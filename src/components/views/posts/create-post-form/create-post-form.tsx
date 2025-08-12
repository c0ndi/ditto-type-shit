/**
 * Created on: Post creation form with image upload - 12/08/2025 15:38
 * Purpose: Form component for creating posts with photo upload, validation, and submission
 */

"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Upload, Camera, X, Loader2 } from "lucide-react";
import Image from "next/image";

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

interface CreatePostFormProps {
  topicId?: string;
  className?: string;
}

export function CreatePostForm({ topicId, className }: CreatePostFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostFormSchema),
  });

  // Get active topic if not provided
  const { data: activeTopic } = api.post.getActiveTopic.useQuery(undefined, {
    enabled: !topicId,
  });

  // Check if user has already posted
  const currentTopicId = topicId ?? activeTopic?.id;
  const { data: hasPosted } = api.post.hasUserPosted.useQuery(
    { topicId: currentTopicId! },
    {
      enabled: !!currentTopicId,
      refetchOnWindowFocus: false,
    }
  );

  // Mutation for creating posts
  const createPostMutation = api.post.create.useMutation({
    onSuccess: () => {
      form.reset();
      setPreviewUrl(null);
    },
    onError: (error) => {
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

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

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
    if (!currentTopicId) {
      return;
    }

    try {
      const base64 = await fileToBase64(data.image);

      await createPostMutation.mutateAsync({
        topicId: currentTopicId,
        imageBase64: base64,
        imageType: data.image.type,
        fileName: data.image.name,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // If user has already posted today
  if (hasPosted) {
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

  // If no active topic
  if (!currentTopicId && !activeTopic) {
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

  const topic = activeTopic;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Topic Info */}
      {topic && (
        <div className="rounded-lg border p-4 bg-accent/50">
          <h2 className="font-semibold text-lg mb-2">Today&apos;s Challenge</h2>
          <h3 className="text-xl font-bold text-primary">{topic.title}</h3>
          {topic.description && (
            <p className="text-muted-foreground mt-2">{topic.description}</p>
          )}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Photo</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {!previewUrl ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50"
                          }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium">
                            Drop your photo here or click to upload
                          </p>
                          <p className="text-sm text-muted-foreground">
                            JPEG, PNG, or WebP up to 5MB
                          </p>
                        </div>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleInputChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Choose Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
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
          <Button
            type="submit"
            className="w-full"
            disabled={!previewUrl || createPostMutation.isPending}
          >
            {createPostMutation.isPending ? (
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

