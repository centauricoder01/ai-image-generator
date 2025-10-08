"use client";

import React, { useEffect, useRef } from "react";

interface TextElement {
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  textAlign: string;
  fontFamily: string;
  zIndex: number;
}

interface ImageElement {
  imageData: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface SampleData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundType: string;
  backgroundColor?: string;
  gradientConfig?: {
    type: "linear" | "radial";
    colors: string[];
    direction: number;
  };
  patternId?: string;
  textElements: TextElement[];
  imageElements: ImageElement[];
  createdAt: string;
}

interface Pattern {
  id: string;
  type: "dots" | "stripes" | "grid" | "waves" | "hexagon" | "triangles";
}

const patternMap: Record<string, Pattern> = {
  "dots-1": { id: "dots-1", type: "dots" },
  "dots-2": { id: "dots-2", type: "dots" },
  "stripes-1": { id: "stripes-1", type: "stripes" },
  "stripes-2": { id: "stripes-2", type: "stripes" },
  "grid-1": { id: "grid-1", type: "grid" },
  "waves-1": { id: "waves-1", type: "waves" },
  "hexagon-1": { id: "hexagon-1", type: "hexagon" },
  "triangles-1": { id: "triangles-1", type: "triangles" },
};

interface SamplePreviewProps {
  sample: SampleData;
  onClick?: () => void;
  className?: string;
}

const SamplePreview: React.FC<SamplePreviewProps> = ({
  sample,
  onClick,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createPattern = (
    ctx: CanvasRenderingContext2D,
    pattern: Pattern,
    backgroundColor: string
  ): CanvasPattern | null => {
    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");
    if (!patternCtx) return null;

    let patternSize = 50;
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;

    patternCtx.fillStyle = backgroundColor;
    patternCtx.fillRect(0, 0, patternSize, patternSize);

    patternCtx.strokeStyle = "#ffffff";
    patternCtx.fillStyle = "#ffffff";
    patternCtx.lineWidth = 2;

    switch (pattern.type) {
      case "dots":
        const dotSize = pattern.id.includes("large") ? 8 : 4;
        patternCtx.beginPath();
        patternCtx.arc(
          patternSize / 2,
          patternSize / 2,
          dotSize,
          0,
          Math.PI * 2
        );
        patternCtx.fill();
        break;

      case "stripes":
        if (pattern.id.includes("diagonal")) {
          patternCtx.beginPath();
          patternCtx.moveTo(0, 0);
          patternCtx.lineTo(patternSize, patternSize);
          patternCtx.stroke();
        } else {
          patternCtx.fillRect(patternSize / 2 - 2, 0, 4, patternSize);
        }
        break;

      case "grid":
        patternCtx.strokeRect(0, 0, patternSize, patternSize);
        break;

      case "waves":
        patternCtx.beginPath();
        for (let x = 0; x < patternSize; x++) {
          const y = patternSize / 2 + Math.sin(x * 0.2) * 10;
          if (x === 0) patternCtx.moveTo(x, y);
          else patternCtx.lineTo(x, y);
        }
        patternCtx.stroke();
        break;

      case "hexagon":
        const centerX = patternSize / 2;
        const centerY = patternSize / 2;
        const radius = 15;
        patternCtx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          if (i === 0) patternCtx.moveTo(x, y);
          else patternCtx.lineTo(x, y);
        }
        patternCtx.closePath();
        patternCtx.stroke();
        break;

      case "triangles":
        patternCtx.beginPath();
        patternCtx.moveTo(patternSize / 2, 10);
        patternCtx.lineTo(10, patternSize - 10);
        patternCtx.lineTo(patternSize - 10, patternSize - 10);
        patternCtx.closePath();
        patternCtx.stroke();
        break;
    }

    return ctx.createPattern(patternCanvas, "repeat");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = sample.canvasWidth;
    canvas.height = sample.canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (sample.backgroundType === "gradient" && sample.gradientConfig) {
      let gradient;
      if (sample.gradientConfig.type === "linear") {
        const angle = (sample.gradientConfig.direction - 90) * (Math.PI / 180);
        const x1 = canvas.width / 2 - (Math.cos(angle) * canvas.width) / 2;
        const y1 = canvas.height / 2 - (Math.sin(angle) * canvas.height) / 2;
        const x2 = canvas.width / 2 + (Math.cos(angle) * canvas.width) / 2;
        const y2 = canvas.height / 2 + (Math.sin(angle) * canvas.height) / 2;
        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      } else {
        gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 2
        );
      }

      sample.gradientConfig.colors.forEach((color, index) => {
        gradient.addColorStop(
          index / (sample.gradientConfig!.colors.length - 1),
          color
        );
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (sample.backgroundType === "pattern" && sample.patternId) {
      const pattern = patternMap[sample.patternId];
      if (pattern) {
        const canvasPattern = createPattern(
          ctx,
          pattern,
          sample.backgroundColor || "#7c3aed"
        );
        if (canvasPattern) {
          ctx.fillStyle = canvasPattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    } else {
      ctx.fillStyle = sample.backgroundColor || "#7c3aed";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Combine and sort elements by zIndex
    const allElements = [
      ...sample.imageElements.map((img) => ({ ...img, type: "image" as const })),
      ...sample.textElements.map((text) => ({ ...text, type: "text" as const })),
    ].sort((a, b) => a.zIndex - b.zIndex);

    // Track loaded images
    let imagesToLoad = sample.imageElements.length;
    let imagesLoaded = 0;

    const drawElements = () => {
      allElements.forEach((element) => {
        if (element.type === "text") {
          ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
          ctx.fillStyle = element.color;
          ctx.textAlign = element.textAlign as CanvasTextAlign;

          const lines = element.content.split("\n");
          lines.forEach((line, index) => {
            ctx.fillText(line, element.x, element.y + index * element.fontSize * 1.2);
          });
        }
      });
    };

    // Load and draw images
    if (imagesToLoad === 0) {
      drawElements();
    } else {
      allElements.forEach((element) => {
        if (element.type === "image") {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, element.x, element.y, element.width, element.height);
            imagesLoaded++;
            if (imagesLoaded === imagesToLoad) {
              drawElements();
            }
          };
          img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded === imagesToLoad) {
              drawElements();
            }
          };
          img.src = element.imageData;
        }
      });
    }
  }, [sample]);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className="bg-gray-100 p-4 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto rounded border border-gray-300"
          style={{
            maxHeight: "300px",
            width: "auto",
            height: "auto",
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">
          {sample.name}
        </h3>
        {sample.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {sample.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {sample.category || "Custom"}
          </span>
          <span className="text-xs text-gray-400">
            {sample.canvasWidth} × {sample.canvasHeight}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SamplePreview;