# Implementation Tasks

## プロジェクト初期化

- [x] 1. (P) Astroプロジェクトの初期セットアップ
  - Astro 4.xプロジェクトを`pnpm create astro@latest`で初期化
  - TypeScript strict modeを有効化
  - 基本的なディレクトリ構造を作成（`src/pages/`, `src/components/`, `src/lib/`, `src/layouts/`, `src/i18n/`）
  - `.gitignore`、`README.md`を設定
  - _Requirements: 10.1_

- [x] 2. (P) 依存関係のインストールと設定
  - React 18.x、TailwindCSS 4.x、jsqr 1.4.0をインストール
  - `@astrojs/react`、`@astrojs/tailwind`統合を追加
  - TailwindCSS設定ファイル（`tailwind.config.mjs`）を作成
  - TypeScript設定（`tsconfig.json`）でpath alias `@/*`を設定
  - _Requirements: 10.1_

- [x] 3. (P) Astro i18n設定
  - `astro.config.mjs`でi18n設定（日本語・英語）を追加
  - `i18n.locales: ['ja', 'en']`、`i18n.defaultLocale: 'ja'`を設定
  - i18n翻訳辞書（`src/i18n/locales/ja.json`, `en.json`）を作成
  - i18nヘルパー関数（`src/i18n/utils.ts`）を実装
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

## コアロジックの実装

- [ ] 4. ファイルバリデーション機能の実装
- [x] 4.1 (P) 画像ファイルバリデーターの作成
  - `src/lib/qr/validator.ts`を作成
  - `validateImage(file: File)`関数を実装
  - JPG、PNG、WebP、GIF形式のサポート判定
  - 50MBファイルサイズ制限の実装
  - PDF形式の明示的な拒否
  - エラーメッセージを返す仕組み（フォーマットエラー、サイズエラー）
  - _Requirements: 1.4, 1.5, 1.6, 1.7_

- [ ] 4.2* (P) バリデーターのユニットテスト
  - `src/lib/qr/validator.test.ts`を作成
  - 対応フォーマット（JPG、PNG、WebP、GIF）のテストケース
  - 非対応フォーマット（PDF、TXT等）のエラーケース
  - 50MB超過ファイルのエラーケース
  - 正常ケース（有効な画像ファイル）
  - _Requirements: 1.4, 1.5, 1.6, 1.7_

- [ ] 5. QRコード検出機能の実装
- [x] 5.1 (P) QRコードスキャナーの作成
  - `src/lib/qr/scanner.ts`を作成
  - `scanQRCode(imageFile: File, options?: ScanOptions)`関数を実装
  - Canvas APIで画像をImageDataに変換
  - jsqrライブラリで`jsQR(imageData, width, height, options)`を実行
  - 複数QRコード検出のロジック実装（画像全体を走査）
  - type判定（URL or テキスト）を`isQRCodeURL()`で実装
  - 画像リサイズ処理（最大4000x4000px）
  - `inversionAttempts: 'attemptBoth'`オプション設定
  - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.8_

- [ ] 5.2* (P) スキャナーのユニットテスト
  - `src/lib/qr/scanner.test.ts`を作成
  - QRコード検出成功ケース（単一QRコード）
  - 複数QRコード検出ケース
  - QRコード未検出ケース（空配列を返す）
  - URL判定テスト（`isQRCodeURL()`）
  - 画像リサイズのテストケース
  - _Requirements: 2.1, 2.3, 2.4, 2.5_

- [x] 6. (P) URLユーティリティの実装
  - `src/lib/utils/url.ts`を作成
  - `isValidURL(data: string): boolean`関数を実装（http/httpsスキーム検証）
  - URL整形ユーティリティ（必要に応じて）
  - _Requirements: 3.2, 3.4_

## Reactコンポーネント（島）の実装

- [ ] 7. ImageUploaderコンポーネントの実装
- [x] 7.1 ファイル選択とドラッグ&ドロップ機能
  - `src/components/qr/ImageUploader.tsx`を作成
  - ファイル選択ボタンとinput[type="file"]の実装
  - ドラッグ&ドロップエリアの実装（`onDrop`, `onDragOver`イベント）
  - Validator統合（`validateImage()`呼び出し）
  - エラーメッセージ表示UI
  - TailwindCSSでスタイリング（レスポンシブ対応）
  - _Requirements: 1.1, 1.2, 1.6, 1.7_

- [x] 7.2 クリップボードペースト機能
  - Ctrl+V（Cmd+V）のpasteイベントリスナーを追加
  - `event.clipboardData.files`から画像ファイルを取得
  - FileReaderで画像をDataURLまたはArrayBufferに変換
  - 画像がない場合のエラーハンドリング
  - `onImageUpload`コールバックで親に画像を渡す
  - _Requirements: 1.3_

- [ ] 7.3* ImageUploaderのユニットテスト
  - `src/components/qr/ImageUploader.test.tsx`を作成
  - ファイル選択イベントのテスト
  - ドラッグ&ドロップイベントのテスト
  - ペーストイベントのテスト
  - バリデーションエラー表示のテスト
  - _Requirements: 1.1, 1.2, 1.3, 1.6_

