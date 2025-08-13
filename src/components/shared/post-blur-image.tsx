/**
 * Updated on: Migrated from BlurHash to Plaiceholder - 13/08/2025 10:55
 * Purpose: Progressive loading for post images using Next.js Image blur properties with plaiceholder
 */

"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface PostBlurImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  /**
   * The base64 blur data URL for the image (from post.blurDataUrl)
   * Used directly with Next.js Image component's blurDataURL prop
   */
  blurDataUrl: string | null;
  /**
   * Additional className for the image container
   */
  containerClassName?: string;
}

/**
 * Progressive loading image component for post images with plaiceholder blur placeholders
 * 
 * Usage:
 * ```tsx
 * <PostBlurImage
 *   src={post.imageUrl}
 *   blurDataUrl={post.blurDataUrl}
 *   alt="Post image"
 *   fill
 *   className="object-cover"
 * />
 * ```
 */
export function PostBlurImage({
  blurDataUrl,
  containerClassName,
  className,
  ...props
}: PostBlurImageProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        {...props}
        alt={props.alt || ""}
        className={cn("transition-opacity duration-500", className)}
        placeholder={blurDataUrl ? "blur" : "empty"}
        blurDataURL={blurDataUrl || undefined}
      />
    </div>
  );
}

/**
 * Utility function to preload post images
 * Useful for prefetching post images that will be displayed soon
 */
export function preloadPostImage(imageUrl: string) {
  // Create a hidden image to trigger browser preloading
  const img = new window.Image();
  img.src = imageUrl;
}