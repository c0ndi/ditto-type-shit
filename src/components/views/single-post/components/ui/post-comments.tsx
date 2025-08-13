import { usePostComments } from "@/hooks";
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "../../types";

type Props = {
  post: Post;
}

export function PostComments({ post }: Props) {
  const [newComment, setNewComment] = useState("");
  const {
    comments,
    isLoading,
    createComment,
    isCreatingComment,
    loadMoreComments,
    hasMoreComments,
    isLoadingMore,
  } = usePostComments({ postId: post.id });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <CardContent className="pt-0">
      <div className="border-t pt-4 space-y-4">
        {/* Comment input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isCreatingComment}
            size="sm"
          >
            {isCreatingComment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Comments list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-muted rounded w-24" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user.twitterImage ?? undefined}
                    alt={comment.user.twitterDisplayName ?? "User"}
                  />
                  <AvatarFallback>
                    {comment.user.twitterDisplayName?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.user.twitterDisplayName ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}

            {/* Load more button */}
            {hasMoreComments && (
              <Button
                variant="ghost"
                onClick={loadMoreComments}
                disabled={isLoadingMore}
                className="w-full"
              >
                {isLoadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Load more comments
              </Button>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
}