import { api } from "@/trpc/server";
import { PostViewClient } from "../post.client";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import { PostProvider } from "@/components/providers";

type Props = {
  postId: string;
  initialPost: inferProcedureOutput<AppRouter["post"]["getById"]>;
}

export async function InteractionsServer({ postId, initialPost }: Props) {
  const comments = await api.post.getComments({ postId: postId });
  const userVote = await api.post.getUserVote({ postId: postId });

  return (
    <PostProvider postId={postId} initialPost={initialPost} initialComments={comments} initialUserVote={userVote}>
      <PostViewClient />
    </PostProvider>
  )
}