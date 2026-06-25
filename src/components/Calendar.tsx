import { useState } from "react";
import type { PeriodLog, DailyLog } from "../types";
import { addDays, toKey, todayKey } from "../lib/date";

const WD = ["日", "月", "火", "水", "木", "金", "土"];

function periodDaySet(periods: PeriodLog[], todayK: string): Set<string> {
  const set = new Set<string>();
  for (const p of periods) {
    const end = p.end ?? todayK;
    let cur = p.start;
    let guard = 0;
    while (cur <= end && guard < 90) {
      set.add(cur);
      cur = addDays(cur, 1);
      guard++;
    }
  }
  return set;
}

export function Calendar({
  periods,
  logs,
  predictedNextStart,
  selected,
  onSelect,
}: {
  periods: PeriodLog[];
  logs: Record<string, DailyLog>;
  predictedNextStart?: string;
  selected: string;
  onSelect: (key: string) => void;
}) {
  const today = todayKey();
  const sel = new Date(selected);
  const [ym, setYm] = useState({ y: sel.getFullYear(), m: sel.getMonth() });

  const periodDays = periodDaySet(periods, today);
  const first = new Date(ym.y, ym.m, 1);
  const startWd = first.getDay();
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWd; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toKey(new Date(ym.y, ym.m, d)));

  const move = (delta: number) => {
    const nm = ym.m + delta;
    setYm({ y: ym.y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => move(-1)} className="h-8 w-8 rounded-full text-muted active:bg-surface">
          ‹
        </button>
        <p className="font-mincho text-[15px] font-bold text-ink">
          {ym.y}年 {ym.m + 1}月
        </p>
        <button onClick={() => move(1)} className="h-8 w-8 rounded-full text-muted active:bg-surface">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {WD.map((w, i) => (
          <span
            key={w}
            className={`text-[11px] font-bold ${i === 0 ? "text-rose-400" : i === 6 ? "text-accent" : "text-muted"}`}
          >
            {w}
          </span>
        ))}

        {cells.map((k, i) => {
          if (!k) return <span key={`b${i}`} />;
          const isPeriod = periodDays.has(k);
          const hasLog = !!logs[k] && (logs[k].mood || logs[k].pain || logs[k].symptoms.length > 0);
          const isToday = k === today;
          const isSel = k === selected;
          const isPredicted = k === predictedNextStart;
          const day = Number(k.split("-")[2]);

          return (
            <button key={k} onClick={() => onSelect(k)} className="flex flex-col items-center">
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-[13px] ${
                  isSel
                    ? "bg-accent font-bold text-white"
                    : isPeriod
                      ? "bg-rose-100 font-bold text-rose-500"
                      : "text-ink"
                } ${isToday && !isSel ? "ring-2 ring-accent" : ""} ${
                  isPredicted && !isSel ? "border-2 border-dashed border-rose-300" : ""
                }`}
              >
                {day}
                {hasLog && !isSel && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-100 ring-1 ring-rose-300" />生理
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-rose-300" />次の予定
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-accent" />記録あり
        </span>
      </div>
    </div>
  );
}
