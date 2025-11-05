"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Type,
  Download,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Move,
  Monitor,
  Smartphone,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Layout,
  Presentation,
  FileText,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TextElement {
  id: number;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  color: string;
  textAlign: "left" | "center" | "right";
  fontFamily: string;
}

interface ImageElement {
  id: number;
  data: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

interface Pattern {
  id: string;
  name: string;
  type: "dots" | "stripes" | "grid" | "waves" | "hexagon" | "triangles";
}

interface GradientBackground {
  type: "linear" | "radial";
  colors: string[];
  direction: number; // for linear gradients (0-360 degrees)
}

interface TextElement {
  id: number;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  color: string;
  textAlign: "left" | "center" | "right";
  fontFamily: string;
  zIndex: number; // ADD THIS
}

interface ImageElement {
  id: number;
  data: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  zIndex: number; // ADD THIS
}

type CanvasSize = "desktop" | "mobile";

const presetSizes = {
  "youtube-thumbnail": {
    width: 1280,
    height: 720,
    label: "YouTube Thumbnail",
    category: "Video",
  },
  "instagram-post": {
    width: 1080,
    height: 1080,
    label: "Instagram Post",
    category: "Social Media",
  },
  "instagram-story": {
    width: 1080,
    height: 1920,
    label: "Instagram Story",
    category: "Social Media",
  },
  "facebook-post": {
    width: 1200,
    height: 630,
    label: "Facebook Post",
    category: "Social Media",
  },
  "twitter-post": {
    width: 1200,
    height: 675,
    label: "Twitter/X Post",
    category: "Social Media",
  },
  "linkedin-post": {
    width: 1200,
    height: 627,
    label: "LinkedIn Post",
    category: "Social Media",
  },
  "blog-header": {
    width: 1200,
    height: 600,
    label: "Blog Header",
    category: "Blog",
  },
  "blog-featured": {
    width: 800,
    height: 400,
    label: "Blog Featured Image",
    category: "Blog",
  },
  "pinterest-pin": {
    width: 1000,
    height: 1500,
    label: "Pinterest Pin",
    category: "Social Media",
  },
  "facebook-cover": {
    width: 1640,
    height: 859,
    label: "Facebook Cover",
    category: "Social Media",
  },
  "twitter-header": {
    width: 1500,
    height: 500,
    label: "Twitter/X Header",
    category: "Social Media",
  },
  "linkedin-banner": {
    width: 1584,
    height: 396,
    label: "LinkedIn Banner",
    category: "Social Media",
  },
  "presentation-slide": {
    width: 1920,
    height: 1080,
    label: "Presentation Slide",
    category: "Presentation",
  },
  "desktop-wallpaper": {
    width: 1920,
    height: 1080,
    label: "Desktop Wallpaper",
    category: "Desktop",
  },
  "mobile-wallpaper": {
    width: 1080,
    height: 1920,
    label: "Mobile Wallpaper",
    category: "Mobile",
  },
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

type PresetKey = keyof typeof presetSizes;

const ImageEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageElement[]>([]);
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState<CanvasSize>("desktop");
  const [activeTab, setActiveTab] = useState<
    "text" | "background" | "export" | "layers"
  >("background");
  const [filename, setFilename] = useState("TextCanvas_20250926_1316");
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState("#7c3aed"); // Default purple

  const [backgroundType, setBackgroundType] = useState<
    "solid" | "gradient" | "pattern" | "image"
  >("solid");

  // const [backgroundType, setBackgroundType] = useState;
  // "solid" | "gradient" | "pattern" | ("image" > "solid");

  const [gradientBackground, setGradientBackground] =
    useState<GradientBackground>({
      type: "linear",
      colors: ["#7c3aed", "#3b82f6"],
      direction: 45,
    });
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [currentPreset, setCurrentPreset] = useState<PresetKey | null>(null);
  const [customCanvasSize, setCustomCanvasSize] = useState({
    width: 1920,
    height: 1080,
  });

  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);

  const canvasSizes = {
    desktop: { width: 1920, height: 1080, label: "Desktop", icon: Monitor },
    mobile: { width: 1080, height: 1920, label: "Mobile", icon: Smartphone },
  };

  const patternLibrary: Pattern[] = [
    { id: "dots-1", name: "Small Dots", type: "dots" },
    { id: "dots-2", name: "Large Dots", type: "dots" },
    { id: "stripes-1", name: "Vertical Stripes", type: "stripes" },
    { id: "stripes-2", name: "Diagonal Stripes", type: "stripes" },
    { id: "grid-1", name: "Square Grid", type: "grid" },
    { id: "waves-1", name: "Smooth Waves", type: "waves" },
    { id: "hexagon-1", name: "Hexagon Pattern", type: "hexagon" },
    { id: "triangles-1", name: "Triangle Pattern", type: "triangles" },
  ];
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    const sampleId = searchParams.get("sample");

