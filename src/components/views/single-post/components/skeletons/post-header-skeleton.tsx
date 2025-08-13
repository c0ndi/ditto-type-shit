/**
 * Skeleton component for PostHeader
 * Created: [Date]
 * Matches the structure of PostHeader with loading placeholders
 */

import { CardHeader } from "@/components/ui/card";

export function PostHeaderSkeleton() {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />

          <div className="space-y-2">
            {/* Display name skeleton */}
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            {/* Username and timestamp skeleton */}
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Badge skeleton */}
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </CardHeader>
  );
}
