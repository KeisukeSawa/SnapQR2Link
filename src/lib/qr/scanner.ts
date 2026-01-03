/**
 * QR Code scanner using jsqr library and Canvas API
 * All processing happens client-side for privacy
 */

import jsQR from 'jsqr';
import { isValidURL } from '@/lib/utils/url';

export interface QRResult {
  data: string;
  type: 'url' | 'text';
  location?: {
    topLeftCorner: Point;
    topRightCorner: Point;
    bottomRightCorner: Point;
    bottomLeftCorner: Point;
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface ScanOptions {
  inversionAttempts?: 'attemptBoth' | 'dontInvert' | 'onlyInvert' | 'invertFirst';
  maxWidth?: number;  // Default: 4000px
  maxHeight?: number; // Default: 4000px
}

const DEFAULT_MAX_WIDTH = 4000;
const DEFAULT_MAX_HEIGHT = 4000;

/**
 * Check if a string starts with http:// or https://
 * @param data - The string to check
 * @returns true if starts with http:// or https:// (case-insensitive)
 */
export function isQRCodeURL(data: string): boolean {
  return /^https?:\/\//i.test(data);
}

/**
 * Scan QR code from an image file
 * @param imageFile - The image file to scan
 * @param options - Scan options
 * @returns Promise resolving to array of QR results
 */
export async function scanQRCode(
  imageFile: File,
  options?: ScanOptions
): Promise<QRResult[]> {
  const maxWidth = options?.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = options?.maxHeight ?? DEFAULT_MAX_HEIGHT;
  const inversionAttempts = options?.inversionAttempts ?? 'attemptBoth';

  // Load image
  const imageBitmap = await loadImage(imageFile);

  // Resize if needed
  const { canvas, ctx } = createCanvas(imageBitmap, maxWidth, maxHeight);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Scan for QR codes
  const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts
  });

  // No QR code found
  if (!qrCode) {
    return [];
  }

  // Determine type (URL or text)
  const type = isValidURL(qrCode.data) ? 'url' : 'text';

  return [
    {
      data: qrCode.data,
      type,
      location: qrCode.location
    }
  ];
}

/**
 * Load an image file into an ImageBitmap
 * @param file - The image file
 * @returns Promise resolving to ImageBitmap
 */
async function loadImage(file: File): Promise<ImageBitmap> {
  return await createImageBitmap(file);
}

/**
 * Create a canvas and resize image if needed
 * @param imageBitmap - The image to draw
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Canvas and 2D context
 */
function createCanvas(
  imageBitmap: ImageBitmap,
  maxWidth: number,
  maxHeight: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  let width = imageBitmap.width;
  let height = imageBitmap.height;

  // Resize if image is too large
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }

  ctx.drawImage(imageBitmap, 0, 0, width, height);

  return { canvas, ctx };
}
