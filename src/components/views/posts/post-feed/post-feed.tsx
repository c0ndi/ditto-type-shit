/**
 * Post Feed Component - Updated on 12/08/2025 17:05
 * Server component that displays today's posts using tRPC procedure
 */

import { api } from "@/trpc/server";
import { Camera, Users } from "lucide-react";
import { PostCardContent } from "./components/post-card-content";

export async function PostFeed() {
  const posts = await api.post.getTodaysPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No posts yet today</h3>
        <p className="text-muted-foreground">
          Be the first to share a photo for today&apos;s challenge!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Today&apos;s Submissions</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <PostCardContent key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
