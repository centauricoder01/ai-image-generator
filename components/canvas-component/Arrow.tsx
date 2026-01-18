"use client"

import React from "react";
import type { ArrowElement } from "../../types/types";

export const Arrow: React.FC<{
  element: ArrowElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: (e: React.MouseEvent, isStart: boolean) => void;
}> = ({ element, isSelected, onSelect, onDragStart }) => {
  // Arrowhead size
  const headLength = 15;
  const headWidth = 10;

  const handleEndpointMouseDown = (e: React.MouseEvent, isStart: boolean) => {
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(e, isStart);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        pointerEvents: "none", // Changed from "none"
        cursor: isSelected ? "move" : "default",
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <svg
        width={element.width}
        height={element.height}
        style={{ overflow: "visible" }}
      >
        <defs>
          <marker
            id={`arrowhead-${element.id}`}
            markerWidth={headLength}
            markerHeight={headWidth}
            refX={headLength - 2}
            refY={headWidth / 2}
            orient="auto"
          >
            <polygon
              points={`0 0, ${headLength} ${headWidth / 2}, 0 ${headWidth}`}
              fill={element.color}
            />
          </marker>
        </defs>

        {/* Invisible thick line for easier clicking */}
        <line
          x1={element.startX - element.x}
          y1={element.startY - element.y}
          x2={element.endX - element.x}
          y2={element.endY - element.y}
          stroke="transparent"
          strokeWidth={20}
          style={{ pointerEvents: "all", cursor: "move" }}
          onMouseDown={() => {
            // Don't stop propagation - let Canvas handle it
            onSelect();
          }}
        />

        {/* Visible arrow line */}
        <line
          // x1={element.startX - Math.min(element.startX, element.endX) + 20}
          // y1={element.startY - Math.min(element.startY, element.endY) + 20}
          // x2={element.endX - Math.min(element.startX, element.endX) + 20}
          // y2={element.endY - Math.min(element.startY, element.endY) + 20}
          x1={element.startX - element.x}
          y1={element.startY - element.y}
          x2={element.endX - element.x}
          y2={element.endY - element.y}
          stroke={element.color}
          strokeWidth={element.strokeWidth}
          markerEnd={`url(#arrowhead-${element.id})`}
          strokeLinecap="round"
          style={{ pointerEvents: "none" }}
        />

        {isSelected && (
          <>
            {/* Start point handle */}
            <circle
              cx={element.startX - element.x}
              cy={element.startY - element.y}
              r={6}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              style={{ pointerEvents: "all", cursor: "move" }}
              onMouseDown={(e) => handleEndpointMouseDown(e, true)}
            />

            {/* End point handle */}
            <circle
              cx={element.endX - element.x}
              cy={element.endY - element.y}
              r={6}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              style={{ pointerEvents: "all", cursor: "move" }}
              onMouseDown={(e) => handleEndpointMouseDown(e, false)}
            />
          </>
        )}
      </svg>
    </div>
  );
};
