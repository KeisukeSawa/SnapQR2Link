import { describe, it, expect } from 'vitest';
import { getI18n, t, getDefaultLocale, type Locale } from './utils';

describe('i18n utils', () => {
  describe('getI18n', () => {
    it('should return Japanese translations for ja locale', () => {
      const i18n = getI18n('ja');
      expect(i18n.app.title).toBe('SnapQR2Link');
      expect(i18n.app.description).toContain('スクリーンショット');
    });

    it('should return English translations for en locale', () => {
      const i18n = getI18n('en');
      expect(i18n.app.title).toBe('SnapQR2Link');
      expect(i18n.app.description).toContain('screenshot');
    });

    it('should fallback to Japanese for invalid locale', () => {
      const i18n = getI18n('invalid' as Locale);
      expect(i18n.app.description).toContain('スクリーンショット');
    });
  });

  describe('t function', () => {
    it('should get nested translation value with dot notation for Japanese', () => {
      expect(t('ja', 'app.title')).toBe('SnapQR2Link');
      expect(t('ja', 'uploader.selectFile')).toBe('ファイルを選択');
      expect(t('ja', 'errors.noQRCode')).toBe('QRコードが検出できませんでした');
    });

    it('should get nested translation value with dot notation for English', () => {
      expect(t('en', 'app.title')).toBe('SnapQR2Link');
      expect(t('en', 'uploader.selectFile')).toBe('Select File');
      expect(t('en', 'errors.noQRCode')).toBe('No QR code detected');
    });

    it('should return key if translation not found', () => {
      expect(t('ja', 'nonexistent.key')).toBe('nonexistent.key');
    });
  });

  describe('getDefaultLocale', () => {
    it('should return ja for Japanese language', () => {
      expect(getDefaultLocale('ja')).toBe('ja');
      expect(getDefaultLocale('ja-JP')).toBe('ja');
    });

    it('should return en for English language', () => {
      expect(getDefaultLocale('en')).toBe('en');
      expect(getDefaultLocale('en-US')).toBe('en');
    });

    it('should return en for other languages', () => {
      expect(getDefaultLocale('fr')).toBe('en');
      expect(getDefaultLocale('zh')).toBe('en');
    });

    it('should default to ja when no parameter provided', () => {
      expect(getDefaultLocale()).toBe('ja');
    });
  });
});
