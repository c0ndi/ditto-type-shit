import { z } from "zod";

// Validation schemas
const createPostSchema = z.object({
  topicId: z.string().cuid(),
  imageBase64: z.string().min(1, "Image is required"),
  imageType: z.string().regex(/^image\/(jpeg|png|webp)$/, "Invalid image type"),
  fileName: z.string().min(1, "File name is required"),
});

const getPostsSchema = z.object({
  topicId: z.string().cuid().optional(),
  limit: z.number().min(1).max(50).default(20),
  cursor: z.string().cuid().optional(),
});

export { createPostSchema, getPostsSchema };
