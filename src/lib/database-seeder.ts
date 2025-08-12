/**
 * Database Seeder - Created on 12/08/2025 16:55
 * Comprehensive seeding system for generating realistic test data
 */

import { db } from "@/server/db";
import { type ValidationStatus, type VoteType } from "@prisma/client";

// Sample data for generating realistic content
const SAMPLE_USERNAMES = [
  "photo_hunter_",
  "creative_lens_",
  "snap_master_",
  "visual_story_",
  "pixel_artist_",
  "frame_seeker_",
  "light_chaser_",
  "moment_capture_",
  "street_wanderer_",
  "nature_eye_",
  "urban_explorer_",
  "color_palette_",
  "bokeh_dreams_",
  "golden_hour_",
  "shadow_play_",
  "macro_world_",
  "candid_shots_",
  "portrait_pro_",
  "landscape_lover_",
  "vintage_vibes_",
  "minimalist_frame_",
  "dramatic_light_",
  "texture_hunter_",
  "geometry_finder_",
  "emotion_catcher_",
  "travel_lens_",
  "food_stylist_",
  "architecture_eye_",
  "wildlife_tracker_",
  "abstract_mind_",
];

const SAMPLE_DISPLAY_NAMES = [
  "Alex Chen",
  "Maya Patel",
  "Jordan Kim",
  "Riley Johnson",
  "Casey Wong",
  "Morgan Davis",
  "Avery Taylor",
  "Quinn Anderson",
  "Sage Wilson",
  "Phoenix Liu",
  "River Martinez",
  "Skylar Brown",
  "Rowan Garcia",
  "Ember Rodriguez",
  "Aspen Miller",
  "Sage Thompson",
  "Ocean Park",
  "Storm Young",
  "Luna Wright",
  "Atlas Lopez",
  "Nova Green",
  "Orion Adams",
  "Zara Hall",
  "Kai Walker",
  "Iris Lee",
  "Leo Zhang",
  "Mia Foster",
  "Ben Cooper",
  "Zoe Clark",
  "Max Rivera",
];

const SAMPLE_TOPICS = [
  {
    title: "Urban Shadows",
    description: "Capture interesting shadows in city environments",
    keywords: [
      "shadow",
      "urban",
      "city",
      "building",
      "street",
      "architecture",
      "light",
      "contrast",
    ],
  },
  {
    title: "Colorful Food",
    description: "Bright and vibrant food photography",
    keywords: [
      "food",
      "colorful",
      "bright",
      "vibrant",
      "meal",
      "dish",
      "cuisine",
      "rainbow",
    ],
  },
  {
    title: "Reflections",
    description: "Mirror images and water reflections",
    keywords: [
      "reflection",
      "mirror",
      "water",
      "glass",
      "surface",
      "symmetry",
      "double",
      "image",
    ],
  },
  {
    title: "Pets in Action",
    description: "Animals doing something interesting or funny",
    keywords: [
      "pet",
      "animal",
      "dog",
      "cat",
      "action",
      "movement",
      "playing",
      "running",
    ],
  },
  {
    title: "Minimalist Design",
    description: "Clean, simple compositions with lots of negative space",
    keywords: [
      "minimal",
      "simple",
      "clean",
      "negative space",
      "geometric",
      "modern",
      "less",
    ],
  },
  {
    title: "Street Art",
    description: "Murals, graffiti, and artistic expressions in public spaces",
    keywords: [
      "street art",
      "mural",
      "graffiti",
      "wall",
      "artistic",
      "public",
      "creative",
      "urban art",
    ],
  },
  {
    title: "Golden Hour",
    description: "Photos taken during the magic hour of sunset or sunrise",
    keywords: [
      "golden hour",
      "sunset",
      "sunrise",
      "warm light",
      "magic hour",
      "glow",
      "amber",
    ],
  },
  {
    title: "Patterns in Nature",
    description: "Natural patterns, textures, and repetitive elements",
    keywords: [
      "pattern",
      "nature",
      "texture",
      "repetitive",
      "organic",
      "natural",
      "geometry",
    ],
  },
  {
    title: "Black and White",
    description: "Monochrome photography that tells a story",
    keywords: [
      "black and white",
      "monochrome",
      "contrast",
      "dramatic",
      "timeless",
      "classic",
    ],
  },
  {
    title: "Close-up Details",
    description: "Macro photography showing intricate details",
    keywords: [
      "macro",
      "close-up",
      "detail",
      "intricate",
      "small",
      "texture",
      "magnified",
    ],
  },
];

const SAMPLE_COMMENTS = [
  "Amazing composition! Love the lighting.",
  "This perfectly captures the theme!",
  "Great use of color and contrast.",
  "Such a creative interpretation!",
  "The detail in this shot is incredible.",
  "Perfect timing on this capture.",
  "Love the artistic vision here.",
  "This has such a unique perspective.",
  "Beautiful work! Very inspiring.",
  "Excellent technical execution.",
  "The mood in this photo is perfect.",
  "Such an interesting subject choice.",
  "Great eye for photography!",
  "This really stands out from the crowd.",
  "Fantastic use of the theme!",
];

