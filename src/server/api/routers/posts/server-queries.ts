/**
 * Server-side Post Queries - Created on 12/08/2025 16:52
 * Functions for server-side data fetching to avoid client-side loading states
 */

import { db } from "@/server/db";
import { type Session } from "next-auth";

export async function getActiveTopicWithPostStatus(session: Session | null) {
  const activeTopic = await db.topic.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!activeTopic || !session?.user?.twitterId) {
    return {
      topic: activeTopic,
      hasPosted: false,
    };
  }

  const existingPost = await db.post.findUnique({
    where: {
      twitterId_topicId: {
        twitterId: session.user.twitterId,
        topicId: activeTopic.id,
      },
    },
    select: { id: true },
  });

  return {
    topic: activeTopic,
    hasPosted: !!existingPost,
  };
}

export async function hasUserPostedForTopic(
  topicId: string,
  twitterId: string,
) {
  const post = await db.post.findUnique({
    where: {
      twitterId_topicId: {
        twitterId,
        topicId,
      },
    },
    select: { id: true },
  });

  return !!post;
}
