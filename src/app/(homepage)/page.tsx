
/**
 * Updated on: Redesigned homepage with tech crypto aesthetic and improved UX - 12/09/2025
 */

import { CreatePostForm } from "@/components/views/posts/create-post-form";
import { PostFeed } from "@/components/views/posts/post-feed/post-feed";
import { auth } from "@/server/auth/config";
import { Zap } from "lucide-react";
import { Homepage } from "./_components";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <Homepage />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header and Create Post Section */}
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Ready to Mine
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Welcome back!</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready for today&apos;s creative challenge?
            </p>
          </div>

          <div className="glass-card tech-border rounded-3xl overflow-hidden">
            <CreatePostForm />
          </div>
        </div>

        {/* Feed Section */}
        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Today&apos;s Submissions</h2>
            <p className="text-muted-foreground">
              See what the community is creating
            </p>
          </div>
          <PostFeed />
        </div>
      </div>
    </div>
  );
}
