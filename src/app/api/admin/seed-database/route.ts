/**
 * Database Seeding API Route - Created on 12/08/2025 16:55
 * Endpoint for seeding the database with test data via admin panel
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/config";
import { seedDatabase, clearDatabase } from "@/lib/database-seeder";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get the action from request body
    const body = (await request.json()) as { action: string };
    const { action } = body;

    if (action === "seed") {
      console.log("🌱 Starting database seed operation...");
      const stats = await seedDatabase();

      return NextResponse.json({
        success: true,
        message: "Database seeded successfully!",
        stats,
      });
    } else if (action === "clear") {
      console.log("🧹 Starting database clear operation...");
      await clearDatabase();

      return NextResponse.json({
        success: true,
        message: "Database cleared successfully!",
      });
    } else if (action === "clear-and-seed") {
      console.log("🔄 Starting clear and seed operation...");
      await clearDatabase();
      const stats = await seedDatabase();

      return NextResponse.json({
        success: true,
        message: "Database cleared and seeded successfully!",
        stats,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Use 'seed', 'clear', or 'clear-and-seed'",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Database operation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database operation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
