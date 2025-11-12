import React from "react";
import type { ArrowElement } from "../../types/types";

export const Arrow: React.FC<{
  element: ArrowElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart?: (e: React.MouseEvent, isStart: boolean) => void;
}> = ({ element, isSelected, onSelect, onDragStart }) => {
  const dx = element.endX - element.startX;
  const dy = element.endY - element.startY;

  // Arrowhead size
  const headLength = 15;
  const headWidth = 10;

  const handleLineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

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
        left: Math.min(element.startX, element.endX) - 20,
        top: Math.min(element.startY, element.endY) - 20,
        width: Math.abs(dx) + 40,
        height: Math.abs(dy) + 40,
        pointerEvents: "none",
      }}
    >
      <svg
        width={Math.abs(dx) + 40}
        height={Math.abs(dy) + 40}
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
          x1={element.startX - Math.min(element.startX, element.endX) + 20}
          y1={element.startY - Math.min(element.startY, element.endY) + 20}
          x2={element.endX - Math.min(element.startX, element.endX) + 20}
          y2={element.endY - Math.min(element.startY, element.endY) + 20}
          stroke="transparent"
          strokeWidth={20}
          style={{ pointerEvents: "all", cursor: "move" }}
          onClick={handleLineClick}
        />
        
        {/* Visible arrow line */}
        <line
          x1={element.startX - Math.min(element.startX, element.endX) + 20}
          y1={element.startY - Math.min(element.startY, element.endY) + 20}
          x2={element.endX - Math.min(element.startX, element.endX) + 20}
          y2={element.endY - Math.min(element.startY, element.endY) + 20}
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
              cx={element.startX - Math.min(element.startX, element.endX) + 20}
              cy={element.startY - Math.min(element.startY, element.endY) + 20}
              r={6}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              style={{ pointerEvents: "all", cursor: "move" }}
              onMouseDown={(e) => handleEndpointMouseDown(e, true)}
            />
            
            {/* End point handle */}
            <circle
              cx={element.endX - Math.min(element.startX, element.endX) + 20}
              cy={element.endY - Math.min(element.startY, element.endY) + 20}
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