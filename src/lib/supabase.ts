/**
 * Created on: Supabase client configuration for image storage - 12/08/2025 15:36
 * Purpose: Client and server-side Supabase configurations for post image uploads
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

// Client-side Supabase instance
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Server-side Supabase instance with service role (for admin operations)
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Storage configuration
export const STORAGE_CONFIG = {
  BUCKET_NAME: "post-images",
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  PHOTO_DIRECTORY: "posts", // Main directory for all post photos
} as const;

/**
 * Generates a unique storage path for post images
 * Format: posts/YYYY/MM/DD/userId/timestamp-randomId.ext
 * This structure makes it easy to organize and change storage paths later
 */
export function generatePostImagePath(
  userId: string,
  fileName: string,
): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const timestamp = now.getTime();
  const randomId = Math.random().toString(36).substring(2, 8);

  // Extract file extension
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";

  return `${STORAGE_CONFIG.PHOTO_DIRECTORY}/${year}/${month}/${day}/${userId}/${timestamp}-${randomId}.${ext}`;
}

/**
 * Uploads an image to Supabase storage
 * Returns the storage path (without domain) for database storage
 */
export async function uploadPostImage(
  file: File,
  userId: string,
): Promise<{
  path: string;
  publicUrl: string;
}> {
  // Validate file
  if (
    !STORAGE_CONFIG.ALLOWED_TYPES.includes(
      file.type as "image/jpeg" | "image/png" | "image/webp",
    )
  ) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  // Generate unique path
  const storagePath = generatePostImagePath(userId, file.name);

  // Upload to Supabase
  const { data, error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .getPublicUrl(storagePath);

  return {
    path: storagePath, // Store this in database (domain-independent)
    publicUrl: urlData.publicUrl, // Use this for display
  };
}

/**
 * Gets the public URL for a stored image path
 * This function allows us to change domains/CDNs later without updating the database
 */
export function getPostImageUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

/**
 * Deletes an image from Supabase storage
 */
export async function deletePostImage(storagePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
