

"use client";

import { usePost } from "@/components/providers";
import { Card } from "@/components/ui/card";
import { PostActions } from "./components/post-actions";
import { PostComments } from "./components/post-comments";
import { PostLoading } from "./components/post-loading";
import { PostNotFound } from "./components/post-not-found";

export function PostViewClient() {
  const { post, isLoadingPost, postError } = usePost();

  if (isLoadingPost) {
    return "TEGO NIE POWINNO BYC W OGOLE"
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


