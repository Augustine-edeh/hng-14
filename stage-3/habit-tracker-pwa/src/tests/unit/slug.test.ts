import { describe, it, expect } from "vitest";
import { getHabitSlug } from "@/lib/slug";

describe("getHabitSlug", () => {
  it("converts spaces to hyphens", () => {
    expect(getHabitSlug("drink water")).toBe("drink-water");
  });

  it("converts to lowercase", () => {
    expect(getHabitSlug("Drink Water")).toBe("drink-water");
  });

  it("removes special characters", () => {
    expect(getHabitSlug("drink water!")).toBe("drink-water");
  });

  it("handles multiple spaces", () => {
    expect(getHabitSlug("drink   water")).toBe("drink-water");
  });

  it("trims leading and trailing spaces", () => {
    expect(getHabitSlug("  drink water  ")).toBe("drink-water");
  });
});
