/**
 * Post Interaction Example - Created on 12/08/2025 17:11
 * Example showing how to use the refactored PostProvider and hooks
 */

"use client";

import { PostProvider, usePost } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useState } from "react";

interface PostInteractionExampleProps {
  postId: string;
}

// Main component wrapped with PostProvider
export function PostInteractionExample({ postId }: PostInteractionExampleProps) {
  return (
    <PostProvider postId={postId}>
      <PostContent />
    </PostProvider>
  );
}

// Content component that uses the composed hooks via context
function PostContent() {
  const [newComment, setNewComment] = useState("");

  // All post functionality is available through the usePost hook
  const {
    // Post data
    post,
    isLoadingPost,
    postError,

    // Voting
    userVote,
    upvote,
    downvote,
    isVoting,

    // Comments
    comments,
    createComment,
    isCreatingComment,
    loadMoreComments,
    hasMoreComments,
  } = usePost();

  if (isLoadingPost) return <div>Loading post...</div>;
  if (postError || !post) return <div>Error: {postError}</div>;

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Post info */}
      <div>
        <h3 className="font-semibold">{post.topic.title}</h3>
        <p className="text-sm text-muted-foreground">
          by @{post.user.twitterUsername}
        </p>
      </div>

      {/* Voting buttons */}
      <div className="flex gap-2">
        <Button
          variant={userVote === "UPVOTE" ? "default" : "outline"}
          size="sm"
          onClick={() => upvote()}
          disabled={isVoting}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          {post.upvotes}
        </Button>

        <Button
          variant={userVote === "DOWNVOTE" ? "destructive" : "outline"}
          size="sm"
          onClick={() => downvote()}
          disabled={isVoting}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          {post.downvotes}
        </Button>
      </div>

      {/* Comments section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{comments.length} comments</span>
        </div>

        {/* Add comment */}
        <div className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[60px]"
          />
          <Button
            onClick={handleCreateComment}
            disabled={!newComment.trim() || isCreatingComment}
          >
            {isCreatingComment ? "Posting..." : "Post"}
          </Button>
        </div>

        {/* Comments list */}
        <div className="space-y-2">
          {comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="p-2 bg-muted rounded text-sm">
              <div className="font-medium">@{comment.user.twitterUsername}</div>
              <div>{comment.content}</div>
            </div>
          ))}

          {hasMoreComments && (
            <Button variant="outline" size="sm" onClick={() => loadMoreComments()}>
              Load more comments
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
