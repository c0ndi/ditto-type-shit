import { db } from "@/server/db";
import { auth } from "../config";

export async function getUser() {
  const session = await auth();

  const user = await db.user.findUnique({
    where: {
      twitterId: session?.user?.id,
    },
  });

  return user;
}
