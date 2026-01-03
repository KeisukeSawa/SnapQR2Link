import { describe, it, expect } from 'vitest';
import { isQRCodeURL } from './scanner';

describe('scanner', () => {
  describe('isQRCodeURL', () => {
    it('should return true for http URLs', () => {
      expect(isQRCodeURL('http://example.com')).toBe(true);
    });

    it('should return true for https URLs', () => {
      expect(isQRCodeURL('https://example.com')).toBe(true);
    });

    it('should return true for HTTP (uppercase)', () => {
      expect(isQRCodeURL('HTTP://example.com')).toBe(true);
    });

    it('should return true for HTTPS (uppercase)', () => {
      expect(isQRCodeURL('HTTPS://example.com')).toBe(true);
    });

    it('should return false for non-URL text', () => {
      expect(isQRCodeURL('Hello World')).toBe(false);
      expect(isQRCodeURL('12345')).toBe(false);
    });

    it('should return false for URLs without http/https', () => {
      expect(isQRCodeURL('ftp://example.com')).toBe(false);
      expect(isQRCodeURL('mailto:user@example.com')).toBe(false);
    });

    it('should return false for partial URLs', () => {
      expect(isQRCodeURL('example.com')).toBe(false);
      expect(isQRCodeURL('www.example.com')).toBe(false);
    });
  });

  // Note: Full integration tests for scanQRCode would require browser environment
  // and actual image files. These will be covered in E2E tests with Playwright.
  // Unit tests here focus on the logic and helper functions.
});
