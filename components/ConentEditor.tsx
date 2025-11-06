import React, { useState } from "react";
import type { MessageNodeData, TextEntry } from "../types/types";
import {
  MessageCircle,
  Type as TypeIcon,
  Video,
  X,
  Image as ImageIcon,
} from "lucide-react";
import type { Node } from "@xyflow/react";

export const ContentEditor = ({
  selectedNodeId,
  nodes,
  onContentTypeChange,
  onClose,
}: {
  selectedNodeId: string | null;
  nodes: Node[];
  onMessageChange: (id: string, message: string) => void;
  onContentTypeChange: (
    id: string,
    contentType: string,
    additionalData?: any
  ) => void;
  onClose: () => void;
}) => {
  const [textEntries, setTextEntries] = useState<TextEntry[]>([
    { id: "1", label: "", value: "", valueType: "text" },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [selectedType, setSelectedType] = useState<
    "text" | "image" | "video" | "heading"
  >("text");

  const selectedNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId)
    : null;

  React.useEffect(() => {
    if (selectedNode) {
      const nodeData = selectedNode.data as unknown as MessageNodeData;
      setSelectedType(nodeData.contentType || "text");

      switch (nodeData.contentType) {
        case "heading":
          setInputValue(nodeData.message || "");
          break;
        case "text":
          if (nodeData.textEntries && nodeData.textEntries.length > 0) {
            setTextEntries(nodeData.textEntries);
          } else {
            setTextEntries([{ id: "1", label: "", value: "" }]);
          }
          break;
        case "image":
          setInputValue(nodeData.imageUrl || "");
          break;
        case "video":
          setInputValue(nodeData.videoUrl || "");
          break;
      }
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (!selectedNodeId) return;

    const additionalData: any = {};

    switch (selectedType) {
      case "heading":
        additionalData.message = inputValue;
        additionalData.fontSize =
          (selectedNode?.data as unknown as MessageNodeData)?.fontSize || 24;
        break;
      case "text":
        additionalData.textEntries = textEntries;
        additionalData.message = textEntries
          .map((e) => `${e.label}: ${e.value}`)
          .join("\n");
        break;
      case "image":
        additionalData.imageUrl = inputValue;
        break;
      case "video":
        additionalData.videoUrl = inputValue;
        break;
    }

    onContentTypeChange(selectedNodeId, selectedType, additionalData);
    onClose();
  };

  const contentTypes = [
    { type: "text", icon: TypeIcon, label: "Text" },
    { type: "image", icon: ImageIcon, label: "Image" },
    { type: "video", icon: Video, label: "Video" },
  ];

  const getPlaceholder = () => {
    switch (selectedType) {
      case "image":
        return "Enter image URL...";
      case "video":
        return "Enter video URL...";
      default:
        return "Enter your message...";
    }
  };

  const addMoreText = () => {
    setTextEntries([
      ...textEntries,
      {
        id: Date.now().toString(),
        label: "",
        value: "",
        valueType: "text", // default
      },
    ]);
  };

  const updateTextEntry = (
    id: string,
    field: "label" | "value" | "valueType",
    newValue: string
  ) => {
    setTextEntries(
      textEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: newValue } : entry
      )
    );
  };

  const deleteTextEntry = (id: string) => {
    if (textEntries.length > 1) {
      setTextEntries(textEntries.filter((entry) => entry.id !== id));
    }
  };

  if (!selectedNodeId || !selectedNode) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
        <p>Click on a node's content area to edit it</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Edit Content</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* // Add this right after the header div */}
      {selectedNode &&
        (selectedNode.data as unknown as MessageNodeData).contentType ===
          "heading" && (
          <div className="space-y-3 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Font Size
              </label>
              <span className="text-sm font-semibold text-gray-800">
                {(selectedNode.data as unknown as MessageNodeData).fontSize ||
                  24}
                px
              </span>
            </div>
            <input
              type="range"
              min="16"
              max="48"
              value={
                (selectedNode.data as unknown as MessageNodeData).fontSize || 24
              }
              onChange={(e) => {
                const newSize = Number(e.target.value);
                const currentMessage =
                  (selectedNode.data as unknown as MessageNodeData).message ||
                  "";
                onContentTypeChange(selectedNodeId!, "heading", {
                  fontSize: newSize,
                  message: currentMessage, // Keep the existing message
                });
              }}
              className="w-full"
            />
          </div>
        )}

      {/* Content Type Selection - Hide for heading nodes */}
      {selectedNode &&
        (selectedNode.data as unknown as MessageNodeData).contentType !==
          "heading" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Content Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {contentTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className={`flex items-center gap-2 p-2 rounded border text-left transition-colors ${
                    selectedType === type
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Content Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {selectedType === "text" ? "Text Entries" : "Content"}
        </label>

        {selectedType === "text" ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {textEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="space-y-2 p-3 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-700">
                    Entry {index + 1}
                  </span>
                  {textEntries.length > 1 && (
                    <button
                      onClick={() => deleteTextEntry(entry.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Label Input */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={entry.label}
                    onChange={(e) =>
                      updateTextEntry(entry.id, "label", e.target.value)
                    }
                    placeholder="e.g., Title, Description, Header"
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Value Type Selection */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Value Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateTextEntry(entry.id, "valueType", "text")
                      }
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                        entry.valueType === "text"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <TypeIcon size={12} className="inline mr-1" />
                      Text
                    </button>
                    <button
                      onClick={() =>
                        updateTextEntry(entry.id, "valueType", "image")
                      }
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                        entry.valueType === "image"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <ImageIcon size={12} className="inline mr-1" />
                      Image
                    </button>
                    <button
                      onClick={() =>
                        updateTextEntry(entry.id, "valueType", "video")
                      }
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                        entry.valueType === "video"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Video size={12} className="inline mr-1" />
                      Video
                    </button>
                  </div>
                </div>

                {/* Value Input - conditional based on valueType */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    {entry.valueType === "text" ? "Value" : "URL"}
                  </label>
                  {entry.valueType === "text" ? (
                    <textarea
                      value={entry.value}
                      onChange={(e) =>
                        updateTextEntry(entry.id, "value", e.target.value)
                      }
                      placeholder="Enter text value..."
                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      value={entry.value}
                      onChange={(e) =>
                        updateTextEntry(entry.id, "value", e.target.value)
                      }
                      placeholder={`Enter ${entry.valueType} URL...`}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addMoreText}
              className="w-full py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              + Add More Text
            </button>
          </div>
        ) : selectedType === "image" || selectedType === "video" ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ) : selectedType === "heading" ? (
          // Simple input for heading
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter heading text..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
