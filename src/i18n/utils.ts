import jaTranslations from './locales/ja.json';
import enTranslations from './locales/en.json';

export type Locale = 'ja' | 'en';

export const translations = {
  ja: jaTranslations,
  en: enTranslations
} as const;

/**
 * Get i18n helper for the specified locale
 * @param locale - The locale to use ('ja' or 'en')
 * @returns Translation object for the locale
 */
export function getI18n(locale: Locale) {
  return translations[locale] || translations.ja;
}

/**
 * Get nested translation value using dot notation
 * @param locale - The locale to use
 * @param key - Dot-notation key (e.g., 'app.title')
 * @returns Translated string
 */
export function t(locale: Locale, key: string): string {
  const i18n = getI18n(locale);
  const keys = key.split('.');

  let value: any = i18n;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get the default locale from browser language
 * @param acceptLanguage - Accept-Language header or navigator.language
 * @returns Default locale ('ja' or 'en')
 */
export function getDefaultLocale(acceptLanguage?: string): Locale {
  const lang = acceptLanguage || (typeof navigator !== 'undefined' ? navigator.language : 'ja');
  return lang.startsWith('ja') ? 'ja' : 'en';
}
