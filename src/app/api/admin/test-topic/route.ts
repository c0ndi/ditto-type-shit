/**
 * Created on: Manual topic generation endpoint for testing - 12/08/2025 15:46
 * Purpose: API endpoint for manually triggering topic generation during development
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // In development, allow manual topic generation
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This endpoint is only available in development" },
        { status: 403 },
      );
    }

    // Call the cron endpoint directly
    const baseUrl = request.nextUrl.origin;
    const cronResponse = await fetch(`${baseUrl}/api/cron/generate-topic`, {
      method: "POST",
    });

    const result = await cronResponse.json();

    return NextResponse.json({
      success: true,
      message: "Manual topic generation completed",
      result,
    });
  } catch (error) {
    console.error("Manual topic generation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
