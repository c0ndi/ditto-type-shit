/**
 * Post Comments Hook - Created on 12/08/2025 17:08
 * Custom hook for managing post comments with pagination
 */

"use client";

import { useCallback, useMemo } from "react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import type { AppRouter } from "@/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";

interface UsePostCommentsProps {
  postId: string;
  limit?: number;
  initialComments?: inferProcedureOutput<AppRouter["post"]["getComments"]>;
}

export function usePostComments({
  postId,
  limit = 20,
  initialComments,
}: UsePostCommentsProps) {
  const { data: session } = useSession();
  const utils = api.useUtils();

  // Comments query with infinite pagination
  const {
    data: commentsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.post.getComments.useInfiniteQuery(
    { postId, limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!postId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      initialData: {
        pages: [initialComments ?? { comments: [], nextCursor: undefined }],
        pageParams: [undefined],
      },
    },
  );

  // Create comment mutation
  const createCommentMutation = api.post.createComment.useMutation({
    onMutate: async ({ content }) => {
      // Cancel outgoing refetches
      await utils.post.getComments.cancel({ postId });

      // Snapshot current data
      const previousComments = utils.post.getComments.getInfiniteData({
        postId,
      });

      // Optimistically add the new comment
      if (session?.user && previousComments) {
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          content,
          createdAt: new Date(),
          user: {
            id: "temp-user",
            twitterUsername: session.user.username || null,
            twitterDisplayName: session.user.name || null,
            twitterImage: session.user.profile_image_url || null,
            reputation: 0,
          },
        };

        const newData = {
          ...previousComments,
          pages: previousComments.pages.map((page, index) =>
            index === 0
              ? { ...page, comments: [optimisticComment, ...page.comments] }
              : page,
          ),
        };

        utils.post.getComments.setInfiniteData(
          { postId },
          newData as typeof previousComments,
        );
      }

      return { previousComments };
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousComments) {
        utils.post.getComments.setInfiniteData(
          { postId },
          context.previousComments,
        );
      }
    },
    onSuccess: () => {
      // Refetch to get the real comment with correct ID
      void utils.post.getComments.invalidate({ postId });
      void utils.post.getById.invalidate({ id: postId });
    },
  });

  // Flatten comments from all pages
  const comments = useMemo(() => {
    return commentsData?.pages.flatMap((page) => page.comments) ?? [];
  }, [commentsData]);

  const createComment = useCallback(
    async (content: string) => {
      if (!session) {
        throw new Error("Must be logged in to comment");
      }

      if (!content.trim()) {
        throw new Error("Comment cannot be empty");
      }

      return createCommentMutation.mutateAsync({
        postId,
        content: content.trim(),
      });
    },
    [postId, session, createCommentMutation],
  );

  const loadMoreComments = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    comments,
    isLoading,
    error: error?.message ?? null,
    hasMoreComments: hasNextPage ?? false,
    isLoadingMore: isFetchingNextPage,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
    createCommentError: createCommentMutation.error?.message ?? null,
    loadMoreComments,
  };
}
