/**
 * URL utility functions for QR code result processing
 */

/**
 * Check if a string is a valid HTTP/HTTPS URL
 * @param data - The string to validate
 * @returns true if valid HTTP/HTTPS URL, false otherwise
 */
export function isValidURL(data: string): boolean {
  // Reject empty or whitespace-only strings
  if (!data || data.trim().length === 0) {
    return false;
  }

  try {
    const url = new URL(data);
    // Only accept http and https protocols (case-insensitive)
    const protocol = url.protocol.toLowerCase();
    if (protocol !== 'http:' && protocol !== 'https:') {
      return false;
    }

    // Reject URLs without a hostname
    if (!url.hostname || url.hostname.length === 0) {
      return false;
    }

    // Reject hostnames that are only dots
    if (url.hostname.replace(/\./g, '').length === 0) {
      return false;
    }

    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}
