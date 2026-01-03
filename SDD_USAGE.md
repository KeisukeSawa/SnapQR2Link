# SnapQR2Link - cc-sddを使ったスペック駆動開発ガイド

## cc-sddとは

cc-sdd（Custom Claude for Specification Driven Development）は、Claude Codeなど複数のAIエージェントに対応した仕様駆動開発（SDD）を実現するツールです。

**特徴：**
- 「要件 → 設計 → タスク → 実装」の流れを強制
- 実装前に仕様を承認する事前承認ゲート
- プロジェクト全体のメモリとパターンを保持
- 並列実行可能なタスク分解

---

## セットアップ完了

cc-sddは既にこのプロジェクトにセットアップ済みです。以下のファイルが作成されています：

```
.claude/commands/kiro/     # 11個のスラッシュコマンド
.kiro/settings/            # テンプレートとルール（25ファイル）
CLAUDE.md                  # プロジェクトメモリドキュメント
```

---

## 重要：Claude Codeの再起動が必要

**スラッシュコマンドを使用する前に、Claude Codeを再起動してください。**

再起動後、以下のスラッシュコマンドが使えるようになります：
- `/kiro:steering`
- `/kiro:spec-init`
- など

---

## 基本ワークフロー

### Phase 0（推奨）: プロジェクト全体のステアリング設定

プロジェクトの基本方針、技術スタック、アーキテクチャパターンを定義します。

```
/kiro:steering
```

カスタムステアリングドキュメントを追加：
```
/kiro:steering-custom <作成したいドキュメント名>
```

**注意：** 既存プロジェクトの場合は必須。新規プロジェクトでも推奨。

---

### Phase 1: 仕様策定

#### ステップ1: 機能の初期化

新しい機能を開始する際に実行します。

```
/kiro:spec-init "SnapQR2Linkのコア機能実装"
```

または具体的な機能名で：
```
/kiro:spec-init "QRコード解析とリンクジャンプ機能"
```

これにより `.kiro/specs/<機能名>/` ディレクトリが作成されます。

#### ステップ2: 要件定義

EARS形式で要件を生成します（15項目程度）。

```
/kiro:spec-requirements qrcode-scanner
```

生成されるファイル: `.kiro/specs/qrcode-scanner/requirements.md`

#### ステップ3（任意）: ギャップ検証

既存コードベースとの差分を確認します。

```
/kiro:validate-gap qrcode-scanner
```

#### ステップ4: 設計書作成

Mermaid図付きのアーキテクチャ設計を生成します。

```
/kiro:spec-design qrcode-scanner
```

または承認をスキップして自動生成：
```
/kiro:spec-design qrcode-scanner -y
```

生成されるファイル: `.kiro/specs/qrcode-scanner/design.md`

#### ステップ5（任意）: 設計レビュー

設計書をレビューします。

```
/kiro:validate-design qrcode-scanner
```

#### ステップ6: タスク分解

依存関係付きで実装タスクを分解します。

```
/kiro:spec-tasks qrcode-scanner
```

または承認をスキップして自動生成：
```
/kiro:spec-tasks qrcode-scanner -y
```

生成されるファイル: `.kiro/specs/qrcode-scanner/tasks.md`

---

### Phase 2: 実装

#### 実装の実行

タスクを指定して実装を開始します。

```
/kiro:spec-impl qrcode-scanner task-1 task-2
```

または全タスクを実装：
```
/kiro:spec-impl qrcode-scanner
```

#### 実装検証（任意）

実装後に検証を実行します。

```
/kiro:validate-impl qrcode-scanner
```

---

## 進捗確認

いつでも進捗を確認できます。

```
/kiro:spec-status qrcode-scanner
```

または全機能の状態を確認：
```
/kiro:spec-status
```

---

## 利用可能なコマンド一覧

| コマンド | 説明 |
|---------|------|
| `/kiro:spec-init` | 新機能の初期化 |
| `/kiro:spec-requirements` | 要件定義の生成 |
| `/kiro:spec-design` | 設計書の作成 |
| `/kiro:spec-tasks` | タスク分解 |
| `/kiro:spec-impl` | 実装実行 |
| `/kiro:spec-status` | 進捗確認 |
| `/kiro:steering` | プロジェクト全体のステアリング設定 |
| `/kiro:steering-custom` | カスタムステアリングドキュメント作成 |
| `/kiro:validate-gap` | 既存コードとのギャップ検証 |
| `/kiro:validate-design` | 設計レビュー |
| `/kiro:validate-impl` | 実装検証 |

---

## ファイル構造

