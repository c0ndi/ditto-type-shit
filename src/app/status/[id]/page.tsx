import { PostViewServer } from "@/components/views/single-post/post.server";
import { ContentSkeleton } from "@/components/views/single-post/components/skeletons/content-skeleton";
import { Suspense } from "react";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<ContentSkeleton />} key={id}>
      <PostViewServer postId={id} />
    </Suspense>
  );
}