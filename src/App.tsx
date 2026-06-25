import { useState, type ReactNode } from "react";
import { StoreProvider, useStore } from "./store";
import { BottomNav } from "./components/BottomNav";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { Chat } from "./screens/Chat";
import { Todo } from "./screens/Todo";
import { Health } from "./screens/Health";
import { Memo } from "./screens/Memo";
import { Plan } from "./screens/Plan";
import { Settings } from "./screens/Settings";
import type { ScreenId } from "./types";

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-line/40">
      <div className="relative flex h-[100dvh] w-full max-w-phone flex-col overflow-hidden bg-bg shadow-2xl">
        {children}
      </div>
    </div>
  );
}

function AppShell() {
  const { s } = useStore();
  const [screen, setScreen] = useState<ScreenId>("home");

  if (!s.onboarded) {
    return (
      <Phone>
        <Onboarding />
      </Phone>
    );
  }

  return (
    <Phone>
      {screen === "home" && <Home go={setScreen} />}
      {screen === "chat" && <Chat />}
      {screen === "todo" && <Todo />}
      {screen === "health" && <Health />}
      {screen === "memo" && <Memo go={setScreen} />}
      {screen === "plan" && <Plan />}
      {screen === "settings" && <Settings />}
      <BottomNav active={screen} onChange={setScreen} />
    </Phone>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
