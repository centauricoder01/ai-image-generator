"use client"

import React, { useState } from "react";
import { Plus, X, Edit2, Copy, MoreVertical } from "lucide-react";

export const SheetTabs: React.FC<{
  sheets: { [key: string]: { elements: any[]; name: string } };
  activeSheetId: string;
  sheetOrder: string[];
  onSheetChange: (sheetId: string) => void;
  onCreateSheet: () => void;
  onRenameSheet?: (sheetId: string, newName: string) => void;
  onDeleteSheet?: (sheetId: string) => void;
  onDuplicateSheet?: (sheetId: string) => void;
  userRole: "owner" | "collaborator" | "viewer" | null;
}> = ({
  sheets,
  activeSheetId,
  sheetOrder,
  onSheetChange,
  onCreateSheet,
  onRenameSheet,
  onDeleteSheet,
  onDuplicateSheet,
  userRole,
}) => {
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [contextMenuSheetId, setContextMenuSheetId] = useState<string | null>(
    null
  );

  const handleStartRename = (sheetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userRole === "viewer") {
      alert("You don't have permission to rename sheets");
      return;
    }
    setEditingSheetId(sheetId);
    setEditingName(sheets[sheetId].name);
    setContextMenuSheetId(null);
  };

  const handleFinishRename = (sheetId: string) => {
    if (editingName.trim() && onRenameSheet) {
      onRenameSheet(sheetId, editingName.trim());
    }
    setEditingSheetId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, sheetId: string) => {
    e.preventDefault();
    setContextMenuSheetId(contextMenuSheetId === sheetId ? null : sheetId);
  };

  // Allow editing when not in collaboration mode OR when user is owner/collaborator
  const canEdit =
    userRole === null || userRole === "owner" || userRole === "collaborator";

  return (
    <div className="absolute bottom-4 left-4 flex items-center gap-2 z-50">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        {sheetOrder.map((sheetId) => (
          <div key={sheetId} className="relative group" data-sheet-id={sheetId}>
            {editingSheetId === sheetId ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleFinishRename(sheetId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFinishRename(sheetId);
                  if (e.key === "Escape") setEditingSheetId(null);
                }}
                autoFocus
                className="px-3 py-2 border-2 border-blue-500 rounded-lg text-sm font-medium w-32"
              />
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSheetChange(sheetId)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                    activeSheetId === sheetId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {sheets[sheetId].name}
                </button>

                {canEdit && (
                  <button
                    onClick={(e) => handleContextMenu(e, sheetId)}
                    className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical size={14} />
                  </button>
                )}

                {/* Context Menu */}
                {contextMenuSheetId === sheetId && canEdit && (
                  <div className="absolute bottom-full mb-1 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[150px]">
                    <button
                      onClick={(e) => handleStartRename(sheetId, e)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      Rename
                    </button>

                    {onDuplicateSheet && (
                      <button
                        onClick={() => {
                          onDuplicateSheet(sheetId);
                          setContextMenuSheetId(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Copy size={14} />
                        Duplicate
                      </button>
                    )}

                    {onDeleteSheet && sheetOrder.length > 1 && (
                      <button
                        onClick={() => {
                          onDeleteSheet(sheetId);
                          setContextMenuSheetId(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <X size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {canEdit && (
          <button
            onClick={onCreateSheet}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors"
          >
            <Plus size={16} />
            <span>New</span>
          </button>
        )}
      </div>

      {/* Click outside to close context menu */}
      {contextMenuSheetId && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenuSheetId(null)}
        />
      )}
    </div>
  );
};
