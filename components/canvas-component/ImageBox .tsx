import React from "react";
import type { ImageElement } from "../../types/types";

export const ImageBox: React.FC<{
  element: ImageElement;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ element, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: "move",
      }}
      className={`${isSelected ? "ring-2 ring-blue-500" : ""} rounded`}
    >
      <img
        src={element.src}
        alt="Uploaded"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
