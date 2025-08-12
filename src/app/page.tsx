
/**
 * Updated on: Added post creation form with image upload functionality - 12/08/2025 15:40
 */

import { auth } from "@/server/auth/config";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Camera, Users, Trophy } from "lucide-react";
import { CreatePostForm } from "@/components/views/posts/create-post-form/create-post-form";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Daily Photo Challenge
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the community, share creative photos based on daily themes,
              and earn rewards through engagement and AI validation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <Camera className="h-12 w-12 mx-auto text-primary" />
              <h3 className="font-semibold">Daily Themes</h3>
              <p className="text-sm text-muted-foreground">
                New creative challenges every day
              </p>
            </div>
            <div className="text-center space-y-3">
              <Users className="h-12 w-12 mx-auto text-primary" />
              <h3 className="font-semibold">Community Voting</h3>
              <p className="text-sm text-muted-foreground">
                Vote on submissions and validate creativity
              </p>
            </div>
            <div className="text-center space-y-3">
              <Trophy className="h-12 w-12 mx-auto text-primary" />
              <h3 className="font-semibold">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Get points for quality content and engagement
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button asChild size="lg">
              <Link href="/api/auth/signin">
                <Camera className="mr-2 h-4 w-4" />
                Start Creating
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Sign in with Twitter to join the daily challenges
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Ready for today&apos;s photo challenge?
          </p>
        </div>

        <CreatePostForm
        />
      </div>
    </div>
  );
}
