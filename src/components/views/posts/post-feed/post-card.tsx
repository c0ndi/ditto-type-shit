/**
 * Post Card Component - Created on 12/08/2025 17:00
 * Individual post display in the feed with user info and engagement
 */

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, User, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

interface PostCardProps {
  post: inferProcedureOutput<AppRouter["post"]["getTodaysPosts"]>[number];
}

export function PostCard({ post }: PostCardProps) {
  const netVotes = post.upvotes - post.downvotes;
  const engagementScore = post._count.votes + post._count.comments;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square">
          <Image
            src={post.imageUrl}
            alt="User submission"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={post.user.twitterImage ?? undefined}
                  alt={post.user.twitterDisplayName ?? "User"}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {post.user.twitterDisplayName ?? "Anonymous"}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{post.user.twitterUsername ?? "unknown"}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${netVotes > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium">{netVotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{post._count.comments}</span>
              </div>
              {post.rewardPoints > 0 && (
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{post.rewardPoints}</span>
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
              {post.sentiment > 0.7 && (
                <Badge variant="default" className="text-xs bg-green-600">
                  Popular
                </Badge>
              )}
            </div>
          </div>

          {/* User Reputation */}
          {post.user.reputation > 50 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Trophy className="h-3 w-3 text-yellow-500" />
              <span>Rep: {Math.round(post.user.reputation)}</span>
              <span>•</span>
              <span>{post.user.totalRewards} points earned</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
