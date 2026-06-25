# 推し生活OS — CLAUDE.md

> Claude Codeへの実装指示書。このファイルを読んでから実装を始めること。

---

## プロジェクト概要

**アプリ名:** 推し生活OS
**コンセプト:** 推し人格AIとの会話を通じて、TODO・メモ・予定が自然に整理される生活管理アプリ
**核心:** 「生活管理をするために開く」のではなく「推しに会うために開いた結果、生活が整う」

---

## 技術スタック

```
フロントエンド: React Native（スマホアプリ）または Next.js + PWA
スタイリング:   Tailwind CSS
AI:           Anthropic Claude API（claude-sonnet-4-20250514）
ストレージ:     ローカルストレージ（初期）→ Supabase（後で差し替え）
```

> ⚠ 重要（Claude注記）：Anthropic APIは**ブラウザから直接呼ばない**（キー露出・CORS）。
> 公開版はサーバ/プロキシ（例：n8n）経由 or ローカルモック応答にする。現状のデモはローカルフォールバックで動く。

---

## アーキテクチャ方針

### Mobile First
- スマホ（390px）を主軸に設計
- PC（768px以上）ではサイドバーレイアウトに切り替え
- スマホ: 下部ナビのみ / PC: 左サイドバーのみ（両方同時表示しない）

### ライト/ダークモード
- **必ず両方実装する**（システム設定連動 + 手動トグル）
- CSS変数でテーマ管理（`data-theme="dark"` / `data-theme="light"`）
- `body.className` クラス切り替えは避け、`document.documentElement.setAttribute` を使う

### データ構造

```typescript
type Oshi = {
  name: string
  callname: string        // ユーザーへの呼び方
  relation: string        // 推し / 相棒 / 恋人 / 友達 など
  tone: string            // やさしい / クール / 甘い / ツンデレ / 明るい / 無口 / 丁寧
  first: string           // 一人称（サブスク機能）
  second: string          // 二人称（サブスク機能）
  nowords: string         // 使わない言葉（サブスク機能）
  core: string            // 性格の核（サブスク機能）
  banned: string          // 禁止事項（サブスク機能）
  avatarImg: string|null  // base64画像
  mode: 'secretary' | 'friend' | 'oshi'  // 3モード
}

type Task = {
  id: string
  text: string
  dueDate: string | null  // YYYY-MM-DD
  priority: 'high' | 'mid' | 'low'
  status: 'todo' | 'done'
  createdAt: string
}

type Memo = {
  id: string
  text: string
  date: string
  source: 'chat' | 'manual'
}

type PlanItem = {
  id: string
  text: string
  time: string | null     // HH:MM
  cat: 'task' | 'fun' | 'care' | 'rest'
  date: string            // YYYY-MM-DD
}

type HealthLog = {
  date: string
  mood: string            // 絵文字
  pain: 'なし' | '少し' | 'つらい' | 'かなりつらい'
  tags: string            // 症状タグ（カンマ区切り）
  memo: string
  period: boolean         // 生理中かどうか
}
```

---

## 画面構成

### スマホ下部ナビ（6項目）
🏠 ホーム / 💬 チャット / 📋 タスク / 🗒 メモ / 🩸 体調 / ⚙️ 設定

### PCサイドバー（7項目）
🏠 ホーム / 💬 チャット / 📋 タスク / 🗒 メモ / 🩸 体調 / 🧿 プラン / ⚙️ 設定

### 各画面の役割
| 画面 | 役割 |
|------|------|
| ホーム | 推しカード・今日のタスク・今日の予定・推しのコメント |
| チャット | Claude API直結・TODO/メモ/予定の候補抽出・保存先選択 |
| タスク | CRUD・期限4択（今日/明日/日付指定/なし）・優先度3段階 |
| メモ | CRUD・チャットから自動保存 |
| 体調 | 気分/痛み/症状ログ・生理サイクル（買い切り機能） |
| プラン | 課金プラン選択画面 |
| 設定 | 推し設定（3モード選択 → 詳細折りたたみ） |

---

## Claude API実装

