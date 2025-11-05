import { AlertCircle, CheckCircle, X } from "lucide-react";

export const Modal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        {/* Header with colored bar */}
        <div
          className={`h-2 rounded-t-2xl ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          }`}
        />

        {/* Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-full ${
                isSuccess ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h3
              className={`text-xl font-semibold ${
                isSuccess ? "text-green-800" : "text-red-800"
              }`}
            >
              {title}
            </h3>
          </div>

          {/* Message */}
          <p className="text-gray-700 leading-relaxed mb-6">{message}</p>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSuccess
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isSuccess ? "Great!" : "Got it"}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};
