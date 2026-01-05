import { useState } from 'react';
import type { QRResult } from '@/lib/qr/scanner';

export interface QRResultCardProps {
  result: QRResult;
  locale: 'ja' | 'en';
  onCopySuccess?: () => void;
}

const translations = {
  ja: {
    openLink: 'リンクを開く',
    copyText: 'コピー',
    copied: 'コピーしました'
  },
  en: {
    openLink: 'Open Link',
    copyText: 'Copy',
    copied: 'Copied!'
  }
};

export function QRResultCard({ result, locale, onCopySuccess }: QRResultCardProps) {
  const [showToast, setShowToast] = useState(false);
  const t = translations[locale];

  const openURL = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      onCopySuccess?.();

      // Auto-hide toast after 2 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* QR Code Data */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {result.type === 'url' ? (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {result.type === 'url' ? 'URL' : 'Text'}
          </span>
        </div>
        <p className="text-gray-900 break-all font-mono text-xs sm:text-sm bg-gray-100 p-3 rounded-lg border border-gray-200">
          {result.data}
        </p>
      </div>

      {/* Action Button */}
      <div>
        {result.type === 'url' ? (
          <button
            onClick={() => openURL(result.data)}
            className="
              w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
              hover:from-blue-700 hover:to-purple-700 active:scale-95
              transition-all duration-200 shadow-md hover:shadow-lg
              font-semibold text-sm sm:text-base
              min-h-[44px]
              focus:outline-none focus:ring-4 focus:ring-blue-300
              flex items-center justify-center gap-2
            "
            aria-label={`${t.openLink}: ${result.data}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t.openLink}
          </button>
        ) : (
          <button
            onClick={() => copyToClipboard(result.data)}
            className="
              w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg
              hover:from-purple-700 hover:to-pink-700 active:scale-95
              transition-all duration-200 shadow-md hover:shadow-lg
              font-semibold text-sm sm:text-base
              min-h-[44px]
              focus:outline-none focus:ring-4 focus:ring-purple-300
              flex items-center justify-center gap-2
            "
            aria-label={`${t.copyText}: ${result.data}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {t.copyText}
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="
            absolute -top-3 right-4
            bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm px-4 py-2 rounded-full
            shadow-lg animate-bounce
            flex items-center gap-2
          "
          role="status"
          aria-live="polite"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t.copied}
        </div>
      )}
    </div>
  );
}
