import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { PostHeader } from "../components/post-header";
import { PostImage } from "../components/post-image";
import { Suspense } from "react";
import { SecondLoadServer } from "./second-load.server";

export async function FirstLoadServer({ postId }: { postId: string }) {
  const post = await api.post.getById({ id: postId });

  if (!post) {
    redirect("/")
  }

  return (
    <div>
      <PostHeader post={post} />
      <PostImage post={post} />

      <div className="w-full">
        <Suspense fallback={<div>Loading second load...</div>}>
          <SecondLoadServer postId={postId} initialPost={post} />
        </Suspense>
      </div>
    </div>
  )
}