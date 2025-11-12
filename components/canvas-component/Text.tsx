import { useEffect, useRef } from "react";
import type { TextElement } from "../../types/types";

export const TextBox: React.FC<{
  element: TextElement;
  isSelected: boolean;
  isEditing: boolean;
  isManuallyResizing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onChange: (content: string) => void;
  onResize: (newHeight: number) => void;
}> = ({
  element,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onChange,
  onResize,
  isManuallyResizing,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Auto-resize height based on content (only when NOT manually resizing)
  useEffect(() => {
    if (measureRef.current && element.content && !isManuallyResizing) {
      const contentHeight = measureRef.current.scrollHeight;
      const minHeight = 40;
      const newHeight = Math.max(minHeight, contentHeight + 10);

      if (Math.abs(newHeight - element.height) > 5) {
        onResize(newHeight);
      }
    }
  }, [
    element.content,
    element.width,
    element.baseFontSize,
    isManuallyResizing,
    onResize,
  ]);

  const textStyle: React.CSSProperties = {
    fontSize: `${element.baseFontSize}px`,
    fontFamily: "'Patrick Hand', cursive",
    lineHeight: "1.2",
  };

  return (
    <div
      onClick={onSelect}
      onDoubleClick={onEdit}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        minHeight: element.height,
        cursor: isEditing ? "text" : "move",
      }}
      className={`${isSelected ? "ring-2 ring-blue-500" : ""} rounded`}
    >
      {/* Hidden div for measuring content height */}
      <div
        ref={measureRef}
        style={{
          ...textStyle,
          position: "absolute",
          fontFamily: "'Patrick Hand', cursive",
          visibility: "hidden",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          width: element.width,
          padding: "4px",
        }}
      >
        {element.content || "Double click to edit"}
      </div>

      {isEditing ? (
        <textarea
          ref={inputRef}
          value={element.content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none border-none outline-none bg-transparent p-1"
          style={{
            ...textStyle,
            overflow: "hidden",
            minHeight: element.height,
          }}
        />
      ) : (
        <div
          className="w-full p-1"
          style={{
            ...textStyle,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            minHeight: element.height,
          }}
        >
          {element.content || "Double click to edit"}
        </div>
      )}
    </div>
  );
};
