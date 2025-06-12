# screenshot-nodejs

🎯 Node.js + puppeteer-core による WebページのスクリーンショットAPI  
ARM/Linux 環境（例：Raspberry Pi）でも動作するように puppeteer-core を使い、Chromium を自前インストールして使用します。

---

## 🚀 Features

- 任意の URL を PNG スクリーンショットとして取得
- OGP画像（1200x630）向けサイズに最適化
- puppeteer-core + system chromium 対応
- headless モード対応
- curlで簡単に利用可能

---

## 🔧 必要環境

- Node.js 16 以上
- Linux（Ubuntu / ARM対応）
- Chromium ブラウザ
- puppeteer-core（Chromium は別途インストール）

---

## 📦 セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/blue-islands/screenshot-nodejs
cd screenshot-nodejs
````

### 2. Chromium をインストール（例: Ubuntu）

```bash
sudo apt update
sudo apt install -y chromium-browser
```

🔍 インストールパスの確認（後で使います）：

```bash
which chromium-browser
```

例: `/usr/bin/chromium-browser`

### 3. Node.js モジュールをインストール

```bash
npm install
```

---

## 🛠 実行方法

```bash
node capture-api.js
```

ログ出力例：

```
Server is running on http://localhost:8091
```

---

## 📸 APIの使い方

URL パラメータ url を指定して、GETリクエストを送信するだけ：

```bash
curl "http://localhost:8091/screenshot?url=https://example.com" --output shot.png
```

→ 1200x630 の PNG画像が保存されます。

---

## ⚙️ puppeteer-core 設定について

以下のように system にインストールされた Chromium を明示的に指定します：

```js
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium-browser",
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-extensions",
    // ...その他のパフォーマンス最適化
  ]
});
```

---

## 🧱 常駐起動（Forever を使う場合）

```bash
npm install -g forever
forever start capture-api.js
```

ログ確認：

```bash
forever list
forever logs
```

---

## 🧪 トラブルシューティング

### エラー: Failed to launch the browser process!

```
Error: Failed to launch the browser process!
chrome: 1: Syntax error: Unterminated quoted string
```

✅ 対処：

* puppeteer ではなく puppeteer-core を使用
* `executablePath` で system の Chromium を指定
* puppeteer-core を使って Chromium を自前でインストール・管理する
