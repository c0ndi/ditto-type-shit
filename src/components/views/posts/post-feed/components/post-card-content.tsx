/**
 * Post Card Content Component - Updated on 12/08/2025 23:56
 * Displays individual post content within the feed with interactive voting and blur placeholder images
 * Reads live data from tRPC cache to reflect optimistic updates in real-time
 */

"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, Heart, MessageCircle, Trophy, User } from "lucide-react";
import { type inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { usePostVoting } from "@/hooks/use-post-voting";
import Link from "next/link";
import { api } from "@/trpc/react";
import { PostBlurImage } from "@/components/shared/post-blur-image";

export function PostCardContent({ post }: { post: inferProcedureOutput<AppRouter["post"]["getTodaysPosts"]>[number] }) {
  const { upvote, downvote, isVoting, userVote } = usePostVoting({ postId: post.id });

  // Get live post data from cache to reflect optimistic updates
  const { data: livePostData } = api.post.getTodaysPosts.useQuery(undefined, {
    staleTime: 30 * 1000, // 30 seconds
  });

  // Find the current post in the live data, fallback to prop data
  const currentPost = livePostData?.find(p => p.id === post.id) ?? post;

  const netVotes = currentPost.upvotes - currentPost.downvotes;
  const engagementScore = currentPost._count.votes + currentPost._count.comments;

  function handleUpvote(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    void upvote();
  }
  function handleDownvote(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    void downvote();
  }

  return (
    <Link href={`/status/${post.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Image */}
          <PostBlurImage
            src={currentPost.imageUrl}
            blurDataUrl={currentPost.blurDataUrl}
            alt="User submission"
            containerClassName="aspect-square"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* User Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={currentPost.user.twitterImage ?? undefined}
                    alt={currentPost.user.twitterDisplayName ?? "User"}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {currentPost.user.twitterDisplayName ?? "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{currentPost.user.twitterUsername ?? "unknown"}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}
              </div>
            </div>

            {/* Voting and Engagement Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Voting buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={userVote === "UPVOTE" ? "default" : "ghost"}
                    size="sm"
                    onClick={handleUpvote}
                    disabled={isVoting}
                    className="h-8 px-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="ml-1 text-sm">{currentPost.upvotes}</span>
                  </Button>
                  <Button
                    variant={userVote === "DOWNVOTE" ? "destructive" : "ghost"}
                    size="sm"
                    onClick={handleDownvote}
                    disabled={isVoting}
                    className="h-8 px-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="ml-1 text-sm">{currentPost.downvotes}</span>
                  </Button>
                </div>

                {/* Other stats */}
                <div className="flex items-center gap-1">
                  <Heart className={`h-4 w-4 ${netVotes > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{netVotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{currentPost._count.comments}</span>
                </div>
                {currentPost.rewardPoints > 0 && (
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{currentPost.rewardPoints}</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                {engagementScore > 10 && (
                  <Badge variant="secondary" className="text-xs">
                    Hot
                  </Badge>
                )}
                {currentPost.sentiment > 0.7 && (
                  <Badge variant="default" className="text-xs bg-green-600">
                    Popular
                  </Badge>
                )}
              </div>
            </div>

            {/* User Reputation */}
            {currentPost.user.reputation > 50 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span>Rep: {Math.round(currentPost.user.reputation)}</span>
                <span>•</span>
                <span>{currentPost.user.totalRewards} points earned</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}