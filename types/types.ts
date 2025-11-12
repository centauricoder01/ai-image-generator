export interface TextEntry {
  id: string;
  label: string;
  value: string;
  valueType?: "text" | "image" | "video"; // Add this to track the type of value
}

export interface MessageNodeData {
  message: string;
  contentType: "text" | "image" | "video" | "heading";
  imageUrl?: string;
  fontSize : number;
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

export interface HeadingNodeProps {
  data: {
    fontSize?: number;
    contentType: "text" | "image" | "video";
    onDelete: (id: string) => void;
    onNodeClick: (id: string) => void;
    message?: string;
  };
  id: string;
}

export interface MessageNodeProps {
  data: MessageNodeData;
  id: string;
}



// Canvas imports

export interface Point {
  x: number;
  y: number;
}

export interface BaseElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapeElement extends BaseElement {
  type: "rectangle" | "circle";
  fillColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  baseFontSize: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
}

export interface ArrowElement extends BaseElement {
  type: "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  strokeWidth: number;
}

export type CanvasElement =
  | ShapeElement
  | TextElement
  | ImageElement
  | ArrowElement;

export type Tool =
  | "select"
  | "rectangle"
  | "circle"
  | "text"
  | "image"
  | "arrow";

export interface ResizeHandle {
  position: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";
  x: number;
  y: number;
}
