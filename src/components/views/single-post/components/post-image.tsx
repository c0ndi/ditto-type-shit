import Image from "next/image";
import type { Post } from "../types";

type Props = {
  post: Post;
}

export function PostImage({ post }: Props) {

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