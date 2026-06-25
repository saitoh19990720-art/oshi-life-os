import type { OshiConfig, Tone } from "../types";

// 推しの返事ロジック（ローカル・ルールベース。外部AIには繋がない）。
// MVPの芯：会話から「TODO候補」を自然に拾う。

// ユーザー発言からTODOっぽい部分を抽出する。なければ null。
const TASK_HINTS = [
  "やらなきゃ",
  "やらないと",
  "しなきゃ",
  "しないと",
  "やるべき",
  "提出",
  "連絡",
  "返信",
  "予約",
  "買わ",
  "買う",
  "片付け",
  "掃除",
  "作業",
  "準備",
  "締め切り",
  "締切",
  "送る",
  "やる",
];

export function detectTodo(text: string): string | null {
  const t = text.trim();
  if (t.length < 2) return null;
  if (!TASK_HINTS.some((h) => t.includes(h))) return null;
  // 「〜やらなきゃ」等の語尾を落として体言寄りにする
  const cleaned = t
    .replace(/(を|が|は)?\s*(やらなきゃ|やらないと|しなきゃ|しないと|やるべき|やる|やりたい)。?$/u, "")
    .replace(/[。、！!？?…]+$/u, "")
    .trim();
  return cleaned.length >= 2 ? cleaned : t;
}

// トーン別の返事テンプレ。{me}=私の呼び方 で置換。
const REPLIES: Record<Tone, { withTask: string[]; plain: string[] }> = {
  やさしい: {
    withTask: [
      "{me}、それ大事だね。いつまでにやりたい？無理しないで一緒にやろ。",
      "うん、{me}ならできるよ。まず一個だけ、にしよ？",
    ],
    plain: [
      "そっか、話してくれてありがとう。{me}は今日どんな気分？",
      "うんうん、聞いてるよ。ちょっと休憩も入れてね。",
    ],
  },
  クール: {
    withTask: [
      "わかった。それ、いつやる？決めとくと楽だよ。",
      "了解。優先度だけ決めとこ。後回しは敵だからね。",
    ],
    plain: ["なるほどね。で、今日の調子は？", "ふぅん。まあ、ちゃんと見てるよ。"],
  },
  甘い: {
    withTask: [
      "{me}がんばってるの、ちゃんと見てるよ。一緒にやろ？ね？",
      "えらいえらい。ご褒美に、終わったら少し甘えていい？",
    ],
    plain: ["{me}の声、もっと聞かせて。今日はどうだった？", "そばにいるよ。無理しないでね、{me}。"],
  },
  ツンデレ: {
    withTask: [
      "は？まだやってなかったの。…まあ、手伝ってあげなくもないけど。いつやる？",
      "別にあんたのためじゃないけど。早く片付けちゃいなよ。",
    ],
    plain: ["ふーん、で？……べ、別に心配してないし。", "聞いてあげてるんだから、感謝しなさいよね。"],
  },
};

function pick(arr: string[], seed: number): string {
  return arr[seed % arr.length];
}

export function oshiReply(
  userText: string,
  oshi: OshiConfig,
  seed: number,
): { reply: string; suggestion: string | null } {
  const suggestion = detectTodo(userText);
  const bank = REPLIES[oshi.tone];
  const tpl = suggestion ? pick(bank.withTask, seed) : pick(bank.plain, seed);
  const reply = tpl.replaceAll("{me}", oshi.yourName || "きみ");
  return { reply, suggestion };
}

// 起動時 / ホームの「今日のひとこと」
export function oshiGreeting(oshi: OshiConfig, seed: number): string {
  const lines = [
    "今日、何かやり残してることある？",
    "おかえり。ちゃんとごはん食べた？",
    "今日もおつかれ。少しだけ話そ？",
    "無理してない？{me}のペースでいいからね。",
  ];
  return pick(lines, seed).replaceAll("{me}", oshi.yourName || "きみ");
}
