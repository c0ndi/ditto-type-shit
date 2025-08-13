/**
 * Updated on: Added BlurImage support for progressive loading - 12/08/2025 23:55
 * Purpose: Single post image display with blur placeholder
 */

import { PostBlurImage } from "@/components/shared/post-blur-image";
import type { Post } from "../../types";

type Props = {
  post: Post;
}

export function PostImage({ post }: Props) {
  return (
    <PostBlurImage
      src={post.imageUrl}
      blurHash={post.blurHash}
      alt="Post content"
      fill
      className="object-cover"
      containerClassName="aspect-square"
      sizes="(max-width: 768px) 100vw, 600px"
    />
  );
}