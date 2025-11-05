"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
} from "@xyflow/react";

import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MessageCircle } from "lucide-react";
import type { MessageNodeData } from "../../types/types";
import { Modal } from "../../components/Model";
import { ContentEditor } from "../../components/ConentEditor";
import { MessageNode } from "../../components/MessageNode";
import { AIGenerateModal } from "../../components/AImodel";

import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Layout,
  Smartphone,
  Monitor,
  Presentation,
  FileText,
  Sparkles,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const contentTypes = [
  {
    id: "youtube-thumbnail",
    title: "YouTube Thumbnails",
    description: "Eye-catching thumbnails that boost click-through rates",
    icon: <Youtube className="w-8 h-8" />,
    size: "1280 × 720px",
    category: "Video Content",
    color: "from-red-500 to-red-600",
    href: "/image-text-generator?ref=youtube-thumbnail",
  },
  {
    id: "instagram-post",
    title: "Instagram Posts",
    description: "Square posts perfect for Instagram feeds",
    icon: <Instagram className="w-8 h-8" />,
    size: "1080 × 1080px",
    category: "Social Media",
    color: "from-pink-500 to-purple-600",
    href: "/image-text-generator?ref=instagram-post",
  },
  {
    id: "instagram-story",
    title: "Instagram Stories",
    description: "Vertical stories and highlights covers",
    icon: <Smartphone className="w-8 h-8" />,
    size: "1080 × 1920px",
    category: "Social Media",
    color: "from-purple-500 to-pink-500",
    href: "/image-text-generator?ref=instagram-story",
  },
  {
    id: "facebook-post",
    title: "Facebook Posts",
    description: "Engaging posts for Facebook feeds",
    icon: <Facebook className="w-8 h-8" />,
    size: "1200 × 630px",
    category: "Social Media",
    color: "from-blue-600 to-blue-700",
    href: "/image-text-generator?ref=facebook-post",
  },
  {
    id: "twitter-post",
    title: "Twitter/X Posts",
    description: "Perfect images for tweets and threads",
    icon: <Twitter className="w-8 h-8" />,
    size: "1200 × 675px",
    category: "Social Media",
    color: "from-sky-500 to-blue-600",
    href: "/image-text-generator?ref=twitter-post",
  },
  {
    id: "linkedin-post",
    title: "LinkedIn Posts",
    description: "Professional content for LinkedIn",
    icon: <Linkedin className="w-8 h-8" />,
    size: "1200 × 627px",
    category: "Social Media",
    color: "from-blue-500 to-indigo-600",
    href: "/image-text-generator?ref=linkedin-post",
  },
  {
    id: "blog-header",
    title: "Blog Headers",
    description: "Featured images for blog posts",
    icon: <FileText className="w-8 h-8" />,
    size: "1200 × 600px",
    category: "Blog Content",
    color: "from-green-500 to-emerald-600",
    href: "/image-text-generator?ref=blog-header",
  },
  {
    id: "pinterest-pin",
    title: "Pinterest Pins",
    description: "Vertical pins that get saved",
    icon: <Layout className="w-8 h-8" />,
    size: "1000 × 1500px",
    category: "Social Media",
    color: "from-red-500 to-rose-600",
    href: "/image-text-generator?ref=pinterest-pin",
  },
  {
    id: "presentation-slide",
    title: "Presentation Slides",
    description: "Professional slides and graphics",
    icon: <Presentation className="w-8 h-8" />,
    size: "1920 × 1080px",
    category: "Business",
    color: "from-indigo-500 to-purple-600",
    href: "/image-text-generator?ref=presentation-slide",
  },
  {
    id: "facebook-cover",
    title: "Facebook Covers",
    description: "Profile and page cover photos",
    icon: <Monitor className="w-8 h-8" />,
    size: "1640 × 859px",
    category: "Social Media",
    color: "from-blue-600 to-cyan-600",
    href: "/image-text-generator?ref=facebook-cover",
  },
  {
    id: "twitter-header",
    title: "Twitter Headers",
    description: "Profile banner images",
    icon: <Layout className="w-8 h-8" />,
    size: "1500 × 500px",
    category: "Social Media",
    color: "from-sky-400 to-blue-500",
    href: "/image-text-generator?ref=twitter-header",
  },
  {
    id: "linkedin-banner",
    title: "LinkedIn Banners",
    description: "Professional profile banners",
    icon: <Monitor className="w-8 h-8" />,
    size: "1584 × 396px",
    category: "Social Media",
    color: "from-blue-500 to-cyan-600",
    href: "/image-text-generator?ref=linkedin-banner",
  },
];

// Draggable Message Node Component for the sidebar
const DraggableMessageNode = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="w-full bg-green-100 border-2 border-green-200 rounded-lg p-3 hover:bg-green-200 transition-colors cursor-grab active:cursor-grabbing"
      onDragStart={(event) => onDragStart(event, "messageNode")}
      draggable
    >
      <div className="flex items-center gap-2 justify-center">
        <MessageCircle size={16} className="text-green-700" />
        <span className="text-sm font-medium text-green-800">
          Drag Message Node
        </span>
      </div>
    </div>
  );
};

