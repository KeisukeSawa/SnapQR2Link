import { describe, it, expect } from 'vitest';
import { validateImage, SUPPORTED_FORMATS, MAX_FILE_SIZE } from './validator';

describe('validateImage', () => {
  describe('Supported formats', () => {
    it('should accept JPEG files', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImage(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept PNG files', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateImage(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept WebP files', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' });
      const result = validateImage(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept GIF files', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      const result = validateImage(file);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Unsupported formats', () => {
    it('should reject PDF files explicitly', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = validateImage(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('サポートされていません');
    });

    it('should reject text files', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateImage(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject unknown MIME types', () => {
      const file = new File(['test'], 'test.unknown', { type: 'application/octet-stream' });
      const result = validateImage(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('File size validation', () => {
    it('should accept files under 50MB', () => {
      const smallFile = new File(['x'.repeat(1024)], 'small.jpg', { type: 'image/jpeg' });
      const result = validateImage(smallFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept files exactly at 50MB limit', () => {
      // Create a file exactly at 50MB
      const content = new ArrayBuffer(50 * 1024 * 1024);
      const file = new File([content], 'exact.jpg', { type: 'image/jpeg' });
      const result = validateImage(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject files over 50MB', () => {
      // Create a file over 50MB
      const content = new ArrayBuffer(50 * 1024 * 1024 + 1);
      const file = new File([content], 'large.jpg', { type: 'image/jpeg' });
      const result = validateImage(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('50MB');
    });
  });

  describe('Constants', () => {
    it('should export SUPPORTED_FORMATS', () => {
      expect(SUPPORTED_FORMATS).toContain('image/jpeg');
      expect(SUPPORTED_FORMATS).toContain('image/png');
      expect(SUPPORTED_FORMATS).toContain('image/webp');
      expect(SUPPORTED_FORMATS).toContain('image/gif');
      expect(SUPPORTED_FORMATS).toHaveLength(4);
    });

    it('should export MAX_FILE_SIZE as 50MB', () => {
      expect(MAX_FILE_SIZE).toBe(50 * 1024 * 1024);
    });
  });
});
