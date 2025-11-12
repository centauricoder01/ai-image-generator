import type { ShapeElement } from "../../types/types";

export const Shape: React.FC<{
  element: ShapeElement;
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
    >
      {element.type === "rectangle" ? (
        <div
          className={`w-full h-full ${
            isSelected ? "ring-2 ring-blue-500" : ""
          }`}
          style={{
            backgroundColor: element.fillColor,
            border: `${element.borderWidth}px solid ${element.borderColor}`,
            borderRadius: "4px",
          }}
        />
      ) : (
        <div
          className={`w-full h-full ${
            isSelected ? "ring-2 ring-blue-500" : ""
          }`}
          style={{
            backgroundColor: element.fillColor,
            border: `${element.borderWidth}px solid ${element.borderColor}`,
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );
};
