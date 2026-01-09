import { useRef, useState, useEffect } from 'react';
import { validateImage } from '@/lib/qr/validator';

export interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onError: (error: string) => void;
  locale: 'ja' | 'en';
}

const translations = {
  ja: {
    title: 'QRコード画像をアップロード',
    dragDrop: 'ここに画像をドラッグ＆ドロップ',
    or: 'または',
    selectFile: 'ファイルを選択',
    pasteHint: 'Ctrl+V で画像を貼り付け',
    supportedFormats: 'JPG, PNG, WebP, GIF (最大 50MB)'
  },
  en: {
    title: 'Upload QR Code Image',
    dragDrop: 'Drag & Drop Image Here',
    or: 'or',
    selectFile: 'Select File',
    pasteHint: 'Paste image with Ctrl+V',
    supportedFormats: 'JPG, PNG, WebP, GIF (max 50MB)'
  }
};

export function ImageUploader({ onImageUpload, onError, locale }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const t = translations[locale];

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle paste event
  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          processFile(file);
          return;
        }
      }
    }

    // No image found in clipboard
    onError(locale === 'ja'
      ? 'クリップボードに画像が見つかりません'
      : 'No image found in clipboard');
  };

  // Process file with validation
  const processFile = (file: File) => {
    const result = validateImage(file);

    if (!result.isValid && result.error) {
      onError(result.error);
      return;
    }

    onImageUpload(file);
  };

  // Add/remove paste event listener
  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [locale, onImageUpload, onError]);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-4 sm:p-8 text-center
          transition-all duration-300 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.02] shadow-xl'
            : 'border-gray-300 hover:border-blue-400 hover:shadow-lg bg-white'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
        aria-label={locale === 'ja' ? 'QRコード画像アップロード' : 'QR code image upload'}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          id="qr-image-input"
          aria-label={t.selectFile}
        />

        <div className="space-y-3 sm:space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`
              p-3 rounded-full transition-all duration-300
              ${isDragging
                ? 'bg-blue-500 scale-110'
                : 'bg-gradient-to-br from-blue-500 to-purple-500'}
            `}>
              <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {t.title}
          </h2>

          {/* Drag & Drop Text */}
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            {t.dragDrop}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-xs mx-auto">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">{t.or}</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Select File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="
              px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
              hover:from-blue-700 hover:to-purple-700 active:scale-95
              transition-all duration-200 shadow-lg hover:shadow-xl
              font-semibold text-sm sm:text-base
              min-w-[44px] min-h-[44px]
              focus:outline-none focus:ring-4 focus:ring-blue-300
            "
            aria-describedby="upload-instructions"
          >
            {t.selectFile}
          </button>

          {/* Paste Hint */}
          <div className="space-y-2">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                V
              </kbd>
              <span className="ml-1">{t.pasteHint}</span>
            </p>

            {/* Supported Formats */}
            <p id="upload-instructions" className="text-xs text-gray-400">
              {t.supportedFormats}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
