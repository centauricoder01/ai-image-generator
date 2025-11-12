import type { CanvasElement, ResizeHandle } from "../../types/types";
import { getResizeHandles } from "../../lib/utils";

export const ResizeHandles: React.FC<{
  element: CanvasElement;
  onResizeStart: (
    handle: ResizeHandle["position"],
    e: React.MouseEvent
  ) => void;
}> = ({ element, onResizeStart }) => {
  const handles = getResizeHandles(element);

  return (
    <>
      {handles.map((handle) => (
        <div
          key={handle.position}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(handle.position, e);
          }}
          style={{
            position: "absolute",
            left: handle.x - 4,
            top: handle.y - 4,
            width: 8,
            height: 8,
            cursor: `${handle.position}-resize`,
          }}
          className="bg-blue-500 border-2 border-white rounded-sm z-20"
        />
      ))}
    </>
  );
};
