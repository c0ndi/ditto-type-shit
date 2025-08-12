import Image from "next/image";
import { usePost } from "@/components/providers";

export function PostImage() {
  const { post } = usePost();

  if (!post) return null;

  return (
    <div className="relative aspect-square">
      <Image
        src={post.imageUrl}
        alt="Post content"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 600px"
      />
    </div>
  );
}