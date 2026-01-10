# Requirements Document

## Project Description (Input)
SnapQR2Link

## Introduction
SnapQR2Linkは、スクリーンショット内のQRコードを解析し、リンクへ直接ジャンプできる軽量Webアプリケーションです。Astroを使用した静的サイト生成（SSG）により、すべての画像処理とQRコード解析をクライアントサイドで完結させ、プライバシーを保護しながら高速なユーザー体験を提供します。

## Requirements

### Requirement 1: 画像アップロード機能
**Objective:** ユーザーとして、スクリーンショットやQRコード画像を簡単にアップロードしたい。そうすることで、カメラを使わずに画面上のQRコードを読み取れる。

#### Acceptance Criteria
1. When ユーザーがファイル選択ボタンをクリックした時, the SnapQR2Linkアプリ shall ファイル選択ダイアログを表示する
2. When ユーザーが画像ファイルをドラッグ＆ドロップエリアにドロップした時, the SnapQR2Linkアプリ shall そのファイルを受け付けて処理を開始する
3. When ユーザーがCtrl+V（またはCmd+V）でクリップボードから画像を貼り付けた時, the SnapQR2Linkアプリ shall クリップボード内の画像を受け付けて処理を開始する
4. The SnapQR2Linkアプリ shall JPG、PNG、WebP、GIF形式の画像ファイルをサポートする
5. The SnapQR2Linkアプリ shall PDF形式はサポートしない（将来的な拡張機能として検討）
6. If アップロードされた画像ファイルが対応フォーマット以外の場合, then the SnapQR2Linkアプリ shall 「このファイル形式はサポートされていません（JPG、PNG、WebP、GIFのみ対応）」というエラーメッセージを表示する
7. If アップロードされた画像ファイルサイズが50MBを超える場合, then the SnapQR2Linkアプリ shall 「ファイルサイズが大きすぎます（最大50MB）」というエラーメッセージを表示する

### Requirement 2: QRコード検出・解析機能
**Objective:** ユーザーとして、アップロードした画像内のQRコードを自動的に検出・解析したい。そうすることで、手動で探す手間を省ける。

#### Acceptance Criteria
1. When 画像がアップロードされた時, the SnapQR2Linkアプリ shall ブラウザ標準のCanvas API（無料）を使用して画像をピクセルデータに変換する
2. When 画像解析が開始された時, the SnapQR2Linkアプリ shall ローディングインジケーターを表示する
3. The SnapQR2Linkアプリ shall jsqrライブラリ（無料、オープンソース）を使用してピクセルデータからQRコードを検出する
4. The SnapQR2Linkアプリ shall 画像内のすべてのQRコードを検出する
5. When QRコードが検出された時, the SnapQR2Linkアプリ shall QRコードをデコードしてデータを取得する
6. When 複数のQRコードが検出された時, the SnapQR2Linkアプリ shall すべてのQRコードをリスト形式で表示する
7. If 画像内にQRコードが検出できなかった場合, then the SnapQR2Linkアプリ shall 「QRコードが検出できませんでした」というメッセージを表示する
8. The SnapQR2Linkアプリ shall サーバーに画像を送信せず、すべての処理をクライアントサイドで実行する

### Requirement 3: 結果表示・アクション機能
**Objective:** ユーザーとして、検出されたQRコードの内容を確認し、URLを即座に開いたりテキストをコピーしたい。そうすることで、目的の情報に素早くアクセスできる。

#### Acceptance Criteria
1. When QRコードがデコードされた時, the SnapQR2Linkアプリ shall デコード結果（URL、テキスト等）をカード形式で表示する
2. When デコード結果が1つのURLのみの場合, the SnapQR2Linkアプリ shall 自動的に新しいタブでそのURLを開く
3. When デコード結果が複数のURLまたはURLとテキストの混在の場合, the SnapQR2Linkアプリ shall 各結果に「リンクを開く」ボタンまたは「コピー」ボタンを表示する
4. When ユーザーが「リンクを開く」ボタンをクリックした時, the SnapQR2Linkアプリ shall 新しいタブでそのURLを開く
5. When デコード結果がURL以外のテキストの場合, the SnapQR2Linkアプリ shall 「コピー」ボタンを表示する
6. When ユーザーが「コピー」ボタンをクリックした時, the SnapQR2Linkアプリ shall テキストをクリップボードにコピーする
7. When テキストがクリップボードにコピーされた時, the SnapQR2Linkアプリ shall 「コピーしました」という確認メッセージを短時間表示する
8. When ユーザーが「クリア」ボタンをクリックした時, the SnapQR2Linkアプリ shall すべての検出結果とアップロードされた画像をクリアする

