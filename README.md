# 推し生活OS（Oshi Life OS）

> 推しと話すと、生活が整っていく。
> TODO管理アプリじゃない。推しとの会話の副産物として、毎日が自然に回るOS。

スマホで使える Web アプリ（PWA）。ホーム画面に追加すると、アプリのように起動できる。

## MVP v0.1 の中身

- **オンボーディング**：コンセプト紹介
- **ホーム**：推しの今日のひとこと／今日やること／メモ／予定
- **チャット（芯）**：推しと話す → 発言から「TODO候補」を自動で拾い、ワンタップでTODO化
- **TODO**：追加・完了・編集・削除（チャットからも自動でたまる）
- **体調**：生理サイクル・気分・痛み・症状の記録
- **プラン**：無料／体調管理パック／お守りプラン（課金UIのみ）
- **設定**：推し設定（名前・呼び方・関係性・口調・アバター）／テーマ（ライト・ダーク）／通知／リセット

口調（やさしい／クール／甘い／ツンデレ）は、チャットの返事に反映される。

## 実装しないもの（MVP範囲外）

外部カレンダー連携／習慣トラッカー／家計管理／気分ログ専用画面／本物の通知／Supabase接続／複数推し管理／ログイン認証。

## データ

すべて **localStorage**（この端末の中だけ）。外部送信なし。

## Tech Stack

React 18 + TypeScript / Vite / Tailwind CSS / lucide-react / PWA（manifest）

## Setup

```bash
npm install
npm run dev      # ローカル起動
npm run build    # 本番ビルド（docs/）
```

## スマホで使う

公開URLをスマホで開く → ブラウザの「ホーム画面に追加」→ アプリのように起動。

## Folder Structure

```
src/
  screens/     Onboarding / Home / Chat / Todo / Health / Plan / Settings
  components/  ui（共通部品）/ BottomNav
  lib/oshi.ts  推しの返事ロジック＋TODO抽出（ローカル・ルールベース）
  store.tsx    localStorage 状態管理
  types.ts     データ型
```

## Future

実際の通知（PWA Push）／複数推し／会話からの予定・メモ自動抽出／本物の課金。
