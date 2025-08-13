/**
 * Post Card Component - Updated on 12/09/2025
 * Individual post display with tech crypto aesthetic, glassmorphism effects, and enhanced visual hierarchy
 */

import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, User, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PostBlurImage } from "@/components/shared/post-blur-image";
import { type inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

interface PostCardProps {
  post: inferProcedureOutput<AppRouter["post"]["getTodaysPosts"]>[number];
}

export function PostCard({ post }: PostCardProps) {
  const netVotes = post.upvotes - post.downvotes;
  const engagementScore = post._count.votes + post._count.comments;

  return (
    <Card className="glass-card tech-border rounded-3xl overflow-hidden hover:glow-effect transition-all duration-500 group">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative">
          <PostBlurImage
            src={post.imageUrl}
            blurDataUrl={post.blurDataUrl}
            alt="User submission"
            containerClassName="aspect-square"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {engagementScore > 10 && (
              <Badge className="bg-primary/80 backdrop-blur-sm border-primary/30 text-white text-xs">
                🔥 Hot
              </Badge>
            )}
            {post.sentiment > 0.7 && (
              <Badge className="bg-green-500/80 backdrop-blur-sm border-green-400/30 text-white text-xs">
                ⭐ Popular
              </Badge>
            )}
          </div>

          {/* Rewards Indicator */}
          {post.rewardPoints > 0 && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-yellow-500/80 backdrop-blur-sm border border-yellow-400/30 rounded-full px-3 py-1">
                <Trophy className="h-3 w-3 text-white" />
                <span className="text-xs font-bold text-white">{post.rewardPoints}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage
                  src={post.user.twitterImage ?? undefined}
                  alt={post.user.twitterDisplayName ?? "User"}
                />
                <AvatarFallback className="bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {post.user.twitterDisplayName ?? "Anonymous"}
                </span>
                <span className="text-sm text-muted-foreground">
                  @{post.user.twitterUsername ?? "unknown"}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${netVotes > 0 ? "bg-red-500/10 text-red-400" : "bg-muted/50 text-muted-foreground"}`}>
                  <Heart className="h-4 w-4" />
                </div>
                <span className="font-semibold">{netVotes}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-400">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span className="font-semibold">{post._count.comments}</span>
              </div>
            </div>
          </div>

          {/* User Reputation */}
          {post.user.reputation > 50 && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="p-1 rounded-full bg-yellow-500/20">
                <Trophy className="h-3 w-3 text-yellow-400" />
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Rep: {Math.round(post.user.reputation)}</span>
                <span className="mx-2">•</span>
                <span>{post.user.totalRewards} points earned</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
