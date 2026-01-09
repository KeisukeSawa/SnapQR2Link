import { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { QRResultList } from './QRResultList';
import { scanQRCode } from '@/lib/qr/scanner';
import type { QRResult } from '@/lib/qr/scanner';

export interface QRScannerProps {
  locale: 'ja' | 'en';
}

const translations = {
  ja: {
    title: 'QRコードスキャナー',
    scanning: 'スキャン中...',
    clearButton: 'クリア',
    errorNoQRCode: 'QRコードが検出されませんでした。別の画像をお試しください。',
    errorTimeout: 'スキャンがタイムアウトしました（3秒）。画像が大きすぎる可能性があります。',
    errorGeneric: 'エラーが発生しました。もう一度お試しください。'
  },
  en: {
    title: 'QR Code Scanner',
    scanning: 'Scanning...',
    clearButton: 'Clear',
    errorNoQRCode: 'No QR code detected. Please try a different image.',
    errorTimeout: 'Scan timed out (3 seconds). The image might be too large.',
    errorGeneric: 'An error occurred. Please try again.'
  }
};

const SCAN_TIMEOUT_MS = 3000;

export function QRScanner({ locale }: QRScannerProps) {
  const [results, setResults] = useState<QRResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[locale];

  const handleImageUpload = async (file: File) => {
    // Reset state
    setResults([]);
    setError(null);
    setIsLoading(true);

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('TIMEOUT'));
        }, SCAN_TIMEOUT_MS);
      });

      // Race between scan and timeout
      const scanResults = await Promise.race([
        scanQRCode(file),
        timeoutPromise
      ]);

      // Check if any QR codes were found
      if (scanResults.length === 0) {
        setError(t.errorNoQRCode);
      } else {
        setResults(scanResults);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'TIMEOUT') {
        setError(t.errorTimeout);
      } else {
        console.error('QR scan error:', err);
        setError(t.errorGeneric);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setResults([]);
  };

  const handleClear = () => {
    setResults([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6 space-y-3 sm:space-y-6">
      {/* Image Uploader */}
      <ImageUploader
        onImageUpload={handleImageUpload}
        onError={handleError}
        locale={locale}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-4 sm:py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"
                role="status"
                aria-label={t.scanning}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700 font-semibold text-base sm:text-lg">{t.scanning}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !isLoading && (
        <div
          className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4 sm:p-6 shadow-lg"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !isLoading && (
        <div className="space-y-3 sm:space-y-4">
          <QRResultList results={results} locale={locale} />

          {/* Clear Button */}
          <div className="flex justify-center">
            <button
              onClick={handleClear}
              className="
                px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl
                hover:from-gray-700 hover:to-gray-800 active:scale-95
                transition-all duration-200 shadow-md hover:shadow-lg
                font-semibold text-sm sm:text-base
                min-h-[44px]
                focus:outline-none focus:ring-4 focus:ring-gray-300
                flex items-center gap-2
              "
              aria-label={t.clearButton}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t.clearButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
