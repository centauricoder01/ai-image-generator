"use client"

import React from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Trash2,
} from "lucide-react";

export const LayerControls: React.FC<{
  isVisible: boolean;
  selectedElement: any | null;
  zoom: number;
  panOffset: { x: number; y: number };
  onBringToFront: () => void;
  onSendToBack: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDelete: () => void;
}> = ({
  isVisible,
  selectedElement,
  zoom,
  panOffset,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  onDelete,
}) => {
  if (!isVisible || !selectedElement) return null;

  // Calculate position based on selected element
  let elementX = selectedElement.x || 0;
  let elementY = selectedElement.y || 0;
  const elementWidth = selectedElement.width || 100;

  // For arrows, use endX as the reference point
  if (selectedElement.type === "arrow") {

    console.log(selectedElement, "This is selectedElement")
    console.log("Yes, i came here")
    elementX = Math.max(selectedElement.startX, selectedElement.endX);
    elementY = selectedElement.startY;
  }

  const left = elementX * zoom + panOffset.x + elementWidth * zoom + 10;
  const top = elementY * zoom + panOffset.y;

  return (
    <div
      className="absolute bg-white shadow-lg rounded-lg p-2 z-10 flex flex-col gap-2"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <button
        onClick={onBringToFront}
        className="p-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm whitespace-nowrap"
        title="Bring to Front"
      >
        <ArrowUpToLine size={16} />
        <span>To Front</span>
      </button>
      <button
        onClick={onBringForward}
        className="p-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm whitespace-nowrap"
        title="Bring Forward"
      >
        <ArrowUp size={16} />
        <span>Forward</span>
      </button>
      <button
        onClick={onSendBackward}
        className="p-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm whitespace-nowrap"
        title="Send Backward"
      >
        <ArrowDown size={16} />
        <span>Backward</span>
      </button>
      <button
        onClick={onSendToBack}
        className="p-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm whitespace-nowrap"
        title="Send to Back"
      >
        <ArrowDownToLine size={16} />
        <span>To Back</span>
      </button>

      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-100 rounded flex items-center gap-2 text-sm whitespace-nowrap text-red-600"
        title="Delete"
      >
        <Trash2 size={16} />
        <span>Delete</span>
      </button>
    </div>
  );
};