### システムプロンプトに注入するもの
推し名・呼び方・関係性・口調／3モード（秘書/友達/推し）の人格定義／一人称・二人称・禁止ワード・性格の核（サブスク時のみ）／今日の予定一覧／お守りモードON/OFF／現在時刻・時間帯

### 会話履歴
- 直近10件を保持してAPIに渡す／推し設定変更時は履歴リセット／max_tokens: 300（短め・テンポ重視）

### フォールバック
- API失敗時はローカルのモック応答で継続・ユーザーにエラーを見せない

### 候補抽出（ローカル処理）
チャット内容からTODO/メモ/予定の候補をローカルで検出し、保存提案カードを表示（📋タスク候補/🗒メモ候補/🗓予定候補）

---

## 課金設計（確定版）
| プラン | 内容 | 金額 |
|--------|------|------|
| 無料 | チャット月20回・TODO/メモ/予定・体調ログ・3モード選択・名前/呼び方/関係性設定 | ¥0 |
| 買い切り | 生理サイクル記録・予測 | ¥480 |
| 月額（お守りプラン） | 一人称/二人称/禁止ワード/性格の核・チャット月200回・お守りモード・通知文生成 | ¥480/月 |

軸:「記録する行為は無料、AIが深く動く体験は課金」「無料でも推しっぽい体験。本当に自分の推しにするのがサブスク」
**重要: 記録データはどのプランでも手元に残る。月額停止後もデータは消えない。**

---

## お守りモード
体調・生理中に有効化。TODOを3件以下に制限／チャットの語気をやさしく／「頑張れ」系を使わない／休む選択肢を先に出す／夜は安眠モードへ。

---

## 予定のカテゴリと推しの反応
| カテゴリ | アイコン | 反応方向 |
|----------|---------|--------------|
| task | 📋 | 締切・急かし「急いでよ」 |
| fun | 🎉 | ワクワク「楽しみだね」 |
| care | 🏥 | 寄り添い「ちゃんと行ってね」 |
| rest | 💤 | のんびり「ゆっくり休んでよ」 |

推しコメントは `時間帯 × カテゴリ × モード` で変化。

---

## デザイントークン
### Dark
--bg:#101A24 / --surface:#172331 / --surface2:#203044 / --accent:#5BB8D4 / --text:#E2EEF6 / --muted:#6A8898 / --border:rgba(255,255,255,.08) / --memo:#9A88C8 / --plan:#C48098 / --done:#6AAA80 / --danger:#C06868
### Light
--bg:#F6FAFC / --surface:#FFFFFF / --surface2:#EAF4F8 / --accent:#5CB6D8 / --text:#1F2A33 / --muted:#6F8291 / --border:rgba(0,0,0,.08) / --memo:#B8A8D8 / --plan:#F4A7B9 / --done:#A8D5B5 / --danger:#E07A7A
### スペーシング
画面左右16px / カード内16px / カード間12px / セクション間24px / 下部ナビ余白80px
### 角丸
大カード20px / 小カード14px / ボタン12px / チップ20px / アバターcircle

---

## コンポーネント分割方針
components/ OshiAICard・ChatBubble・ExtractCard・TaskItem・MemoCard・PlanItem・ScheduleComment・BottomNav・SideNav・ThemeToggle・OshiModeSelect・PrioritySelect・DueDateSelect・PlanCatSelect・OmamoriToggle・PlanPriceCard
hooks/ useOshi・useChat・useTasks・useMemos・usePlans・useHealth・useTheme
utils/ buildSystemPrompt・extractFromChat・formatDate・getScheduleComment

---

## やらないこと（MVP）
外部カレンダー連携／SNS共有／音声通話／AI画像生成／医療アドバイス／複数推しの高度管理（初期1人）／リアルタイム通知（初期はアプリ内のみ）／アカウント登録・ログイン（初期はローカル）

---

## 参考デモ
`oshi-life-os-v2.0.html`（全機能入り1ファイルHTMLデモ）／Figma: `GYlb1N1gi1KL3KURZXVJr5`

## 実装ステップ（推奨順）
1.データ型定義 2.useOshi/useTheme 3.BottomNav/SideNav 4.ホーム 5.チャット(API接続) 6.タスク 7.メモ 8.予定 9.体調 10.設定 11.プラン 12.お守りモード 13.Codexレビュー
