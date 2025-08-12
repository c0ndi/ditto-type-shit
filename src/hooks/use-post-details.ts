/**
 * Post Details Hook - Created on 12/08/2025 17:08
 * Custom hook for fetching individual post details
 */

"use client";

import type { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { type inferProcedureOutput } from "@trpc/server";
interface UsePostDetailsProps {
  postId: string;
  initialPost?: inferProcedureOutput<AppRouter["post"]["getById"]>;
}

export function usePostDetails({ postId, initialPost }: UsePostDetailsProps) {
  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = api.post.getById.useQuery(
    { id: postId },
    {
      enabled: !!postId,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      initialData: initialPost,
      refetchOnWindowFocus: false,
    },
  );

  return {
    post: post ?? null,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
}
