# Project Structure

## Organization Philosophy

**Astro + 機能ベースのシンプルな構成**

小規模なクライアントサイドアプリケーションとして、Astroの規約に従いつつ、過度な抽象化を避けます。

## Directory Patterns

### Pages（ルーティング）
**Location**: `/src/pages/`
**Purpose**: ファイルベースルーティング、各言語のページ
**Example**:
```
src/pages/
├── ja/
│   └── index.astro     # 日本語メインページ
├── en/
│   └── index.astro     # 英語メインページ
└── index.astro         # リダイレクト（デフォルト言語へ）
```

### Layouts（レイアウト）
**Location**: `/src/layouts/`
**Purpose**: 共通レイアウトコンポーネント
**Example**:
```
src/layouts/
├── BaseLayout.astro    # 基本レイアウト（HTML構造、メタタグ）
└── MainLayout.astro    # メインレイアウト（ヘッダー、フッター含む）
```

### Components（UIコンポーネント）
**Location**: `/src/components/`
**Purpose**: 再利用可能なUIコンポーネント（.astro / .tsx）
**Example**:
```
src/components/
├── ui/                 # 汎用UIコンポーネント（Astro）
│   ├── Button.astro
│   └── Card.astro
├── qr/                 # QR機能特化コンポーネント（React島）
│   ├── QRScanner.tsx   # メインスキャナー（client:load）
│   ├── ImageUploader.tsx
│   ├── QRResultList.tsx
│   └── QRResultCard.tsx
└── layout/             # レイアウトパーツ（Astro）
    ├── Header.astro
    └── Footer.astro
```

### Lib（コアロジック）
**Location**: `/src/lib/`
**Purpose**: フレームワーク非依存のビジネスロジック
**Example**:
```
src/lib/
├── qr/
│   ├── scanner.ts      # QRコード解析ロジック
│   └── validator.ts    # 画像バリデーション
├── utils/
│   ├── file.ts         # ファイル操作ユーティリティ
│   └── url.ts          # URL検証・整形
└── types/
    └── qr.ts           # QR関連の型定義
```

### i18n（多言語対応）
**Location**: `/src/i18n/`
**Purpose**: 翻訳辞書とi18nユーティリティ
**Example**:
```
src/i18n/
├── locales/
│   ├── ja.json         # 日本語翻訳
│   └── en.json         # 英語翻訳
└── utils.ts            # i18nヘルパー関数
```

### Public（静的アセット）
**Location**: `/public/`
**Purpose**: 画像、ファビコン、robots.txt等（ビルド時にルートにコピー）
**Example**: `favicon.ico`, `og-image.png`

### Tests
**Location**: 各ファイルと並列に `.test.ts` または `/src/__tests__/`
**Purpose**: テストファイル
**Example**:
```
src/
├── lib/
│   └── qr/
│       ├── scanner.ts
│       └── scanner.test.ts
└── __tests__/
    └── components/
        └── qr/
            └── QRScanner.test.tsx
```

## Naming Conventions

- **Files**: kebab-case（例: `qr-scanner.ts`）または PascalCase（コンポーネント: `QRScanner.tsx`, `Button.astro`）
- **Components**: PascalCase（例: `ImageUploader`, `QRResultCard`, `BaseLayout`）
- **Functions**: camelCase（例: `scanQRCode`, `validateImage`）
- **Types/Interfaces**: PascalCase、Interfaceには`I`プレフィックスなし（例: `QRResult`, `ScanOptions`）
- **Constants**: UPPER_SNAKE_CASE（例: `MAX_FILE_SIZE`, `SUPPORTED_FORMATS`）

## Import Organization

**Astroファイル（.astro）:**
```astro
---
// 1. 外部ライブラリ
import { Image } from 'astro:assets'

// 2. レイアウト
import BaseLayout from '@/layouts/BaseLayout.astro'

// 3. コンポーネント
import Header from '@/components/layout/Header.astro'
import QRScanner from '@/components/qr/QRScanner.tsx'

// 4. ユーティリティ・型
import { getI18n } from '@/i18n/utils'
import type { QRResult } from '@/lib/types/qr'

// 5. スタイル
import '@/styles/global.css'
---
```

**Reactコンポーネント（.tsx）:**
```typescript
// 1. React
import { useState } from 'react'

// 2. 内部モジュール（@/エイリアス使用）
import { scanQRCode } from '@/lib/qr/scanner'
import type { QRResult } from '@/lib/types/qr'

// 3. コンポーネント（React島のみ、Astroコンポーネントはimportしない）
import { QRResultCard } from '@/components/qr/QRResultCard'

// 4. 相対パス（同階層のみ）
import { validateImage } from './validator'
```

**Path Aliases**（tsconfig.json）:
- `@/*` → `/src/*`（`src/components/`, `src/lib/`等にアクセス）

## Code Organization Principles

### 責任の分離
- **Pages**: ルーティング、SEOメタデータ、ページ構成
- **Layouts**: HTML構造、共通レイアウト（静的）
- **Components**: UI表示・ユーザーインタラクション（.astro は静的、.tsx は動的）
- **Lib**: ビジネスロジック（QRコード解析、バリデーション）

### 依存方向
```
Pages → Layouts → Components → Lib
（ルート）（レイアウト）（UI）    （ロジック）
```
- Libはフレームワーク非依存（React/Astroをimportしない）
- ComponentsはLibを利用可能
- 逆方向の依存は禁止（Libから Componentsを参照しない）

### ファイル配置ルール
- **Colocation**: 関連ファイルは近くに配置（例: `scanner.ts` と `scanner.test.ts`）
- **Feature grouping**: 機能ごとにディレクトリ分け（例: `/components/qr/`, `/lib/qr/`）
- **最小限の抽象化**: 1-2回しか使わないユーティリティは作らない

### アイランドアーキテクチャの使い分け
- **Astroコンポーネント（.astro）**: 静的コンテンツ（ヘッダー、フッター、レイアウト等）
- **React島（.tsx + client指定）**: インタラクティブ部分のみ
  - `client:load`: 即座にロード（QRスキャナー等、重要な機能）
  - `client:visible`: 表示時にロード（スクロールで表示される部分）
  - `client:idle`: アイドル時にロード（優先度低い機能）

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
