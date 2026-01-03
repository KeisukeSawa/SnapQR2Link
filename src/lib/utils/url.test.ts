import { describe, it, expect } from 'vitest';
import { isValidURL } from './url';

describe('isValidURL', () => {
  describe('Valid URLs', () => {
    it('should accept http URLs', () => {
      expect(isValidURL('http://example.com')).toBe(true);
      expect(isValidURL('http://www.example.com')).toBe(true);
      expect(isValidURL('http://example.com/path')).toBe(true);
      expect(isValidURL('http://example.com:8080')).toBe(true);
    });

    it('should accept https URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('https://www.example.com')).toBe(true);
      expect(isValidURL('https://example.com/path/to/page')).toBe(true);
      expect(isValidURL('https://example.com?query=value')).toBe(true);
    });

    it('should accept URLs with query parameters', () => {
      expect(isValidURL('https://example.com?foo=bar&baz=qux')).toBe(true);
    });

    it('should accept URLs with fragments', () => {
      expect(isValidURL('https://example.com#section')).toBe(true);
      expect(isValidURL('https://example.com/page#top')).toBe(true);
    });

    it('should accept URLs with subdomains', () => {
      expect(isValidURL('https://subdomain.example.com')).toBe(true);
      expect(isValidURL('https://deep.subdomain.example.com')).toBe(true);
    });
  });

  describe('Invalid URLs', () => {
    it('should reject non-URL text', () => {
      expect(isValidURL('hello world')).toBe(false);
      expect(isValidURL('example.com')).toBe(false);
      expect(isValidURL('www.example.com')).toBe(false);
    });

    it('should reject URLs without http/https scheme', () => {
      expect(isValidURL('ftp://example.com')).toBe(false);
      expect(isValidURL('file:///path/to/file')).toBe(false);
      expect(isValidURL('mailto:user@example.com')).toBe(false);
    });

    it('should reject empty or whitespace strings', () => {
      expect(isValidURL('')).toBe(false);
      expect(isValidURL(' ')).toBe(false);
      expect(isValidURL('\n')).toBe(false);
    });

    it('should reject malformed URLs', () => {
      expect(isValidURL('http://')).toBe(false);
      expect(isValidURL('https://')).toBe(false);
      expect(isValidURL('http://.')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle URLs with special characters', () => {
      expect(isValidURL('https://example.com/path%20with%20spaces')).toBe(true);
    });

    it('should handle URLs with authentication', () => {
      expect(isValidURL('https://user:pass@example.com')).toBe(true);
    });

    it('should handle localhost URLs', () => {
      expect(isValidURL('http://localhost')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('http://127.0.0.1')).toBe(true);
    });

    it('should be case-insensitive for scheme', () => {
      expect(isValidURL('HTTP://example.com')).toBe(true);
      expect(isValidURL('HTTPS://example.com')).toBe(true);
    });
  });
});
