# SnapQR2Link

SnapQR2Linkは、スクリーンショット内のQRコードを解析し、リンクへ直接ジャンプできる軽量Webアプリケーションです。

## 概要

カメラ不要でPC画面上のQRコードを読み取り、URLへ即座にアクセスできます。すべての画像処理はブラウザ内で完結し、プライバシーを保護します。

### 主な機能

- **画像内QRコード検出**: アップロードされた画像から自動的にQRコードを検出・解析
- **即座のリンクアクセス**: URLを含むQRコードをワンクリックで開く
- **複数QRコード対応**: 1枚の画像に複数のQRコードが含まれる場合も全て検出
- **プライバシー重視**: すべての処理をクライアントサイドで完結（画像はサーバーに送信されない）
- **多言語対応**: 日本語・英語に対応

## 技術スタック

- **Framework**: Astro 4.x (Island Architecture)
- **UI Library**: React 18.x
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: TailwindCSS 4.x
- **QR Detection**: jsqr 1.4.0
- **Testing**: Vitest, Playwright

## プロジェクト構造

```text
/
├── public/              # 静的アセット
├── src/
│   ├── components/      # UIコンポーネント（Astro/React）
│   ├── layouts/         # レイアウトコンポーネント
│   ├── pages/           # ページ（ファイルベースルーティング）
│   ├── lib/             # コアロジック（フレームワーク非依存）
│   └── i18n/            # 多言語対応
├── .kiro/               # Kiro仕様管理
└── package.json
```

## コマンド

| Command | Action |
| :--- | :--- |
| `pnpm install` | 依存関係をインストール |
| `pnpm dev` | 開発サーバーを起動 (`localhost:4321`) |
| `pnpm build` | 本番用ビルド (`./dist/`) |
| `pnpm preview` | ビルド結果をローカルでプレビュー |
| `pnpm test` | ユニットテストを実行 |
| `pnpm test:e2e` | E2Eテストを実行 |

## 開発ガイドライン

- TypeScript strict mode有効
- `any`型の使用禁止
- TDD (Test-Driven Development) の実践
- アイランドアーキテクチャ: 静的コンテンツはAstro、動的部分はReact島

## ライセンス

MIT License