const nodeTypes = {
  messageNode: MessageNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "messageNode",
    position: { x: 100, y: 200 },
    data: {
      message: "test message 1",
      contentType: "text" as const,
    },
  },
  {
    id: "2",
    type: "messageNode",
    position: { x: 400, y: 150 },
    data: {
      message: "test message 2",
      contentType: "text" as const,
    },
  },
];

const initialEdges: Edge[] = [];

function FlowComponent() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState<number>(3);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      id: `${params.source}-${params.target}`,
      source: params.source!,
      target: params.target!,
      style: { stroke: "#94a3b8", strokeWidth: 2 },
      markerEnd: {
        type: "arrowclosed",
        color: "#94a3b8",
      },
    };

    setEdges((edgesSnapshot) => addEdge(newEdge, edgesSnapshot));
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId]
  );

  const updateNodeMessage = useCallback((nodeId: string, message: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, message } } : node
      )
    );
  }, []);

  const updateNodeContentType = useCallback(
    (nodeId: string, contentType: string, additionalData?: any) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  contentType,
                  ...additionalData,
                },
              }
            : node
        )
      );
    },
    []
  );

  const showModal = (
    type: "success" | "error",
    title: string,
    message: string
  ) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const nodesWithFunctions: Node[] = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onDelete: deleteNode,
      onMessageChange: updateNodeMessage,
      onContentTypeChange: updateNodeContentType,
      onNodeClick: handleNodeClick,
    },
  }));

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Snap to grid for better alignment in complex flows
      const snappedPosition = {
        x: Math.round(position.x / 50) * 50,
        y: Math.round(position.y / 50) * 50,
      };

      const newNode: Node = {
        id: nodeIdCounter.toString(),
        type,
        position: snappedPosition,
        data: {
          message: "",
          contentType: "text" as const,
          onDelete: deleteNode,
          onMessageChange: updateNodeMessage,
          onContentTypeChange: updateNodeContentType,
          onNodeClick: handleNodeClick,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setNodeIdCounter((counter) => counter + 1);
    },
    [
      reactFlowInstance,
      nodeIdCounter,
      deleteNode,
      updateNodeMessage,
      updateNodeContentType,
      handleNodeClick,
    ]
  );

  const handleAIGenerate = useCallback(
    (flowData: any) => {
      // Clear existing nodes and edges
      setNodes([]);
      setEdges([]);

      // Find the highest existing node ID to continue counter
      const maxId = Math.max(
        ...flowData.nodes.map((n: any) => parseInt(n.id) || 0),
        0
      );
      setNodeIdCounter(maxId + 1);

      // Create nodes from AI response with textEntries support
      const newNodes: Node[] = flowData.nodes.map((nodeData: any) => {
        // Ensure textEntries exist
        let textEntries = [];

        if (nodeData.textEntries && Array.isArray(nodeData.textEntries)) {
          textEntries = nodeData.textEntries;
        } else if (nodeData.message) {
          // Fallback: convert old message format to textEntries
          textEntries = [
            {
              id: "entry1",
              label: "Message",
              value: nodeData.message,
              valueType: "text",
            },
          ];
        }

        return {
          id: nodeData.id,
          type: "messageNode",
          position: nodeData.position,
          data: {
            contentType: nodeData.contentType || "text",
            textEntries: textEntries,
            message:
              nodeData.message ||
              textEntries.map((e: any) => `${e.label}: ${e.value}`).join(" "),
            // Include any additional data
            imageUrl: nodeData.imageUrl,
            videoUrl: nodeData.videoUrl,
            onDelete: deleteNode,
            onMessageChange: updateNodeMessage,
            onContentTypeChange: updateNodeContentType,
            onNodeClick: handleNodeClick,
          },
        };
      });

      // Create edges with enhanced styling for complex flows
      const newEdges: Edge[] = flowData.edges.map(
        (edgeData: any, index: number) => {
          const sourceEdges = flowData.edges.filter(
            (e: any) => e.source === edgeData.source
          );
          const isBranching = sourceEdges.length > 1;

          return {
            id: edgeData.id || `${edgeData.source}-${edgeData.target}-${index}`,
            source: edgeData.source,
            target: edgeData.target,
            type: edgeData.type || "default",
            animated: edgeData.animated || false,
            style: {
              stroke: isBranching ? "#3b82f6" : "#94a3b8",
              strokeWidth: isBranching ? 2.5 : 2,
            },
            markerEnd: {
              type: "arrowclosed",
              color: isBranching ? "#3b82f6" : "#94a3b8",
            },
            label: edgeData.label || "",
          };
        }
      );

      setNodes(newNodes);
      setEdges(newEdges);

      const nodeCount = newNodes.length;
      const edgeCount = newEdges.length;

      // Count total text entries across all nodes
      const totalEntries = newNodes.reduce((sum, node) => {
        return sum + (node.data.textEntries?.length || 0);
      }, 0);

      const complexity =
        nodeCount > 10 ? "complex" : nodeCount > 5 ? "moderate" : "simple";

      showModal(
        "success",
        "Detailed Flow Generated!",
        `Created a ${complexity} flow with ${nodeCount} nodes, ${totalEntries} detailed entries, and ${edgeCount} connections.`
      );

      // Fit view with padding for complex flows
      setTimeout(() => {
        reactFlowInstance?.fitView({
          padding: 0.15,
          maxZoom: 1,
          minZoom: 0.5,
        });
      }, 100);
    },
    [
      nodeIdCounter,
      reactFlowInstance,
      deleteNode,
      updateNodeMessage,
      updateNodeContentType,
      handleNodeClick,
    ]
  );

  const saveChanges = () => {
    // For complex flows, allow multiple disconnected branches
    const unconnectedNodes = nodes.filter((node) => {
      const hasIncomingConnection = edges.some(
        (edge) => edge.target === node.id
      );
      const hasOutgoingConnection = edges.some(
        (edge) => edge.source === node.id
      );
      return !hasIncomingConnection && !hasOutgoingConnection;
    });

    // Only warn if there are completely isolated nodes (not start/end nodes)
    if (unconnectedNodes.length > 2) {
      // Allow 1 start and 1 end node to be unconnected
      const nodeMessages = unconnectedNodes
        .map((node) => {
          const message = (node.data as unknown as Partial<MessageNodeData>)
            ?.message;
          return message && message.trim() !== "" ? message : `Node ${node.id}`;
        })
        .join(", ");

      showModal(
        "error",
        "Cannot Save Changes",
        `Warning: ${unconnectedNodes.length} nodes appear to be isolated: ${nodeMessages}. Consider connecting them.`
      );
      return;
    }

    // Validate that nodes have content
    const emptyMessageNodes = nodes.filter((node) => {
      const nodeData = node.data as unknown as MessageNodeData;
      const message = nodeData?.message;
      const hasContent =
        (message && message.trim() !== "") ||
        nodeData?.imageUrl ||
        nodeData?.videoUrl;
      return !hasContent;
    });

    if (emptyMessageNodes.length > 0) {
      showModal(
        "error",
        "Cannot Save Changes",
        `${emptyMessageNodes.length} node(s) have empty content. Please add content to all nodes.`
      );
      return;
    }

    // Detect flow complexity
    const branchingNodes = nodes.filter((node) => {
      const outgoingEdges = edges.filter((e) => e.source === node.id);
      return outgoingEdges.length > 1;
    });

    const convergingNodes = nodes.filter((node) => {
      const incomingEdges = edges.filter((e) => e.target === node.id);
      return incomingEdges.length > 1;
    });

    const flowData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        position: node.position,
        ...(node.data as unknown as MessageNodeData),
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        animated: edge.animated,
        label: edge.label,
      })),
      metadata: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        branchingPoints: branchingNodes.length,
        convergingPoints: convergingNodes.length,
        complexity:
          nodes.length > 10
            ? "complex"
            : nodes.length > 5
            ? "moderate"
            : "simple",
      },
    };

    console.log("Complex Flow Data:", flowData);

    showModal(
      "success",
      "Changes Saved Successfully!",
      `Your ${flowData.metadata.complexity} flow has been saved with ${nodes.length} nodes, ${branchingNodes.length} branching points, and ${convergingNodes.length} convergence points.`
    );
  };

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {/* Left Section - 80% - React Flow */}
      <div className="w-4/5 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodesWithFunctions}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Right Section - 20% - Controls Panel */}
      <div className="w-1/5 h-full bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Save Button */}
          <button
            onClick={saveChanges}
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm mb-4 cursor-pointer"
          >
            Save Changes
          </button>

          {/* Generate with AI Button */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors shadow-sm mb-4 cursor-pointer"
          >
            Generate with AI
          </button>

          {/* Nodes Panel */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Drag to add nodes:</div>
            <DraggableMessageNode />
          </div>

          {/* Content Editor */}
          <div className="flex-1 mb-4">
            <ContentEditor
              selectedNodeId={selectedNodeId}
              nodes={nodes}
              onMessageChange={updateNodeMessage}
              onContentTypeChange={updateNodeContentType}
              onClose={() => setSelectedNodeId(null)}
            />
          </div>

          {/* Clear All Button */}
          <button
            onClick={clearAll}
            className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors border border-red-200 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      {/* AI Generate Modal */}
      <AIGenerateModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-sky-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ImageCraft
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#tools"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Tools
              </a>

              <Link
                href="/text-behind-image"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Text behind Image
              </Link>

              <Link
                href="/flow-builder"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Flow Builder
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <a className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    Content types
                  </a>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  {contentTypes.map((item) => (
                    <Link key={item.id} href={item.href} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        {item.title}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="image-text-generator"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <button className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <ReactFlowProvider>
        <FlowComponent />
      </ReactFlowProvider>
    </>
  );
}