### Requirement 4: 多言語対応（国際化）
**Objective:** ユーザーとして、日本語または英語で快適に利用したい。そうすることで、海外ユーザーも含めて幅広く利用できる。

#### Acceptance Criteria
1. The SnapQR2Linkアプリ shall 日本語と英語の2言語をサポートする
2. When ユーザーがブラウザの言語設定を日本語にしている時, the SnapQR2Linkアプリ shall デフォルトで日本語UIを表示する
3. When ユーザーがブラウザの言語設定を英語にしている時, the SnapQR2Linkアプリ shall デフォルトで英語UIを表示する
4. The SnapQR2Linkアプリ shall `/ja`と`/en`のルーティングで各言語ページにアクセスできるようにする
5. The SnapQR2Linkアプリ shall 各言語ページに適切な`hreflang`メタタグを設定する

### Requirement 5: レスポンシブUI
**Objective:** ユーザーとして、スマートフォン、タブレット、デスクトップのどのデバイスからでも快適に利用したい。

#### Acceptance Criteria
1. The SnapQR2Linkアプリ shall モバイル（320px〜）、タブレット（768px〜）、デスクトップ（1024px〜）の各画面サイズに最適化されたレイアウトを提供する
2. When モバイルブラウザでアクセスした時, the SnapQR2Linkアプリ shall タッチ操作に最適化されたボタンサイズ（最小44x44px）を提供する
3. When 画面幅が768px未満の時, the SnapQR2Linkアプリ shall 縦スクロール可能な単一カラムレイアウトを表示する
4. When 画面幅が768px以上の時, the SnapQR2Linkアプリ shall 複数カラムレイアウトを表示できる
5. When iPhone SE（320px×568px）のような最小画面サイズでアクセスした時, the SnapQR2Linkアプリ shall 縦スクロールを最小限に抑えるため、各コンポーネントのパディングとスペーシングを削減する
   - MainLayout: `py-3` (small), `py-6` (large)
   - Header: `py-3` (small), `py-4` (large)
   - Footer: `mt-4` (small), `mt-8` (large), `py-3` (small), `py-4` (large)
   - QRScanner: `py-2` (small), `py-6` (large), `space-y-3` (small), `space-y-6` (large)
   - ImageUploader: `p-4` (small), `p-8` (large)

### Requirement 6: アクセシビリティ
**Objective:** ユーザーとして、キーボード操作やスクリーンリーダーを使用しても快適に利用したい。

#### Acceptance Criteria
1. The SnapQR2Linkアプリ shall WCAG 2.1レベルAの基準を満たす
2. The SnapQR2Linkアプリ shall すべてのインタラクティブ要素にキーボードでアクセスできるようにする
3. When ユーザーがTabキーを押した時, the SnapQR2Linkアプリ shall 論理的な順序でフォーカスを移動する
4. The SnapQR2Linkアプリ shall すべての画像とアイコンに適切な代替テキスト（alt属性）を提供する
5. The SnapQR2Linkアプリ shall フォーカス可能な要素に視覚的なフォーカスインジケーターを表示する
6. The SnapQR2Linkアプリ shall スクリーンリーダー向けに適切なARIA属性を設定する

### Requirement 7: SEO対策
**Objective:** サービス提供者として、検索エンジンで発見されやすくしたい。そうすることで、より多くのユーザーに利用してもらえる。

#### Acceptance Criteria
1. The SnapQR2Linkアプリ shall 各ページに適切なタイトルタグとメタディスクリプションを設定する
2. The SnapQR2Linkアプリ shall OGP（Open Graph Protocol）メタタグを設定する
3. The SnapQR2Linkアプリ shall sitemap.xmlを自動生成する
4. The SnapQR2Linkアプリ shall robots.txtを提供する
5. The SnapQR2Linkアプリ shall セマンティックHTMLタグ（header, main, footer等）を適切に使用する
6. When 日本語ページと英語ページが存在する時, the SnapQR2Linkアプリ shall 各ページに`hreflang`属性を設定して言語バリエーションを示す