- [ ] 8. ResultCardコンポーネントの実装
- [x] 8.1 QRコード結果カードの作成
  - `src/components/qr/QRResultCard.tsx`を作成
  - QRResultをカード形式で表示
  - URLの場合「リンクを開く」ボタン表示
  - テキストの場合「コピー」ボタン表示
  - `openURL(url: string)`関数実装（`window.open(url, '_blank')`）
  - `copyToClipboard(text: string)`関数実装（`navigator.clipboard.writeText()`）
  - コピー成功時のToast表示（短時間表示、自動消去）
  - TailwindCSSでカードスタイリング、ARIA属性追加（アクセシビリティ）
  - _Requirements: 3.1, 3.4, 3.5, 3.6_

- [ ] 8.2* ResultCardのユニットテスト
  - `src/components/qr/QRResultCard.test.tsx`を作成
  - URL結果の表示テスト（「リンクを開く」ボタン）
  - テキスト結果の表示テスト（「コピー」ボタン）
  - コピー機能のテスト（クリップボードAPI）
  - Toast表示のテスト
  - _Requirements: 3.1, 3.4, 3.5, 3.6_

- [ ] 9. ResultListコンポーネントの実装
- [x] 9.1 結果リストと自動オープン機能
  - `src/components/qr/QRResultList.tsx`を作成
  - QRResult配列を受け取り、ResultCardをレンダリング
  - `autoOpenURL(results: QRResult[])`関数実装
  - 結果が1つのURLのみの場合、自動的に`window.open()`
  - 複数結果またはURL以外のテキストの場合、リスト表示
  - useEffect()でresults変更を監視、自動オープン実行
  - ポップアップブロッカー対策（フォールバック処理：手動ボタン表示）
  - _Requirements: 2.6, 3.2, 3.3_

- [ ] 9.2* ResultListのユニットテスト
  - `src/components/qr/QRResultList.test.tsx`を作成
  - 単一URL結果の自動オープンテスト
  - 複数結果のリスト表示テスト
  - 自動オープンが1度だけ実行されることの検証
  - _Requirements: 2.6, 3.2, 3.3_

- [ ] 10. QRScannerコンポーネントの実装
- [x] 10.1 メインオーケストレーター
  - `src/components/qr/QRScanner.tsx`を作成
  - 状態管理（`useState`でresults、isLoading、errorを管理）
  - ImageUploaderとResultListを統合
  - 画像アップロード時にScanner.scanQRCode()を呼び出し
  - ローディングインジケーターの表示制御
  - エラーメッセージ表示（QRコード未検出、タイムアウト）
  - クリアボタン実装（results、errorをリセット）
  - 3秒タイムアウト設定
  - _Requirements: 2.2, 2.7, 3.7_

- [ ] 10.2* QRScannerのインテグレーションテスト
  - `src/components/qr/QRScanner.test.tsx`を作成
  - 画像アップロード → QRコード検出 → 結果表示フロー
  - ローディング状態の表示テスト
  - エラーメッセージ表示テスト
  - クリアボタン機能テスト
  - _Requirements: 2.2, 2.7, 3.7_

## レイアウトとページの実装

- [ ] 11. 基本レイアウトの実装
- [x] 11.1 (P) BaseLayoutの作成
  - `src/layouts/BaseLayout.astro`を作成
  - HTML基本構造（`<html>`, `<head>`, `<body>`）
  - メタタグ設定（title, description, viewport, charset）
  - OGPメタタグ（Open Graph Protocol）
  - hreflangメタタグ（日本語・英語ページの関連付け）
  - セマンティックHTMLタグ（`<main>`）の使用
  - TailwindCSSのインポート
  - _Requirements: 7.1, 7.2, 7.5, 7.6_

- [x] 11.2 (P) HeaderとFooterの作成
  - `src/components/layout/Header.astro`を作成（静的コンテンツ）
  - `src/components/layout/Footer.astro`を作成（静的コンテンツ）
  - i18n翻訳辞書から多言語テキストを取得
  - レスポンシブデザイン（TailwindCSS）
  - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2_

- [x] 11.3 (P) MainLayoutの作成
  - `src/layouts/MainLayout.astro`を作成
  - BaseLayoutを拡張
  - HeaderとFooterを統合
  - セマンティックHTMLタグ（`<header>`, `<footer>`）の使用
  - _Requirements: 5.1, 5.2, 6.1_

- [ ] 12. ページの実装
- [x] 12.1 日本語ページの作成
  - `src/pages/ja/index.astro`を作成
  - MainLayoutを使用
  - QRScannerコンポーネントを`client:load`で配置
  - hreflangメタタグで英語ページへのリンク
  - 日本語UIテキスト（i18n辞書から取得）
  - _Requirements: 4.2, 4.4, 7.6, 8.3_

- [x] 12.2 英語ページの作成
  - `src/pages/en/index.astro`を作成
  - MainLayoutを使用
  - QRScannerコンポーネントを`client:load`で配置
  - hreflangメタタグで日本語ページへのリンク
  - 英語UIテキスト（i18n辞書から取得）
  - _Requirements: 4.3, 4.4, 7.6, 8.3_

