import { PageLoader } from "@/components/shared/page-loader";
import { PostViewServer } from "@/components/views/single-post/post.server";
import { Suspense } from "react";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<PageLoader />} key={id}>
      <PostViewServer postId={id} />
    </Suspense>
  );
}