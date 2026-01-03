# Technology Stack

## Architecture

**静的サイト生成（SSG）特化の超軽量Webアプリ**
- Astro（島アーキテクチャ）
- サーバーサイド処理なし（完全な静的ホスティング）
- すべての画像処理・QRコード解析をブラウザ内で実行
- プライバシー重視の設計思想

## Core Technologies

- **Language**: TypeScript 5.x
- **Framework**: Astro 4.x
- **Runtime**: モダンブラウザ（Chrome, Firefox, Safari, Edge最新版）
- **UI Framework**: React 18.x（島コンポーネントとして部分的に使用）

## Key Libraries

- **QRコード解析**: `jsqr` または `@zxing/library`（クライアントサイド）
- **画像処理**: Canvas API（ブラウザネイティブ）
- **多言語化**: Astro i18n（組み込み機能）
- **SEO**: Astro SEO（組み込み、sitemap/robots.txt自動生成）
- **UIスタイリング**: TailwindCSS

## Development Standards

### Type Safety
- TypeScript strict mode有効
- `any`型の使用禁止（やむを得ない場合は`unknown`経由）
- すべてのコンポーネント・関数に型定義

### Code Quality
- **フォーマッター**: Prettier
- **リンター**: ESLint（Astro推奨設定）
- **コミットフック**: husky + lint-staged

### Testing
- **ユニットテスト**: Vitest（Astro推奨）
  - QRコード解析ロジック
  - ファイルバリデーション
  - ユーティリティ関数
- **E2Eテスト**: Playwright（マルチブラウザ対応）
  - 画像アップロード → QRコード検出 → リンクオープンの一連フロー

## Development Environment

### Required Tools
- Node.js 20.x LTS
- パッケージマネージャー: **pnpm**（ディスク効率、厳密な依存管理）

### Common Commands
```bash
# Dev: 開発サーバー起動
pnpm dev

# Build: 静的ファイル生成
pnpm build

# Preview: ビルド結果をローカルでプレビュー
pnpm preview

# Test: ユニットテスト実行
pnpm test

# Lint: ESLint + Prettier実行
pnpm lint
```

## Key Technical Decisions

### Astro採用理由
- **決定**: Astro（SSG特化フレームワーク）を採用
- **理由**:
  - **超軽量**: アイランドアーキテクチャによりQRスキャナー部分のみJSを配信（初期ロード50KB程度）
  - **強力なSEO**: メタタグ、sitemap、OGP、hreflangが組み込みで対応
  - **シンプルさ**: `.astro`ファイルはHTMLライクで学習コスト低
  - **柔軟性**: Reactコンポーネントも使える（段階的移行可能）
  - **パフォーマンス優先**: 単一機能アプリに最適
- **トレードオフ**: エコシステムはNext.jsより小さいが、小規模プロジェクトには十分

### アイランドアーキテクチャの活用
- **静的HTML**: ランディングページ、ヘッダー、フッター等
- **React島**: QRスキャナー、画像アップロード等のインタラクティブ部分のみ
- **ハイドレーション戦略**: `client:load`（即座）、`client:visible`（表示時）を使い分け

### クライアントサイド完結
- **決定**: すべての処理をブラウザ内で完結
- **理由**: プライバシー保護、サーバーコスト削減、高速レスポンス

### 静的ホスティング
- **第一候補**: GitHub Pages または Cloudflare Pages
- **理由**: 無料、CDN配信、CI/CD連携、高可用性

### 多言語対応（国際化）
- **初期対応**: 日本語（デフォルト）・英語
- **実装**: Astroのi18nルーティング（`src/pages/ja/`, `src/pages/en/`）
- **SEO**: 各言語ページで適切な`hreflang`メタタグ自動設定

### アクセシビリティ
- WCAG 2.1 レベルA準拠
- キーボード操作完全対応
- スクリーンリーダー対応（ARIA属性適切使用）

---
_Document standards and patterns, not every dependency_