### Requirement 8: パフォーマンス
**Objective:** ユーザーとして、快適な速度でアプリを利用したい。

#### Acceptance Criteria
1. The SnapQR2Linkアプリ shall 初期ページロードのJavaScriptバンドルサイズを100KB以下に抑える
2. When 画像がアップロードされてからQRコード解析が完了するまで, the SnapQR2Linkアプリ shall 3秒以内に結果を表示する
3. The SnapQR2Linkアプリ shall Astroのアイランドアーキテクチャを活用し、QRスキャナーコンポーネントのみをReact島として配信する
4. The SnapQR2Linkアプリ shall 静的コンテンツ（ヘッダー、フッター、説明文等）はAstroコンポーネントとして配信する

### Requirement 9: プライバシー保護
**Objective:** ユーザーとして、アップロードした画像が外部に送信されないことを保証してほしい。

#### Acceptance Criteria
1. The SnapQR2Linkアプリ shall すべての画像処理とQRコード解析をブラウザ内（クライアントサイド）で実行する
2. The SnapQR2Linkアプリ shall サーバーに画像データを送信しない
3. The SnapQR2Linkアプリ shall 外部サービスにユーザーデータを送信しない
4. The SnapQR2Linkアプリ shall ユーザーの個人情報を収集・保存しない
5. When ユーザーがページをリロードまたは閉じた時, the SnapQR2Linkアプリ shall アップロードされた画像と解析結果をメモリから削除する

### Requirement 10: デプロイメント
**Objective:** サービス提供者として、低コストで高可用性なホスティングを実現したい。

#### Acceptance Criteria
1. The SnapQR2Linkアプリ shall Astroの静的ビルド機能を使用して完全な静的HTMLを生成する
2. The SnapQR2Linkアプリ shall GitHub PagesまたはCloudflare Pagesにデプロイ可能な形式で出力される
3. When ソースコードがmainブランチにプッシュされた時, the CI/CDパイプライン shall 自動的にビルドとデプロイを実行する
4. The SnapQR2Linkアプリ shall CDN経由で配信される

---

## Notes
- 上記要件はすべてEARS（Easy Approach to Requirements Syntax）形式で記述されています
- 要件番号は今後の追加・修正に備えて柔軟に管理します
- 実装フェーズでは技術仕様（ステアリング）に従い、Astro + TypeScript + React島コンポーネントを使用します

## Technical Notes

### Canvas APIとQRコード解析の仕組み
1. ユーザーが画像をアップロード
2. ブラウザ標準のCanvas APIで画像をCanvasに描画
3. `canvas.getImageData()`でピクセルデータ（RGBA配列）を取得
4. jsqrライブラリ（無料、オープンソース）がピクセルデータを解析してQRコードパターンを検出
5. デコード結果を表示

**重要**: すべての処理はブラウザ内で完結し、外部API呼び出しや料金は一切発生しません。

### アイランドアーキテクチャについて

**定義:**
静的HTML（Astro）の中に、インタラクティブなJavaScriptコンポーネント（React）を「島」として配置するアーキテクチャパターン。

**このプロジェクトでの適用:**
```
静的部分（.astro）: ヘッダー、フッター、説明文 → ビルド時にHTMLのみ生成
動的部分（React島）: QRスキャナー、画像アップロード → クライアントサイドJSを配信
```

**メリット:**
- 初期ページロード軽量化: 静的部分はJavaScriptなし（50-100KB削減）
- SEO最適化: 検索エンジンが即座にHTMLを取得可能
- 段階的ロード: `client:load`（即座）、`client:visible`（表示時）を使い分け

**Astroでアイランドアーキテクチャが自然な理由:**
このプロジェクトでは、QRスキャナーというインタラクティブ機能がクライアントサイドJavaScript必須です。Astroで実装する場合、静的部分（ヘッダー等）と動的部分（QRスキャナー）を分離するアイランドアーキテクチャが最も効率的です。

**代替案との比較:**
- **Vite + React（完全SPA）**: すべてReact、初期ロード重め、開発はシンプル
- **Astro + 全部React**: Astroを使う意味が薄い、Vite + Reactと実質同じ
- **Astro + Vanilla JS**: 超軽量だが開発効率低下

このプロジェクトはSEO重視・軽量性重視のため、**Astro + アイランドアーキテクチャが最適**と判断しています。
