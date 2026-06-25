// 推し生活OS のデータ型。全部 localStorage に保存（外部送信なし）。

export type Theme = "light" | "dark";
export type Relationship = "推し" | "相棒" | "恋人未満" | "友達";
export type Tone = "やさしい" | "クール" | "甘い" | "ツンデレ";
export type PlanId = "free" | "health" | "omamori";
export type ScreenId = "home" | "chat" | "todo" | "health" | "plan" | "settings" | "memo";

export interface OshiConfig {
  name: string;
  yourName: string;
  avatar: string; // 絵文字 or dataURL
  relationship: Relationship;
  tone: Tone;
  // キャラの“素の設定”（ユーザーがカスタマイズ）
  firstPerson: string; // 一人称（例：わたし／俺／僕）
  catchphrase: string; // 口癖（例：〜だね）
  persona: string; // 性格・キャラ設定（自由記述）
  ngWords: string; // 使わない言葉（NGワード・カンマ区切り）
  gentleOnPeriod: boolean; // 生理中だけ特別やさしくモード
}

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

export interface Memo {
  id: string;
  title: string;
  date: string; // MM/DD
}

export interface PlanItem {
  id: string;
  text: string;
  when: string;
}

export interface ChatMsg {
  id: string;
  role: "oshi" | "me";
  text: string;
  ts: number;
  // 推しのメッセージに付くTODO候補（未追加のときだけ表示）
  suggestion?: string;
  suggestionResolved?: boolean;
}

export type Pain = "なし" | "少し" | "つらい";

export interface DailyLog {
  mood: string | null; // 絵文字
  pain: Pain | null;
  symptoms: string[];
}

export interface PeriodLog {
  start: string; // YYYY-MM-DD
  end: string | null; // YYYY-MM-DD（進行中はnull）
}

export interface HealthState {
  cycleStartDate: string | null; // 進行中の生理の開始日キー（無ければnull）
  periods: PeriodLog[]; // 生理の履歴（予測に使う）
  logs: Record<string, DailyLog>; // 日付キー → その日の記録（一日ごと管理）
}

export interface Notifications {
  dailyCheckin: boolean;
  todoReminder: boolean;
  cycleAlert: boolean;
}

export interface AppState {
  onboarded: boolean;
  theme: Theme;
  plan: PlanId;
  oshi: OshiConfig;
  todos: Todo[];
  memos: Memo[];
  plans: PlanItem[];
  chat: ChatMsg[];
  health: HealthState;
  notifications: Notifications;
}
