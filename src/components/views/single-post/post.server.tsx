
import { PostProvider } from "@/components/providers";
import { api } from "@/trpc/server";
import { PostViewClient } from "./post.client";
import { PostNotFound } from "./components/post-not-found";

export async function PostViewServer({ postId }: { postId: string }) {
  const post = await api.post.getById({ id: postId });
  const comments = await api.post.getComments({ postId: postId });
  const userVote = await api.post.getUserVote({ postId: postId });

  if (!post) {
    return <PostNotFound postError="Post not found" />;
  }

  return (
    <PostProvider postId={postId} initialPost={post} initialComments={comments} initialUserVote={userVote}>
      <PostViewClient />
    </PostProvider>
  );
}