    if (ref && presetSizes[ref as PresetKey]) {
      const preset = ref as PresetKey;
      setCurrentPreset(preset);
      setCustomCanvasSize(presetSizes[preset]);

      // Update filename based on preset
      const presetInfo = presetSizes[preset];
      const timestamp = new Date()
        .toISOString()
        .slice(0, 16)
        .replace(/[-:]/g, "")
        .replace("T", "_");
      setFilename(
        `${presetInfo.label.replace(/[^a-zA-Z0-9]/g, "_")}_${timestamp}`
      );
    }

    if (sampleId) {
      loadSample(sampleId);
    }
  }, [searchParams]);

  // const currentCanvasSize = canvasSizes[canvasSize];
  const currentCanvasSize = currentPreset
    ? presetSizes[currentPreset]
    : canvasSizes[canvasSize];

  // Add new text
  const addText = (): void => {
    const newText: TextElement = {
      id: Date.now(),
      content: "Your text here",
      x: currentCanvasSize.width / 2 - 50,
      y: currentCanvasSize.height / 2,
      fontSize: 48,
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#ffffff",
      textAlign: "center",
      fontFamily: "Arial",
      zIndex:
        Math.max(
          0,
          ...texts.map((t) => t.zIndex || 0),
          ...images.map((i) => i.zIndex || 0)
        ) + 1,
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
    setSelectedImageId(null);
    setActiveTab("text");
  };

  // Update text properties
  const updateText = (id: number, updates: Partial<TextElement>): void => {
    setTexts(
      texts.map((text) => (text.id === id ? { ...text, ...updates } : text))
    );
  };

  // Update image properties
  const updateImage = (id: number, updates: Partial<ImageElement>): void => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  // Delete text
  const deleteText = (id: number): void => {
    setTexts(texts.filter((text) => text.id !== id));
    setSelectedTextId(null);
  };

  // Delete image
  const deleteImage = (id: number): void => {
    setImages(images.filter((img) => img.id !== id));
    setSelectedImageId(null);
  };

  // Handle file upload
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxSize =
            Math.min(currentCanvasSize.width, currentCanvasSize.height) * 0.5;
          let { width, height } = img;

          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width *= ratio;
            height *= ratio;
          }

          const newImage: ImageElement = {
            id: Date.now(),
            data: img,
            x: (currentCanvasSize.width - width) / 2,
            y: (currentCanvasSize.height - height) / 2,
            width,
            height,
            originalWidth: width,
            originalHeight: height,
            zIndex:
              Math.max(
                0,
                ...texts.map((t) => t.zIndex || 0),
                ...images.map((i) => i.zIndex || 0)
              ) + 1,
          };

          setImages([...images, newImage]);
          setSelectedImageId(newImage.id);
          setSelectedTextId(null);
          setActiveTab("background");
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Get resize handles for selected image
  const getResizeHandles = (img: ImageElement) => {
    return [
      { name: "nw", x: img.x - 5, y: img.y - 5 },
      { name: "ne", x: img.x + img.width - 5, y: img.y - 5 },
      { name: "sw", x: img.x - 5, y: img.y + img.height - 5 },
      { name: "se", x: img.x + img.width - 5, y: img.y + img.height - 5 },
    ];
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
  };

  const createPattern = (
    ctx: CanvasRenderingContext2D,
    pattern: Pattern,
    width: number,
    height: number
  ): CanvasPattern | null => {
    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");
    if (!patternCtx) return null;

    let patternSize = 50;
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;

    patternCtx.fillStyle = backgroundColor;
    patternCtx.fillRect(0, 0, patternSize, patternSize);

    patternCtx.strokeStyle = "#ffffff";
    patternCtx.fillStyle = "#ffffff";
    patternCtx.lineWidth = 2;

    switch (pattern.type) {
      case "dots":
        const dotSize = pattern.id.includes("large") ? 8 : 4;
        patternCtx.beginPath();
        patternCtx.arc(
          patternSize / 2,
          patternSize / 2,
          dotSize,
          0,
          Math.PI * 2
        );
        patternCtx.fill();
        break;

      case "stripes":
        if (pattern.id.includes("diagonal")) {
          patternCtx.beginPath();
          patternCtx.moveTo(0, 0);
          patternCtx.lineTo(patternSize, patternSize);
          patternCtx.stroke();
        } else {
          patternCtx.fillRect(patternSize / 2 - 2, 0, 4, patternSize);
        }
        break;

      case "grid":
        patternCtx.strokeRect(0, 0, patternSize, patternSize);
        break;

      case "waves":
        patternCtx.beginPath();
        for (let x = 0; x < patternSize; x++) {
          const y = patternSize / 2 + Math.sin(x * 0.2) * 10;
          if (x === 0) patternCtx.moveTo(x, y);
          else patternCtx.lineTo(x, y);
        }
        patternCtx.stroke();
        break;

      case "hexagon":
        const centerX = patternSize / 2;
        const centerY = patternSize / 2;
        const radius = 15;
        patternCtx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          if (i === 0) patternCtx.moveTo(x, y);
          else patternCtx.lineTo(x, y);
        }
        patternCtx.closePath();
        patternCtx.stroke();
        break;

      case "triangles":
        patternCtx.beginPath();
        patternCtx.moveTo(patternSize / 2, 10);
        patternCtx.lineTo(10, patternSize - 10);
        patternCtx.lineTo(patternSize - 10, patternSize - 10);
        patternCtx.closePath();
        patternCtx.stroke();
        break;
    }

    return ctx.createPattern(patternCanvas, "repeat");
  };

  // Draw on canvas
  const drawCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = currentCanvasSize.width;
    canvas.height = currentCanvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background

    // Draw background
    if (backgroundType === "image" && backgroundImage) {
      // Calculate scaling to cover the entire canvas while maintaining aspect ratio
      const scale = Math.max(
        canvas.width / backgroundImage.width,
        canvas.height / backgroundImage.height
      );
      const x = (canvas.width - backgroundImage.width * scale) / 2;
      const y = (canvas.height - backgroundImage.height * scale) / 2;

      ctx.drawImage(
        backgroundImage,
        x,
        y,
        backgroundImage.width * scale,
        backgroundImage.height * scale
      );
    } else if (backgroundType === "gradient") {
      let gradient;
      if (gradientBackground.type === "linear") {
        const angle = (gradientBackground.direction - 90) * (Math.PI / 180);
        const x1 = canvas.width / 2 - (Math.cos(angle) * canvas.width) / 2;
        const y1 = canvas.height / 2 - (Math.sin(angle) * canvas.height) / 2;
        const x2 = canvas.width / 2 + (Math.cos(angle) * canvas.width) / 2;
        const y2 = canvas.height / 2 + (Math.sin(angle) * canvas.height) / 2;
        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      } else {
        gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 2
        );
      }

      gradientBackground.colors.forEach((color, index) => {
        gradient.addColorStop(
          index / (gradientBackground.colors.length - 1),
          color
        );
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (backgroundType === "pattern" && selectedPattern) {
      const pattern = createPattern(
        ctx,
        selectedPattern,
        canvas.width,
        canvas.height
      );
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Create combined array of all elements with their types and sort by zIndex
    const allElements = [
      ...images.map((img) => ({ ...img, type: "image" as const })),
      ...texts.map((text) => ({ ...text, type: "text" as const })),
    ].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    // Draw all elements in z-index order
    allElements.forEach((element) => {
      if (element.type === "image") {
        const img = element as ImageElement & { type: "image" };

        // Draw the image
        ctx.drawImage(img.data, img.x, img.y, img.width, img.height);

        // Draw selection border and resize handles for selected image
        if (img.id === selectedImageId) {
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.strokeRect(img.x, img.y, img.width, img.height);

          // Draw resize handles
          const handles = getResizeHandles(img);
          handles.forEach((handle) => {
            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(handle.x, handle.y, 10, 10);
          });
        }
      } else {
        const text = element as TextElement & { type: "text" };

        // Set text properties
        ctx.font = `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.textAlign = text.textAlign as CanvasTextAlign;

        // Draw text lines
        const lines = text.content.split("\n");
        lines.forEach((line, index) => {
          ctx.fillText(line, text.x, text.y + index * text.fontSize * 1.2);
        });

        // Draw selection border for selected text
        if (text.id === selectedTextId) {
          const maxLineWidth = Math.max(
            ...lines.map((line) => ctx.measureText(line).width)
          );
          const textHeight = text.fontSize * lines.length * 1.2;

          let borderX = text.x;
          if (text.textAlign === "center") {
            borderX = text.x - maxLineWidth / 2;
          } else if (text.textAlign === "right") {
            borderX = text.x - maxLineWidth;
          }

          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          drawRoundedRect(
            ctx,
            borderX - 5,
            text.y - text.fontSize - 5,
            maxLineWidth + 10,
            textHeight + 10,
            8
          );

          // Draw resize handles for text
          const textBounds = {
            x: borderX - 5,
            y: text.y - text.fontSize - 5,
            width: maxLineWidth + 10,
            height: textHeight + 10,
          };

          const handles = [
            { name: "nw", x: textBounds.x - 5, y: textBounds.y - 5 },
            {
              name: "ne",
              x: textBounds.x + textBounds.width - 5,
              y: textBounds.y - 5,
            },
            {
              name: "sw",
              x: textBounds.x - 5,
              y: textBounds.y + textBounds.height - 5,
            },
            {
              name: "se",
              x: textBounds.x + textBounds.width - 5,
              y: textBounds.y + textBounds.height - 5,
            },
          ];

          handles.forEach((handle) => {
            ctx.fillStyle = "white";
            ctx.fillRect(handle.x, handle.y, 10, 10);
          });
        }
      }
    });
  }, [
    images,
    texts,
    selectedTextId,
    selectedImageId,
    currentCanvasSize,
    backgroundColor,
    backgroundType,
    gradientBackground,
    selectedPattern,
  ]);

  // Handle canvas mouse events
  const handleCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement>
  ): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Check if clicked on any image
    let clickedImageId: number | null = null;
    let clickedTextId: number | null = null;

    // Check images (reverse order to get top-most)
    for (let i = images.length - 1; i >= 0; i--) {
      const img = images[i];
      if (
        x >= img.x &&
        x <= img.x + img.width &&
        y >= img.y &&
        y <= img.y + img.height
      ) {
        clickedImageId = img.id;
        break;
      }
    }

    // Check texts if no image was clicked
    if (!clickedImageId) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        for (let i = texts.length - 1; i >= 0; i--) {
          const text = texts[i];
          ctx.font = `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
          const textWidth = ctx.measureText(text.content).width;
          const textHeight = text.fontSize;

          if (
            x >= text.x - 5 &&
            x <= text.x + textWidth + 5 &&
            y >= text.y - textHeight &&
            y <= text.y + 5
          ) {
            clickedTextId = text.id;
            break;
          }
        }
      }
    }

    setSelectedImageId(clickedImageId);
    setSelectedTextId(clickedTextId);

    if (clickedImageId) {
      setActiveTab("background");
    } else if (clickedTextId) {
      setActiveTab("text");
    }
  };

  // Add these functions:
  const moveToTop = (elementId: number, type: "text" | "image") => {
    const maxZ = Math.max(
      ...texts.map((t) => t.zIndex || 0),
      ...images.map((i) => i.zIndex || 0)
    );
    if (type === "text") {
      updateText(elementId, { zIndex: maxZ + 1 });
    } else {
      updateImage(elementId, { zIndex: maxZ + 1 });
    }
  };

  const moveToBottom = (elementId: number, type: "text" | "image") => {
    const minZ = Math.min(
      ...texts.map((t) => t.zIndex || 0),
      ...images.map((i) => i.zIndex || 0)
    );
    if (type === "text") {
      updateText(elementId, { zIndex: minZ - 1 });
    } else {
      updateImage(elementId, { zIndex: minZ - 1 });
    }
  };

  const moveUp = (elementId: number, type: "text" | "image") => {
    const currentElement =
      type === "text"
        ? texts.find((t) => t.id === elementId)
        : images.find((i) => i.id === elementId);
    if (currentElement) {
      const currentZ = currentElement.zIndex || 0;
      if (type === "text") {
        updateText(elementId, { zIndex: currentZ + 1 });
      } else {
        updateImage(elementId, { zIndex: currentZ + 1 });
      }
    }
  };

  const moveDown = (elementId: number, type: "text" | "image") => {
    const currentElement =
      type === "text"
        ? texts.find((t) => t.id === elementId)
        : images.find((i) => i.id === elementId);
    if (currentElement) {
      const currentZ = currentElement.zIndex || 0;
      if (type === "text") {
        updateText(elementId, { zIndex: currentZ - 1 });
      } else {
        updateImage(elementId, { zIndex: currentZ - 1 });
      }
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement>
  ): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for text resize handles first
    if (selectedTextId) {
      const selectedText = texts.find((text) => text.id === selectedTextId);
      if (selectedText) {
        const handles = getTextResizeHandles(selectedText, ctx);
        for (const handle of handles) {
          if (
            x >= handle.x &&
            x <= handle.x + 10 &&
            y >= handle.y &&
            y <= handle.y + 10
          ) {
            setIsResizing(true);
            setResizeHandle(handle.name);
            return;
          }
        }
      }
    }

    // Check for image resize handles
    if (selectedImageId) {
      const selectedImage = images.find((img) => img.id === selectedImageId);
      if (selectedImage) {
        const handles = getResizeHandles(selectedImage);
        for (const handle of handles) {
          if (
            x >= handle.x &&
            x <= handle.x + 10 &&
            y >= handle.y &&
            y <= handle.y + 10
          ) {
            setIsResizing(true);
            setResizeHandle(handle.name);
            return;
          }
        }
      }
    }

    // Regular dragging
    if (selectedTextId) {
      const selectedText = texts.find((text) => text.id === selectedTextId);
      if (selectedText) {
        setIsDragging(true);
        setDragOffset({
          x: x - selectedText.x,
          y: y - selectedText.y,
        });
      }
    } else if (selectedImageId) {
      const selectedImage = images.find((img) => img.id === selectedImageId);
      if (selectedImage) {
        setIsDragging(true);
        setDragOffset({
          x: x - selectedImage.x,
          y: y - selectedImage.y,
        });
      }
    }
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isResizing && selectedTextId) {
      const selectedText = texts.find((text) => text.id === selectedTextId);
      if (selectedText) {
        const handles = getTextResizeHandles(selectedText, ctx);
        const currentHandle = handles.find((h) => h.name === resizeHandle);
        if (!currentHandle) return;

        const bounds = currentHandle.bounds;
        let newFontSize = selectedText.fontSize;

        if (resizeHandle.includes("e")) {
          const newWidth = Math.max(50, x - bounds.x);
          const widthRatio = newWidth / bounds.width;
          newFontSize = Math.max(
            12,
            Math.round(selectedText.fontSize * widthRatio)
          );
        } else if (resizeHandle.includes("w")) {
          const newWidth = Math.max(50, bounds.x + bounds.width - x);
          const widthRatio = newWidth / bounds.width;
          newFontSize = Math.max(
            12,
            Math.round(selectedText.fontSize * widthRatio)
          );
        }

        updateText(selectedTextId, { fontSize: newFontSize });
      }
    } else if (isResizing && selectedImageId) {
      const selectedImage = images.find((img) => img.id === selectedImageId);
      if (selectedImage) {
        let newWidth = selectedImage.width;
        let newHeight = selectedImage.height;
        let newX = selectedImage.x;
        let newY = selectedImage.y;

        const aspectRatio =
          selectedImage.originalWidth / selectedImage.originalHeight;

        if (resizeHandle.includes("e")) {
          newWidth = Math.max(50, x - selectedImage.x);
          newHeight = newWidth / aspectRatio;
        } else if (resizeHandle.includes("w")) {
          newWidth = Math.max(50, selectedImage.x + selectedImage.width - x);
          newHeight = newWidth / aspectRatio;
          newX = selectedImage.x + selectedImage.width - newWidth;
          newY = selectedImage.y + selectedImage.height - newHeight;
        }

        updateImage(selectedImageId, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      }
    } else if (isDragging) {
      if (selectedTextId) {
        updateText(selectedTextId, {
          x: x - dragOffset.x,
          y: y - dragOffset.y,
        });
      } else if (selectedImageId) {
        updateImage(selectedImageId, {
          x: x - dragOffset.x,
          y: y - dragOffset.y,
        });
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = (): void => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
  };

  // Download canvas as image
  const downloadImage = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Get resize handles for selected text
  const getTextResizeHandles = (
    text: TextElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.font = `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
    const lines = text.content.split("\n");
    const maxLineWidth = Math.max(
      ...lines.map((line) => ctx.measureText(line).width)
    );
    const textHeight = text.fontSize * lines.length * 1.2;

    let borderX = text.x;
    if (text.textAlign === "center") {
      borderX = text.x - maxLineWidth / 2;
    } else if (text.textAlign === "right") {
      borderX = text.x - maxLineWidth;
    }

    const textBounds = {
      x: borderX - 5,
      y: text.y - text.fontSize - 5,
      width: maxLineWidth + 10,
      height: textHeight + 10,
    };

    return [
      {
        name: "nw",
        x: textBounds.x - 5,
        y: textBounds.y - 5,
        bounds: textBounds,
      },
      {
        name: "ne",
        x: textBounds.x + textBounds.width - 5,
        y: textBounds.y - 5,
        bounds: textBounds,
      },
      {
        name: "sw",
        x: textBounds.x - 5,
        y: textBounds.y + textBounds.height - 5,
        bounds: textBounds,
      },
      {
        name: "se",
        x: textBounds.x + textBounds.width - 5,
        y: textBounds.y + textBounds.height - 5,
        bounds: textBounds,
      },
    ];
  };

  // Effect to redraw canvas
  useEffect(() => {
    drawCanvas();
  }, [
    drawCanvas,
    backgroundColor,
    backgroundType,
    gradientBackground,
    selectedPattern,
    currentPreset,
    customCanvasSize,
    backgroundImage,
  ]);

  const selectedText = texts.find((text) => text.id === selectedTextId);
  const selectedImage = images.find((img) => img.id === selectedImageId);

  const loadSample = async (sampleId: string) => {
    try {
      const response = await fetch(`/api/sample/${sampleId}`);
      const result = await response.json();

      if (!result.success) {
        alert("Failed to load sample");
        return;
      }

      const sample = result.data;

      // Set canvas size
      setCustomCanvasSize({
        width: sample.canvasWidth,
        height: sample.canvasHeight,
      });

      // Set preset if available
      if (sample.presetKey && presetSizes[sample.presetKey as PresetKey]) {
        setCurrentPreset(sample.presetKey as PresetKey);
      }

      // Set background
      setBackgroundType(sample.backgroundType);
      if (sample.backgroundColor) {
        setBackgroundColor(sample.backgroundColor);
      }
      if (sample.gradientConfig) {
        setGradientBackground(sample.gradientConfig);
      }
      if (sample.patternId) {
        const pattern = patternLibrary.find((p) => p.id === sample.patternId);
        if (pattern) setSelectedPattern(pattern);
      }

      // Load text elements
      const loadedTexts = sample.textElements.map((text: any) => ({
        id: Date.now() + Math.random(), // Generate new IDs for client
        content: text.content,
        x: text.x,
        y: text.y,
        fontSize: text.fontSize,
        fontWeight: text.fontWeight as "normal" | "bold",
        fontStyle: text.fontStyle as "normal" | "italic",
        color: text.color,
        textAlign: text.textAlign as "left" | "center" | "right",
        fontFamily: text.fontFamily,
        zIndex: text.zIndex,
      }));
      setTexts(loadedTexts);

      // Load image elements (need to convert base64 to Image objects)
      const imagePromises = sample.imageElements.map((imgElement: any) => {
        return new Promise<ImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              id: Date.now() + Math.random(),
              data: img,
              x: imgElement.x,
              y: imgElement.y,
              width: imgElement.width,
              height: imgElement.height,
              originalWidth: imgElement.originalWidth,
              originalHeight: imgElement.originalHeight,
              zIndex: imgElement.zIndex,
            });
          };
          img.src = imgElement.imageData;
        });
      });

      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);

      // Set filename
      setFilename(sample.name);
    } catch (error) {
      console.error("Error loading sample:", error);
      alert("Failed to load sample");
    }
  };

  const handleBackgroundImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(img);
          setBackgroundType("image"); // You'll need to add this type
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
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
      </nav>{" "}


      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Left Panel - Preview */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="bg-white rounded-2xl shadow-lg h-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
            </div>

            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-4 flex justify-center items-center">
                <canvas
                  ref={canvasRef}
                  width={currentCanvasSize.width}
                  height={currentCanvasSize.height}
                  onClick={handleCanvasClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="border border-gray-300 rounded-lg cursor-pointer bg-white shadow-lg"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    width: "auto",
                    height: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Right Panel - Customize */}
        <div className="w-96 bg-white shadow-lg overflow-y-auto">
          {" "}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Customize</h2>
          </div>
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { key: "text", label: "Text", icon: Type },
              { key: "background", label: "Background", icon: ImageIcon },
              { key: "export", label: "Export", icon: Download },
              { key: "layers", label: "Layers", icon: Layers }, // Import Layers from lucide-react
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? "border-sky-500 text-sky-600 bg-sky-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                {label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "export" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Canvas & Download
                </h3>

                {/* Canvas Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Canvas Size
                  </label>

                  {/* Show current preset if from URL */}
                  {currentPreset && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-blue-900">
                            {presetSizes[currentPreset].label}
                          </div>
                          <div className="text-sm text-blue-700">
                            {presetSizes[currentPreset].width} ×{" "}
                            {presetSizes[currentPreset].height} px
                          </div>
                          <div className="text-xs text-blue-600">
                            Optimized for {presetSizes[currentPreset].category}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentPreset(null);
                            setCustomCanvasSize({ width: 1920, height: 1080 });
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  {!currentPreset && (
                    <>
                      {/* Preset Categories */}
                      <div className="space-y-4 mb-4">
                        {Object.entries(
                          Object.entries(presetSizes).reduce(
                            (acc, [key, value]) => {
                              if (!acc[value.category])
                                acc[value.category] = [];
                              acc[value.category].push({
                                key: key as PresetKey,
                                ...value,
                              });
                              return acc;
                            },
                            {} as Record<
                              string,
                              Array<
                                {
                                  key: PresetKey;
                                } & (typeof presetSizes)[PresetKey]
                              >
                            >
                          )
                        ).map(([category, presets]) => (
                          <div key={category}>
                            <div className="text-sm font-medium text-gray-600 mb-2">
                              {category}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {presets.map(({ key, label, width, height }) => (
                                <button
                                  key={key}
                                  onClick={() => {
                                    setCurrentPreset(key);
                                    setCustomCanvasSize({ width, height });
                                    // Update filename
                                    const timestamp = new Date()
                                      .toISOString()
                                      .slice(0, 16)
                                      .replace(/[-:]/g, "")
                                      .replace("T", "_");
                                    setFilename(
                                      `${label.replace(
                                        /[^a-zA-Z0-9]/g,
                                        "_"
                                      )}_${timestamp}`
                                    );
                                  }}
                                  className="p-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="text-sm font-medium text-gray-900">
                                    {label}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {width}×{height}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Original Desktop/Mobile Options */}
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium text-gray-600 mb-2">
                          Quick Options
                        </div>
                        <div className="flex gap-2">
                          {Object.entries(canvasSizes).map(
                            ([key, { label, icon: Icon, width, height }]) => (
                              <button
                                key={key}
                                onClick={() => {
                                  setCurrentPreset(null);
                                  setCanvasSize(key as CanvasSize);
                                  setCustomCanvasSize({ width, height });
                                }}
                                className={`flex-1 p-3 rounded-lg border transition-all ${
                                  !currentPreset && canvasSize === key
                                    ? "border-sky-500 bg-sky-50 text-sky-700"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <Icon className="w-5 h-5 mx-auto mb-1" />
                                <div className="text-sm font-medium">
                                  {label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {width}×{height}
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Optimization Tips */}
                  {currentPreset && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        💡 Tips for {presetSizes[currentPreset].label}
                      </h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        {currentPreset.includes("youtube") && (
                          <>
                            <div>• Use bold, readable fonts (minimum 24px)</div>
                            <div>• Keep important text in the center area</div>
                            <div>• High contrast colors work best</div>
                            <div>• Consider mobile viewing experience</div>
                          </>
                        )}
                        {currentPreset.includes("instagram") && (
                          <>
                            <div>• Use vibrant colors to stand out in feed</div>
                            <div>• Keep text minimal and impactful</div>
                            <div>• Consider your brand colors</div>
                            <div>• Test readability on mobile devices</div>
                          </>
                        )}
                        {currentPreset.includes("blog") && (
                          <>
                            <div>• Use clear, descriptive titles</div>
                            <div>• Optimize for SEO with relevant imagery</div>
                            <div>
                              • Ensure fast loading with proper compression
                            </div>
                            <div>• Keep it relevant to your content</div>
                          </>
                        )}
                        {(currentPreset.includes("twitter") ||
                          currentPreset.includes("linkedin")) && (
                          <>
                            <div>• Professional look with clean design</div>
                            <div>• Use platform-appropriate colors</div>
                            <div>• Keep text readable at small sizes</div>
                            <div>• Consider your personal/company brand</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filename */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filename
                  </label>
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                {/* Image Dimensions Display */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image Dimensions
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-800">
                        {currentCanvasSize.width} × {currentCanvasSize.height}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">pixels</span>
                    </div>
                  </div>
                </div>

                {/* File Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    File Format
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                    <option>PNG (High Quality)</option>
                    <option>JPG (Smaller Size)</option>
                  </select>
                </div>
                {/* Download Button */}
                <button
                  onClick={downloadImage}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
              </div>
            )}

            {activeTab === "background" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center gap-5">
                  <h3 className="text-lg font-bold text-gray-800">
                    Background
                  </h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />

                  <div className="flex gap-2 flex-col">
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) =>
                          handleBackgroundImageUpload(e as any);
                        input.click();
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Background Image
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Image
                    </button>
                  </div>
                </div>

                {/* Background Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Background Type
                  </label>
                  {/* <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "solid", label: "Solid" },
                    { value: "gradient", label: "Gradient" },
                    { value: "pattern", label: "Pattern" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setBackgroundType(value as any)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        backgroundType === value
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div> */}

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: "solid", label: "Solid" },
                      { value: "gradient", label: "Gradient" },
                      { value: "pattern", label: "Pattern" },
                      { value: "image", label: "Image" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setBackgroundType(value as any)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          backgroundType === value
                            ? "border-sky-500 bg-sky-50 text-sky-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {backgroundType === "image" && backgroundImage && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Background Image Active
                        </span>
                        <button
                          onClick={() => {
                            setBackgroundImage(null);
                            setBackgroundType("solid");
                          }}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <img
                        src={backgroundImage.src}
                        alt="Background"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  </div>
                )}

                {/* Solid Color */}
                {backgroundType === "solid" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                {/* Gradient Background */}
                {backgroundType === "gradient" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gradient Type
                      </label>
                      <div className="flex gap-2">
                        {["linear", "radial"].map((type) => (
                          <button
                            key={type}
                            onClick={() =>
                              setGradientBackground((prev) => ({
                                ...prev,
                                type: type as any,
                              }))
                            }
                            className={`px-4 py-2 rounded-lg border text-sm capitalize ${
                              gradientBackground.type === type
                                ? "border-sky-500 bg-sky-50 text-sky-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Colors
                      </label>
                      <div className="flex gap-2">
                        {gradientBackground.colors.map((color, index) => (
                          <input
                            key={index}
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...gradientBackground.colors];
                              newColors[index] = e.target.value;
                              setGradientBackground((prev) => ({
                                ...prev,
                                colors: newColors,
                              }));
                            }}
                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                          />
                        ))}
                        <button
                          onClick={() => {
                            if (gradientBackground.colors.length < 5) {
                              setGradientBackground((prev) => ({
                                ...prev,
                                colors: [...prev.colors, "#ffffff"],
                              }));
                            }
                          }}
                          className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {gradientBackground.type === "linear" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Direction
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={gradientBackground.direction}
                          onChange={(e) =>
                            setGradientBackground((prev) => ({
                              ...prev,
                              direction: parseInt(e.target.value),
                            }))
                          }
                          className="w-full"
                        />
                        <div className="text-center text-sm text-gray-600 mt-1">
                          {gradientBackground.direction}°
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pattern Selection */}
                {backgroundType === "pattern" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pattern Library
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {patternLibrary.map((pattern) => (
                        <button
                          key={pattern.id}
                          onClick={() => setSelectedPattern(pattern)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            selectedPattern?.id === pattern.id
                              ? "border-sky-500 bg-sky-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {pattern.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {pattern.type}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedImage && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">
                      Selected Image
                    </h4>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Size
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500">Width</label>
                          <input
                            type="number"
                            value={Math.round(selectedImage.width)}
                            onChange={(e) => {
                              const newWidth = parseInt(e.target.value);
                              const aspectRatio =
                                selectedImage.originalWidth /
                                selectedImage.originalHeight;
                              updateImage(selectedImage.id, {
                                width: newWidth,
                                height: newWidth / aspectRatio,
                              });
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            Height
                          </label>
                          <input
                            type="number"
                            value={Math.round(selectedImage.height)}
                            onChange={(e) => {
                              const newHeight = parseInt(e.target.value);
                              const aspectRatio =
                                selectedImage.originalWidth /
                                selectedImage.originalHeight;
                              updateImage(selectedImage.id, {
                                height: newHeight,
                                width: newHeight * aspectRatio,
                              });
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteImage(selectedImage.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Image
                    </button>
                  </div>
                )}

                {images.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No images added yet</p>
                    <p className="text-xs mt-2">
                      Click "Add Image" to get started
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "text" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Text</h3>
                  <button
                    onClick={addText}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Text
                  </button>
                </div>

                {selectedText ? (
                  <div className="space-y-4">
                    {/* Text Content */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Text Content
                      </label>
                      <textarea
                        value={selectedText.content}
                        onChange={(e) =>
                          updateText(selectedText.id, {
                            content: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        rows={3}
                      />
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Font Size
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="1000"
                        value={selectedText.fontSize}
                        onChange={(e) =>
                          updateText(selectedText.id, {
                            fontSize: parseInt(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600 mt-1">
                        {selectedText.fontSize}px
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Font Family
                      </label>
                      <select
                        value={selectedText.fontFamily}
                        onChange={(e) =>
                          updateText(selectedText.id, {
                            fontFamily: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                      </select>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={selectedText.color}
                        onChange={(e) =>
                          updateText(selectedText.id, { color: e.target.value })
                        }
                        className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Font Weight & Style */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Style
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateText(selectedText.id, {
                              fontWeight:
                                selectedText.fontWeight === "bold"
                                  ? "normal"
                                  : "bold",
                            })
                          }
                          className={`p-2 rounded-lg border ${
                            selectedText.fontWeight === "bold"
                              ? "bg-sky-500 text-white border-sky-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            updateText(selectedText.id, {
                              fontStyle:
                                selectedText.fontStyle === "italic"
                                  ? "normal"
                                  : "italic",
                            })
                          }
                          className={`p-2 rounded-lg border ${
                            selectedText.fontStyle === "italic"
                              ? "bg-sky-500 text-white border-sky-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Text Alignment */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Text Alignment
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "left" as const, icon: AlignLeft },
                          { value: "center" as const, icon: AlignCenter },
                          { value: "right" as const, icon: AlignRight },
                        ].map(({ value, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() =>
                              updateText(selectedText.id, { textAlign: value })
                            }
                            className={`p-2 rounded-lg border ${
                              selectedText.textAlign === value
                                ? "bg-sky-500 text-white border-sky-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            } transition-colors`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delete Text */}
                    <button
                      onClick={() => deleteText(selectedText.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Text
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Type className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No text selected</p>
                    <p className="text-xs mt-2">
                      Click "Add Text" or select existing text to edit
                    </p>
                  </div>
                )}

                {/* Text List */}
                {texts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Text Elements
                    </h4>
                    <div className="space-y-2">
                      {texts.map((text) => (
                        <div
                          key={text.id}
                          onClick={() => {
                            setSelectedTextId(text.id);
                            setSelectedImageId(null);
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            text.id === selectedTextId
                              ? "border-sky-500 bg-sky-50"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate">
                              {text.content.length > 20
                                ? text.content.substring(0, 20) + "..."
                                : text.content}
                            </span>
                            <Move className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {text.fontSize}px • {text.fontFamily}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "layers" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Layers</h3>

                <div className="space-y-2">
                  {[
                    ...images.map((img) => ({
                      ...img,
                      type: "image" as const,
                    })),
                    ...texts.map((text) => ({
                      ...text,
                      type: "text" as const,
                    })),
                  ]
                    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                    .map((element) => (
                      <div
                        key={`${element.type}-${element.id}`}
                        className="p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {element.type === "text"
                                ? element.content.length > 20
                                  ? element.content.substring(0, 20) + "..."
                                  : element.content
                                : "Image"}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {element.type} • Z-Index: {element.zIndex || 0}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                moveToTop(element.id, element.type)
                              }
                              className="p-1 hover:bg-gray-100 rounded text-xs"
                            >
                              Top
                            </button>
                            <button
                              onClick={() => moveUp(element.id, element.type)}
                              className="p-1 hover:bg-gray-100 rounded text-xs"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveDown(element.id, element.type)}
                              className="p-1 hover:bg-gray-100 rounded text-xs"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() =>
                                moveToBottom(element.id, element.type)
                              }
                              className="p-1 hover:bg-gray-100 rounded text-xs"
                            >
                              Bottom
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageEditor;
