import { beforeEach, describe, expect, it } from "vitest";

import {
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  applyThemeMode,
  isLight,
  readThemeMode,
  setThemeMode,
} from "@/lib/theme";

function setDevice(light: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: light === query.includes("light"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}

function reset() {
  window.localStorage.clear();
  document.documentElement.classList.remove("light", "dark");
}

describe("Theme follows the device", () => {
  beforeEach(reset);

  it("has no stored choice, so the device decides", () => {
    setDevice(false);
    expect(readThemeMode()).toBe("system");
    expect(isLight("system")).toBe(false);
  });

  it("keeps the page dark when the device is dark", () => {
    setDevice(false);
    applyThemeMode("system");
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("turns the page light when the device is light", () => {
    setDevice(true);
    applyThemeMode("system");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("keeps an explicit light choice even on a dark device", () => {
    setDevice(false);
    setThemeMode("light");
    expect(readThemeMode()).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("keeps an explicit dark choice even on a light device", () => {
    setDevice(true);
    setThemeMode("dark");
    expect(readThemeMode()).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("going back to system clears the stored choice", () => {
    setDevice(true);
    setThemeMode("dark");
    setThemeMode("system");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("the head script picks the device theme before first paint", () => {
    setDevice(true);
    window.eval(THEME_INIT_SCRIPT);
    expect(document.documentElement.classList.contains("light")).toBe(true);

    reset();
    setDevice(false);
    window.eval(THEME_INIT_SCRIPT);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("the head script respects an explicit choice over the device", () => {
    setDevice(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    window.eval(THEME_INIT_SCRIPT);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
