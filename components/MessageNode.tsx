import { Handle, Position } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { X, Image, Video } from "lucide-react";
import type { MessageNodeProps } from "../types/types";

export const MessageNode: React.FC<MessageNodeProps> = ({ data, id }) => {
  const handleNodeClick = () => {
    data.onNodeClick(id);
  };

  const renderContent = () => {
    // Handle new textEntries structure
    if (
      data.contentType === "text" &&
      data.textEntries &&
      data.textEntries.length > 0
    ) {
      return (
        <div className="space-y-3 w-full">
          {data.textEntries.map((entry, index) => (
            <div key={entry.id || index} className="w-full">
              {/* Label as header */}
              {entry.label && (
                <div className="text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                  {entry.label}
                </div>
              )}

              {/* Value based on valueType */}
              <div className="w-full">
                {entry.valueType === "text" && entry.value && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded p-2 border border-gray-200">
                    {entry.value}
                  </div>
                )}

                {entry.valueType === "image" && entry.value && (
                  <div className="rounded overflow-hidden border border-gray-200">
                    <img
                      src={entry.value}
                      alt={entry.label || "Image"}
                      className="w-full h-auto object-cover max-h-32"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const errorDiv = document.createElement("div");
                        errorDiv.className =
                          "p-2 bg-red-50 text-red-600 text-xs text-center";
                        errorDiv.textContent = "Invalid image URL";
                        e.currentTarget.parentElement?.appendChild(errorDiv);
                      }}
                    />
                  </div>
                )}

                {entry.valueType === "video" && entry.value && (
                  <div className="rounded overflow-hidden border border-gray-200 bg-black">
                    <video
                      src={entry.value}
                      className="w-full h-auto max-h-32 object-contain"
                      muted
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        e.currentTarget.currentTime = 1;
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.currentTarget.paused) {
                          e.currentTarget.play();
                        } else {
                          e.currentTarget.pause();
                        }
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const errorDiv = document.createElement("div");
                        errorDiv.className =
                          "p-2 bg-red-50 text-red-600 text-xs text-center";
                        errorDiv.textContent = "Invalid video URL";
                        e.currentTarget.parentElement?.appendChild(errorDiv);
                      }}
                    >
                      <source src={entry.value} type="video/mp4" />
                      <source src={entry.value} type="video/webm" />
                      <source src={entry.value} type="video/ogg" />
                    </video>
                  </div>
                )}

                {!entry.value && (
                  <div className="text-xs text-gray-400 italic p-2 bg-gray-50 rounded border border-gray-200">
                    No content
                  </div>
                )}
              </div>

              {/* Divider between entries */}
              {index < data.textEntries.length - 1 && (
                <div className="border-t border-gray-300 mt-3"></div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Fallback for old single content types
    switch (data.contentType) {
      case "image":
        if (data.imageUrl) {
          return (
            <div className="w-full">
              <img
                src={data.imageUrl}
                alt="Node content"
                className="w-full h-16 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="hidden items-center gap-2 text-sm text-gray-700">
                <Image size={14} />
                <span>Invalid image URL</span>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Image size={14} />
            <span>Click to add image</span>
          </div>
        );
      case "video":
        if (data.videoUrl) {
          return (
            <div className="w-full h-20 flex items-center justify-center bg-black rounded overflow-hidden">
              <video
                className="max-w-full max-h-full object-contain rounded"
                muted
                preload="metadata"
                onError={(e) => {
                  console.error("Video loading error:", e);
                  e.currentTarget.style.display = "none";
                  const sibling = e.currentTarget.parentElement
                    ?.nextElementSibling as HTMLElement | null;
                  if (sibling) {
                    sibling.style.display = "flex";
                  }
                }}
                onLoadedMetadata={(e) => {
                  e.currentTarget.currentTime = 1;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.currentTarget.paused) {
                    e.currentTarget.play();
                  } else {
                    e.currentTarget.pause();
                  }
                }}
              >
                <source src={data.videoUrl} type="video/mp4" />
                <source src={data.videoUrl} type="video/webm" />
                <source src={data.videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
              <div className="hidden items-center gap-2 text-sm text-gray-700">
                <Video size={14} />
                <span>Unable to load video</span>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Video size={14} />
            <span>Click to add video</span>
          </div>
        );
      default:
        return (
          <span className="text-sm text-gray-700">
            {data.message || "Click to add text"}
          </span>
        );
    }
  };

  return (
    <div className="bg-green-200 border-2 border-green-300 rounded-lg px-4 py-2 min-w-[200px] shadow-md relative group">
      {/* Source Handle - Right (outgoing connections) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-600 border-2 border-white"
        style={{ right: -6 }}
      />

      {/* Target Handle - Left (incoming connections) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-600 border-2 border-white"
        style={{ left: -6 }}
      />

      {/* Delete button */}
      <button
        onClick={() => data.onDelete(id)}
        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
      >
        <X size={8} />
      </button>

      {/* <div className="flex items-center gap-2 mb-2">
        <MessageCircle size={16} className="text-green-700" />
        <span className="font-semibold text-green-800"></span>
        <div className="w-3 h-3 bg-green-500 rounded-full ml-auto"></div>
      </div> */}

      <div
        className="bg-white rounded px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleNodeClick}
      >
        {renderContent()}
      </div>
    </div>
  );
};
