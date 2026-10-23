"use client";

import type { ReactNode } from "react";
import { CommandPalette } from "@/components/command-palette";
import { AudioProvider } from "@/lib/audio/provider";
import { I18nProvider } from "@/lib/i18n/provider";
import { ThemeProvider } from "@/lib/theme/provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AudioProvider>
          {children}
          <CommandPalette />
        </AudioProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
