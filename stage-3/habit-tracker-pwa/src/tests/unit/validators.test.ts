import { describe, it, expect } from "vitest";
import { validateHabitName } from "@/lib/validators";

describe("validateHabitName", () => {
  it("accepts valid habit names", () => {
    expect(validateHabitName("drink water")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(validateHabitName("")).toBe(false);
  });

  it("rejects string with only whitespace", () => {
    expect(validateHabitName("   ")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(validateHabitName(null as any)).toBe(false);
    expect(validateHabitName(undefined as any)).toBe(false);
    expect(validateHabitName(123 as any)).toBe(false);
  });

  it("rejects names longer than 100 characters", () => {
    const longName = "a".repeat(101);
    expect(validateHabitName(longName)).toBe(false);
  });

  it("accepts names up to 100 characters", () => {
    const maxName = "a".repeat(100);
    expect(validateHabitName(maxName)).toBe(true);
  });
});
