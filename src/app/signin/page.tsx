/**
 * Created on: Beautiful sign-in page with Twitter OAuth integration - 12/08/2025 16:00
 * Purpose: Attractive landing page for user authentication with Twitter
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/server/auth/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Twitter, Users, Trophy, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

async function SignInContent() {
  const session = await auth();

  // If already signed in, redirect to home
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sign In Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
                  <CardDescription className="text-base">
                    Sign in with Twitter to start your creative journey
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  <div className="space-y-4">
                    <form action={async () => {
                      "use server";
                      await signIn("twitter");
                    }}>

                      <Button
                        size="lg"
                        className="w-full h-12 text-base bg-[#1DA1F2] hover:bg-[#1a91da] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Twitter className="mr-3 h-5 w-5" />
                        Continue with Twitter
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground dark:bg-gray-800">
                          Why Twitter?
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                        <Twitter className="inline h-4 w-4 mr-1" />
                        We use Twitter for authentic user verification and to build a genuine creative community.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      By signing in, you agree to our{" "}
                      <Link href="/terms" className="underline hover:no-underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="underline hover:no-underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Join Ditto2?</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-lg shadow-lg">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Daily Creative Challenges</h3>
                      <p className="text-muted-foreground">
                        Get fresh, inspiring photo themes every day. Push your creative boundaries with unique prompts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-lg shadow-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Earn Rewards & Recognition</h3>
                      <p className="text-muted-foreground">
                        Get points for quality content and community engagement. Build your reputation as a creative photographer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-lg shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Vibrant Community</h3>
                      <p className="text-muted-foreground">
                        Connect with fellow photographers, vote on submissions, and discover amazing talent worldwide.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg shadow-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">AI-Powered Validation</h3>
                      <p className="text-muted-foreground">
                        Smart AI analysis combined with community feedback ensures fair and accurate content validation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Featured Benefits</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-green-500" />
                    One photo per day keeps you consistently creative
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-green-500" />
                    Build streaks and compete on leaderboards
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-green-500" />
                    Discover new photography techniques and styles
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-green-500" />
                    Free to join, rewarding to participate
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-12 w-12 mx-auto text-primary animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
