"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SamplePreview from "@/components/editor/canvas-preview";
import { Loader2, Plus, Search } from "lucide-react";

interface SampleData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundType: string;
  backgroundColor?: string;
  gradientConfig?: {
    type: "linear" | "radial";
    colors: string[];
    direction: number;
  };
  patternId?: string;
  textElements: Array<{
    content: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    color: string;
    textAlign: string;
    fontFamily: string;
    zIndex: number;
  }>;
  imageElements: Array<{
    imageData: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  }>;
  createdAt: string;
}

const SamplesGalleryPage: React.FC = () => {
  const router = useRouter();
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchSamples();
  }, [selectedCategory]);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = "/api/sample";
      if (selectedCategory) {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSamples(data.data);
      } else {
        setError(data.error || "Failed to fetch samples");
      }
    } catch (err) {
      setError("An error occurred while fetching samples");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleId: string) => {
    // Navigate to editor with the sample data
    router.push(`/editor?sampleId=${sampleId}`);
  };

  const handleCreateNew = () => {
    router.push("/editor");
  };

  const handleDeleteSample = async (sampleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this sample?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sample?id=${sampleId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setSamples(samples.filter((s) => s.id !== sampleId));
      } else {
        alert("Failed to delete sample");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the sample");
    }
  };

  // Get unique categories
  const categories = Array.from(
    new Set(samples.map((s) => s.category).filter(Boolean))
  );

  // Filter samples by search query
  const filteredSamples = samples.filter((sample) => {
    const matchesSearch =
      sample.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading samples...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-lg font-semibold">{error}</div>
          <button
            onClick={fetchSamples}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    
      {/* Samples Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSamples.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              {searchQuery
                ? "No samples found matching your search"
                : "No samples yet"}
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Sample
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSamples.map((sample) => (
              <div key={sample.id} className="relative group">
                <SamplePreview
                  sample={sample}
                  onClick={() => handleSampleClick(sample.id)}
                />
                <button
                  onClick={(e) => handleDeleteSample(sample.id, e)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete sample"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SamplesGalleryPage;