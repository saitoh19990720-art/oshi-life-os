import { useRef, useState } from "react";
import { useStore } from "../store";
import { Screen, TopBar, Card } from "../components/ui";

export function Todo() {
  const { s, addTodo, toggleTodo, editTodo, deleteTodo } = useStore();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const remain = s.todos.filter((t) => !t.done).length;

  const add = () => {
    // 空のときは「押せない」感を消すため、入力欄をフォーカスして促す
    if (!text.trim()) {
      inputRef.current?.focus();
      return;
    }
    addTodo(text);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <Screen>
      <TopBar title="📋 TODO" caption={`残り ${remain} 件。会話からも自動でたまるよ。`} />

      {/* 追加（formにして Enter でも + でも確実に追加） */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="mb-4 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="やること を追加…"
          className="h-11 flex-1 rounded-full border border-line bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-[22px] text-white active:opacity-80"
        >
          +
        </button>
      </form>

      <Card className="space-y-1 p-2">
        {s.todos.length === 0 && (
          <p className="px-2 py-6 text-center text-[13px] text-muted">
            まだ空っぽ。推しと話すと、ここに増えていくよ。
          </p>
        )}
        {s.todos.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-2xl px-2 py-2.5 active:bg-surface"
          >
            <button
              onClick={() => toggleTodo(t.id)}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-[11px] ${
                t.done ? "border-accent bg-accent text-white" : "border-line"
              }`}
            >
              {t.done ? "✓" : ""}
            </button>
            <span
              className={`flex-1 text-[14px] ${t.done ? "text-muted line-through" : "text-ink"}`}
            >
              {t.title}
            </span>
            <button
              onClick={() => {
                const v = window.prompt("やることを編集", t.title);
                if (v && v.trim()) editTodo(t.id, v.trim());
              }}
              className="px-1 text-[15px] opacity-70 active:opacity-100"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteTodo(t.id)}
              className="px-1 text-[15px] opacity-70 active:opacity-100"
            >
              🗑
            </button>
          </div>
        ))}
      </Card>
    </Screen>
  );
}