// Generate random number between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random float between min and max
function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Pick random item from array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!;
}

// Pick multiple random items from array
function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate random Twitter ID
function generateTwitterId(): string {
  return Math.floor(
    Math.random() * 9000000000000000 + 1000000000000000,
  ).toString();
}

// Generate random date in the past 30 days
function randomRecentDate(daysAgo = 30): Date {
  const now = new Date();
  const msAgo = daysAgo * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() - Math.random() * msAgo);
}

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Create Topics first
    console.log("📋 Creating topics...");
    const topics = [];
    for (let i = 0; i < SAMPLE_TOPICS.length; i++) {
      const topicData = SAMPLE_TOPICS[i]!;
      const date = new Date();
      date.setDate(date.getDate() - (SAMPLE_TOPICS.length - i));

      const topic = await db.topic.create({
        data: {
          title: topicData.title,
          description: topicData.description,
          keywords: topicData.keywords,
          date: date,
          isActive: i === SAMPLE_TOPICS.length - 1, // Only the last one is active
        },
      });
      topics.push(topic);
    }
    console.log(`✅ Created ${topics.length} topics`);

    // 2. Create Users
    console.log("👥 Creating users...");
    const users = [];
    for (let i = 0; i < 30; i++) {
      const twitterId = generateTwitterId();
      const username = randomChoice(SAMPLE_USERNAMES) + randomInt(100, 999);
      const displayName = randomChoice(SAMPLE_DISPLAY_NAMES);

      const user = await db.user.create({
        data: {
          twitterId,
          twitterUsername: username,
          twitterDisplayName: displayName,
          twitterImage: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
          totalRewards: randomInt(100, 5000),
          reputation: randomFloat(0, 100),
        },
      });
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // 3. Create User Stats
    console.log("📊 Creating user statistics...");
    for (const user of users) {
      await db.stats.create({
        data: {
          userId: user.id,
          totalLikes: randomInt(10, 500),
          totalDislikes: randomInt(0, 50),
          totalViews: randomInt(100, 2000),
          totalComments: randomInt(5, 200),
          communitySentiment: randomFloat(-0.5, 1.0),
          aiAccuracyRate: randomFloat(0.6, 0.95),
          totalPosts: randomInt(5, 25),
          consecutiveDays: randomInt(0, 15),
          longestStreak: randomInt(3, 30),
          lastPostDate: randomRecentDate(7),
          topThreeFinishes: randomInt(0, 8),
          perfectValidations: randomInt(0, 10),
        },
      });
    }
    console.log("✅ Created user statistics");

    // 4. Create Posts
    console.log("📷 Creating posts...");
    const posts = [];
    const validationStatuses: ValidationStatus[] = [
      "PENDING",
      "AI_VALIDATED",
      "AI_REJECTED",
      "COMMUNITY_VALIDATED",
      "COMMUNITY_REJECTED",
      "FINAL_APPROVED",
      "FINAL_REJECTED",
    ];

    for (const topic of topics) {
      // Each topic gets posts from 60-80% of users
      const participatingUsers = randomChoices(users, randomInt(18, 24));

      for (const user of participatingUsers) {
        const post = await db.post.create({
          data: {
            twitterId: user.twitterId,
            topicId: topic.id,
            imageUrl: `https://picsum.photos/800/800?random=${user.id + topic.id}`,
            imageKey: `posts/${topic.date.getFullYear()}/${String(topic.date.getMonth() + 1).padStart(2, "0")}/${String(topic.date.getDate()).padStart(2, "0")}/${user.twitterId}/photo.jpg`,
            aiDescription: `Photo showing ${randomChoices(topic.keywords, randomInt(2, 4)).join(", ")}`,
            aiConfidence: randomFloat(0.4, 0.95),
            aiKeywordsFound: randomChoices(topic.keywords, randomInt(1, 3)),
            aiProcessed: true,
            validationStatus: randomChoice(validationStatuses),
            votes: {
              create: {
                userId: user.id,
                type: randomChoice(["UPVOTE", "DOWNVOTE"]),
                createdAt: randomRecentDate(5),
              },
            },
            totalViews: randomInt(20, 200),
            sentiment: randomFloat(-0.3, 1.0),
            rewardPoints: randomInt(10, 100),
            rewardCalculated: Math.random() > 0.3,
            createdAt: randomRecentDate(
              topic === topics[topics.length - 1] ? 1 : 30,
            ),
          },
        });
        posts.push(post);
      }
    }
    console.log(`✅ Created ${posts.length} posts`);

    // 5. Create Votes
    console.log("🗳️ Creating votes...");
    let totalVotes = 0;
    for (const post of posts) {
      // Each post gets votes from 30-70% of other users
      const votingUsers = users.filter((u) => u.twitterId !== post.twitterId);
      const votersCount = randomInt(
        Math.floor(votingUsers.length * 0.3),
        Math.floor(votingUsers.length * 0.7),
      );
      const voters = randomChoices(votingUsers, votersCount);

      for (const voter of voters) {
        const voteType: VoteType = Math.random() > 0.2 ? "UPVOTE" : "DOWNVOTE"; // 80% upvotes

        await db.vote.create({
          data: {
            userId: voter.id,
            postId: post.id,
            type: voteType,
            createdAt: randomRecentDate(5),
          },
        });
        totalVotes++;
      }
    }
    console.log(`✅ Created ${totalVotes} votes`);

    // 6. Create Comments
    console.log("💬 Creating comments...");
    let totalComments = 0;
    for (const post of posts) {
      // Each post gets 0-8 comments
      const commentCount = randomInt(0, 8);
      const commentingUsers = users.filter(
        (u) => u.twitterId !== post.twitterId,
      );

      for (let i = 0; i < commentCount; i++) {
        const commenter = randomChoice(commentingUsers);

        await db.comment.create({
          data: {
            userId: commenter.id,
            postId: post.id,
            content: randomChoice(SAMPLE_COMMENTS),
            aiProcessed: Math.random() > 0.3,
            contributesToValid:
              Math.random() > 0.4 ? Math.random() > 0.2 : null,
            createdAt: randomRecentDate(3),
          },
        });
        totalComments++;
      }
    }
    console.log(`✅ Created ${totalComments} comments`);

    // 7. Create Reward Transactions
    console.log("💰 Creating reward transactions...");
    let totalTransactions = 0;
    const rewardReasons = [
      "Daily post reward",
      "Engagement bonus",
      "Community validation bonus",
      "AI accuracy bonus",
      "Streak bonus",
      "Top performer reward",
    ];

    for (const user of users) {
      const transactionCount = randomInt(3, 15);

      for (let i = 0; i < transactionCount; i++) {
        await db.rewardTransaction.create({
          data: {
            userId: user.id,
            postId:
              Math.random() > 0.3
                ? randomChoice(
                    posts.filter((p) => p.twitterId === user.twitterId),
                  )?.id
                : null,
            points: randomInt(5, 150),
            reason: randomChoice(rewardReasons),
            createdAt: randomRecentDate(20),
          },
        });
        totalTransactions++;
      }
    }
    console.log(`✅ Created ${totalTransactions} reward transactions`);

    // 8. Create Post Views
    console.log("👁️ Creating post views...");
    let totalViews = 0;
    for (const post of posts) {
      const viewCount = randomInt(post.totalViews, post.totalViews + 50);

      for (let i = 0; i < viewCount; i++) {
        const viewer = Math.random() > 0.3 ? randomChoice(users) : null;

        await db.postView.create({
          data: {
            postId: post.id,
            userId: viewer?.id,
            ipAddress: viewer ? null : `192.168.1.${randomInt(1, 254)}`,
            createdAt: randomRecentDate(2),
          },
        });
        totalViews++;
      }
    }
    console.log(`✅ Created ${totalViews} post views`);

    // 9. Create some User Wallets (optional)
    console.log("💳 Creating user wallets...");
    let totalWallets = 0;
    for (const user of users) {
      if (Math.random() > 0.6) {
        // 40% of users have wallets
        await db.userWallet.create({
          data: {
            userId: user.id,
            address: `0x${Math.random().toString(16).substr(2, 40)}`,
            userWalletName:
              Math.random() > 0.5 ? "Main Wallet" : "Trading Wallet",
            chainId: randomChoice([1, 137, 56]), // Ethereum, Polygon, BSC
            isDefault: true,
            lastUsed: randomRecentDate(10),
          },
        });
        totalWallets++;
      }
    }
    console.log(`✅ Created ${totalWallets} user wallets`);

    console.log("🎉 Database seeding completed successfully!");

    return {
      users: users.length,
      topics: topics.length,
      posts: posts.length,
      votes: totalVotes,
      comments: totalComments,
      transactions: totalTransactions,
      views: totalViews,
      wallets: totalWallets,
    };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export async function clearDatabase() {
  console.log("🧹 Clearing database...");

  try {
    // Delete in order due to foreign key constraints
    await db.postView.deleteMany({});
    await db.rewardTransaction.deleteMany({});
    await db.comment.deleteMany({});
    await db.vote.deleteMany({});
    await db.post.deleteMany({});
    await db.userWallet.deleteMany({});
    await db.stats.deleteMany({});
    await db.topic.deleteMany({});
    await db.user.deleteMany({});

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
}
