import { useStore, cycleDay } from "../store";
import { Screen, TopBar, Card, Chip } from "../components/ui";

const MOODS = ["😊", "😐", "😔", "😤", "😢"];
const PAINS = ["なし", "少し", "つらい"] as const;
const SYMPTOMS = ["眠気", "だるさ", "頭痛", "腹痛", "むくみ", "イライラ", "食欲↑", "肌荒れ"];

export function Health() {
  const { s, setCycleStart, setMood, setPain, toggleSymptom } = useStore();
  const { health } = s;
  const day = cycleDay(health.cycleStartDate);

  const startCycle = () => {
    const today = new Date();
    setCycleStart(today.toISOString());
  };

  return (
    <Screen>
      <TopBar title="🩸 体調・生理" caption="ローカル保存のみ。誰にも送らないよ。" />

      {/* 生理サイクル */}
      <Card>
        <p className="text-[13px] font-bold text-muted">生理サイクル</p>
        {day ? (
          <div className="mt-2 flex items-end gap-3">
            <span className="font-mincho text-[44px] font-bold leading-none text-accent">{day}</span>
            <span className="pb-1.5 text-[15px] font-medium text-ink">生理 {day}日目</span>
            <button
              onClick={() => setCycleStart(null)}
              className="ml-auto rounded-full border border-line px-4 py-2 text-[13px] font-bold text-muted active:bg-surface"
            >
              生理終了
            </button>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[14px] text-muted">今は記録なし</p>
            <button
              onClick={startCycle}
              className="rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white active:opacity-80"
            >
              生理開始
            </button>
          </div>
        )}
      </Card>

      {/* 今日の体調 */}
      <Card className="mt-4">
        <p className="text-[13px] font-bold text-muted">今日の体調</p>

        <p className="mt-4 mb-2 text-[12px] font-bold text-ink">気分</p>
        <div className="flex justify-between">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[24px] transition-transform ${
                health.mood === m ? "scale-110 bg-accent-soft" : "opacity-60"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <p className="mt-5 mb-2 text-[12px] font-bold text-ink">痛み</p>
        <div className="flex gap-2">
          {PAINS.map((p) => (
            <Chip key={p} active={health.pain === p} onClick={() => setPain(p)}>
              {p}
            </Chip>
          ))}
        </div>

        <p className="mt-5 mb-2 text-[12px] font-bold text-ink">症状</p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((sym) => (
            <Chip key={sym} active={health.symptoms.includes(sym)} onClick={() => toggleSymptom(sym)}>
              {sym}
            </Chip>
          ))}
        </div>
      </Card>
    </Screen>
  );
}
