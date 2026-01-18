import type { CanvasElement, Point, ResizeHandle } from "../types/types";

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getResizeHandles = (element: CanvasElement): ResizeHandle[] => {
  return [
    { position: "nw", x: element.x, y: element.y },
    { position: "ne", x: element.x + element.width, y: element.y },
    { position: "sw", x: element.x, y: element.y + element.height },
    {
      position: "se",
      x: element.x + element.width,
      y: element.y + element.height,
    },
    { position: "n", x: element.x + element.width / 2, y: element.y },
    {
      position: "s",
      x: element.x + element.width / 2,
      y: element.y + element.height,
    },
    {
      position: "e",
      x: element.x + element.width,
      y: element.y + element.height / 2,
    },
    { position: "w", x: element.x, y: element.y + element.height / 2 },
  ];
};

export const isPointInElement = (
  point: Point,
  element: CanvasElement
): boolean => {
  return (
    point.x >= element.x &&
    point.x <= element.x + element.width &&
    point.y >= element.y &&
    point.y <= element.y + element.height
  );
};
