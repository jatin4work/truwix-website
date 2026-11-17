import { useCallback, useEffect, useState } from "react";

import { applyThemeMode, readThemeMode, setThemeMode, type ThemeMode } from "@/lib/theme";

// Follows the device until the visitor picks a theme, then keeps that pick.
export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const initial = readThemeMode();
    setMode(initial);
    applyThemeMode(initial);

    if (typeof window.matchMedia !== "function") return;
    const lightScheme = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (readThemeMode() === "system") applyThemeMode("system");
    };
    lightScheme.addEventListener("change", onChange);
    return () => lightScheme.removeEventListener("change", onChange);
  }, []);

  const choose = useCallback((next: ThemeMode) => {
    setMode(next);
    setThemeMode(next);
  }, []);

  return { mode, choose };
}
