"use client";

import { api } from "@/trpc/react";

export function useGetUser() {
  const utils = api.useUtils();

  const userQuery = api.user.getUser.useQuery();

  return {
    data: userQuery.data?.user,
    isLoading: userQuery.isLoading || userQuery.isPending,
    refresh: () => utils.user.getUser.invalidate(),
  };
}
