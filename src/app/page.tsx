
/**
 * Updated on: Redesigned homepage with tech crypto aesthetic and improved UX - 12/09/2025
 */

import { auth } from "@/server/auth/config";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Camera, Users, Trophy, Zap, Brain, Target } from "lucide-react";
import { CreatePostForm } from "@/components/views/posts/create-post-form";
import { PostFeed } from "@/components/views/posts/post-feed/post-feed";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Mine Rewards Through Creativity
              </div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                <span className="gradient-text">DITTO</span>
              </h1>
              <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Daily photo challenges with{" "}
                <span className="text-primary font-medium">AI validation</span>{" "}
                and{" "}
                <span className="text-primary font-medium">community rewards</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="btn-tech h-14 px-8 text-lg rounded-2xl electric-gradient glow-effect">
                <Link href="/api/auth/signin">
                  <Camera className="mr-3 h-5 w-5" />
                  Start Mining
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Connect with <span className="text-primary font-medium">Twitter</span> to join
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-card tech-border rounded-3xl p-8 space-y-4 hover:glow-effect transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl electric-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Daily Challenges</h3>
              <p className="text-muted-foreground leading-relaxed">
                New creative themes every 24 hours. Fresh inspiration, endless possibilities.
              </p>
            </div>

            <div className="glass-card tech-border rounded-3xl p-8 space-y-4 hover:glow-effect transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl electric-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">AI Validation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI analyzes creativity and theme relevance for fair rewards.
              </p>
            </div>

            <div className="glass-card tech-border rounded-3xl p-8 space-y-4 hover:glow-effect transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl electric-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Earn Rewards</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quality content + community engagement = valuable reward points.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="glass-card tech-border rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">24h</div>
                <div className="text-sm text-muted-foreground">Challenge Cycle</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">1</div>
                <div className="text-sm text-muted-foreground">Photo Per Day</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Creativity</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">🏆</div>
                <div className="text-sm text-muted-foreground">Fair Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
