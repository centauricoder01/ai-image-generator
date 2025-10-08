import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const sample = await prisma.sample.findUnique({
      where: { id },
      include: {
        textElements: {
          orderBy: { zIndex: "asc" }
        },
        imageElements: {
          orderBy: { zIndex: "asc" }
        }
      }
    });

    if (!sample) {
      return NextResponse.json(
        {
          success: false,
          error: "Sample not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sample
    });
  } catch (error) {
    console.error("Error fetching sample:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sample",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}