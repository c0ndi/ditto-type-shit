/**
 * Created on: Post Image component with react-blurhash - 12/09/2025 00:08
 * Purpose: Progressive loading for post images using react-blurhash component
 */

"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Blurhash } from "react-blurhash";
import { cn } from "@/lib/utils";

interface PostBlurImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  /**
   * The BlurHash string for the image (from post.blurHash)
   * Used to render the blur placeholder using react-blurhash
   */
  blurHash?: string;
  /**
   * Additional className for the image container
   */
  containerClassName?: string;
  /**
   * Whether to show a loading overlay while the main image loads
   */
  showLoadingOverlay?: boolean;
}

/**
 * Progressive loading image component for post images with BlurHash placeholders
 * 
 * Usage:
 * ```tsx
 * <PostBlurImage
 *   src={post.imageUrl}
 *   blurHash={post.blurHash}
 *   alt="Post image"
 *   fill
 *   className="object-cover"
 * />
 * ```
 */
export function PostBlurImage({
  blurHash,
  containerClassName,
  showLoadingOverlay = true,
  className,
  onLoad,
  ...props
}: PostBlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    onLoad?.(event);
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* BlurHash placeholder - renders immediately if available */}
      {blurHash && isLoading && (
        <div className="absolute inset-0">
          <Blurhash
            hash={blurHash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      )}

      {/* Main image */}
      <Image
        {...props}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
      />

      {/* Optional loading overlay */}
      {showLoadingOverlay && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
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