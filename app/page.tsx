"use client";

import React, { useEffect, useState } from "react";
import {
  Palette,
  Image,
  Type,
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
import Link from "next/link";
import SamplePreview from "@/components/editor/canvas-preview";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const HomePage = () => {
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await fetch("/api/sample");
      const data = await response.json();
      if (data.success) {
        setSamples(data.data.slice(0, 6)); // Get only first 6 samples
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const tools = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Smart Backgrounds",
      description: "Gradients, patterns, and solid colors",
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Custom Images",
      description: "Upload and position your own images",
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "Beautiful Typography",
      description: "Professional fonts with text effects",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Export Options",
      description: "PNG, JPG, and animated GIF formats",
    },
  ];

  const categories = contentTypes
    .map((item) => item.category)
    .filter((value, index, self) => self.indexOf(value) === index);

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
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

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/60 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-sky-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Create professional graphics in minutes
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
              Design Perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Visual Content
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Create stunning graphics for social media, YouTube, blogs, and
            presentations. No design skills required—just choose your format and
            start creating.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => handleNavigation("/image-text-generator")}
              className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Start Creating Free
            </button>
            <button className="bg-white/70 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-white/30 hover:bg-white/90 transition-all">
              View Examples
            </button>
          </div>
        </div>
      </section>

      {/* Text Behind Image Demos Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-6 py-2 mb-6">
            <Image className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-700">
              Text Behind Image Effect
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Create Stunning Text Behind Image Effects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Make your text appear to go behind objects in your images with our
            advanced AI-powered tool. Perfect for social media posts, marketing
            materials, and creative designs.
          </p>
          <Link
            href="/text-behind-image"
            className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Try Text Behind Image
            <Sparkles className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Demo Images Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              src: "/lion.png",
              alt: "Text behind person demo",
              // title: "Portrait Effect",
              // description: "Text flowing behind a person",
            },
            {
              src: "/car.png",
              alt: "Text behind object demo",
              // title: "Object Masking",
              // description: "Creative text placement with objects",
            },
            {
              src: "/play.png",
              alt: "Text behind landscape demo",
              // title: "Landscape Design",
              // description: "Typography integrated with scenery",
            },
          ].map((demo, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 min-h-[200px] max-h-[400px] flex items-center justify-center">
                <img
                  src={demo.src}
                  alt={demo.alt}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {/* Fallback placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 hidden">
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium opacity-75">Demo Image</p>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Samples Gallery Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Recent Designs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get inspired by designs created with ImageCraft
          </p>
        </div>

        {loading ? (
          <div className="text-center">Loading samples...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samples.map((sample) => (
              <SamplePreview
                key={sample.id}
                sample={sample}
                onClick={() =>
                  handleNavigation(`/image-text-generator?sample=${sample.id}`)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Content Types Section */}
      <section id="templates" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Choose Your Content Type
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from professionally optimized templates for every platform
            and purpose
          </p>
        </div>

        {/* Categories */}
        {categories.map((category) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {contentTypes
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div
                      className={`bg-gradient-to-r ${item.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}
                    >
                      {item.icon}
                    </div>

                    <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                      {item.title}
                    </h4>

                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg px-3 py-1 inline-block">
                      {item.size}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sky-600 font-semibold text-sm group-hover:text-sky-700 transition-colors">
                        Create Now →
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Tools Section */}
      <section id="tools" className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powerful Design Tools
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to create professional-looking graphics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tools.map((tool, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-sky-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-sky-600 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {tool.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Create Amazing Graphics?
            </h2>
            <p className="text-xl mb-8 text-sky-100 max-w-2xl mx-auto">
              Join thousands of creators who use ImageCraft to bring their ideas
              to life
            </p>
            <button
              onClick={() => handleNavigation("/image-text-generator")}
              className="bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Creating Now
            </button>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-sky-500 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">ImageCraft</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Create stunning visuals for all your content needs with our
                powerful online editor.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Content Types</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/image-text-generator?ref=youtube-thumbnail"
                    className="hover:text-sky-400 transition-colors"
                  >
                    YouTube Thumbnails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/image-text-generator?ref=instagram-post"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Social Media Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/image-text-generator?ref=blog-header"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Blog Graphics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/image-text-generator?ref=presentation-slide"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Presentations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/text-behind-image"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Text Behind Image Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/flow-builder"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Flow Builder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Connect</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="https://www.instagram.com/codersarts"
                    target="_blank"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/c/CodersArts"
                    target="_blank"
                    className="hover:text-sky-400 transition-colors"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/codersarts"
                    target="_blank"
                    className="hover:text-sky-400 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mt-12 text-center text-gray-400">
            <p>
              &copy; 2025 ImageCraft. All rights reserved. Made with ❤️ for
              creators By <b>CodersArts</b>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
