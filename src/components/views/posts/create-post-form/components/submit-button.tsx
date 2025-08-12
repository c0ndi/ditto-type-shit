/**
 * Submit Button Component - Created on 12/08/2025 16:52
 * Handles form submission with loading states
 */

import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
}

export function SubmitButton({ isLoading, isDisabled }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isDisabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Camera className="mr-2 h-4 w-4" />
          Share Photo
        </>
      )}
    </Button>
  );
}
