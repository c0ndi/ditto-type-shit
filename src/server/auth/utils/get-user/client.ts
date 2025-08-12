"use client";

import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

export function useGetUser() {
  const session = useSession();
  const utils = api.useUtils();

  const userQuery = api.user.getUser.useQuery(undefined, {
    enabled: !!session.data?.user,
  });

  return {
    data: userQuery.data?.user,
    isLoading: userQuery.isLoading || userQuery.isPending,
    refresh: () => utils.user.getUser.invalidate(),
  };
}
