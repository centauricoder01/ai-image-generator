// import { useEffect, useRef, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import type { CanvasElement } from "../types/types";

// interface UseCollaborationProps {
//   roomId: string | null;
//   ownerId: string | null;
//   sessionToken: string | null; // Add this
//   elements: CanvasElement[];
//   onElementsUpdate: (elements: CanvasElement[]) => void;
//   onSessionTokenReceived: (token: string) => void; // Add this callback
// }

// interface CollaborationState {
//   isConnected: boolean;
//   userCount: number;
//   error: string | null;
//   userRole: "owner" | "collaborator" | "viewer" | null; // Add this
//   userList: User[]; // Add this
// }

// interface User {
//   socketId: string;
//   role: "owner" | "collaborator" | "viewer";
//   joinedAt: Date;
// }

// export const useCollaboration = ({
//   roomId,
//   ownerId,
//   sessionToken, // Add this
//   elements,
//   onElementsUpdate,
//   onSessionTokenReceived, // Add this
// }: UseCollaborationProps) => {
//   const socketRef = useRef<Socket | null>(null);
//   const [state, setState] = useState<CollaborationState>({
//     isConnected: false,
//     userCount: 0,
//     error: null,
//     userRole: null,
//     userList: [],
//   });

//   const isRemoteUpdateRef = useRef(false);
//   const lastElementsRef = useRef<CanvasElement[]>(elements);

//   // Connect to WebSocket server
//   useEffect(() => {
//     if (!roomId) return;

//     const socket = io(`http://3.7.156.63:3002`, {
//       transports: ["websocket", "polling"],
//     });

//     socketRef.current = socket;

//     // In useCollaboration hook, update the join-room emit:
//     socket.on("connect", () => {
//       console.log("Connected to server");
//       setState((prev) => ({ ...prev, isConnected: true, error: null }));

//       // Get invite token from session storage
//       const inviteToken = sessionStorage.getItem("pendingInviteToken");

//       // Join the room with proper authentication
//       socket.emit("join-room", {
//         roomId,
//         ownerId: ownerId || undefined,
//         inviteToken: inviteToken || undefined,
//         sessionToken: sessionToken || undefined,
//       });

//       // Clear the invite token after use
//       if (inviteToken) {
//         sessionStorage.removeItem("pendingInviteToken");
//       }
//     });

//     // Update canvas-state handler
//     socket.on(
//       "canvas-state",
//       (data: {
//         elements: CanvasElement[];
//         role: "owner" | "collaborator" | "viewer";
//         sessionToken?: string;
//       }) => {
//         console.log("Received canvas state with role:", data.role);
//         isRemoteUpdateRef.current = true;
//         onElementsUpdate(data.elements);
//         setState((prev) => ({ ...prev, userRole: data.role }));

//         // Store session token if received
//         if (data.sessionToken) {
//           onSessionTokenReceived(data.sessionToken);
//         }

//         setTimeout(() => {
//           isRemoteUpdateRef.current = false;
//         }, 100);
//       }
//     );

//     // Receive canvas updates from other users
//     socket.on("canvas-update", (remoteElements: CanvasElement[]) => {
//       console.log("Received canvas update");
//       isRemoteUpdateRef.current = true;
//       onElementsUpdate(remoteElements);
//       setTimeout(() => {
//         isRemoteUpdateRef.current = false;
//       }, 100);
//     });

//     // Receive individual element updates
//     // Receive individual element updates
//     socket.on(
//       "element-update",
//       ({
//         element,
//         action,
//       }: {
//         element: CanvasElement;
//         action: "add" | "update" | "delete";
//       }) => {
//         isRemoteUpdateRef.current = true;

//         // Get current elements from ref instead of using callback
//         const currentElements = lastElementsRef.current;
//         let updatedElements: CanvasElement[];

//         if (action === "add") {
//           updatedElements = [...currentElements, element];
//         } else if (action === "update") {
//           updatedElements = currentElements.map((e) =>
//             e.id === element.id ? element : e
//           );
//         } else if (action === "delete") {
//           updatedElements = currentElements.filter((e) => e.id !== element.id);
//         } else {
//           updatedElements = currentElements;
//         }

//         // Update with the new array
//         onElementsUpdate(updatedElements);
//         lastElementsRef.current = updatedElements;

//         setTimeout(() => {
//           isRemoteUpdateRef.current = false;
//         }, 100);
//       }
//     );

//     // Receive user list updates
//     socket.on("user-list", (users: User[]) => {
//       setState((prev) => ({
//         ...prev,
//         userCount: users.length,
//         userList: users,
//       }));
//     });

//     // Handle role changes
//     socket.on(
//       "role-changed",
//       (data: { newRole: "collaborator" | "viewer" }) => {
//         setState((prev) => ({ ...prev, userRole: data.newRole }));
//         alert(`Your role has been changed to ${data.newRole}`);
//       }
//     );

//     // Handle errors
//     socket.on("error", (data: { message: string }) => {
//       setState((prev) => ({ ...prev, error: data.message }));
//       setTimeout(() => {
//         setState((prev) => ({ ...prev, error: null }));
//       }, 3000);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [roomId, ownerId]);

