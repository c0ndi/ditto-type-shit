

"use client";

import { usePost } from "@/components/providers";
import { Card } from "@/components/ui/card";
import { PostActions } from "./components/ui/post-actions";
import { PostComments } from "./components/ui/post-comments";
import { PostLoading } from "./components/ui/post-loading";
import { PostNotFound } from "./components/ui/post-not-found";

export function PostViewClient() {
  const { post, isLoadingPost, postError } = usePost();

  if (isLoadingPost) {
    return <PostLoading />;
  }

  if (postError || !post) {
    return <PostNotFound postError={postError} />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <PostActions post={post} />
      <PostComments post={post} />
    </Card>
  );
}


