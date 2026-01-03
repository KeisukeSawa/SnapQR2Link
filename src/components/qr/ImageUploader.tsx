import { useRef, useState, useEffect } from 'react';
import { validateImage } from '@/lib/qr/validator';

export interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onError: (error: string) => void;
  locale: 'ja' | 'en';
}

const translations = {
  ja: {
    selectFile: 'ファイルを選択',
    dragDrop: 'ここにドラッグ＆ドロップ',
    pasteHint: 'または Ctrl+V で貼り付け',
    supportedFormats: '対応形式: JPG, PNG, WebP, GIF',
    maxFileSize: '最大ファイルサイズ: 50MB'
  },
  en: {
    selectFile: 'Select File',
    dragDrop: 'Drag & Drop Here',
    pasteHint: 'or Paste with Ctrl+V',
    supportedFormats: 'Supported: JPG, PNG, WebP, GIF',
    maxFileSize: 'Max file size: 50MB'
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
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          transition-colors duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="
              px-6 py-3 bg-blue-500 text-white rounded-lg
              hover:bg-blue-600 transition-colors
              font-medium
            "
          >
            {t.selectFile}
          </button>

          <p className="text-gray-600 text-lg">
            {t.dragDrop}
          </p>

          <p className="text-gray-500 text-sm">
            {t.pasteHint}
          </p>

          <div className="text-xs text-gray-400 space-y-1">
            <p>{t.supportedFormats}</p>
            <p>{t.maxFileSize}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
