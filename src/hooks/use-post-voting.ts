/**
 * Post Voting Hook - Created on 12/08/2025 17:08
 * Custom hook for post voting with optimistic updates
 */

"use client";

import { useCallback } from "react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { type VoteType } from "@prisma/client";
import type { AppRouter } from "@/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";

interface UsePostVotingProps {
  postId: string;
  initialUserVote?: inferProcedureOutput<AppRouter["post"]["getUserVote"]>;
}

export function usePostVoting({ postId, initialUserVote }: UsePostVotingProps) {
  const { data: session } = useSession();
  const utils = api.useUtils();

  // Get user's current vote
  const { data: userVote, isLoading: isLoadingVote } =
    api.post.getUserVote.useQuery(
      { postId },
      {
        enabled: !!session && !!postId,
        staleTime: 30 * 1000, // 30 seconds
        initialData: initialUserVote,
      },
    );

  // Vote mutation with optimistic updates
  const voteMutation = api.post.votePost.useMutation({
    onMutate: async ({ type }) => {
      // Cancel outgoing refetches
      await utils.post.getUserVote.cancel({ postId });
      await utils.post.getById.cancel({ id: postId });

      const previousVote = utils.post.getUserVote.getData({ postId });
      const previousPost = utils.post.getById.getData({ id: postId });
      const previousTodaysPosts = utils.post.getTodaysPosts.getData();

      // Calculate vote changes
      const newVote = type === previousVote ? null : type;

      // Optimistically update the user vote
      utils.post.getUserVote.setData({ postId }, newVote);

      // Optimistically update post vote counts
      if (previousPost) {
        const updatedPost = { ...previousPost };

        // Remove previous vote
        if (previousVote === "UPVOTE") {
          updatedPost.upvotes = Math.max(0, updatedPost.upvotes - 1);
        } else if (previousVote === "DOWNVOTE") {
          updatedPost.downvotes = Math.max(0, updatedPost.downvotes - 1);
        }

        // Add new vote
        if (newVote === "UPVOTE") {
          updatedPost.upvotes = updatedPost.upvotes + 1;
        } else if (newVote === "DOWNVOTE") {
          updatedPost.downvotes = updatedPost.downvotes + 1;
        }

        utils.post.getById.setData({ id: postId }, updatedPost);
      }

      // Also update the post in the today's posts feed
      if (previousTodaysPosts) {
        const updatedTodaysPosts = previousTodaysPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                upvotes: post.upvotes + (newVote === "UPVOTE" ? 1 : 0),
                downvotes: post.downvotes + (newVote === "DOWNVOTE" ? 1 : 0),
              }
            : post,
        );
        utils.post.getTodaysPosts.setData(undefined, updatedTodaysPosts);
      }

      return { previousVote, previousPost, previousTodaysPosts };
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousVote !== undefined) {
        utils.post.getUserVote.setData({ postId }, context.previousVote);
      }
      if (context?.previousPost) {
        utils.post.getById.setData({ id: postId }, context.previousPost);
      }
      if (context?.previousTodaysPosts) {
        utils.post.getTodaysPosts.setData(
          undefined,
          context.previousTodaysPosts,
        );
      }
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      void utils.post.getUserVote.invalidate({ postId });
      void utils.post.getById.invalidate({ id: postId });
      void utils.post.getTodaysPosts.invalidate();
    },
  });

  const vote = useCallback(
    async (type: VoteType) => {
      if (!session) {
        throw new Error("Must be logged in to vote");
      }

      return voteMutation.mutateAsync({ postId, type });
    },
    [postId, session, voteMutation],
  );

  const upvote = useCallback(() => vote("UPVOTE"), [vote]);
  const downvote = useCallback(() => vote("DOWNVOTE"), [vote]);

  return {
    userVote: userVote ?? null,
    isLoadingVote,
    isVoting: voteMutation.isPending,
    vote,
    upvote,
    downvote,
    error: voteMutation.error?.message ?? null,
  };
}
