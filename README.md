# BootstrapVueポータル

BootstrapVueを使用したポータルアプリケーションです。

## セットアップ

依存関係をインストールします：

```bash
npm install
```

## 開発サーバーの起動

以下のコマンドで開発サーバーを起動します：

```bash
npm start
```

または

```bash
npx http-server -a localhost -p 8000 -o
```

ブラウザが自動的に開き、`http://localhost:8000`でアプリケーションにアクセスできます。

## 開発サーバーの停止

```bash
Ctrl + C
```

## プロジェクト構成

```
bootstrapvue-portal/
├── public/              # 静的ファイル
│   ├── css/            # スタイルシート
│   ├── data/           # データファイル
│   ├── faq/            # FAQコンテンツ
│   ├── js/             # JavaScriptライブラリ
│   ├── index.html      # メインページ
│   ├── calendar.html   # カレンダーページ
│   └── faq.html        # FAQページ
├── package.json        # プロジェクト設定
└── README.md          # このファイル
```

## 使用ライブラリ

- Vue.js v2.6.12
- BootstrapVue v2.21.2
- Axios v0.21.1
- PapaParse v5.4.1
- FullCalendar v6.1.8
