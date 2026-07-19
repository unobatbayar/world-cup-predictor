"use client";

import { ModelSettingsProvider } from "@/context/ModelSettingsContext";
import { TeamModalProvider } from "@/context/TeamModalContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ModelSettingsProvider>
      <TeamModalProvider>{children}</TeamModalProvider>
    </ModelSettingsProvider>
  );
}
