"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { removeBackground } from "@imgly/background-removal";
// import { removeBackground } from "@imgly/background-removal-node";
import { PlusIcon, ReloadIcon, DownloadIcon } from "@radix-ui/react-icons";
import TextCustomizer from "@/components/editor/text-customizer";
import Image from "next/image";
import { Accordion } from "@/components/ui/accordion";
import "@/app/fonts.css";

const Page = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(
    null
  );
  const [textSets, setTextSets] = useState<Array<any>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsImageSetupDone(false);
      setRemovedBgImageUrl(null); // Add this line
      await setupImage(imageUrl);
    }
  };

  const setupImage = async (imageUrl: string) => {
    try {
      const imageBlob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(imageBlob);
      setRemovedBgImageUrl(url);
      setIsImageSetupDone(true);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: "edit",
        fontFamily: "Inter",
        top: 0,
        left: 0,
        color: "white",
        fontSize: 200,
        fontWeight: 800,
        opacity: 1,
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowSize: 4,
        rotation: 0,
      },
    ]);
  };

  const handleAttributeChange = (id: number, attribute: string, value: any) => {
    setTextSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [attribute]: value } : set))
    );
  };

  const duplicateTextSet = (textSet: any) => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [...prev, { ...textSet, id: newId }]);
  };

  const removeTextSet = (id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  };

  const saveCompositeImage = () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new (window as any).Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Draw background image first
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Draw text sets behind the subject
      textSets.forEach((textSet) => {
        ctx.save();

        // Calculate scale factor based on canvas vs preview size
        const previewWidth = 1280; // approximate preview width in pixels
        // In saveCompositeImage, replace the scale calculation and font line with:
        const scale = canvas.width / 650; // Adjust 800 based on your needs

        ctx.font = `${textSet.fontWeight} ${textSet.fontSize * scale}px ${
          textSet.fontFamily
        }`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Add shadow if specified (scaled)
        if (textSet.shadowSize > 0) {
          ctx.shadowColor = textSet.shadowColor;
          ctx.shadowBlur = textSet.shadowSize * scale;
          ctx.shadowOffsetX = (textSet.shadowSize / 2) * scale;
          ctx.shadowOffsetY = (textSet.shadowSize / 2) * scale;
        }

        // Use the same positioning as preview
        const x = (canvas.width * (textSet.left + 50)) / 100;
        const y = (canvas.height * (51 - textSet.top)) / 100;

        // Move the context to the text position and rotate
        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);
        ctx.fillText(textSet.text, 0, 0);
        ctx.restore();
      });

      // Draw removed background image on top (this creates the "text behind" effect)
      if (removedBgImageUrl) {
        const removedBgImg = new (window as any).Image();
        removedBgImg.crossOrigin = "anonymous";
        removedBgImg.onload = () => {
          ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
          triggerDownload();
        };
        removedBgImg.src = removedBgImageUrl;
      } else {
        triggerDownload();
      }
    };
    bgImg.src = selectedImage || "";

    function triggerDownload() {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "text-behind-image.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-row items-center justify-between p-5 px-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Text Behind Image Editor
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png"
            />
            <Button
              onClick={handleUploadImage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </div>
        </div>
      </div>

      {selectedImage ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Image Preview - Sticky */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-600">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Preview
                </h2>
              </div>

              <div className="p-6">
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden relative shadow-inner">
                  {isImageSetupDone ? (
                    <Image
                      src={selectedImage}
                      alt="Uploaded"
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center"
                      className="rounded-xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <ReloadIcon className="animate-spin h-5 w-5" />
                        <span className="font-medium">Processing image...</span>
                      </div>
                    </div>
                  )}

                  {/* Text Overlays */}
                  {isImageSetupDone &&
                    textSets.map((textSet) => (
                      <div
                        key={textSet.id}
                        style={{
                          position: "absolute",
                          top: `${50 - textSet.top}%`,
                          left: `${textSet.left + 50}%`,
                          transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                          color: textSet.color,
                          textAlign: "center",
                          fontSize: `${textSet.fontSize}px`,
                          fontWeight: textSet.fontWeight,
                          fontFamily: textSet.fontFamily,
                          opacity: textSet.opacity,
                          textShadow:
                            textSet.shadowSize > 0
                              ? `${textSet.shadowSize / 2}px ${
                                  textSet.shadowSize / 2
                                }px ${textSet.shadowSize}px ${
                                  textSet.shadowColor
                                }`
                              : "none",
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        {textSet.text}
                      </div>
                    ))}

                  {/* Removed Background Overlay */}
                  {removedBgImageUrl && (
                    <Image
                      src={removedBgImageUrl}
                      alt="Subject"
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center"
                      className="absolute top-0 left-0 w-full h-full rounded-xl"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Add Text Button */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Text Elements
                </h2>
                <Button
                  variant="outline"
                  onClick={addNewTextSet}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Text
                </Button>
              </div>

              {textSets.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <PlusIcon className="h-8 w-8" />
                  </div>
                  <p className="font-medium">No text elements yet</p>
                  <p className="text-sm mt-1">
                    Click "Add Text" to get started
                  </p>
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-2"
                >
                  {textSets.map((textSet) => (
                    <div
                      key={textSet.id}
                      className="bg-slate-50 dark:bg-slate-700/50 rounded-lg overflow-hidden"
                    >
                      <TextCustomizer
                        textSet={textSet}
                        handleAttributeChange={handleAttributeChange}
                        removeTextSet={removeTextSet}
                        duplicateTextSet={duplicateTextSet}
                      />
                    </div>
                  ))}
                </Accordion>
              )}
            </div>

            {/* Export Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Export
              </h2>
              <Button
                onClick={saveCompositeImage}
                disabled={!isImageSetupDone}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-lg font-semibold"
              >
                <DownloadIcon className="mr-2 h-5 w-5" />
                Download Image
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                High-quality PNG format
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Welcome Screen */
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <PlusIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Create Amazing Text Effects
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Upload an image and add text that appears behind your subject with
              AI-powered background removal
            </p>
            <Button
              onClick={handleUploadImage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-14 px-8 text-lg font-semibold"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Get Started - Upload Image
            </Button>
          </div>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Page;
