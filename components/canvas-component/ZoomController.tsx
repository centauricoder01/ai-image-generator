export const ZoomControls: React.FC<{
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}> = ({ zoom, onZoomIn, onZoomOut, onZoomReset }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white shadow-lg rounded-lg p-2 z-10 flex items-center gap-2">
      <button
        onClick={onZoomOut}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-semibold"
        title="Zoom Out"
      >
        −
      </button>
      <button
        onClick={onZoomReset}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm min-w-[60px]"
        title="Reset Zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={onZoomIn}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-semibold"
        title="Zoom In"
      >
        +
      </button>
    </div>
  );
};