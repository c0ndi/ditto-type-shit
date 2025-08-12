/**
 * Create Post Form - Refactored on 12/08/2025 16:52
 * Server component that handles post status checking without client-side loading states
 */

import { auth } from "@/server/auth/config";
import { getActiveTopicWithPostStatus } from "@/server/api/routers/posts/server-queries";

// Import sub-components
import { TopicInfo } from "./components/topic-info";
import { CreatePostFormClient } from "./form.client";
import { AlreadyPostedMessage, NoActiveTopicMessage } from "./components/post-status-messages";

interface CreatePostFormProps {
  className?: string;
}

export async function CreatePostForm({ className }: CreatePostFormProps) {
  const session = await auth();
  const { topic, hasPosted } = await getActiveTopicWithPostStatus(session);

  // If user has already posted today
  if (hasPosted) {
    return <AlreadyPostedMessage className={className} />;
  }

  // If no active topic
  if (!topic) {
    return <NoActiveTopicMessage className={className} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Topic Info */}
      <TopicInfo topic={topic} />

      {/* Form */}
      <CreatePostFormClient topic={topic} />
    </div>
  );
}

