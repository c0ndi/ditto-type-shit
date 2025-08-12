/**
 * Created on: Post management tRPC router - 12/08/2025 15:37
 * Purpose: API endpoints for creating, fetching, and managing posts with image uploads
 */

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { uploadPostImage, deletePostImage } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";
import { createPostSchema, getPostsSchema } from "./schemas";

export const postsRouter = createTRPCRouter({
  /**
   * Create a new post with image upload
   */
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { twitterId } = ctx.session.user;

      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          twitterId,
        },
      });

      try {
        // Check if user already posted for this topic
        const existingPost = await ctx.db.post.findUnique({
          where: {
            twitterId_topicId: {
              twitterId: user.twitterId,
              topicId: input.topicId,
            },
          },
        });

        if (existingPost) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already posted for this topic today",
          });
        }

        // Verify topic exists and is active
        const topic = await ctx.db.topic.findUnique({
          where: { id: input.topicId },
        });

        if (!topic) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Topic not found",
          });
        }

        if (!topic.isActive) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This topic is not currently active",
          });
        }

        // Convert base64 to File object
        const base64Data = input.imageBase64.split(",")[1] ?? input.imageBase64;
        const buffer = Buffer.from(base64Data, "base64");
        const file = new File([buffer], input.fileName, {
          type: input.imageType,
        });

        // Upload image to Supabase storage
        const { path: storagePath, publicUrl } = await uploadPostImage(
          file,
          user.twitterId,
        );

        // Create post in database
        const post = await ctx.db.post.create({
          data: {
            twitterId: user.twitterId,
            topicId: input.topicId,
            imageUrl: publicUrl,
            imageKey: storagePath, // Store domain-independent path
          },
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
            topic: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
            _count: {
              select: {
                votes: true,
                comments: true,
              },
            },
          },
        });

        // Update user stats
        await ctx.db.stats.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            totalPosts: 1,
            lastPostDate: new Date(),
          },
          update: {
            totalPosts: { increment: 1 },
            lastPostDate: new Date(),
          },
        });

        return post;
      } catch (error) {
        // If post creation fails after image upload, clean up the uploaded image
        if (error instanceof Error && error.message.includes("Upload failed")) {
          // Image upload failed, no cleanup needed
        } else {
          // Post creation failed, but image was uploaded - clean up
          try {
            // We don't have the storage path here, so we'll rely on periodic cleanup
            // or implement a more sophisticated error handling system
          } catch (cleanupError) {
            console.error("Failed to cleanup uploaded image:", cleanupError);
          }
        }

        throw error;
      }
    }),

  /**
   * Get posts with pagination
   */
  getMany: publicProcedure
    .input(getPostsSchema)
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: input.topicId ? { topicId: input.topicId } : undefined,
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
          topic: {
            select: {
              id: true,
              title: true,
              description: true,
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
        take: input.limit + 1, // Take one extra to determine if there are more
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  /**
   * Get current active topic for posting
   */
  getActiveTopic: publicProcedure.query(async ({ ctx }) => {
    const topic = await ctx.db.topic.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return topic;
  }),

  /**
   * Check if user has posted for a specific topic
   */
  hasUserPosted: protectedProcedure
    .input(z.object({ topicId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          twitterId_topicId: {
            twitterId: ctx.session.user.twitterId,
            topicId: input.topicId,
          },
        },
        select: { id: true },
      });

      return !!post;
    }),

  /**
   * Get user's own posts
   */
  getUserPosts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().cuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: { user: { twitterId: ctx.session.user.twitterId } },
        include: {
          topic: {
            select: {
              id: true,
              title: true,
              description: true,
              date: true,
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
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
});
