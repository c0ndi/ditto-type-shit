import { PostViewServer } from "@/components/views/single-post/post.server";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PostViewServer postId={id} />
  );
}