/**
 * Image file validator for QR code processing
 * Validates file format and size constraints
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

/**
 * Validate an image file for QR code processing
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImage(file: File): ValidationResult {
  // Check file format
  if (!SUPPORTED_FORMATS.includes(file.type as any)) {
    return {
      isValid: false,
      error: 'このファイル形式はサポートされていません（JPG、PNG、WebP、GIFのみ対応）'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'ファイルサイズが大きすぎます（最大50MB）'
    };
  }

  // All checks passed
  return {
    isValid: true
  };
}
