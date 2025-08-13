/**
 * Create Post Form - Updated on 12/08/2025 17:05
 * Server component that uses tRPC procedure for post status checking
 */

import { api } from "@/trpc/server";

// Import sub-components
import { TopicInfo } from "./components/topic-info";
import { CreatePostFormClient } from "./form.client";
import { AlreadyPostedMessage, NoActiveTopicMessage } from "./components/post-status-messages";

interface CreatePostFormProps {
  className?: string;
}

export async function CreatePostForm({ className }: CreatePostFormProps) {
  const { topic, hasPosted } = await api.post.getActiveTopicWithPostStatus();

  // If user has already posted today
  if (hasPosted) {
    return <AlreadyPostedMessage className={className} />;
  }

  // If no active topic
  if (!topic) {
    return <NoActiveTopicMessage className={className} />;
  }

  return (
    <div className={`space-y-8 p-8 ${className}`}>
      {/* Topic Info */}
      <TopicInfo topic={topic} />

      {/* Form */}
      <CreatePostFormClient topic={topic} />
    </div>
  );
}