//   // Broadcast local changes to other users (only if not a viewer)
//   useEffect(() => {
//     if (!socketRef.current || !roomId || isRemoteUpdateRef.current) return;

//     // Don't broadcast if user is a viewer
//     if (state.userRole === "viewer") return;

//     if (JSON.stringify(elements) === JSON.stringify(lastElementsRef.current)) {
//       return;
//     }

//     lastElementsRef.current = elements;

//     socketRef.current.emit("canvas-update", {
//       roomId,
//       elements,
//     });
//   }, [elements, roomId, state.userRole]);

//   const changeUserPermission = useCallback(
//     (targetUserId: string, newRole: "collaborator" | "viewer") => {
//       if (!socketRef.current || !roomId || state.userRole !== "owner") return;

//       socketRef.current.emit("change-permission", {
//         roomId,
//         targetUserId,
//         newRole,
//       });
//     },
//     [roomId, state.userRole]
//   );

//   return {
//     ...state,
//     changeUserPermission,
//   };
// };

// "use client"

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { CanvasElement } from "../types/types";

interface UseCollaborationProps {
  roomId: string | null;
  ownerId: string | null;
  sessionToken: string | null;
  sheets: {
    [key: string]: {
      elements: CanvasElement[];
      name: string;
    };
  };
  activeSheetId: string;
  sheetOrder: string[];
  onSheetsUpdate: (sheets: {
    [key: string]: {
      elements: CanvasElement[];
      name: string;
    };
  } | ((prevSheets: {
    [key: string]: {
      elements: CanvasElement[];
      name: string;
    };
  }) => {
    [key: string]: {
      elements: CanvasElement[];
      name: string;
    };
  })) => void;
  onActiveSheetChange: (sheetId: string) => void;
  onSheetOrderUpdate: (order: string[] | ((prevOrder: string[]) => string[])) => void;
  onSessionTokenReceived: (token: string) => void;
}

interface CollaborationState {
  isConnected: boolean;
  userCount: number;
  error: string | null;
  userRole: "owner" | "collaborator" | "viewer" | null;
  userList: User[];
}

interface User {
  socketId: string;
  role: "owner" | "collaborator" | "viewer";
  joinedAt: Date;
}

