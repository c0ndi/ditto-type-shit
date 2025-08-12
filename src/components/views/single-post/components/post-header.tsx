
import { CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "../types";

type Props = {
  post: Post;
}

export function PostHeader({ post }: Props) {

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.user.twitterImage ?? undefined}
              alt={post.user.twitterDisplayName ?? "User"}
            />
            <AvatarFallback>
              {post.user.twitterDisplayName?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.user.twitterDisplayName ?? "Anonymous"}</p>
            <p className="text-sm text-muted-foreground">
              @{post.user.twitterUsername ?? "unknown"} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Badge variant="outline">{post.topic.title}</Badge>
      </div>
    </CardHeader>
  );
}