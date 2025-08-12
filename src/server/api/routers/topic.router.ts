/**
 * Created on: Topic management tRPC router - 12/08/2025 15:47
 * Purpose: API endpoints for fetching and managing daily topics
 */

import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const topicRouter = createTRPCRouter({
  /**
   * Get the current active topic
   */
  getCurrent: publicProcedure.query(async ({ ctx }) => {
    const topic = await ctx.db.topic.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return topic;
  }),

  /**
   * Get all topics with pagination
   */
  getMany: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().cuid().optional(),
        includeInactive: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const topics = await ctx.db.topic.findMany({
        where: input.includeInactive ? undefined : { isActive: true },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (topics.length > input.limit) {
        const nextItem = topics.pop();
        nextCursor = nextItem?.id;
      }

      return {
        topics,
        nextCursor,
      };
    }),

  /**
   * Get topic by ID with posts
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const topic = await ctx.db.topic.findUnique({
        where: { id: input.id },
        include: {
          posts: {
            include: {
              user: {
                select: {
                  id: true,
                  twitterUsername: true,
                  twitterDisplayName: true,
                  twitterImage: true,
                  isAnonymous: true,
                },
              },
              _count: {
                select: {
                  votes: true,
                  comments: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return topic;
    }),

  /**
   * Get topic statistics
   */
  getStats: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const topic = await ctx.db.topic.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          title: true,
          date: true,
          isActive: true,
          posts: {
            select: {
              id: true,
              upvotes: true,
              downvotes: true,
              totalViews: true,
              aiProcessed: true,
              validationStatus: true,
            },
          },
        },
      });

      if (!topic) {
        return null;
      }

      const stats = {
        totalPosts: topic.posts.length,
        totalVotes: topic.posts.reduce(
          (sum, post) => sum + post.upvotes + post.downvotes,
          0,
        ),
        totalViews: topic.posts.reduce((sum, post) => sum + post.totalViews, 0),
        aiProcessedPosts: topic.posts.filter((post) => post.aiProcessed).length,
        averageUpvotes:
          topic.posts.length > 0
            ? topic.posts.reduce((sum, post) => sum + post.upvotes, 0) /
              topic.posts.length
            : 0,
        participationRate: 0, // This would need user count to calculate properly
      };

      return {
        topic: {
          id: topic.id,
          title: topic.title,
          date: topic.date,
          isActive: topic.isActive,
        },
        stats,
      };
    }),

  /**
   * Manually trigger topic generation (development only)
   */
  generateTest: protectedProcedure.mutation(async ({ ctx }) => {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("This endpoint is only available in development");
    }

    try {
      const response = await fetch(
        `${process.env.VERCEL_URL || "http://localhost:3000"}/api/admin/test-topic`,
        {
          method: "POST",
        },
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate topic");
      }

      return result;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to generate test topic",
      );
    }
  }),
});