export const useCollaboration = ({
  roomId,
  ownerId,
  sessionToken,
  sheets,
  activeSheetId,
  onSheetsUpdate,
  onActiveSheetChange,
  onSheetOrderUpdate,
  onSessionTokenReceived,
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
  const lastSheetsRef = useRef(sheets);

  // Connect to WebSocket server
  useEffect(() => {
    if (!roomId) return;

    const socket = io("http://65.1.139.176:3002", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
      setState((prev) => ({ ...prev, isConnected: true, error: null }));

      const inviteToken = sessionStorage.getItem("pendingInviteToken");

      socket.emit("join-room", {
        roomId,
        ownerId: ownerId || undefined,
        inviteToken: inviteToken || undefined,
        sessionToken: sessionToken || undefined,
      });

      if (inviteToken) {
        sessionStorage.removeItem("pendingInviteToken");
      }
    });

    // Receive initial canvas state
    socket.on(
      "canvas-state",
      (data: {
        sheets: {
          [key: string]: {
            elements: CanvasElement[];
            name: string;
          };
        };
        activeSheetId: string;
        sheetOrder: string[];
        role: "owner" | "collaborator" | "viewer";
        sessionToken?: string;
      }) => {
        console.log("Received canvas state with role:", data.role);
        console.log("Sheets:", data.sheets);
        console.log("Active sheet:", data.activeSheetId);

        isRemoteUpdateRef.current = true;

        // Update all sheets
        onSheetsUpdate(data.sheets);
        onActiveSheetChange(data.activeSheetId);
        onSheetOrderUpdate(data.sheetOrder);
        setState((prev) => ({ ...prev, userRole: data.role }));

        if (data.sessionToken) {
          onSessionTokenReceived(data.sessionToken);
        }

        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 100);
      }
    );

    // Receive canvas updates for specific sheet
    socket.on(
      "canvas-update",
      (data: { sheetId: string; elements: CanvasElement[] }) => {
        console.log("Received canvas update for sheet:", data.sheetId);
        isRemoteUpdateRef.current = true;

        onSheetsUpdate((prevSheets: {
          [key: string]: {
            elements: CanvasElement[];
            name: string;
          };
        }) => ({
          ...prevSheets,
          [data.sheetId]: {
            ...prevSheets[data.sheetId],
            elements: data.elements,
          },
        }));

        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 100);
      }
    );

    // NEW: Handle sheet created
    socket.on(
      "sheet-created",
      (data: { sheetId: string; sheetName: string }) => {
        console.log("Sheet created by another user:", data.sheetId);
        isRemoteUpdateRef.current = true;

        onSheetsUpdate((prevSheets: {
          [key: string]: {
            elements: CanvasElement[];
            name: string;
          };
        }) => {
          // Check if sheet already exists (to prevent duplicates)
          if (prevSheets[data.sheetId]) {
            console.log("Sheet already exists, skipping");
            return prevSheets;
          }

          return {
            ...prevSheets,
            [data.sheetId]: {
              elements: [],
              name: data.sheetName,
            },
          };
        });

        onSheetOrderUpdate((prevOrder) => {
          // Check if already in order
          if (prevOrder.includes(data.sheetId)) {
            return prevOrder;
          }
          return [...prevOrder, data.sheetId];
        });

        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 100);
      }
    );

    // NEW: Handle sheet switched
    socket.on("sheet-switched", (data: { sheetId: string; userId: string }) => {
      console.log("User switched to sheet:", data.sheetId);
      // Optional: You can show a notification that another user switched sheets
    });

    // NEW: Handle sheet renamed
    socket.on("sheet-renamed", (data: { sheetId: string; newName: string }) => {
      console.log("Sheet renamed:", data.sheetId, data.newName);
      isRemoteUpdateRef.current = true;

      onSheetsUpdate((prevSheets: {
        [key: string]: {
          elements: CanvasElement[];
          name: string;
        };
      }) => ({
        ...prevSheets,
        [data.sheetId]: {
          ...prevSheets[data.sheetId],
          name: data.newName,
        },
      }));

      setTimeout(() => {
        isRemoteUpdateRef.current = false;
      }, 100);
    });

    // NEW: Handle sheet deleted
    socket.on(
      "sheet-deleted",
      (data: { sheetId: string; newActiveSheetId: string }) => {
        console.log("Sheet deleted:", data.sheetId);
        isRemoteUpdateRef.current = true;

        onSheetsUpdate((prevSheets) => {
          const newSheets = { ...prevSheets };
          delete newSheets[data.sheetId];
          return newSheets;
        });

        onSheetOrderUpdate((prevOrder) =>
          prevOrder.filter((id) => id !== data.sheetId)
        );

        // If the deleted sheet was active, switch to new active sheet
        onActiveSheetChange(data.newActiveSheetId);

        setTimeout(() => {
          isRemoteUpdateRef.current = false;
        }, 100);
      }
    );

    // Receive individual element updates
    socket.on(
      "element-update",
      (data: {
        sheetId: string;
        element: CanvasElement;
        action: "add" | "update" | "delete";
      }) => {
        isRemoteUpdateRef.current = true;

        onSheetsUpdate((prevSheets: {
          [key: string]: {
            elements: CanvasElement[];
            name: string;
          };
        }) => {
          const sheet = prevSheets[data.sheetId];
          if (!sheet) return prevSheets;

          let updatedElements: CanvasElement[];

          if (data.action === "add") {
            updatedElements = [...sheet.elements, data.element];
          } else if (data.action === "update") {
            updatedElements = sheet.elements.map((e) =>
              e.id === data.element.id ? data.element : e
            );
          } else if (data.action === "delete") {
            updatedElements = sheet.elements.filter(
              (e) => e.id !== data.element.id
            );
          } else {
            updatedElements = sheet.elements;
          }

          return {
            ...prevSheets,
            [data.sheetId]: {
              ...sheet,
              elements: updatedElements,
            },
          };
        });

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

  // Broadcast local changes to other users
  useEffect(() => {
    if (!socketRef.current || !roomId || isRemoteUpdateRef.current) return;

    if (state.userRole === "viewer") return;

    const currentSheet = sheets[activeSheetId];
    const lastSheet = lastSheetsRef.current[activeSheetId];

    if (
      JSON.stringify(currentSheet?.elements) !==
      JSON.stringify(lastSheet?.elements)
    ) {
      lastSheetsRef.current = sheets;

      socketRef.current.emit("canvas-update", {
        roomId,
        sheetId: activeSheetId,
        elements: currentSheet.elements,
      });
    }
  }, [sheets, activeSheetId, roomId, state.userRole]);

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

  const emitSheetCreate = useCallback(
    (sheetId: string, sheetName: string) => {
      if (!socketRef.current || !roomId || state.userRole === "viewer") return;

      socketRef.current.emit("sheet-create", {
        roomId,
        sheetId,
        sheetName,
      });
    },
    [roomId, state.userRole]
  );

  const emitSheetSwitch = useCallback(
    (sheetId: string) => {
      if (!socketRef.current || !roomId) return;

      socketRef.current.emit("sheet-switch", {
        roomId,
        sheetId,
      });
    },
    [roomId]
  );

  const emitSheetRename = useCallback(
    (sheetId: string, newName: string) => {
      if (!socketRef.current || !roomId || state.userRole === "viewer") return;

      socketRef.current.emit("sheet-rename", {
        roomId,
        sheetId,
        newName,
      });
    },
    [roomId, state.userRole]
  );

  const emitSheetDelete = useCallback(
    (sheetId: string) => {
      if (!socketRef.current || !roomId || state.userRole === "viewer") return;

      socketRef.current.emit("sheet-delete", {
        roomId,
        sheetId,
      });
    },
    [roomId, state.userRole]
  );

  return {
    ...state,
    changeUserPermission,
    emitSheetCreate,
    emitSheetSwitch,
    emitSheetRename,
    emitSheetDelete,
  };
};

