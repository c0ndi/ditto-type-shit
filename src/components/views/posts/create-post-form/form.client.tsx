/**
 * Create Post Form Client Component - Created on 12/08/2025 16:52
 * Refactored client-side form logic with better state management and no layout shifts
 */

"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/trpc/react";
import { type Topic } from "@prisma/client";

// Import sub-components
import { ImageUpload } from "./components/image-upload";
import { SubmitButton } from "./components/submit-button";

// Form validation schema
const createPostFormSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
  caption: z.string().optional(),
});

type CreatePostFormData = z.infer<typeof createPostFormSchema>;

interface CreatePostFormClientProps {
  topic: Topic;
  className?: string;
}

export function CreatePostFormClient({ topic, className }: CreatePostFormClientProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostFormSchema),
  });

  // Mutation for creating posts
  const createPostMutation = api.post.create.useMutation({
    onSuccess: () => {
      setIsUploading(false);
      // Refresh the page to show updated state
      router.refresh();
    },
    onError: (error) => {
      setIsUploading(false);
      console.error("Failed to create post:", error);
    },
  });

  // Convert file to base64
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    form.setValue("image", file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Clean up previous preview URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [form, previewUrl]);

  // Remove selected image
  const removeImage = useCallback(() => {
    form.setValue("image", undefined as unknown as File);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [form, previewUrl]);

  // Form submission
  const onSubmit = async (data: CreatePostFormData) => {
    setIsUploading(true);

    try {
      const base64 = await fileToBase64(data.image);

      await createPostMutation.mutateAsync({
        topicId: topic.id,
        imageBase64: base64,
        imageType: data.image.type,
        fileName: data.image.name,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setIsUploading(false);
    }
  };

  // Show upload loading state
  if (isUploading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="rounded-lg border p-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="mx-auto h-12 w-12 bg-primary/20 rounded-full" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Uploading your photo...</h3>
              <p className="text-muted-foreground">
                Please wait while we process your submission
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <ImageUpload
                onFileSelect={handleFileSelect}
                onRemoveImage={removeImage}
                previewUrl={previewUrl}
                error={form.formState.errors.image?.message}
              />
            )}
          />

          {/* Optional Caption */}
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your photo..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <SubmitButton
            isLoading={createPostMutation.isPending}
            isDisabled={!previewUrl}
          />

          {/* Error Display */}
          {createPostMutation.error && (
            <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
              <p className="font-medium">Failed to create post</p>
              <p className="text-sm">{createPostMutation.error.message}</p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
