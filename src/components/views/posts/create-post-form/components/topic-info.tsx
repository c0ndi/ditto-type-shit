/**
 * Topic Info Component - Created on 12/08/2025 16:52
 * Displays current topic information for photo challenge
 */

import { type Topic } from "@prisma/client";

interface TopicInfoProps {
  topic: Topic;
}

export function TopicInfo({ topic }: TopicInfoProps) {
  return (
    <div className="rounded-lg border p-4 bg-accent/50">
      <h2 className="font-semibold text-lg mb-2">Today&apos;s Challenge</h2>
      <h3 className="text-xl font-bold text-primary">{topic.title}</h3>
      {topic.description && (
        <p className="text-muted-foreground mt-2">{topic.description}</p>
      )}
    </div>
  );
}
