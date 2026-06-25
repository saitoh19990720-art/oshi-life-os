import type { PeriodLog } from "../types";
import { addDays, diffDays, todayKey } from "./date";

export interface Prediction {
  enough: boolean; // 予測に足る履歴があるか（生理2回以上）
  avgCycle?: number; // 平均周期（日）
  avgLength?: number | null; // 平均生理日数
  nextStart?: string; // 次の予定開始日（キー）
  daysUntil?: number; // 今日から次の予定まで（マイナス＝過ぎてる）
}

// 過去の生理開始日の間隔から、次の予定日を予測する。
export function predictPeriod(periods: PeriodLog[]): Prediction {
  const starts = periods
    .map((p) => p.start)
    .filter(Boolean)
    .sort();
  if (starts.length < 2) return { enough: false };

  const gaps: number[] = [];
  for (let i = 1; i < starts.length; i++) gaps.push(diffDays(starts[i], starts[i - 1]));
  const avgCycle = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);

  const lengths = periods
    .filter((p) => p.end)
    .map((p) => diffDays(p.end as string, p.start) + 1)
    .filter((n) => n > 0);
  const avgLength = lengths.length
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
    : null;

  const lastStart = starts[starts.length - 1];
  const nextStart = addDays(lastStart, avgCycle);
  const daysUntil = diffDays(nextStart, todayKey());

  return { enough: true, avgCycle, avgLength, nextStart, daysUntil };
}
