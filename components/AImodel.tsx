import React, { useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (flowData: any) => void;
}

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/flow-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.flowData) {
        onGenerate(data.flowData);
        setPrompt("");
        onClose();
      } else {
        throw new Error(data.error || "Failed to generate flow");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate flow");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPrompt("");
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Generate Flow with AI
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your workflow in detail
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Create an insurance policy workflow that collects customer device information (brand, model, serial number), then gathers purchase details (date, price, receipt). After that, validate all documents and check eligibility. Run a risk assessment, calculate pricing, and finally send an approval email and create a Google Doc with the policy summary."
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500">
              {prompt.length} characters
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              💡 Tips for complex workflows:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1.5">
              <li>
                • <strong>Be detailed:</strong> Mention all steps, inputs, and
                decision points
              </li>
              <li>
                • <strong>Specify branches:</strong> Describe parallel tasks or
                conditional paths
              </li>
              <li>
                • <strong>Include validation:</strong> Mention checks,
                approvals, or verification steps
              </li>
              <li>
                • <strong>Describe outputs:</strong> What happens at the end
                (emails, documents, etc.)
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-purple-900 mb-3">
              📋 Example Prompts:
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-purple-100">
                <div className="text-xs font-semibold text-purple-700 mb-1">
                  Simple Flow (3-5 nodes):
                </div>
                <div className="text-xs text-gray-700">
                  "Create a contact form that collects name, email, message, and
                  shows a thank you confirmation."
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-purple-100">
                <div className="text-xs font-semibold text-purple-700 mb-1">
                  Moderate Flow (6-10 nodes):
                </div>
                <div className="text-xs text-gray-700">
                  "Build a customer onboarding flow: collect personal info,
                  validate email and phone separately, then merge results and
                  send welcome package."
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-purple-100">
                <div className="text-xs font-semibold text-purple-700 mb-1">
                  Complex Flow (10-20 nodes):
                </div>
                <div className="text-xs text-gray-700">
                  "Create a device insurance application: gather device details
                  (brand, model, IMEI), collect purchase proof (date, price,
                  receipt), perform parallel validation of documents and
                  eligibility, assess risk tier, calculate pricing, generate
                  approval email, and create policy document."
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Flow
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