```
SnapQR2Link/
├── .claude/
│   └── commands/
│       └── kiro/              # cc-sddコマンド（11ファイル）
│           ├── steering.md
│           ├── spec-init.md
│           ├── spec-requirements.md
│           ├── spec-design.md
│           ├── spec-tasks.md
│           ├── spec-impl.md
│           ├── spec-status.md
│           ├── steering-custom.md
│           ├── validate-gap.md
│           ├── validate-design.md
│           └── validate-impl.md
├── .kiro/
│   ├── settings/              # テンプレートとルール（25ファイル）
│   │   └── templates/         # カスタマイズ可能なテンプレート
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   ├── steering/              # プロジェクト全体の方針
│   │   ├── product.md         # プロダクト方針
│   │   ├── tech.md            # 技術スタック
│   │   └── structure.md       # プロジェクト構造
│   └── specs/                 # 機能ごとの仕様書
│       └── <機能名>/
│           ├── spec.json      # 仕様メタデータ
│           ├── requirements.md # 要件定義
│           ├── design.md      # 設計書
│           └── tasks.md       # タスクリスト
├── CLAUDE.md                  # プロジェクトメモリ
├── SPECIFICATION.md           # 製品仕様書（既存）
└── SDD_USAGE.md              # このファイル
```

---

## SnapQR2Linkでの推奨フロー

### 最初のステップ

**1. Claude Codeを再起動してください**

**2. ステアリング設定（推奨）：**
   ```
   /kiro:steering
   ```
   これにより、プロダクトの方針、技術スタック、プロジェクト構造が定義されます。

**3. コア機能の仕様作成：**
   ```
   /kiro:spec-init "QRコード解析とリンクジャンプ機能"
   /kiro:spec-requirements qrcode-core
   /kiro:spec-design qrcode-core -y
   /kiro:spec-tasks qrcode-core -y
   ```

**4. 実装開始：**
   ```
   /kiro:spec-impl qrcode-core
   ```

---

## カスタマイズ

### テンプレートのカスタマイズ

`.kiro/settings/templates/` 内のテンプレートを編集することで、生成される仕様書の形式をカスタマイズできます。

例：
- `requirements.md` - 要件定義のテンプレート
- `design.md` - 設計書のテンプレート
- `tasks.md` - タスクリストのテンプレート

### ステアリングドキュメントの追加

プロジェクト固有のルールやパターンを追加：
```
/kiro:steering-custom "セキュリティガイドライン"
/kiro:steering-custom "UIコンポーネント規約"
```

---

## ベストプラクティス

1. **段階的な承認：**
   - 各フェーズ（要件、設計、タスク）で内容を確認してから次に進む
   - `-y` フラグは理解している場合のみ使用

2. **ステアリングの維持：**
   - プロジェクトの成長に合わせてステアリングドキュメントを更新
   - 新しいパターンや標準が確立したら追加

3. **仕様の分割：**
   - 大きな機能は複数の仕様に分割
   - 依存関係を明確にする

4. **進捗の定期確認：**
   - `/kiro:spec-status` で全体の進捗を把握

---

## トラブルシューティング

### スラッシュコマンドが認識されない場合

**Claude Codeを再起動してください。** `.claude/commands/kiro/` 内のコマンドが読み込まれます。

再起動の方法：
1. Claude Codeを完全に終了
2. 再度Claude Codeを起動
3. このプロジェクトを開く

### 仕様が生成されない場合

1. ステアリングが設定されているか確認：
   ```
   /kiro:spec-status
   ```

2. `.kiro/specs/` ディレクトリを確認

### テンプレートを変更したい場合

`.kiro/settings/templates/` 内のファイルを直接編集してください。

---

## 既存のSPECIFICATION.mdとの関係

- **SPECIFICATION.md** - プロダクト全体の仕様書（手動で作成したもの）
- **cc-sdd** - 各機能を段階的に開発するためのツール

cc-sddは、SPECIFICATION.mdで定義した要件を**具体的な機能単位**に分解し、「要件→設計→タスク→実装」の流れで開発を進めるためのツールです。

---

## 参考リンク

- [cc-sdd GitHub Repository](https://github.com/gotalab/cc-sdd)
- プロジェクトメモリ: `CLAUDE.md`
- 製品仕様書: `SPECIFICATION.md`

---

## 次のステップ

**1. Claude Codeを再起動**

**2. ステアリング設定を実行：**
   ```
   /kiro:steering
   ```

**3. コア機能の仕様を作成：**
   ```
   /kiro:spec-init "SnapQR2Linkのコア機能"
   ```

**4. 要件定義から始める：**
   ```
   /kiro:spec-requirements <機能名>
   ```

これで、スペック駆動開発の準備が整いました。
