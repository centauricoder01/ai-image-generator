export interface TextEntry {
  id: string;
  label: string;
  value: string;
  valueType?: "text" | "image" | "video"; // Add this to track the type of value
}


export interface MessageNodeData {
  message: string;
  contentType: "text" | "image" | "video";
  imageUrl?: string;
  videoUrl?: string;
  onDelete: (id: string) => void;
  textEntries?: TextEntry[];
  onMessageChange: (id: string, message: string) => void;
  onContentTypeChange: (
    id: string,
    contentType: string,
    additionalData?: any
  ) => void;
  onNodeClick: (id: string) => void;
}

export interface MessageNodeProps {
  data: MessageNodeData;
  id: string;
}
