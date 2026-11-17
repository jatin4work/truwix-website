import { describe, expect, it } from "vitest";
import { estimate } from "@/lib/estimator";

describe("project estimate", () => {
  it("manufacturing, 20 people, 40 h/week, 3 systems", () => {
    const e = estimate({ category: "manufacturing", teamSize: 20, hoursPerWeek: 40, systems: 3 });
    expect(e.hoursSavedMonth).toBe(121);
    expect(e.costMin).toBe(440000);
    expect(e.costMax).toBe(680000);
    expect(e.weeksMin).toBe(6);
    expect(e.weeksMax).toBe(11);
    expect(e.yearlyValue).toBe(653000);
    expect(e.errorReduction).toBe(82);
    expect(e.productivityUplift).toBe(20);
  });
  it("more systems cost more and take longer", () => {
    const a = estimate({ category: "startup", teamSize: 5, hoursPerWeek: 10, systems: 1 });
    const b = estimate({ category: "startup", teamSize: 5, hoursPerWeek: 10, systems: 5 });
    expect(b.costMin).toBeGreaterThan(a.costMin);
    expect(b.weeksMax).toBeGreaterThan(a.weeksMax);
  });
  it("decision lag cut never exceeds 95%", () => {
    expect(estimate({ category: "oem", teamSize: 1, hoursPerWeek: 1, systems: 99 }).decisionLagCut).toBe(95);
  });
});
