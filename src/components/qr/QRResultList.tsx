import { useEffect, useRef } from 'react';
import { QRResultCard } from './QRResultCard';
import type { QRResult } from '@/lib/qr/scanner';

export interface QRResultListProps {
  results: QRResult[];
  locale: 'ja' | 'en';
}

const translations = {
  ja: {
    noResults: '結果がありません',
    multipleResults: '複数のQRコードが見つかりました',
    autoOpenBlocked: '自動的にリンクを開けませんでした。下のボタンをクリックしてください。'
  },
  en: {
    noResults: 'No results found',
    multipleResults: 'Multiple QR codes found',
    autoOpenBlocked: 'Failed to auto-open link. Please click the button below.'
  }
};

/**
 * Auto-open URL if results contain exactly one URL
 * @param results - QR results array
 * @returns true if auto-opened successfully, false otherwise
 */
function autoOpenURL(results: QRResult[]): boolean {
  // Only auto-open if there's exactly one result and it's a URL
  if (results.length !== 1) return false;
  if (results[0].type !== 'url') return false;

  try {
    const newWindow = window.open(results[0].data, '_blank', 'noopener,noreferrer');
    // Check if popup was blocked
    return newWindow !== null && newWindow !== undefined;
  } catch (error) {
    console.error('Failed to auto-open URL:', error);
    return false;
  }
}

export function QRResultList({ results, locale }: QRResultListProps) {
  const t = translations[locale];
  const autoOpenAttempted = useRef(false);

  // Auto-open URL when results change
  useEffect(() => {
    // Reset flag when results change
    if (results.length === 0) {
      autoOpenAttempted.current = false;
      return;
    }

    // Only attempt auto-open once per result set
    if (autoOpenAttempted.current) return;

    const success = autoOpenURL(results);
    autoOpenAttempted.current = true;

    // If auto-open failed (popup blocked), the user will see the manual button
    if (!success && results.length === 1 && results[0].type === 'url') {
      console.warn('Auto-open blocked. User needs to click the button manually.');
    }
  }, [results]);

  // No results
  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>{t.noResults}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Multiple results header */}
      {results.length > 1 && (
        <div className="text-center text-gray-700 font-medium">
          {t.multipleResults} ({results.length})
        </div>
      )}

      {/* Result cards */}
      {results.map((result, index) => (
        <QRResultCard
          key={`${result.data}-${index}`}
          result={result}
          locale={locale}
        />
      ))}
    </div>
  );
}
