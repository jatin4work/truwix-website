import { describe, expect, it } from "vitest";
import { DAILY_BLOG_TARGET, BLOG_TOPICS, dailyRemaining } from "@/lib/blog-policy";
describe("Daily article policy", () => {
  it("targets 15 articles, within the requested 15–20 daily range", () => { expect(DAILY_BLOG_TARGET).toBe(15); expect(dailyRemaining(4)).toBe(11); expect(dailyRemaining(15)).toBe(0); });
  it("does not exceed the daily target even for a larger callback count", () => { expect(dailyRemaining(14, 20)).toBe(1); expect(dailyRemaining(20)).toBe(0); });
  it("uses distinct automation and IoT topic slots", () => { expect(BLOG_TOPICS).toHaveLength(15); expect(new Set(BLOG_TOPICS).size).toBe(15); expect(BLOG_TOPICS).toContain("industrial IoT sensors and edge gateways"); });
});