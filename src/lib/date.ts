// 日付キー（YYYY-MM-DD・ローカル）ユーティリティ。

export function toKey(d: Date): string {
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
}

export function todayKey(): string {
  return toKey(new Date());
}

export function keyToDate(k: string): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(k: string, n: number): string {
  const d = keyToDate(k);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

// a - b （日数）
export function diffDays(a: string, b: string): number {
  return Math.round((keyToDate(a).getTime() - keyToDate(b).getTime()) / 86400000);
}

export function formatMD(k: string): string {
  const d = keyToDate(k);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
