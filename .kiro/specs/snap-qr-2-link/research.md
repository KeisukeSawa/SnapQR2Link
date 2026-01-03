# Research & Design Decisions

---
**Purpose**: Capture discovery findings, architectural investigations, and rationale that inform the technical design.
---

## Summary
- **Feature**: `snap-qr-2-link`
- **Discovery Scope**: New Feature (greenfield)
- **Key Findings**:
  - Astroのアイランドアーキテクチャは`client:load`、`client:visible`、`client:idle`で段階的ハイドレーションを実現
  - jsqrライブラリはCanvas APIのImageDataを直接処理、TypeScript対応済み
  - Clipboard APIは非同期メソッド（navigator.clipboard.read）とpasteイベントの2つのアプローチをサポート

## Research Log

### Astro 4 アイランドアーキテクチャとReact統合

- **Context**: Astro + Reactでの最適なハイドレーション戦略の決定
- **Sources Consulted**:
  - [Islands architecture - Astro Docs](https://docs.astro.build/en/concepts/islands/)
  - [Islands Architecture in React Explained With Best Practices](https://www.dhiwise.com/post/islands-architecture-in-react-a-complete-practical-guide)
  - [Understanding Astro islands architecture - LogRocket Blog](https://blog.logrocket.com/understanding-astro-islands-architecture/)
- **Findings**:
  - `client:load`: ページロード時即座にハイドレート（ナビゲーションバー、重要機能向け）
  - `client:visible`: スクロールでビューポートに入った時にハイドレート（カルーセル、画像スライダー向け）
  - `client:idle`: ブラウザアイドル時にハイドレート（モーダル、ドロップダウン向け）
  - デフォルトではJavaScriptゼロ配信、明示的にオプトインした島のみJSを送信
- **Implications**:
  - QRスキャナーは`client:load`（即座に利用可能である必要）
  - ヘッダー・フッターは静的Astroコンポーネント（JSなし）
  - 初期ロードを50-100KB程度に抑えられる

### jsqr ライブラリAPI仕様

- **Context**: QRコード検出ライブラリの選定とAPI理解
- **Sources Consulted**:
  - [jsqr - npm](https://www.npmjs.com/package/jsqr)
  - [GitHub - cozmo/jsQR](https://github.com/cozmo/jsQR)
  - [Building a JavaScript QR code scanner with jsQR](https://scanbot.io/techblog/javascript-qr-code-scanner-jsqr-qr-scanner-tutorial/)
- **Findings**:
  - **関数シグネチャ**: `jsQR(imageData: Uint8ClampedArray, width: number, height: number, options?: Options)`
  - **戻り値**: `{ data: string, location: { topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner } } | null`
  - **imageData**: Canvas APIの`getImageData()`で取得したRGBAピクセル配列
  - **options.inversionAttempts**: 白黒反転QRコード対応（`attemptBoth`、`dontInvert`、`onlyInvert`、`invertFirst`）
  - TypeScript型定義あり、完全にスタンドアローン動作
- **Implications**:
  - Canvas APIで画像を描画 → `getImageData()` → jsqrに渡すフローが確定
  - 複数QRコード検出には画像の異なる領域を走査する必要
  - location情報でQRコードの位置を特定可能

### Clipboard API - 画像ペースト実装

- **Context**: Ctrl+V（Cmd+V）での画像ペースト機能の実装方法
- **Sources Consulted**:
  - [How to paste images | Clipboard | web.dev](https://web.dev/patterns/clipboard/paste-images)
  - [Clipboard API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
  - [Clipboard: read() method - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read)
- **Findings**:
  - **非同期Clipboard API**: `navigator.clipboard.read()`でClipboardItemを取得（最初の呼び出しで権限要求）
  - **同期Clipboard API**: `paste`イベントの`event.clipboardData.files`から画像ファイルを取得
  - **ハイブリッドアプローチ**: 非同期APIを優先、フォールバックで同期API
  - ブラウザはテキスト、HTML、PNG画像データを一般的にサポート
- **Implications**:
  - `paste`イベントリスナーで`event.clipboardData.files`を取得
  - FileReaderでBlobをDataURLまたはArrayBufferに変換
  - Canvas APIで画像をロードして処理フローに統合

### Astro i18n ルーティング設定

- **Context**: 日本語・英語の多言語対応実装
- **Sources Consulted**:
  - [Internationalization (i18n) Routing - Astro Docs](https://docs.astro.build/en/guides/internationalization/)
  - [Add i18n features - Astro Docs](https://docs.astro.build/en/recipes/i18n/)
  - [Internationalization (i18n) in Astro 5](https://medium.com/@paul.pietzko/internationalization-i18n-in-astro-5-78281827d4b4)
- **Findings**:
  - **設定**: `astro.config.mjs`で`i18n.locales`と`i18n.defaultLocale`を定義
  - **フォルダ構造**: `src/pages/[locale]/`でファイルベースルーティング（例: `src/pages/ja/index.astro`, `src/pages/en/index.astro`）
  - **ヘルパー関数**: `astro:i18n`モジュールから`getRelativeLocaleUrl()`等を利用
  - **prefixDefaultLocale**: `false`（デフォルト言語にプレフィックスなし）または`true`（全言語にプレフィックス）
- **Implications**:
  - `/ja`と`/en`ルーティングが自動生成される
  - `hreflang`メタタグは手動設定（Astroの`<link rel="alternate">`）
  - 翻訳辞書は`src/i18n/locales/{ja,en}.json`で管理

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| アイランドアーキテクチャ（Astro） | 静的HTMLに動的React島を配置 | 初期ロード軽量（50-100KB）、SEO最適 | 学習曲線、エコシステム小 | 選択済み：軽量性・SEO重視に最適 |
| 完全SPA（Vite + React） | すべてReactでCSR | 開発シンプル、エコシステム大 | 初期ロード重い（200-300KB） | 却下：SEO・軽量性要件に不適合 |
| Vanilla JS | フレームワークなし | 超軽量、依存なし | 開発効率低、保守性低 | 却下：TypeScript・React経験活用不可 |

## Design Decisions

### Decision: `jsqr vs @zxing/library`

- **Context**: QRコード解析ライブラリの選定
- **Alternatives Considered**:
  1. **jsqr** — 軽量（~50KB）、シンプルなAPI、TypeScript対応
  2. **@zxing/library** — 多機能（バーコード対応）、重い（~200KB）、複雑なAPI
- **Selected Approach**: jsqr
- **Rationale**:
  - QRコード専用で軽量性要件に合致
  - APIがシンプル（`jsQR(imageData, width, height)`）
  - TypeScript型定義済み、strict mode対応
  - バーコード機能は不要
- **Trade-offs**:
  - メリット: 軽量、学習コスト低、パフォーマンス高
  - デメリット: QRコード以外のバーコード非対応（要件外）
- **Follow-up**: 実装時に複数QRコード検出のパフォーマンステスト

### Decision: `Clipboard API - paste event vs navigator.clipboard.read()`

- **Context**: Ctrl+V画像ペースト実装方法
- **Alternatives Considered**:
  1. **paste event** — 同期、ブラウザ互換性高、権限不要
  2. **navigator.clipboard.read()** — 非同期、モダン、初回権限要求
- **Selected Approach**: paste event（優先）
- **Rationale**:
  - ユーザーのCtrl+V操作に直接反応、権限プロンプト不要
  - ブラウザ互換性が高い
  - `event.clipboardData.files`で画像ファイルを直接取得
- **Trade-offs**:
  - メリット: シンプル、権限不要、互換性高
  - デメリット: pasteイベントのみ（プログラマティックなクリップボード読み取り不可）
- **Follow-up**: フォールバックで`navigator.clipboard.read()`を検討（将来拡張）

### Decision: `TailwindCSS v4 (Oxide Engine) for UI Styling`

- **Context**: UIスタイリング手法の選定
- **Alternatives Considered**:
  1. **TailwindCSS v4** — ユーティリティファースト、Oxide Engine、ビルド時最適化
  2. **CSS Modules** — スコープ付きCSS、TypeScript対応
  3. **Styled Components** — CSS-in-JS、React統合
- **Selected Approach**: TailwindCSS v4
- **Rationale**:
  - Astroと相性良好（公式統合）
  - **Oxide Engine**: 従来比10倍高速なビルド、ネイティブCSS変数活用
  - レスポンシブデザイン（`sm:`、`md:`、`lg:`）が簡潔
  - 未使用クラスを自動削除、バンドル最小化
  - ユーティリティクラスで迅速なプロトタイピング
- **Trade-offs**:
  - メリット: 高速開発、超高速ビルド、バンドル最小、レスポンシブ対応容易
  - デメリット: HTML肥大化、学習コスト（ユーティリティクラス名）
- **Follow-up**: Tailwind設定で不要バリアントを無効化

## Risks & Mitigations

- **Risk 1**: 大容量画像（50MB近く）のCanvas処理でブラウザメモリ不足
  - **Mitigation**: 画像リサイズ処理を追加（最大4000x4000px等の制限）、処理前にメモリ推定
- **Risk 2**: 複数QRコード検出のパフォーマンス劣化
  - **Mitigation**: Web Worker での非同期処理、プログレスインジケーター表示
- **Risk 3**: jsqrの複雑なQRコード（高密度、歪み）の検出精度
  - **Mitigation**: `inversionAttempts: 'attemptBoth'`オプション、検出失敗時のユーザーガイダンス

## References

- [Islands architecture - Astro Docs](https://docs.astro.build/en/concepts/islands/)
- [jsqr - npm](https://www.npmjs.com/package/jsqr)
- [Clipboard API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Internationalization (i18n) Routing - Astro Docs](https://docs.astro.build/en/guides/internationalization/)
- [Canvas API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
