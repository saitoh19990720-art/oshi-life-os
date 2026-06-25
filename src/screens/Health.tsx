import { useState } from "react";
import { useStore, cycleDay } from "../store";
import { Screen, TopBar, Card, Chip } from "../components/ui";
import { Calendar } from "../components/Calendar";
import { predictPeriod } from "../lib/period";
import { todayKey, formatMD } from "../lib/date";
import type { Pain } from "../types";

const MOODS = ["😊", "😐", "😔", "😤", "😢"];
const PAINS: Pain[] = ["なし", "少し", "つらい"];
const SYMPTOMS = ["眠気", "だるさ", "頭痛", "腹痛", "むくみ", "イライラ", "食欲↑", "肌荒れ"];

export function Health() {
  const { s, startPeriod, endPeriod, setMood, setPain, toggleSymptom } = useStore();
  const { health } = s;
  const [selected, setSelected] = useState(todayKey());

  const day = cycleDay(health.cycleStartDate);
  const pred = predictPeriod(health.periods);
  const log = health.logs[selected] ?? { mood: null, pain: null, symptoms: [] };
  const selLabel = selected === todayKey() ? "今日" : formatMD(selected);

  return (
    <Screen>
      <TopBar title="🩸 体調・生理" caption="ローカル保存のみ。誰にも送らないよ。" />

      {/* サイクル状況＋予測 */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-muted">生理サイクル</p>
          {health.cycleStartDate ? (
            <button
              onClick={endPeriod}
              className="rounded-full border border-line px-4 py-1.5 text-[12px] font-bold text-muted active:bg-surface"
            >
              生理終了
            </button>
          ) : (
            <button
              onClick={startPeriod}
              className="rounded-full bg-rose-400 px-4 py-1.5 text-[12px] font-bold text-white active:opacity-80"
            >
              生理開始
            </button>
          )}
        </div>

        {day ? (
          <div className="mt-2 flex items-end gap-3">
            <span className="font-mincho text-[44px] font-bold leading-none text-rose-400">{day}</span>
            <span className="pb-1.5 text-[15px] font-medium text-ink">生理 {day}日目</span>
          </div>
        ) : (
          <p className="mt-2 text-[14px] text-muted">今は生理中じゃないよ。</p>
        )}

        {/* 次の予定（過去の傾向から予測） */}
        <div className="mt-3 rounded-2xl bg-surface p-3">
          {pred.enough ? (
            <p className="text-[13px] leading-relaxed text-ink">
              🗓 次の生理予定：<span className="font-bold text-rose-500">{formatMD(pred.nextStart!)}</span>{" "}
              {pred.daysUntil! >= 0 ? (
                <span className="text-muted">（あと {pred.daysUntil} 日）</span>
              ) : (
                <span className="text-muted">（予定日から {Math.abs(pred.daysUntil!)} 日経過）</span>
              )}
              <br />
              <span className="text-[11px] text-muted">
                平均周期 約{pred.avgCycle}日
                {pred.avgLength ? `・生理 約${pred.avgLength}日` : ""}（過去{health.periods.length}回から）
              </span>
            </p>
          ) : (
            <p className="text-[12px] leading-relaxed text-muted">
              🔮 生理をあと{" "}
              <span className="font-bold text-rose-500">{Math.max(1, 2 - health.periods.length)}回</span>{" "}
              記録すると、過去の傾向から次の予定日を予測するよ。
            </p>
          )}
        </div>
      </Card>

      {/* カレンダー（一日ごと管理） */}
      <Card className="mt-4">
        <Calendar
          periods={health.periods}
          logs={health.logs}
          predictedNextStart={pred.enough ? pred.nextStart : undefined}
          selected={selected}
          onSelect={setSelected}
        />
      </Card>

      {/* 選んだ日の記録 */}
      <Card className="mt-4">
        <p className="text-[13px] font-bold text-ink">
          {selLabel}の体調
          {selected !== todayKey() && (
            <button
              onClick={() => setSelected(todayKey())}
              className="ml-2 text-[11px] font-bold text-accent"
            >
              今日に戻る
            </button>
          )}
        </p>

        <p className="mt-4 mb-2 text-[12px] font-bold text-ink">気分</p>
        <div className="flex justify-between">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(selected, m)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[24px] transition-transform ${
                log.mood === m ? "scale-110 bg-accent-soft" : "opacity-60"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <p className="mt-5 mb-2 text-[12px] font-bold text-ink">痛み</p>
        <div className="flex gap-2">
          {PAINS.map((p) => (
            <Chip key={p} active={log.pain === p} onClick={() => setPain(selected, p)}>
              {p}
            </Chip>
          ))}
        </div>

        <p className="mt-5 mb-2 text-[12px] font-bold text-ink">症状</p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((sym) => (
            <Chip key={sym} active={log.symptoms.includes(sym)} onClick={() => toggleSymptom(selected, sym)}>
              {sym}
            </Chip>
          ))}
        </div>
      </Card>
    </Screen>
  );
}
