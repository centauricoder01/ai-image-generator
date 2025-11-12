import { ArrowRight, Circle, Image, MousePointer, Square, Type } from "lucide-react";
import type { Tool } from "../../types/types";

export const Toolbar: React.FC<{
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
}> = ({ selectedTool, onToolChange }) => {
  const tools: { icon: React.ReactNode; value: Tool; label: string }[] = [
    { icon: <MousePointer size={20} />, value: "select", label: "Select" },
    { icon: <Square size={20} />, value: "rectangle", label: "Rectangle" },
    { icon: <Circle size={20} />, value: "circle", label: "Circle" },
    { icon: <Type size={20} />, value: "text", label: "Text" },
    { icon: <Image size={20} />, value: "image", label: "Image" },
    { icon: <ArrowRight size={20} />, value: 'arrow', label: 'Arrow' },
  ];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex gap-2 z-10">
      {tools.map((tool) => (
        <button
          key={tool.value}
          onClick={() => onToolChange(tool.value)}
          className={`p-3 rounded-md transition-all ${
            selectedTool === tool.value
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};
