import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import { useState } from "react";

export const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, label, markerEnd, style, data }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(label || "");
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
    if (data?.updateEdgeLabel) {
      data.updateEdgeLabel(id, labelText);
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onClick={handleLabelClick}
        >
          {isEditing ? (
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLabelBlur();
                }
                e.stopPropagation();
              }}
              autoFocus
              className="px-2 py-1 text-xs border border-blue-400 rounded bg-white shadow-md"
              style={{ minWidth: '100px' }}
            />
          ) : (
            <div className="px-2 py-1 text-xs bg-white border border-gray-300 rounded cursor-pointer hover:border-blue-400 shadow-sm">
              {labelText || "Click to add label"}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};