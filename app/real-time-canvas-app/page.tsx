"use client"

import React, { useState, useRef, useEffect } from "react";
import type {
  ArrowElement,
  CanvasElement,
  ImageElement,
  Point,
  ResizeHandle,
  ShapeElement,
  TextElement,
  Tool,
} from "../../types/types";
import { generateId, isPointInElement } from "../../lib/utils";
import { useCollaboration } from "../../hooks/UseCollaboration";

// Import your existing components
import { Toolbar } from "../../components/canvas-component/Toolbar";
import { TextBox } from "../../components/canvas-component/Text";
import { Shape } from "../../components/canvas-component/Shape";
import { ResizeHandles } from "../../components/canvas-component/Resizing";
import { ColorPicker } from "../../components/canvas-component/ColorPicker";
import { ZoomControls } from "../../components/canvas-component/ZoomController";
import { ImageBox } from "../../components/canvas-component/ImageBox ";
import { Arrow } from "../../components/canvas-component/Arrow";
import { LayerControls } from "../../components/canvas-component/LayerControls";

const Canvas: React.FC = () => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<
    ResizeHandle["position"] | null
  >(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [drawStart, setDrawStart] = useState<Point | null>(null);

  const [fillColor, setFillColor] = useState("#93c5fd");
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderWidth, setBorderWidth] = useState(2);

  const [initialResizeSize, setInitialResizeSize] = useState<{
    width: number;
    height: number;
    fontSize: number;
  } | null>(null);

  const [isManuallyResizing, setIsManuallyResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zoom and pan
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point | null>(null);

  // Collaboration state
  const [roomId, setRoomId] = useState<string | null>(null);
  // const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Sharing permission or Roles
  const [ownerId, setOwnerId] = useState<string | null>(null);

  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Replace the useEffect for URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRoomId = urlParams.get("room");
    const inviteToken = urlParams.get("invite");

    if (urlRoomId) {
      setRoomId(urlRoomId);

      // Check if this user is the owner
      const storedOwnerId = localStorage.getItem(`owner_${urlRoomId}`);
      if (storedOwnerId) {
        setOwnerId(storedOwnerId);
      }

      // Check if there's a session token stored
      const storedSessionToken = localStorage.getItem(`session_${urlRoomId}`);
      if (storedSessionToken) {
        setSessionToken(storedSessionToken);
      }

      // If there's an invite token, store it temporarily
      if (inviteToken) {
        sessionStorage.setItem("pendingInviteToken", inviteToken);
      }
    }
  }, []);
  // Setup collaboration hook
  // Update the hook call
  const {
    isConnected,
    userCount,
    error,
    userRole,
    userList,
    changeUserPermission,
  } = useCollaboration({
    roomId,
    ownerId,
    sessionToken, // Add this
    elements,
    onElementsUpdate: setElements,
    onSessionTokenReceived: (token) => {
      setSessionToken(token);
      if (roomId) {
        localStorage.setItem(`session_${roomId}`, token);
      }
    },
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Create shareable room
  const handleCreateRoom = async () => {

    console.log("Yes, i came here", )
    try {
      const response = await fetch(`http://localhost:3002/api/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      const newRoomId = data.roomId;
      const newOwnerId = data.ownerId;

      setRoomId(newRoomId);
      setOwnerId(newOwnerId);

      // Store owner ID in localStorage
      localStorage.setItem(`owner_${newRoomId}`, newOwnerId);

      const newUrl = `${window.location.origin}${window.location.pathname}?room=${newRoomId}`;
      window.history.pushState({}, "", newUrl);

      setShowShareModal(true);
    } catch (err) {
      console.error("Failed to create room:", err);
      alert("Failed to create collaboration room");
    }
  };

  const handleGenerateInviteLink = async (role: "collaborator" | "viewer") => {
    if (!roomId || !ownerId) return;

    setGeneratingInvite(true);

    try {
      const response = await fetch(
        `http://localhost:3002/api/rooms/${roomId}/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId, role }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate invite");
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error("Failed to generate invite:", err);
      alert("Failed to generate invite link");
    } finally {
      setGeneratingInvite(false);
    }
  };

  // const handleCopyShareUrl = () => {
  //   if (shareUrl) {
  //     navigator.clipboard.writeText(shareUrl);
  //     alert("Link copied to clipboard!");
  //   }
  // };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.1));
  const handleZoomReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.max(0.1, Math.min(3, prev + delta)));
    }
  };

  // All your existing mouse handlers remain the same
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (selectedTool === "select") {
      const clickedElement = [...elements]
        .reverse()
        .find((el) => isPointInElement({ x, y }, el));

      if (clickedElement) {
        setSelectedElementId(clickedElement.id);
        setIsDragging(true);
        setDragStart({ x: x - clickedElement.x, y: y - clickedElement.y });
      } else {
        setSelectedElementId(null);
        setEditingTextId(null);
      }
    } else if (selectedTool === "rectangle" || selectedTool === "circle") {
      setDrawStart({ x, y });
    } else if (selectedTool === "arrow") {
      setDrawStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    if (isPanning && panStart) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (isDragging && selectedElementId && dragStart) {
      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedElementId
            ? { ...el, x: x - dragStart.x, y: y - dragStart.y }
            : el
        )
      );
    } else if (isResizing && selectedElementId && dragStart && resizeHandle) {
      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedElementId) return el;

          const deltaX = x - dragStart.x;
          const deltaY = y - dragStart.y;

          let newX = el.x;
          let newY = el.y;
          let newWidth = el.width;
          let newHeight = el.height;

          if (resizeHandle.includes("w")) {
            newX = el.x + deltaX;
            newWidth = el.width - deltaX;
          }
          if (resizeHandle.includes("e")) {
            newWidth = el.width + deltaX;
          }
          if (resizeHandle.includes("n")) {
            newY = el.y + deltaY;
            newHeight = el.height - deltaY;
          }
          if (resizeHandle.includes("s")) {
            newHeight = el.height + deltaY;
          }

          if (newWidth < 20) newWidth = 20;
          if (newHeight < 20) newHeight = 20;

          if (el.type === "text" && initialResizeSize) {
            const widthScale = newWidth / initialResizeSize.width;
            const heightScale = newHeight / initialResizeSize.height;
            const scale = (widthScale + heightScale) / 2;
            const newFontSize = Math.max(
              12,
              Math.min(72, initialResizeSize.fontSize * scale)
            );

            return {
              ...el,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
              baseFontSize: newFontSize,
            };
          }

          return {
            ...el,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          };
        })
      );
      setDragStart({ x, y });
    } else if (
      drawStart &&
      (selectedTool === "rectangle" || selectedTool === "circle")
    ) {
      const tempElement: ShapeElement = {
        id: "temp",
        type: selectedTool,
        x: Math.min(drawStart.x, x),
        y: Math.min(drawStart.y, y),
        width: Math.abs(x - drawStart.x),
        height: Math.abs(y - drawStart.y),
        fillColor: fillColor,
        borderColor: borderColor,
        borderWidth: borderWidth,
      };

      setElements((prev) => {
        const filtered = prev.filter((el) => el.id !== "temp");
        return [...filtered, tempElement];
      });
    } else if (drawStart && selectedTool === "arrow") {
      const tempElement: ArrowElement = {
        id: "temp",
        type: "arrow",
        x: Math.min(drawStart.x, x),
        y: Math.min(drawStart.y, y),
        width: Math.abs(x - drawStart.x),
        height: Math.abs(y - drawStart.y),
        startX: drawStart.x,
        startY: drawStart.y,
        endX: x,
        endY: y,
        color: borderColor,
        strokeWidth: borderWidth,
      };

      setElements((prev) => {
        const filtered = prev.filter((el) => el.id !== "temp");
        return [...filtered, tempElement];
      });
    }
  };

  const handleMouseUp = () => {
    if (
      drawStart &&
      (selectedTool === "rectangle" ||
        selectedTool === "circle" ||
        selectedTool === "arrow")
    ) {
      setElements((prev) =>
        prev.map((el) => (el.id === "temp" ? { ...el, id: generateId() } : el))
      );
      setDrawStart(null);
      setSelectedTool("select");
    }

    setIsDragging(false);
    setIsResizing(false);
    setIsManuallyResizing(false);
    setIsPanning(false);
    setDragStart(null);
    setResizeHandle(null);
    setPanStart(null);
    setInitialResizeSize(null);
  };

  // All other handlers remain the same...
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    if (selectedTool === "text" || selectedTool === "select") {
      const clickedElement = [...elements]
        .reverse()
        .find((el) => isPointInElement({ x, y }, el));

      if (clickedElement && clickedElement.type === "text") {
        setEditingTextId(clickedElement.id);
        setSelectedElementId(clickedElement.id);
      } else if (selectedTool === "text") {
        const newText: TextElement = {
          id: generateId(),
          type: "text",
          x: x - 100,
          y: y - 20,
          width: 200,
          height: 40,
          content: "",
          baseFontSize: 16,
        };
        setElements((prev) => [...prev, newText]);
        setEditingTextId(newText.id);
        setSelectedElementId(newText.id);
        setSelectedTool("select");
      }
    }
  };

  const handleResizeStart = (
    handle: ResizeHandle["position"],
    e: React.MouseEvent
  ) => {
    if (!canvasRef.current || !selectedElementId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    const element = elements.find((el) => el.id === selectedElementId);
    if (element && element.type === "text") {
      setInitialResizeSize({
        width: element.width,
        height: element.height,
        fontSize: element.baseFontSize,
      });
    }

    setIsResizing(true);
    setResizeHandle(handle);
    setIsManuallyResizing(true);
    setDragStart({ x, y });
  };

  const handleTextChange = (id: string, content: string) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id && el.type === "text" ? { ...el, content } : el
      )
    );
  };

  const handleTextResize = (id: string, newHeight: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, height: newHeight } : el))
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const canvasCenterX = (rect.width / 2 - panOffset.x) / zoom;
        const canvasCenterY = (rect.height / 2 - panOffset.y) / zoom;

        const aspectRatio = img.width / img.height;
        const maxDimension = 400;

        let width, height;
        if (img.width > img.height) {
          width = Math.min(maxDimension, img.width);
          height = width / aspectRatio;
        } else {
          height = Math.min(maxDimension, img.height);
          width = height * aspectRatio;
        }

        const newImage: ImageElement = {
          id: generateId(),
          type: "image",
          x: canvasCenterX - width / 2,
          y: canvasCenterY - height / 2,
          width: width,
          height: height,
          src: event.target?.result as string,
        };

        setElements((prev) => [...prev, newImage]);
        setSelectedTool("select");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageToolClick = () => {
    fileInputRef.current?.click();
  };

  // Layer controls
  const handleBringToFront = () => {
    if (!selectedElementId) return;
    setElements((prev) => {
      const element = prev.find((el) => el.id === selectedElementId);
      if (!element) return prev;
      const filtered = prev.filter((el) => el.id !== selectedElementId);
      return [...filtered, element];
    });
  };

  const handleSendToBack = () => {
    if (!selectedElementId) return;
    setElements((prev) => {
      const element = prev.find((el) => el.id === selectedElementId);
      if (!element) return prev;
      const filtered = prev.filter((el) => el.id !== selectedElementId);
      return [element, ...filtered];
    });
  };

  const handleBringForward = () => {
    if (!selectedElementId) return;
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === selectedElementId);
      if (index === -1 || index === prev.length - 1) return prev;
      const newElements = [...prev];
      [newElements[index], newElements[index + 1]] = [
        newElements[index + 1],
        newElements[index],
      ];
      return newElements;
    });
  };

  const handleSendBackward = () => {
    if (!selectedElementId) return;
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === selectedElementId);
      if (index <= 0) return prev;
      const newElements = [...prev];
      [newElements[index], newElements[index - 1]] = [
        newElements[index - 1],
        newElements[index],
      ];
      return newElements;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selectedElementId &&
        !editingTextId
      ) {
        e.preventDefault();
        setElements((prev) => prev.filter((el) => el.id !== selectedElementId));
        setSelectedElementId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, editingTextId]);

  useEffect(() => {
    if (selectedTool === "image") {
      handleImageToolClick();
    }
  }, [selectedTool]);

  return (
    <div className="w-full h-screen bg-gray-50 relative overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {/* Collaboration Status Bar */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {roomId ? (
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {userRole && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  userRole === "owner"
                    ? "bg-purple-100 text-purple-800"
                    : userRole === "collaborator"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {userRole}
              </span>
            )}
            <div className="text-sm text-gray-600">
              {userCount} user{userCount !== 1 ? "s" : ""} online
            </div>
            {userRole === "owner" && (
              <button
                onClick={() => setShowShareModal(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Share
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 font-medium"
          >
            Start Collaboration
          </button>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border shadow-xl">
            <h2 className="text-xl font-bold mb-4">Share Canvas</h2>

            <p className="text-gray-600 mb-4">
              Generate secure invite links for collaborators or viewers:
            </p>

            {/* Generate Collaborator Link */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">
                Collaborator Access (Can Edit)
              </h3>
              <button
                onClick={async () => {
                  const url = await handleGenerateInviteLink("collaborator");
                  if (url) {
                    navigator.clipboard.writeText(url);
                    alert("Collaborator link copied to clipboard!");
                  }
                }}
                disabled={generatingInvite}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {generatingInvite
                  ? "Generating..."
                  : "Generate & Copy Collaborator Link"}
              </button>
            </div>

            {/* Generate Viewer Link */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Viewer Access (Read-Only)</h3>
              <button
                onClick={async () => {
                  const url = await handleGenerateInviteLink("viewer");
                  if (url) {
                    navigator.clipboard.writeText(url);
                    alert("Viewer link copied to clipboard!");
                  }
                }}
                disabled={generatingInvite}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
              >
                {generatingInvite
                  ? "Generating..."
                  : "Generate & Copy Viewer Link"}
              </button>
            </div>

            {/* User Management (only for owner) */}
            {userRole === "owner" && userList.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">
                  Active Users ({userList.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {userList.map((user) => (
                    <div
                      key={user.socketId}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-mono">
                          {user.socketId.substring(0, 8)}...
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.role === "owner"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "collaborator"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      {user.role !== "owner" && (
                        <select
                          value={user.role}
                          onChange={(e) =>
                            changeUserPermission(
                              user.socketId,
                              e.target.value as "collaborator" | "viewer"
                            )
                          }
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="collaborator">Collaborator</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-800">
                🔒 <strong>Security Note:</strong> Each invite link can only be
                used once. Generate a new link for each person you want to
                invite.
              </p>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Toolbar selectedTool={selectedTool} onToolChange={setSelectedTool} />
      <ColorPicker
        fillColor={fillColor}
        borderColor={borderColor}
        borderWidth={borderWidth}
        onFillColorChange={setFillColor}
        onBorderColorChange={setBorderColor}
        onBorderWidthChange={setBorderWidth}
      />

      <ZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />

      <LayerControls
        isVisible={!!selectedElementId && selectedElementId !== editingTextId}
        selectedElement={selectedElement}
        zoom={zoom}
        panOffset={panOffset}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
      />

      <div
        ref={canvasRef}
        className="w-full h-full relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? "grabbing" : "default" }}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {elements.map((element) => {
            if (element.type === "text") {
              return (
                <TextBox
                  key={element.id}
                  element={element}
                  isSelected={element.id === selectedElementId}
                  isEditing={element.id === editingTextId}
                  isManuallyResizing={isManuallyResizing}
                  onSelect={() => {
                    setSelectedElementId(element.id);
                    setEditingTextId(null);
                  }}
                  onEdit={() => setEditingTextId(element.id)}
                  onChange={(content) => handleTextChange(element.id, content)}
                  onResize={(newHeight) =>
                    handleTextResize(element.id, newHeight)
                  }
                />
              );
            } else if (element.type === "image") {
              return (
                <ImageBox
                  key={element.id}
                  element={element}
                  isSelected={element.id === selectedElementId}
                  onSelect={() => {
                    setSelectedElementId(element.id);
                    setEditingTextId(null);
                  }}
                />
              );
            } else if (element.type === "arrow") {
              return (
                <Arrow
                  key={element.id}
                  element={element}
                  isSelected={element.id === selectedElementId}
                  onSelect={() => {
                    setSelectedElementId(element.id);
                    setEditingTextId(null);
                  }}
                />
              );
            } else {
              return (
                <Shape
                  key={element.id}
                  element={element}
                  isSelected={element.id === selectedElementId}
                  onSelect={() => {
                    setSelectedElementId(element.id);
                    setEditingTextId(null);
                  }}
                />
              );
            }
          })}

          {selectedElement && selectedElementId !== editingTextId && (
            <ResizeHandles
              element={selectedElement}
              onResizeStart={handleResizeStart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
