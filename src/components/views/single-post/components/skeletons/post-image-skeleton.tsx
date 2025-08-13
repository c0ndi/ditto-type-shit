/**
 * Skeleton component for PostImage
 * Created: [Date]
 * Matches the aspect ratio and structure of PostImage with loading placeholder
 */

export function PostImageSkeleton() {
  return (
    <div className="relative aspect-square bg-gray-200 animate-pulse">
      {/* Optional: Add a subtle loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading image...</div>
      </div>
    </div>
  );
}
