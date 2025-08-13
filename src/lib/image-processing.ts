/**
 * Updated on: Migrated from BlurHash to Plaiceholder - 13/08/2025 10:45
 * Purpose: Generate base64 blur placeholders from images using plaiceholder for Next.js Image component
 */

import { getPlaiceholder } from "plaiceholder";

/**
 * Configuration for plaiceholder generation
 */
export const PLAICEHOLDER_CONFIG = {
  // Placeholder generation settings
  size: 8, // Higher resolution placeholder (4-64, default: 4)

  // Processing optimization
  removeAlpha: false, // Keep transparency if present
  brightness: 1, // No brightness adjustment
  saturation: 1.2, // Slightly enhance saturation for better placeholders
};

/**
 * Generates a base64 blur placeholder from an image buffer
 * This can be used directly with Next.js Image component's blurDataURL prop
 */
export async function generateBlurPlaceholder(
  imageBuffer: Buffer,
): Promise<string> {
  try {
    const { base64 } = await getPlaiceholder(imageBuffer, PLAICEHOLDER_CONFIG);

    return base64;
  } catch (error) {
    console.error("Error generating blur placeholder:", error);
    throw new Error("Failed to generate blur placeholder");
  }
}
