import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { PostHeader } from "./components/ui/post-header";
import { PostImage } from "./components/ui/post-image";
import { Suspense } from "react";
import { InteractionsServer } from "./components/interactions.server";
import { InteractionsSkeleton } from "./components/skeletons/interactions-skeleton";

export async function PostViewServer({ postId }: { postId: string }) {
  const post = await api.post.getById({ id: postId });

  if (!post) {
    redirect("/")
  }

  return (
    <div className="max-w-sm mx-auto my-12">
      <PostHeader post={post} />
      <PostImage post={post} />

      <div className="w-full">
        <Suspense fallback={<InteractionsSkeleton />}>
          <InteractionsServer postId={postId} initialPost={post} />
        </Suspense>
      </div>
    </div>
  )
}