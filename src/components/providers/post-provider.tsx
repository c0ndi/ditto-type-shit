/**
 * Post Provider - Refactored on 12/08/2025 17:10
 * React Context provider that combines the custom hooks for better architecture
 */

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { type VoteType } from "@prisma/client";
import { type inferProcedureOutput } from "@trpc/server";

// Import our custom hooks
import { usePostDetails } from "@/hooks/use-post-details";
import { usePostVoting } from "@/hooks/use-post-voting";
import { usePostComments } from "@/hooks/use-post-comments";
import type { AppRouter } from "@/server/api/root";

interface PostContextValue {
  // Post data (from usePostDetails)
  post: ReturnType<typeof usePostDetails>["post"];
  isLoadingPost: boolean;
  postError: string | null;
  refetchPost: ReturnType<typeof usePostDetails>["refetch"];

  // Comments data (from usePostComments)
  comments: ReturnType<typeof usePostComments>["comments"];
  isLoadingComments: boolean;
  commentsError: string | null;
  hasMoreComments: boolean;
  isLoadingMoreComments: boolean;
  createComment: ReturnType<typeof usePostComments>["createComment"];
  isCreatingComment: boolean;
  createCommentError: string | null;
  loadMoreComments: ReturnType<typeof usePostComments>["loadMoreComments"];

  // Voting data (from usePostVoting)
  userVote: VoteType | null;
  isLoadingVote: boolean;
  isVoting: boolean;
  vote: ReturnType<typeof usePostVoting>["vote"];
  upvote: ReturnType<typeof usePostVoting>["upvote"];
  downvote: ReturnType<typeof usePostVoting>["downvote"];
  votingError: string | null;
}

const PostContext = createContext<PostContextValue | null>(null);

interface PostProviderProps {
  postId: string;
  children: React.ReactNode;
  initialPost: inferProcedureOutput<AppRouter["post"]["getById"]>;
  initialComments: inferProcedureOutput<AppRouter["post"]["getComments"]>;
  initialUserVote: inferProcedureOutput<AppRouter["post"]["getUserVote"]>;
}

export function PostProvider({ postId, children, initialPost, initialComments, initialUserVote }: PostProviderProps) {
  // Use our custom hooks
  const postDetails = usePostDetails({ postId, initialPost });
  const postVoting = usePostVoting({ postId, initialUserVote });
  const postComments = usePostComments({ postId, initialComments });

  // Combine all hook data into a single context value
  const contextValue = useMemo<PostContextValue>(() => ({
    // Post data
    post: postDetails.post,
    isLoadingPost: postDetails.isLoading,
    postError: postDetails.error,
    refetchPost: postDetails.refetch,

    // Comments data
    comments: postComments.comments,
    isLoadingComments: postComments.isLoading,
    commentsError: postComments.error,
    hasMoreComments: postComments.hasMoreComments,
    isLoadingMoreComments: postComments.isLoadingMore,
    createComment: postComments.createComment,
    isCreatingComment: postComments.isCreatingComment,
    createCommentError: postComments.createCommentError,
    loadMoreComments: postComments.loadMoreComments,

    // Voting data
    userVote: postVoting.userVote,
    isLoadingVote: postVoting.isLoadingVote,
    isVoting: postVoting.isVoting,
    vote: postVoting.vote,
    upvote: postVoting.upvote,
    downvote: postVoting.downvote,
    votingError: postVoting.error,
  }), [postDetails, postComments, postVoting]);

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
}