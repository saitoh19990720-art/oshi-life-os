import { useState } from "react";
import { useStore } from "../store";
import { Screen, Card } from "../components/ui";
import type { ScreenId } from "../types";

export function Memo({ go }: { go: (s: ScreenId) => void }) {
  const { s, addMemo, deleteMemo } = useStore();
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    addMemo(text);
    setText("");
  };

  return (
    <Screen>
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => go("home")}
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[18px] text-muted active:bg-surface"
          aria-label="ホームへ"
        >
          ←
        </button>
        <h1 className="font-mincho text-[22px] font-bold text-ink">🗒 フリーメモ</h1>
      </div>
      <p className="mb-4 ml-10 mt-1 text-[13px] text-muted">気になったこと、何でも。端末内だけに保存。</p>

      {/* 追加 */}
      <Card className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="メモを書く…（コスメ、思いつき、推しの予定 など）"
          className="w-full resize-none bg-transparent text-[14px] leading-relaxed text-ink outline-none placeholder:text-muted"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={add}
            className="rounded-full bg-accent px-5 py-2 text-[13px] font-bold text-white active:opacity-80"
          >
            保存
          </button>
        </div>
      </Card>

      {/* 一覧 */}
      {s.memos.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-muted">まだメモはないよ。</p>
      ) : (
        <div className="space-y-3">
          {s.memos.map((m) => (
            <Card key={m.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-ink">
                  {m.title}
                </p>
                <p className="mt-1.5 text-[11px] text-muted">{m.date}</p>
              </div>
              <button
                onClick={() => deleteMemo(m.id)}
                className="shrink-0 px-1 text-[15px] opacity-70 active:opacity-100"
                aria-label="削除"
              >
                🗑
              </button>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}
