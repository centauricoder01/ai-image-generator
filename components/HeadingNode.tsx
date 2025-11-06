import { MessageNodeProps } from "@/types/types";
import { X } from "lucide-react";

export const HeadingNode: React.FC<MessageNodeProps> = ({ data, id }) => {
  const fontSize = data.fontSize || 24;
  
  return (
    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-4 min-w-[250px] shadow-lg relative group">
      <button
        onClick={() => data.onDelete(id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
      >
        <X size={14} />
      </button>

      <div
        className="font-bold text-gray-800 text-center cursor-pointer hover:bg-yellow-50 rounded px-2 py-1 transition-colors"
        style={{ fontSize: `${fontSize}px` }}
        onClick={() => data.onNodeClick(id)}
      >
        {data.message || 'Click to add heading'}
      </div>
    </div>
  );
};