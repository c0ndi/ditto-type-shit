/**
 * Post Status Messages Component - Created on 12/08/2025 16:52
 * Displays different status messages for posting states
 */

import { Camera } from "lucide-react";

interface PostStatusMessagesProps {
  className?: string;
}

export function AlreadyPostedMessage({ className }: PostStatusMessagesProps) {
  return (
    <div className={`rounded-lg border bg-muted p-6 text-center ${className}`}>
      <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">You&apos;ve already posted today!</h3>
      <p className="text-muted-foreground">
        Come back tomorrow for the next daily challenge.
      </p>
    </div>
  );
}

export function NoActiveTopicMessage({ className }: PostStatusMessagesProps) {
  return (
    <div className={`rounded-lg border bg-muted p-6 text-center ${className}`}>
      <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">No active challenge</h3>
      <p className="text-muted-foreground">
        There&apos;s no daily challenge active right now. Check back later!
      </p>
    </div>
  );
}

export function LoadingMessage({ className }: PostStatusMessagesProps) {
  return (
    <div className={`rounded-lg border bg-muted p-6 text-center ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="mx-auto h-12 w-12 bg-muted-foreground/20 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-muted-foreground/20 rounded mx-auto w-48" />
          <div className="h-4 bg-muted-foreground/20 rounded mx-auto w-64" />
        </div>
      </div>
    </div>
  );
}
