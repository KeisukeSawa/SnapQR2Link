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
    <div className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* QR Code Data */}
      <div className="mb-3">
        <p className="text-xs sm:text-sm text-gray-500 mb-1">
          {result.type === 'url' ? 'URL' : 'Text'}
        </p>
        <p className="text-gray-900 break-all font-mono text-xs sm:text-sm">
          {result.data}
        </p>
      </div>

      {/* Action Button */}
      <div>
        {result.type === 'url' ? (
          <button
            onClick={() => openURL(result.data)}
            className="
              w-full px-4 py-3 bg-blue-500 text-white rounded-md
              hover:bg-blue-600 active:bg-blue-700 transition-colors
              font-medium text-sm sm:text-base
              min-h-[44px]
            "
            aria-label={`${t.openLink}: ${result.data}`}
          >
            {t.openLink}
          </button>
        ) : (
          <button
            onClick={() => copyToClipboard(result.data)}
            className="
              w-full px-4 py-3 bg-gray-500 text-white rounded-md
              hover:bg-gray-600 active:bg-gray-700 transition-colors
              font-medium text-sm sm:text-base
              min-h-[44px]
            "
            aria-label={`${t.copyText}: ${result.data}`}
          >
            {t.copyText}
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="
            absolute top-2 right-2
            bg-green-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full
            animate-fade-in
          "
          role="status"
          aria-live="polite"
        >
          {t.copied}
        </div>
      )}
    </div>
  );
}
