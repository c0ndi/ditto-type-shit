import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/server/auth/utils/get-user";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
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
});
