import { db } from "@/server/db";

type Args = {
  twitterId: string;
  twitterUsername: string | null;
  twitterImage: string | null;
  twitterDisplayName: string | null;
};
export async function createUser(args: Args): Promise<{ success: boolean }> {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        twitterId: args.twitterId,
      },
    });

    if (existingUser) {
      return {
        success: true,
      };
    }

    await db.user.create({
      data: {
        twitterId: args.twitterId,
        twitterUsername: args.twitterUsername,
        twitterImage: args.twitterImage,
        twitterDisplayName: args.twitterDisplayName,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
    };
  }
}
