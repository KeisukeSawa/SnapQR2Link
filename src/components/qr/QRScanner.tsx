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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900">
        {t.title}
      </h1>

      {/* Image Uploader */}
      <ImageUploader
        onImageUpload={handleImageUpload}
        onError={handleError}
        locale={locale}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-6 sm:py-8">
          <div className="flex flex-col items-center space-y-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              role="status"
              aria-label={t.scanning}
            />
            <p className="text-gray-600 font-medium text-sm sm:text-base">{t.scanning}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !isLoading && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-red-700"
          role="alert"
        >
          <p className="font-medium text-sm sm:text-base">{error}</p>
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
                px-6 py-3 bg-gray-300 text-gray-700 rounded-md
                hover:bg-gray-400 active:bg-gray-500 transition-colors
                font-medium text-sm sm:text-base
                min-h-[44px]
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
              "
              aria-label={t.clearButton}
            >
              {t.clearButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
