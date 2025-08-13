/**
 * Updated on: Enhanced user router with comprehensive profile data - 12/08/2025 16:05
 * Purpose: Complete user profile information including stats, posts, and achievements
 */

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getUser } from "@/server/auth/utils/get-user";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  /**
   * Get current user basic info
   */
  getUser: protectedProcedure.query(async ({ ctx: _ctx }) => {
    const user = await getUser();

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found in getUser procedure.",
      });
    }

    return {
      user,
    };
  }),

  /**
   * Get comprehensive user profile with stats and recent activity
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { twitterId } = ctx.session.user;

    const user = await ctx.db.user.findUnique({
      where: { twitterId },
      include: {
        stats: true,
        posts: {
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
          take: 10, // Recent posts
        },
        userWallets: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            posts: true,
            votes: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User profile not found.",
      });
    }

    return user;
  }),

  /**
   * Get user statistics summary
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { twitterId } = ctx.session.user;

    const user = await ctx.db.user.findUnique({
      where: { twitterId },
      include: {
        stats: true,
        _count: {
          select: {
            posts: true,
            votes: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    // Calculate additional stats
    const totalEngagement =
      (user.stats?.totalLikes ?? 0) + (user.stats?.totalComments ?? 0);
    const engagementRate =
      user._count.posts > 0 ? totalEngagement / user._count.posts : 0;

    // Calculate rank based on total rewards (simplified ranking)
    const rank =
      (await ctx.db.user.count({
        where: {
          totalRewards: {
            gt: user.totalRewards,
          },
        },
      })) + 1;

    return {
      ...user,
      calculatedStats: {
        totalEngagement,
        engagementRate: Math.round(engagementRate * 100) / 100,
        rank,
      },
    };
  }),

  /**
   * Get user's posting streak and activity
   */
  getActivity: protectedProcedure.query(async ({ ctx }) => {
    const { twitterId } = ctx.session.user;

    const user = await ctx.db.user.findUnique({
      where: { twitterId },
      include: {
        stats: true,
        posts: {
          include: {
            topic: {
              select: {
                title: true,
                date: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 30, // Last 30 posts for activity analysis
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    // Calculate activity metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentPosts = user.posts.filter(
      (post) => new Date(post.createdAt) >= thirtyDaysAgo,
    );

    const averageUpvotes =
      recentPosts.length > 0
        ? recentPosts.reduce((sum, post) => sum + post._count.votes, 0) /
          recentPosts.length
        : 0;

    const bestPost =
      user.posts.length > 0
        ? user.posts.reduce((best, current) =>
            current._count.votes > best._count.votes ? current : best,
          )
        : null;

    return {
      stats: user.stats,
      recentActivity: {
        postsLast30Days: recentPosts.length,
        averageUpvotes: Math.round(averageUpvotes * 100) / 100,
        bestPost,
        currentStreak: user.stats?.consecutiveDays ?? 0,
        longestStreak: user.stats?.longestStreak ?? 0,
      },
    };
  }),

  /**
   * Get public user profile by ID (for viewing other users)
   */
  getPublicProfile: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          stats: true,
          posts: {
            where: {
              // Only show posts if user is not anonymous or if viewing own profile
              OR: [
                { user: { isAnonymous: false } },
                // Add session check here if needed
              ],
            },
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
            take: 12, // Public posts display
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found.",
        });
      }

      // Don't expose sensitive information for public profiles
      const publicUser = {
        id: user.id,
        twitterUsername: user.isAnonymous ? null : user.twitterUsername,
        twitterDisplayName: user.isAnonymous
          ? "Anonymous User"
          : user.twitterDisplayName,
        twitterImage: user.isAnonymous ? null : user.twitterImage,
        isAnonymous: user.isAnonymous,
        totalRewards: user.totalRewards,
        reputation: user.reputation,
        posts: user.posts,
        stats: user.stats
          ? {
              totalPosts: user.stats.totalPosts,
              totalLikes: user.stats.totalLikes,
              totalViews: user.stats.totalViews,
              consecutiveDays: user.stats.consecutiveDays,
              longestStreak: user.stats.longestStreak,
              topThreeFinishes: user.stats.topThreeFinishes,
            }
          : null,
        _count: user._count,
      };

      return publicUser;
    }),

  /**
   * Delete current user and all related data (for testing purposes)
   */
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const { twitterId } = ctx.session.user;

    const user = await ctx.db.user.findUnique({
      where: { twitterId },
      select: { id: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    // Delete all user-related data in the correct order (due to foreign key constraints)
    try {
      // Delete votes made by the user
      await ctx.db.vote.deleteMany({
        where: { user: { twitterId } },
      });

      // Delete comments made by the user
      await ctx.db.comment.deleteMany({
        where: { user: { twitterId } },
      });

      // Delete post views related to the user
      await ctx.db.postView.deleteMany({
        where: { userId: user.id },
      });

      // Delete reward transactions
      await ctx.db.rewardTransaction.deleteMany({
        where: { userId: user.id },
      });

      // Delete votes on user's posts
      await ctx.db.vote.deleteMany({
        where: { post: { user: { twitterId } } },
      });

      // Delete comments on user's posts
      await ctx.db.comment.deleteMany({
        where: { post: { user: { twitterId } } },
      });

      // Delete user's posts
      await ctx.db.post.deleteMany({
        where: { user: { twitterId } },
      });

      // Delete user stats
      await ctx.db.stats.deleteMany({
        where: { userId: user.id },
      });

      // Delete user wallets
      await ctx.db.userWallet.deleteMany({
        where: { userId: user.id },
      });

      // Finally, delete the user
      await ctx.db.user.delete({
        where: { twitterId },
      });

      return {
        success: true,
        message: "User account and all related data deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete user account",
      });
    }
  }),
});
