"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SamplePreview from "@/components/editor/canvas-preview";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Layout,
  Smartphone,
  Monitor,
  Presentation,
  FileText,
  Sparkles,
} from "lucide-react";

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

const contentTypes = [
  {
    id: "youtube-thumbnail",
    title: "YouTube Thumbnails",
    description: "Eye-catching thumbnails that boost click-through rates",
    icon: <Youtube className="w-8 h-8" />,
    size: "1280 × 720px",
    category: "Video Content",
    color: "from-red-500 to-red-600",
    href: "/image-text-generator?ref=youtube-thumbnail",
  },
  {
    id: "instagram-post",
    title: "Instagram Posts",
    description: "Square posts perfect for Instagram feeds",
    icon: <Instagram className="w-8 h-8" />,
    size: "1080 × 1080px",
    category: "Social Media",
    color: "from-pink-500 to-purple-600",
    href: "/image-text-generator?ref=instagram-post",
  },
  {
    id: "instagram-story",
    title: "Instagram Stories",
    description: "Vertical stories and highlights covers",
    icon: <Smartphone className="w-8 h-8" />,
    size: "1080 × 1920px",
    category: "Social Media",
    color: "from-purple-500 to-pink-500",
    href: "/image-text-generator?ref=instagram-story",
  },
  {
    id: "facebook-post",
    title: "Facebook Posts",
    description: "Engaging posts for Facebook feeds",
    icon: <Facebook className="w-8 h-8" />,
    size: "1200 × 630px",
    category: "Social Media",
    color: "from-blue-600 to-blue-700",
    href: "/image-text-generator?ref=facebook-post",
  },
  {
    id: "twitter-post",
    title: "Twitter/X Posts",
    description: "Perfect images for tweets and threads",
    icon: <Twitter className="w-8 h-8" />,
    size: "1200 × 675px",
    category: "Social Media",
    color: "from-sky-500 to-blue-600",
    href: "/image-text-generator?ref=twitter-post",
  },
  {
    id: "linkedin-post",
    title: "LinkedIn Posts",
    description: "Professional content for LinkedIn",
    icon: <Linkedin className="w-8 h-8" />,
    size: "1200 × 627px",
    category: "Social Media",
    color: "from-blue-500 to-indigo-600",
    href: "/image-text-generator?ref=linkedin-post",
  },
  {
    id: "blog-header",
    title: "Blog Headers",
    description: "Featured images for blog posts",
    icon: <FileText className="w-8 h-8" />,
    size: "1200 × 600px",
    category: "Blog Content",
    color: "from-green-500 to-emerald-600",
    href: "/image-text-generator?ref=blog-header",
  },
  {
    id: "pinterest-pin",
    title: "Pinterest Pins",
    description: "Vertical pins that get saved",
    icon: <Layout className="w-8 h-8" />,
    size: "1000 × 1500px",
    category: "Social Media",
    color: "from-red-500 to-rose-600",
    href: "/image-text-generator?ref=pinterest-pin",
  },
  {
    id: "presentation-slide",
    title: "Presentation Slides",
    description: "Professional slides and graphics",
    icon: <Presentation className="w-8 h-8" />,
    size: "1920 × 1080px",
    category: "Business",
    color: "from-indigo-500 to-purple-600",
    href: "/image-text-generator?ref=presentation-slide",
  },
  {
    id: "facebook-cover",
    title: "Facebook Covers",
    description: "Profile and page cover photos",
    icon: <Monitor className="w-8 h-8" />,
    size: "1640 × 859px",
    category: "Social Media",
    color: "from-blue-600 to-cyan-600",
    href: "/image-text-generator?ref=facebook-cover",
  },
  {
    id: "twitter-header",
    title: "Twitter Headers",
    description: "Profile banner images",
    icon: <Layout className="w-8 h-8" />,
    size: "1500 × 500px",
    category: "Social Media",
    color: "from-sky-400 to-blue-500",
    href: "/image-text-generator?ref=twitter-header",
  },
  {
    id: "linkedin-banner",
    title: "LinkedIn Banners",
    description: "Professional profile banners",
    icon: <Monitor className="w-8 h-8" />,
    size: "1584 × 396px",
    category: "Social Media",
    color: "from-blue-500 to-cyan-600",
    href: "/image-text-generator?ref=linkedin-banner",
  },
];

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
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-sky-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ImageCraft
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#tools"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Tools
              </a>

              <Link
                href="/text-behind-image"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Text behind Image
              </Link>

              <Link
                href="/flow-builder"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Flow Builder
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <a className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    Content types
                  </a>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  {contentTypes.map((item) => (
                    <Link key={item.id} href={item.href} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                        {item.title}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="image-text-generator"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <button className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
