/**
 * Combined skeleton component for PostHeader and PostImage
 * Created: [Date]
 * Provides loading state for the main content area
 */

import { CardHeader } from "@/components/ui/card";

export function ContentSkeleton() {
  return (
    <div className="max-w-sm mx-auto my-12">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />

            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </CardHeader>
      <div className="relative aspect-square bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading image...</div>
        </div>
      </div>
    </div>
  );
} 