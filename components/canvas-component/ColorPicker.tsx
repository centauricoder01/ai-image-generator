export const ColorPicker: React.FC<{
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  onFillColorChange: (color: string) => void;
  onBorderColorChange: (color: string) => void;
  onBorderWidthChange: (width: number) => void;
}> = ({ fillColor, borderColor, borderWidth, onFillColorChange, onBorderColorChange, onBorderWidthChange }) => {
  return (
    <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-4 z-10 space-y-3">
      <div className="text-sm font-semibold text-gray-700">Style</div>
      
      <div className="space-y-2">
        <label className="text-xs text-gray-600 block">Fill Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={fillColor}
            onChange={(e) => onFillColorChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={fillColor}
            onChange={(e) => onFillColorChange(e.target.value)}
            className="w-20 px-2 py-1 text-xs border rounded"
          />
          <button
            onClick={() => onFillColorChange('transparent')}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-600 block">Border Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={borderColor}
            onChange={(e) => onBorderColorChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={borderColor}
            onChange={(e) => onBorderColorChange(e.target.value)}
            className="w-20 px-2 py-1 text-xs border rounded"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-600 block">Border Width</label>
        <input
          type="range"
          min="0"
          max="10"
          value={borderWidth}
          onChange={(e) => onBorderWidthChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-center">{borderWidth}px</div>
      </div>
    </div>
  );
};