/**
 * Updated on: Simplified database seeding utilities - 12/09/2025 00:15
 * Purpose: Generate minimal test data for development - 10 users, 3 topics, 2 posts per user
 */

import { db } from "@/server/db";
import { type ValidationStatus, type VoteType } from "@prisma/client";

// Simplified sample data
const SAMPLE_USERS = [
  {
    twitterUsername: "alex_photos",
    twitterDisplayName: "Alex Thompson",
    twitterImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "sarah_captures",
    twitterDisplayName: "Sarah Johnson",
    twitterImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "mike_lens",
    twitterDisplayName: "Mike Rodriguez",
    twitterImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "emma_shots",
    twitterDisplayName: "Emma Wilson",
    twitterImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "david_frame",
    twitterDisplayName: "David Chen",
    twitterImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "lisa_focus",
    twitterDisplayName: "Lisa Anderson",
    twitterImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "james_snap",
    twitterDisplayName: "James Taylor",
    twitterImage:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "nina_pixel",
    twitterDisplayName: "Nina Patel",
    twitterImage:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "ryan_visual",
    twitterDisplayName: "Ryan O'Connor",
    twitterImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    twitterUsername: "kelly_shutter",
    twitterDisplayName: "Kelly Martinez",
    twitterImage:
      "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=150&h=150&fit=crop&crop=face",
  },
];

const SAMPLE_TOPICS = [
  {
    title: "Urban Shadows",
    description: "Capture interesting shadows in city environments",
    keywords: ["shadow", "urban", "city", "building", "street", "architecture"],
  },
  {
    title: "Colorful Food",
    description: "Bright and vibrant food photography",
    keywords: ["food", "colorful", "bright", "vibrant", "meal", "dish"],
  },
  {
    title: "Nature Close-ups",
    description: "Macro photography of plants and natural details",
    keywords: ["nature", "macro", "plant", "flower", "leaf", "detail"],
  },
];

