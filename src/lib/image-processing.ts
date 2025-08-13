/**
 * Updated on: Simplified image processing with react-blurhash - 12/09/2025 00:05
 * Purpose: Generate BlurHash strings from images for use with react-blurhash component
 */

import sharp from "sharp";
import { encode } from "blurhash";

/**
 * Configuration for BlurHash generation
 */
export const BLURHASH_CONFIG = {
  // BlurHash generation settings
  COMPONENTS_X: 4, // Number of X components (horizontal)
  COMPONENTS_Y: 3, // Number of Y components (vertical)

  // Processing optimization
  PROCESSING_MAX_WIDTH: 400, // Resize large images before processing for performance
  PROCESSING_MAX_HEIGHT: 300, // Smaller since we only need BlurHash, not blur images
} as const;

/**
 * Generates a BlurHash string from an image buffer
 * This hash can be used with react-blurhash component for instant placeholders
 */
export async function generateBlurHash(imageBuffer: Buffer): Promise<string> {
  try {
    // Resize image for faster processing
    const processedImage = await sharp(imageBuffer)
      .resize(
        BLURHASH_CONFIG.PROCESSING_MAX_WIDTH,
        BLURHASH_CONFIG.PROCESSING_MAX_HEIGHT,
        {
          fit: "inside",
          withoutEnlargement: true,
        },
      )
      .ensureAlpha() // Ensure RGBA format
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = processedImage;
    const { width, height } = info;

    // Generate BlurHash string
    const blurHash = encode(
      new Uint8ClampedArray(data),
      width,
      height,
      BLURHASH_CONFIG.COMPONENTS_X,
      BLURHASH_CONFIG.COMPONENTS_Y,
    );

    return blurHash;
  } catch (error) {
    console.error("Error generating BlurHash:", error);
    throw new Error("Failed to generate BlurHash");
  }
}
