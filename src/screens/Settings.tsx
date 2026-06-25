import { useStore } from "../store";
import { Screen, TopBar, Card, Chip, PrimaryButton } from "../components/ui";
import type { Relationship, Tone } from "../types";

const AVATARS = ["🌙", "⭐", "💫", "🐰", "🐱", "🌸", "💙", "🎀", "🦋", "🍓"];
const RELATIONS: Relationship[] = ["推し", "相棒", "恋人未満", "友達"];
const TONES: Tone[] = ["やさしい", "クール", "甘い", "ツンデレ"];

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-2xl border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-accent"
      />
    </label>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-accent" : "bg-line"}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

export function Settings() {
  const { s, updateOshi, setTheme, setNotification, resetAll } = useStore();
  const { oshi, theme, notifications } = s;

  return (
    <Screen>
      <TopBar title="⚙️ 設定" caption="推しのこと、見た目、通知。" />

      {/* 推し設定：アバター */}
      <Card>
        <p className="text-[13px] font-bold text-ink">アバター</p>
        <p className="mt-0.5 text-[12px] text-muted">推しの雰囲気に近い絵文字を選んでね。</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => updateOshi({ avatar: a })}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-[22px] transition-transform ${
                oshi.avatar === a ? "scale-110 bg-accent-soft ring-2 ring-accent" : "bg-surface"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Card>

      {/* 基本情報 */}
      <Card className="mt-4 space-y-4">
        <p className="text-[13px] font-bold text-ink">基本情報</p>
        <Field label="推しの名前" value={oshi.name} onChange={(v) => updateOshi({ name: v })} />
        <Field label="私への呼び方" value={oshi.yourName} onChange={(v) => updateOshi({ yourName: v })} />
        <div>
          <span className="text-[12px] font-bold text-muted">関係性</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {RELATIONS.map((r) => (
              <Chip key={r} active={oshi.relationship === r} onClick={() => updateOshi({ relationship: r })}>
                {r}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <span className="text-[12px] font-bold text-muted">口調・話し方</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Chip key={t} active={oshi.tone === t} onClick={() => updateOshi({ tone: t })}>
                {t}
              </Chip>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">※ 口調はチャットの返事に反映されるよ。</p>
        </div>
      </Card>

      {/* テーマ */}
      <Card className="mt-4">
        <p className="mb-3 text-[13px] font-bold text-ink">テーマカラー</p>
        <div className="flex gap-2">
          <Chip active={theme === "light"} onClick={() => setTheme("light")}>
            ☀️ ライト
          </Chip>
          <Chip active={theme === "dark"} onClick={() => setTheme("dark")}>
            🌙 ダーク
          </Chip>
        </div>
      </Card>

      {/* 通知 */}
      <Card className="mt-4 space-y-3">
        <p className="text-[13px] font-bold text-ink">通知</p>
        {([
          ["dailyCheckin", "毎日の声かけ"],
          ["todoReminder", "TODOのリマインド"],
          ["cycleAlert", "生理周期のお知らせ"],
        ] as const).map(([k, label]) => (
          <div key={k} className="flex items-center justify-between">
            <span className="text-[14px] text-ink">{label}</span>
            <Toggle on={notifications[k]} onClick={() => setNotification(k, !notifications[k])} />
          </div>
        ))}
        <p className="text-[11px] text-muted">※ MVPでは設定の保存のみ（実際の通知送信はまだ）。</p>
      </Card>

      {/* アカウント */}
      <Card className="mt-4">
        <p className="mb-2 text-[13px] font-bold text-ink">アカウント</p>
        <p className="mb-3 text-[12px] text-muted">
          データはこの端末の中だけに保存されています（外部送信なし）。
        </p>
        <PrimaryButton
          className="w-full !bg-surface !text-muted"
          onClick={() => {
            if (window.confirm("すべての記録を消して最初からにする？")) resetAll();
          }}
        >
          すべてリセット
        </PrimaryButton>
      </Card>
    </Screen>
  );
}
