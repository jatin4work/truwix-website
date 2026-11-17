import { act, fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactPopup } from "@/components/site/ContactPopup";
import { isExitIntent, isAboveNavbar } from "@/components/site/contact-policy";

describe("Contact popup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
  });
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });
  it("opens two seconds after a reload, not before", () => {
    render(<ContactPopup />);
    act(() => { vi.advanceTimersByTime(1999); });
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  it("opens the same form when the pointer exits at the top", () => {
    render(<ContactPopup />);
    fireEvent.mouseOut(document, { clientY: 0, relatedTarget: null });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(isExitIntent(100, null)).toBe(false);
  });
  it("opens when the pointer moves above the navbar", () => {
    render(<ContactPopup />);
    fireEvent.mouseMove(document, { clientY: 100 });
    fireEvent.mouseMove(document, { clientY: 4 });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(isAboveNavbar(40, 100)).toBe(false);
  });
});