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
import { uploadPostImage } from "@/lib/supabase";
import { TRPCError } from "@trpc/server";
import {
  createPostSchema,
  getPostsSchema,
  votePostSchema,
  createCommentSchema,
  getCommentsSchema,
} from "./schemas";

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

        // Upload image to Supabase storage and generate blur placeholder
        const {
          path: storagePath,
          publicUrl,
          blurDataUrl,
        } = await uploadPostImage(file, user.twitterId);

        // Create post in database
        const post = await ctx.db.post.create({
          data: {
            twitterId: user.twitterId,
            topicId: input.topicId,
            imageUrl: publicUrl,
            imageKey: storagePath, // Store domain-independent path
            blurDataUrl: blurDataUrl, // Store base64 blur data URL for Next.js Image component
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

  /**
   * Get today's posts for the active topic
   */
  getTodaysPosts: publicProcedure.query(async ({ ctx }) => {
    // Get the active topic
    const activeTopic = await ctx.db.topic.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!activeTopic) {
      return [];
    }

    // Get posts for today's topic, sorted by creation date (newest first)
    const posts = await ctx.db.post.findMany({
      where: {
        topicId: activeTopic.id,
      },
      include: {
        user: {
          select: {
            id: true,
            twitterUsername: true,
            twitterDisplayName: true,
            twitterImage: true,
            reputation: true,
            totalRewards: true,
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
        votes: {
          select: {
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to 50 posts for performance
    });

    // Calculate vote counts dynamically from votes
    return posts.map((post) => {
      const upvotes = post.votes.filter(
        (vote) => vote.type === "UPVOTE",
      ).length;
      const downvotes = post.votes.filter(
        (vote) => vote.type === "DOWNVOTE",
      ).length;

      return {
        ...post,
        upvotes,
        downvotes,
        votes: undefined, // Remove the votes array from the response
      };
    });
  }),

  /**
   * Get active topic with user post status
   */
  getActiveTopicWithPostStatus: protectedProcedure.query(async ({ ctx }) => {
    const activeTopic = await ctx.db.topic.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!activeTopic) {
      return {
        topic: null,
        hasPosted: false,
      };
    }

    const existingPost = await ctx.db.post.findUnique({
      where: {
        twitterId_topicId: {
          twitterId: ctx.session.user.twitterId,
          topicId: activeTopic.id,
        },
      },
      select: { id: true },
    });

    return {
      topic: activeTopic,
      hasPosted: !!existingPost,
    };
  }),

  /**
   * Get post by ID with details
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              twitterUsername: true,
              twitterDisplayName: true,
              twitterImage: true,
              reputation: true,
              totalRewards: true,
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
          votes: {
            select: {
              type: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Calculate vote counts dynamically from votes
      const upvotes = post.votes.filter(
        (vote) => vote.type === "UPVOTE",
      ).length;
      const downvotes = post.votes.filter(
        (vote) => vote.type === "DOWNVOTE",
      ).length;

      return {
        ...post,
        upvotes,
        downvotes,
        votes: undefined, // Remove the votes array from the response
      };
    }),

  /**
   * Get comments for a post
   */
  getComments: publicProcedure
    .input(getCommentsSchema)
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.findMany({
        where: { postId: input.postId },
        include: {
          user: {
            select: {
              id: true,
              twitterUsername: true,
              twitterDisplayName: true,
              twitterImage: true,
              reputation: true,
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
      if (comments.length > input.limit) {
        const nextItem = comments.pop();
        nextCursor = nextItem?.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),

  /**
   * Create a comment
   */
  createComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { twitterId } = ctx.session.user;

      // Check if post exists
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        select: { id: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Get user ID
      const user = await ctx.db.user.findUniqueOrThrow({
        where: { twitterId },
        select: { id: true },
      });

      const comment = await ctx.db.comment.create({
        data: {
          postId: input.postId,
          userId: user.id,
          content: input.content,
        },
        include: {
          user: {
            select: {
              id: true,
              twitterUsername: true,
              twitterDisplayName: true,
              twitterImage: true,
              reputation: true,
            },
          },
        },
      });

      return comment;
    }),

  /**
   * Vote on a post
   */
  votePost: protectedProcedure
    .input(votePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { twitterId } = ctx.session.user;

      // Get user ID
      const user = await ctx.db.user.findUniqueOrThrow({
        where: { twitterId },
        select: { id: true },
      });

      // Check if post exists
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        select: { id: true, twitterId: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Prevent self-voting
      if (post.twitterId === twitterId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot vote on your own post",
        });
      }

      // Check if user already voted
      const existingVote = await ctx.db.vote.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId: input.postId,
          },
        },
      });

      if (existingVote) {
        // If same vote type, remove the vote
        if (existingVote.type === input.type) {
          await ctx.db.vote.delete({
            where: { id: existingVote.id },
          });
          return { action: "removed", type: input.type };
        } else {
          // Update to new vote type
          await ctx.db.vote.update({
            where: { id: existingVote.id },
            data: { type: input.type },
          });
          return { action: "updated", type: input.type };
        }
      } else {
        // Create new vote
        await ctx.db.vote.create({
          data: {
            userId: user.id,
            postId: input.postId,
            type: input.type,
          },
        });
        return { action: "created", type: input.type };
      }
    }),

  /**
   * Get user's vote on a post
   */
  getUserVote: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { twitterId } = ctx.session.user;

      const user = await ctx.db.user.findUniqueOrThrow({
        where: { twitterId },
        select: { id: true },
      });

      const vote = await ctx.db.vote.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId: input.postId,
          },
        },
        select: { type: true },
      });

      return vote?.type ?? null;
    }),
});
