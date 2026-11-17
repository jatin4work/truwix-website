// Theme mode resolution: the site follows the device (system) unless the visitor
// picks light or dark explicitly. Every browser read lives inside a function so this
// module stays safe to import during SSR.

export type ThemeMode = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "truwix-theme";

export function devicePrefersLight(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

export function readThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

export function isLight(mode: ThemeMode): boolean {
  return mode === "light" || (mode === "system" && devicePrefersLight());
}

export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const light = isLight(mode);
  document.documentElement.classList.toggle("light", light);
  document.documentElement.classList.toggle("dark", !light);
}

export function setThemeMode(mode: ThemeMode): void {
  try {
    if (mode === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Storage can be blocked (private mode); the in-memory class change still applies.
  }
  applyThemeMode(mode);
}

// Runs in <head> before first paint so the page never flashes the wrong theme.
export const THEME_INIT_SCRIPT = `(function(){try{var k="truwix-theme",v=localStorage.getItem(k),l=v==="light"||(v!=="dark"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches),c=document.documentElement.classList;c.toggle("light",l);c.toggle("dark",!l);}catch(e){}})();`;