const SAMPLE_POST_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
  {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
  {
    url: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
  {
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
  {
    url: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
  {
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
  {
    url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
  {
    url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop",
    blurDataUrl:
      "data:image/webp;base64,UklGRjwCAABXRUJQVlA4IDACAAAwEQCdASoIAAYAAUAmJZwAAudCwPyvwAD+/6qd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6uqd6g==",
  },
];

// Utility functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

function generateTwitterId(): string {
  return Math.random().toString().slice(2, 17);
}

function generateImageKey(userId: string, timestamp: number): string {
  const randomId = Math.random().toString(36).substring(2, 8);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `posts/${year}/${month}/${day}/${userId}/${timestamp}-${randomId}.jpg`;
}

/**
 * Seeds the database with test data
 */
export async function seedDatabase(currentUserTwitterId?: string) {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Create topics
    console.log("📝 Creating topics...");
    const createdTopics = [];

    for (let i = 0; i < SAMPLE_TOPICS.length; i++) {
      const topic = SAMPLE_TOPICS[i]!;
      const date = new Date();
      date.setDate(date.getDate() - (SAMPLE_TOPICS.length - 1 - i)); // Spread topics across days

      const createdTopic = await db.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          keywords: topic.keywords,
          date: date,
          isActive: i === SAMPLE_TOPICS.length - 1, // Only the last topic is active
        },
      });

      createdTopics.push(createdTopic);
      console.log(`  ✅ Created topic: ${topic.title}`);
    }

    // 2. Create users
    console.log("👥 Creating users...");
    const createdUsers = [];

    for (const userData of SAMPLE_USERS) {
      const user = await db.user.create({
        data: {
          twitterId: generateTwitterId(),
          twitterUsername: userData.twitterUsername,
          twitterDisplayName: userData.twitterDisplayName,
          twitterImage: userData.twitterImage,
          totalRewards: randomInt(0, 500),
          reputation: Math.random() * 100,
        },
      });

      // Create stats for user
      await db.stats.create({
        data: {
          userId: user.id,
          totalPosts: 2, // Will create 2 posts per user
          totalLikes: randomInt(0, 50),
          totalDislikes: randomInt(0, 10),
          consecutiveDays: randomInt(1, 10),
          longestStreak: randomInt(1, 15),
          lastPostDate: new Date(),
        },
      });

      createdUsers.push(user);
      console.log(`  ✅ Created user: ${userData.twitterDisplayName}`);
    }

    // 3. Create posts (2 per user)
    console.log("📸 Creating posts...");
    let imageIndex = 0;
    const activeTopic = createdTopics.find((t) => t.isActive)!;

    for (const user of createdUsers) {
      const usedTopics = new Set<string>();

      // Create 2 posts for each user
      for (let postNum = 0; postNum < 2; postNum++) {
        let topic;

        if (postNum === 0) {
          // First post always goes to active topic
          topic = activeTopic;
        } else {
          // Second post goes to a different topic (not already used)
          const availableTopics = createdTopics.filter(
            (t) => !usedTopics.has(t.id),
          );
          topic =
            availableTopics.length > 0 ? randomChoice(availableTopics) : null;
        }

        // Skip if no available topic (shouldn't happen with 3 topics and 2 posts)
        if (!topic) continue;

        usedTopics.add(topic.id);

        const imageData =
          SAMPLE_POST_IMAGES[imageIndex % SAMPLE_POST_IMAGES.length]!;
        const timestamp = Date.now() - randomInt(0, 86400000); // Random time in last 24h

        await db.post.create({
          data: {
            twitterId: user.twitterId,
            topicId: topic.id,
            imageUrl: imageData.url,
            imageKey: generateImageKey(user.twitterId, timestamp),
            blurDataUrl: imageData.blurDataUrl,
            aiDescription: "AI-generated description placeholder",
            aiConfidence: Math.random(),
            aiKeywordsFound: topic.keywords.slice(0, 2),
            aiProcessed: true,
            validationStatus: randomChoice<ValidationStatus>([
              "PENDING",
              "AI_VALIDATED",
              "COMMUNITY_VALIDATED",
              "FINAL_APPROVED",
            ]),
            totalViews: randomInt(10, 200),
            sentiment: (Math.random() - 0.5) * 2, // -1 to 1
            rewardPoints: randomInt(0, 100),
            createdAt: new Date(timestamp),
          },
        });

        imageIndex++;
        console.log(
          `  ✅ Created post for ${user.twitterDisplayName} on ${topic.title}${topic.isActive ? " (ACTIVE)" : ""}`,
        );
      }
    }

    // 4. Create some votes
    console.log("👍 Creating votes...");
    const allPosts = await db.post.findMany();
    const voteCount = Math.min(50, allPosts.length * 3); // 3 votes per post max

    for (let i = 0; i < voteCount; i++) {
      const post = randomChoice(allPosts);
      const voter = randomChoice(createdUsers);

      // Skip if user is voting on their own post
      if (post.twitterId === voter.twitterId) continue;

      try {
        await db.vote.create({
          data: {
            userId: voter.id,
            postId: post.id,
            type: randomChoice<VoteType>(["UPVOTE", "DOWNVOTE"]),
          },
        });
      } catch {
        // Skip duplicate votes (user already voted on this post)
        continue;
      }
    }

    console.log("✅ Database seeding completed successfully!");

    // Return statistics
    const stats = {
      users: createdUsers.length,
      topics: createdTopics.length,
      posts: createdUsers.length * 2,
      votes: await db.vote.count(),
    };

    console.log("📊 Seeding Statistics:");
    console.log(`  👥 Users: ${stats.users}`);
    console.log(`  📝 Topics: ${stats.topics}`);
    console.log(`  📸 Posts: ${stats.posts}`);
    console.log(`  👍 Votes: ${stats.votes}`);

    return stats;
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

/**
 * Clears all data except the current user
 */
export async function clearDatabase(currentUserTwitterId?: string) {
  console.log("🧹 Clearing database...");

  try {
    // Delete in correct order to respect foreign key constraints
    await db.vote.deleteMany({});
    await db.post.deleteMany({});
    await db.stats.deleteMany({});
    await db.topic.deleteMany({});

    // Delete users except current user
    if (currentUserTwitterId) {
      await db.user.deleteMany({
        where: {
          twitterId: { not: currentUserTwitterId },
        },
      });
      console.log(`✅ Cleared all data except current user`);
    } else {
      await db.user.deleteMany({});
      console.log("✅ Cleared all data including users");
    }
  } catch (error) {
    console.error("❌ Database clearing failed:", error);
    throw error;
  }
}

/**
 * Resets database and seeds with fresh data
 */
export async function resetDatabase(currentUserTwitterId?: string) {
  console.log("🔄 Resetting database...");

  await clearDatabase(currentUserTwitterId);
  return await seedDatabase();
}
