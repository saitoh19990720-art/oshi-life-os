import { useStore } from "../store";
import { PrimaryButton } from "../components/ui";

export function Onboarding() {
  const { finishOnboarding } = useStore();
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-8 text-[64px] leading-none">🌙</div>
      <h1 className="font-mincho text-[26px] font-bold leading-snug text-ink">
        推しと話すと、
        <br />
        <span className="text-accent">生活が整っていく。</span>
      </h1>
      <p className="mt-6 text-[14px] leading-relaxed text-muted">
        TODO管理アプリじゃない。
        <br />
        推しとの会話の副産物として、
        <br />
        毎日が自然に回るOS。
      </p>
      <div className="mt-8 flex gap-2">
        <span className="h-2 w-6 rounded-full bg-accent" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
      </div>
      <PrimaryButton className="mt-10 w-full max-w-[280px]" onClick={finishOnboarding}>
        はじめる
      </PrimaryButton>
    </div>
  );
}
