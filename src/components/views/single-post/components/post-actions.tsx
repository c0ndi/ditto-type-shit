import { usePostVoting } from "@/hooks";
import { usePost } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, MessageCircle, Heart } from "lucide-react";

type Props = {
  postId: string;
}

export function PostActions({ postId }: Props) {
  const { userVote, isVoting, upvote, downvote } = usePostVoting({ postId });
  const { post } = usePost();

  if (!post) return null;

  const netVotes = post.upvotes - post.downvotes;

  return (
    <CardContent className="pt-3 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Upvote */}
          <Button
            variant={userVote === "UPVOTE" ? "default" : "ghost"}
            size="sm"
            onClick={() => upvote()}
            disabled={isVoting}
            className="flex items-center gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.upvotes}</span>
          </Button>

          {/* Downvote */}
          <Button
            variant={userVote === "DOWNVOTE" ? "destructive" : "ghost"}
            size="sm"
            onClick={() => downvote()}
            disabled={isVoting}
            className="flex items-center gap-1"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{post.downvotes}</span>
          </Button>

          {/* Comments count */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{post._count.comments}</span>
          </div>
        </div>

        {/* Net score */}
        <div className="flex items-center gap-1">
          <Heart className={`h-4 w-4 ${netVotes > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          <span className="font-medium">{netVotes}</span>
        </div>
      </div>
    </CardContent>
  );
}