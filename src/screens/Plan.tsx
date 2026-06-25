import { useStore } from "../store";
import { Screen, TopBar, Card } from "../components/ui";
import type { PlanId } from "../types";

const PLANS: {
  id: PlanId;
  emoji: string;
  name: string;
  price: string;
  term: string;
  recommend?: boolean;
}[] = [
  { id: "free", emoji: "🌱", name: "無料プラン", price: "¥0", term: "ずっと" },
  { id: "health", emoji: "🩸", name: "体調管理パック", price: "¥480", term: "買い切り" },
  { id: "omamori", emoji: "🧿", name: "お守りプラン", price: "¥480", term: "月", recommend: true },
];

export function Plan() {
  const { s, setPlan } = useStore();

  return (
    <Screen>
      <TopBar title="プラン" caption="お守りプラン" />
      <div className="mb-5">
        <p className="font-mincho text-[20px] font-bold text-ink">推しと、もっと深く。</p>
        <p className="mt-1 text-[13px] text-muted">記録データは全プランで手元に残るよ。</p>
      </div>

      <div className="space-y-3">
        {PLANS.map((p) => {
          const current = s.plan === p.id;
          return (
            <Card key={p.id} className={p.recommend ? "border-accent" : ""}>
              {p.recommend && (
                <span className="mb-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-white">
                  ✦ おすすめ
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-ink">
                    {p.emoji} {p.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    <span className="text-[18px] font-bold text-ink">{p.price}</span> / {p.term}
                  </p>
                </div>
                <button
                  onClick={() => setPlan(p.id)}
                  disabled={current}
                  className={`rounded-full px-4 py-2 text-[13px] font-bold ${
                    current
                      ? "border border-line text-muted"
                      : "bg-accent text-white active:opacity-80"
                  }`}
                >
                  {current ? "現在のプラン" : p.id === "free" ? "これにする" : `${p.price} で選ぶ`}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[11px] text-muted">
        ※ MVPのため、実際の課金処理はまだ。今はタップで切り替えのみ。
      </p>
    </Screen>
  );
}
