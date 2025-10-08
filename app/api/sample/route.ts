import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { Prisma } from "@prisma/client";

export interface SampleData {
  name: string;
  description?: string;
  category?: string;
  presetKey?: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundType: "solid" | "gradient" | "pattern";
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
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    color: string;
    textAlign: "left" | "center" | "right";
    fontFamily: string;
    zIndex: number;
  }>;
  imageElements: Array<{
    imageData: string;
    x: number;
    y: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
    zIndex: number;
  }>;
}

// GET - Fetch all samples or filter by category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const presetKey = searchParams.get("presetKey");

    const where: Prisma.SampleWhereInput = {};
    if (category) where.category = category;
    if (presetKey) where.presetKey = presetKey;

    const samples = await prisma.sample.findMany({
      where,
      include: {
        textElements: {
          orderBy: { zIndex: "asc" }
        },
        imageElements: {
          orderBy: { zIndex: "asc" }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      success: true,
      data: samples,
      count: samples.length
    });
  } catch (error) {
    console.error("Error fetching samples:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch samples",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// POST - Create a new sample
export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as SampleData;

    // Validation
    if (!data.name || !data.canvasWidth || !data.canvasHeight) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, canvasWidth, canvasHeight"
        },
        { status: 400 }
      );
    }

    const sample = await prisma.sample.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        presetKey: data.presetKey,
        canvasWidth: data.canvasWidth,
        canvasHeight: data.canvasHeight,
        backgroundType: data.backgroundType,
        backgroundColor: data.backgroundColor,
        gradientConfig: data.gradientConfig as Prisma.InputJsonValue,
        patternId: data.patternId,
        textElements: {
          create: data.textElements.map((text) => ({
            content: text.content,
            x: text.x,
            y: text.y,
            fontSize: text.fontSize,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            color: text.color,
            textAlign: text.textAlign,
            fontFamily: text.fontFamily,
            zIndex: text.zIndex
          }))
        },
        imageElements: {
          create: data.imageElements.map((img) => ({
            imageData: img.imageData,
            x: img.x,
            y: img.y,
            width: img.width,
            height: img.height,
            originalWidth: img.originalWidth,
            originalHeight: img.originalHeight,
            zIndex: img.zIndex
          }))
        }
      },
      include: {
        textElements: true,
        imageElements: true
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: sample,
        message: "Sample created successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sample:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create sample",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// PUT - Update an existing sample
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Sample ID is required"
        },
        { status: 400 }
      );
    }

    const data = (await req.json()) as Partial<SampleData>;

    // Check if sample exists
    const existingSample = await prisma.sample.findUnique({
      where: { id }
    });

    if (!existingSample) {
      return NextResponse.json(
        {
          success: false,
          error: "Sample not found"
        },
        { status: 404 }
      );
    }

    // Delete existing elements if new ones are provided
    if (data.textElements) {
      await prisma.textElement.deleteMany({
        where: { sampleId: id }
      });
    }

    if (data.imageElements) {
      await prisma.imageElement.deleteMany({
        where: { sampleId: id }
      });
    }

    // Update the sample
    const sample = await prisma.sample.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        presetKey: data.presetKey,
        canvasWidth: data.canvasWidth,
        canvasHeight: data.canvasHeight,
        backgroundType: data.backgroundType,
        backgroundColor: data.backgroundColor,
        gradientConfig: data.gradientConfig as Prisma.InputJsonValue,
        patternId: data.patternId,
        textElements: data.textElements
          ? {
              create: data.textElements.map((text) => ({
                content: text.content,
                x: text.x,
                y: text.y,
                fontSize: text.fontSize,
                fontWeight: text.fontWeight,
                fontStyle: text.fontStyle,
                color: text.color,
                textAlign: text.textAlign,
                fontFamily: text.fontFamily,
                zIndex: text.zIndex
              }))
            }
          : undefined,
        imageElements: data.imageElements
          ? {
              create: data.imageElements.map((img) => ({
                imageData: img.imageData,
                x: img.x,
                y: img.y,
                width: img.width,
                height: img.height,
                originalWidth: img.originalWidth,
                originalHeight: img.originalHeight,
                zIndex: img.zIndex
              }))
            }
          : undefined
      },
      include: {
        textElements: true,
        imageElements: true
      }
    });

    return NextResponse.json({
      success: true,
      data: sample,
      message: "Sample updated successfully"
    });
  } catch (error) {
    console.error("Error updating sample:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update sample",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a sample
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Sample ID is required"
        },
        { status: 400 }
      );
    }

    // Check if sample exists
    const existingSample = await prisma.sample.findUnique({
      where: { id }
    });

    if (!existingSample) {
      return NextResponse.json(
        {
          success: false,
          error: "Sample not found"
        },
        { status: 404 }
      );
    }

    // Delete the sample (cascade will delete related elements)
    await prisma.sample.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Sample deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting sample:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete sample",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}