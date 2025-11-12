import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { CanvasElement } from "../types/types";

interface UseCollaborationProps {
  roomId: string | null;
  ownerId: string | null;
  sessionToken: string | null; // Add this
  elements: CanvasElement[];
  onElementsUpdate: (elements: CanvasElement[]) => void;
  onSessionTokenReceived: (token: string) => void; // Add this callback
}

interface CollaborationState {
  isConnected: boolean;
  userCount: number;
  error: string | null;
  userRole: "owner" | "collaborator" | "viewer" | null; // Add this
  userList: User[]; // Add this
}

interface User {
  socketId: string;
  role: "owner" | "collaborator" | "viewer";
  joinedAt: Date;
}

export const useCollaboration = ({
  roomId,
  ownerId,
  sessionToken, // Add this
  elements,
  onElementsUpdate,
  onSessionTokenReceived, // Add this
}: UseCollaborationProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    userCount: 0,
    error: null,
    userRole: null,
    userList: [],
  });

  const isRemoteUpdateRef = useRef(false);
  const lastElementsRef = useRef<CanvasElement[]>(elements);

  // Connect to WebSocket server
  useEffect(() => {
    if (!roomId) return;

    const socket = io(`http://localhost:3002`, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // In useCollaboration hook, update the join-room emit:
    socket.on("connect", () => {
      console.log("Connected to server");
      setState((prev) => ({ ...prev, isConnected: true, error: null }));

      // Get invite token from session storage
      const inviteToken = sessionStorage.getItem("pendingInviteToken");

      // Join the room with proper authentication
      socket.emit("join-room", {
        roomId,
        ownerId: ownerId || undefined,
        inviteToken: inviteToken || undefined,
        sessionToken: sessionToken || undefined,
      });

      // Clear the invite token after use
      if (inviteToken) {
        sessionStorage.removeItem("pendingInviteToken");
      }
    });

    // Update canvas-state handler
    socket.on(
      "canvas-state",
      (data: {
        elements: CanvasElement[];
        role: "owner" | "collaborator" | "viewer";
        sessionToken?: string;
      }) => {
        console.log("Received canvas state with role:", data.role);
        isRemoteUpdateRef.current = true;
        onElementsUpdate(data.elements);
        setState((prev) => ({ ...prev, userRole: data.role }));

        // Store session token if received
        if (data.sessionToken) {
          onSessionTokenReceived(data.sessionToken);
        }

        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 100);
      }
    );

    // Receive canvas updates from other users
    socket.on("canvas-update", (remoteElements: CanvasElement[]) => {
      console.log("Received canvas update");
      isRemoteUpdateRef.current = true;
      onElementsUpdate(remoteElements);
      setTimeout(() => {
        isRemoteUpdateRef.current = false;
      }, 100);
    });

    // Receive individual element updates
    // Receive individual element updates
    socket.on(
      "element-update",
      ({
        element,
        action,
      }: {
        element: CanvasElement;
        action: "add" | "update" | "delete";
      }) => {
        isRemoteUpdateRef.current = true;

        // Get current elements from ref instead of using callback
        const currentElements = lastElementsRef.current;
        let updatedElements: CanvasElement[];

        if (action === "add") {
          updatedElements = [...currentElements, element];
        } else if (action === "update") {
          updatedElements = currentElements.map((e) =>
            e.id === element.id ? element : e
          );
        } else if (action === "delete") {
          updatedElements = currentElements.filter((e) => e.id !== element.id);
        } else {
          updatedElements = currentElements;
        }

        // Update with the new array
        onElementsUpdate(updatedElements);
        lastElementsRef.current = updatedElements;

        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 100);
      }
    );

    // Receive user list updates
    socket.on("user-list", (users: User[]) => {
      setState((prev) => ({
        ...prev,
        userCount: users.length,
        userList: users,
      }));
    });

    // Handle role changes
    socket.on(
      "role-changed",
      (data: { newRole: "collaborator" | "viewer" }) => {
        setState((prev) => ({ ...prev, userRole: data.newRole }));
        alert(`Your role has been changed to ${data.newRole}`);
      }
    );

    // Handle errors
    socket.on("error", (data: { message: string }) => {
      setState((prev) => ({ ...prev, error: data.message }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, error: null }));
      }, 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, ownerId]);

  // Broadcast local changes to other users (only if not a viewer)
  useEffect(() => {
    if (!socketRef.current || !roomId || isRemoteUpdateRef.current) return;

    // Don't broadcast if user is a viewer
    if (state.userRole === "viewer") return;

    if (JSON.stringify(elements) === JSON.stringify(lastElementsRef.current)) {
      return;
    }

    lastElementsRef.current = elements;

    socketRef.current.emit("canvas-update", {
      roomId,
      elements,
    });
  }, [elements, roomId, state.userRole]);

  const changeUserPermission = useCallback(
    (targetUserId: string, newRole: "collaborator" | "viewer") => {
      if (!socketRef.current || !roomId || state.userRole !== "owner") return;

      socketRef.current.emit("change-permission", {
        roomId,
        targetUserId,
        newRole,
      });
    },
    [roomId, state.userRole]
  );

  return {
    ...state,
    changeUserPermission,
  };
};
