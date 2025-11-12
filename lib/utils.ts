import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateHash(input: string): string {
  // Generate a random number
  const randomNum = Math.random();

  // Combine the input string with the random number
  const combinedString = input + randomNum.toString();

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert the hash to a string of hexadecimal characters
  const hexHash = Math.abs(hash).toString(16);

  // Ensure the hash is at least 8 characters long
  const paddedHash = hexHash.padStart(8, '0');

  // Take the first 8 characters
  return paddedHash.slice(0, 8);
}


// Canvas function

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

export const copyToClipboard = (text: string) => {
  if (navigator?.clipboard && window.isSecureContext) {
    // ✅ Modern way (works in HTTPS or localhost)
    return navigator.clipboard.writeText(text);
  } else {
    // ⚙️ Fallback for HTTP or older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Move textarea off-screen
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy"); // 👈 old method
      console.log("Copied to clipboard using fallback");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    document.body.removeChild(textArea);
  }
};
