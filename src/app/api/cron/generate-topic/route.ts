/**
 * Created on: Vercel cron job for generating daily topics - 12/08/2025 15:45
 * Purpose: API endpoint that creates new daily topics every minute (for testing)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { env } from "@/env";

// Sample topics for testing - in production this would come from a more sophisticated system
const SAMPLE_TOPICS = [
  {
    title: "Red and Round",
    description:
      "Find something that is both red and round in your environment",
    keywords: [
      "red",
      "round",
      "circle",
      "circular",
      "crimson",
      "scarlet",
      "sphere",
      "ball",
    ],
  },
  {
    title: "Nature's Patterns",
    description:
      "Capture natural patterns - leaves, tree bark, water ripples, or clouds",
    keywords: [
      "pattern",
      "nature",
      "leaf",
      "bark",
      "water",
      "cloud",
      "texture",
      "natural",
    ],
  },
  {
    title: "Light and Shadow",
    description: "Play with contrast between light and dark areas",
    keywords: [
      "light",
      "shadow",
      "contrast",
      "bright",
      "dark",
      "illumination",
      "silhouette",
    ],
  },
  {
    title: "Urban Architecture",
    description:
      "Focus on buildings, structures, or architectural details in the city",
    keywords: [
      "building",
      "architecture",
      "urban",
      "structure",
      "city",
      "construction",
      "facade",
    ],
  },
  {
    title: "Food Colors",
    description: "Showcase colorful food items or ingredients",
    keywords: [
      "food",
      "colorful",
      "meal",
      "ingredient",
      "cooking",
      "fruit",
      "vegetable",
      "dish",
    ],
  },
  {
    title: "Transportation",
    description:
      "Capture vehicles, bikes, boats, or any form of transportation",
    keywords: [
      "car",
      "bike",
      "boat",
      "train",
      "vehicle",
      "transportation",
      "travel",
      "wheel",
    ],
  },
  {
    title: "Reflections",
    description: "Find interesting reflections in windows, water, or mirrors",
    keywords: [
      "reflection",
      "mirror",
      "water",
      "window",
      "glass",
      "surface",
      "reflect",
    ],
  },
  {
    title: "Street Art",
    description: "Document graffiti, murals, or other forms of street art",
    keywords: [
      "graffiti",
      "mural",
      "street art",
      "art",
      "wall",
      "spray paint",
      "urban art",
    ],
  },
  {
    title: "Animals in Motion",
    description: "Capture pets, wildlife, or any animals in action",
    keywords: [
      "animal",
      "pet",
      "wildlife",
      "motion",
      "action",
      "dog",
      "cat",
      "bird",
      "movement",
    ],
  },
  {
    title: "Minimalist Composition",
    description: "Create a simple, clean image with minimal elements",
    keywords: [
      "minimal",
      "simple",
      "clean",
      "composition",
      "space",
      "empty",
      "geometric",
    ],
  },
  {
    title: "Weather Phenomena",
    description:
      "Document current weather conditions - rain, sun, clouds, or snow",
    keywords: [
      "weather",
      "rain",
      "sun",
      "cloud",
      "snow",
      "storm",
      "sky",
      "atmosphere",
    ],
  },
  {
    title: "Vintage or Retro",
    description:
      "Find objects or scenes that have a vintage or retro aesthetic",
    keywords: [
      "vintage",
      "retro",
      "old",
      "classic",
      "antique",
      "nostalgic",
      "aged",
    ],
  },
];

// Verify the request is from Vercel Cron
function verifyVercelCron(request: NextRequest): boolean {
  // In production, verify the cron secret
  if (env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET not configured");
      return false;
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("Invalid cron authorization");
      return false;
    }
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    if (!verifyVercelCron(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🕐 Cron job: Generating new topic...");

    // Deactivate any currently active topics
    await db.topic.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Get a random topic from our sample topics
    const randomTopic =
      SAMPLE_TOPICS[Math.floor(Math.random() * SAMPLE_TOPICS.length)];

    if (!randomTopic) {
      throw new Error("No topic available");
    }

    // Create new topic for the current time
    const now = new Date();

    // Check if we already have a topic for this exact minute (prevent duplicates)
    const existingTopic = await db.topic.findFirst({
      where: {
        date: {
          gte: new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
          ),
          lt: new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes() + 1,
          ),
        },
      },
    });

    if (existingTopic) {
      console.log(
        "⚠️  Topic already exists for this minute, activating existing topic",
      );

      // Just activate the existing topic
      await db.topic.update({
        where: { id: existingTopic.id },
        data: { isActive: true },
      });

      return NextResponse.json({
        success: true,
        message: "Activated existing topic",
        topic: existingTopic,
      });
    }

    // Create new topic
    const newTopic = await db.topic.create({
      data: {
        title: randomTopic.title,
        description: randomTopic.description,
        keywords: randomTopic.keywords,
        date: now,
        isActive: true,
      },
    });

    console.log(
      `✅ Created new topic: "${newTopic.title}" (ID: ${newTopic.id})`,
    );

    // Clean up old topics (keep only last 100 topics)
    const oldTopics = await db.topic.findMany({
      orderBy: { createdAt: "desc" },
      skip: 100,
      select: { id: true },
    });

    if (oldTopics.length > 0) {
      const oldTopicIds = oldTopics.map((topic) => topic.id);

      // Delete old posts first (due to foreign key constraint)
      await db.post.deleteMany({
        where: { topicId: { in: oldTopicIds } },
      });

      // Then delete old topics
      await db.topic.deleteMany({
        where: { id: { in: oldTopicIds } },
      });

      console.log(`🧹 Cleaned up ${oldTopics.length} old topics`);
    }

    return NextResponse.json({
      success: true,
      message: "New topic generated successfully",
      topic: {
        id: newTopic.id,
        title: newTopic.title,
        description: newTopic.description,
        isActive: newTopic.isActive,
        createdAt: newTopic.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Cron job error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Also support POST method for manual testing
export async function POST(request: NextRequest) {
  console.log("🔧 Manual topic generation triggered");
  return GET(request);
}