- [x] 12.3 ルートページのリダイレクト
  - `src/pages/index.astro`を作成
  - ブラウザ言語設定を検出してデフォルト言語にリダイレクト
  - 日本語ブラウザ → `/ja`、英語ブラウザ → `/en`
  - _Requirements: 4.2, 4.3, 4.4_

## レスポンシブUIとアクセシビリティ

- [x] 13. レスポンシブデザインの実装
  - すべてのUIコンポーネントにTailwindCSSレスポンシブクラスを適用
  - モバイル（320px〜）、タブレット（768px〜）、デスクトップ（1024px〜）の最適化
  - タッチ操作向けボタンサイズ（最小44x44px）
  - 画面幅768px未満で単一カラムレイアウト
  - 画面幅768px以上で複数カラムレイアウト
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 14. アクセシビリティ対応
  - キーボードナビゲーション（Tab、Enter、Space）のサポート
  - フォーカスインジケーターの視覚的表示
  - ARIA属性の追加（aria-label、role、aria-live等）
  - 画像とアイコンにalt属性を設定
  - スクリーンリーダー対応のテスト
  - WCAG 2.1レベルA準拠の検証
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

## SEOとパフォーマンス最適化

- [ ] 15. (P) SEO設定
  - sitemap.xmlの自動生成（`@astrojs/sitemap`統合）
  - robots.txtの作成
  - 各ページに適切なtitleタグとメタディスクリプションを設定
  - OGP画像（`public/og-image.png`）の配置
  - 構造化データ（Schema.org）の検討（オプション）
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 16. (P) パフォーマンス最適化
  - JavaScriptバンドルサイズの計測（目標: 100KB以下）
  - TailwindCSS未使用クラスの削除（PurgeCSS）
  - QRスキャナーのみReact島として配信（`client:load`）
  - 静的コンテンツ（Header、Footer）をAstroコンポーネントとして配信
  - 画像最適化（Astro Image統合の検討）
  - QRコード解析のタイムアウト設定（3秒以内）
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

## テストとCI/CD

- [ ] 17. E2Eテストの実装
- [ ] 17.1 Playwrightセットアップ
  - Playwrightをインストール
  - `playwright.config.ts`を作成
  - テストディレクトリ（`e2e/`）を作成
  - _Requirements: 8.2_

- [ ] 17.2 E2Eテストシナリオの実装
  - 画像アップロード → QRコード検出 → リンクオープンの一連フロー
  - ドラッグ&ドロップのテスト
  - クリップボードペーストのテスト
  - 複数QRコード検出のテスト
  - エラーケースのテスト（非対応フォーマット、サイズ超過、QRコード未検出）
  - マルチブラウザテスト（Chrome、Firefox、Safari）
  - _Requirements: 1.1, 1.2, 1.3, 2.4, 2.7, 8.2_

- [ ] 18. (P) CI/CDパイプラインの設定
  - GitHub Actionsワークフローファイル（`.github/workflows/deploy.yml`）を作成
  - mainブランチプッシュ時に自動ビルド・デプロイ
  - Vitestユニットテストの実行
  - Playwrightテストの実行
  - 静的ファイルをGitHub Pages（またはCloudflare Pages）にデプロイ
  - _Requirements: 10.2, 10.3, 10.4_

## 最終統合と検証

- [ ] 19. 全体統合テスト
  - すべてのコンポーネントが正しく統合されているか確認
  - 多言語対応（日本語・英語）の動作確認
  - レスポンシブデザインの全画面サイズでの動作確認
  - アクセシビリティ検証ツール（axe、Lighthouse）の実行
  - パフォーマンス計測（Lighthouse、WebPageTest）
  - プライバシー保護の確認（ネットワークタブで外部通信なし）
  - _Requirements: 2.8, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 6.1, 8.1, 9.1, 9.2, 9.3, 9.4, 9.5_

---

## タスク実行ガイド

### 並列実行可能なタスク
`(P)`マークが付いているタスクは、他のタスクと独立して並列実行できます。

### オプショナルなテストタスク
`- [ ]*`マークが付いているタスクは、MVP後に追加可能な補助的テストカバレッジです。コア実装が完了していれば、後回しにできます。

### タスク依存関係
- タスク1-3（プロジェクト初期化）: すべてのタスクの前提条件
- タスク4-6（コアロジック）: タスク7-10（Reactコンポーネント）の前提条件
- タスク7-10（Reactコンポーネント）: タスク11-12（レイアウトとページ）で統合
- タスク13-16（UI/パフォーマンス）: タスク11-12完了後に実施
- タスク17-18（テスト/CI/CD）: タスク12完了後に実施可能
- タスク19（最終統合）: すべてのタスク完了後

### 実装推奨順序
1. プロジェクト初期化（タスク1-3）
2. コアロジック（タスク4-6）
3. Reactコンポーネント（タスク7-10）
4. レイアウトとページ（タスク11-12）
5. レスポンシブ・アクセシビリティ（タスク13-14）
6. SEO・パフォーマンス（タスク15-16）
7. テストとCI/CD（タスク17-18）
8. 最終統合（タスク19）
