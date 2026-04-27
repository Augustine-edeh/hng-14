import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "@/lib/streaks";

describe("calculateCurrentStreak", () => {
  it("returns 0 for empty completions", () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it("returns 1 for single completion", () => {
    const today = new Date().toISOString();
    expect(calculateCurrentStreak([today])).toBe(1);
  });

  it("calculates streak for consecutive days", () => {
    const today = new Date();
    const dates = [
      new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ];
    expect(calculateCurrentStreak(dates)).toBe(3);
  });

  it("stops streak at gap", () => {
    const today = new Date();
    const dates = [
      new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ];
    expect(calculateCurrentStreak(dates)).toBe(2);
  });

  it("handles null or undefined", () => {
    expect(calculateCurrentStreak(null as any)).toBe(0);
    expect(calculateCurrentStreak(undefined as any)).toBe(0);
  });
});
