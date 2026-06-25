import type { ReactNode } from "react";

// スクロール領域。下タブ分の余白を確保。
export function Screen({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-y-auto px-5 pb-28 pt-3">{children}</div>;
}

export function TopBar({
  title,
  caption,
  right,
}: {
  title: ReactNode;
  caption?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 pt-2">
      <div className="min-w-0">
        <h1 className="font-mincho text-[22px] font-bold leading-tight text-ink">{title}</h1>
        {caption && <p className="mt-1 text-[13px] leading-snug text-muted">{caption}</p>}
      </div>
      {right}
    </div>
  );
}

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border border-line bg-card p-4 shadow-soft ${onClick ? "cursor-pointer active:scale-[0.99]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 mt-6 flex items-center gap-2 text-[14px] font-bold text-ink">{children}</h2>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
        active
          ? "bg-accent text-white"
          : "border border-line bg-surface text-muted active:bg-accent-soft"
      }`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-[15px] font-bold text-white transition-opacity active:opacity-80 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center rounded-full border border-accent px-6 text-[15px] font-bold text-accent transition-colors active:bg-accent-soft ${className}`}
    >
      {children}
    </button>
  );
}
