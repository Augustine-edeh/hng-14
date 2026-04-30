import { describe, expect, it } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import { Habit } from "@/types/habit";

const habit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "",
  frequency: "daily",
  createdAt: "2026-04-29T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    expect(toggleHabitCompletion(habit, "2026-04-29").completions).toContain(
      "2026-04-29",
    );
  });

  it("removes a completion date when the date already exists", () => {
    const result = toggleHabitCompletion(
      { ...habit, completions: ["2026-04-29"] },
      "2026-04-29",
    );
    expect(result.completions).not.toContain("2026-04-29");
  });

  it("does not mutate the original habit object", () => {
    const original = { ...habit, completions: [] };
    toggleHabitCompletion(original, "2026-04-29");
    expect(original.completions).toEqual([]);
  });

  it("does not return duplicate completion dates", () => {
    const result = toggleHabitCompletion(
      { ...habit, completions: ["2026-04-29", "2026-04-29"] },
      "2026-04-28",
    );
    expect(result.completions).toEqual(["2026-04-28", "2026-04-29"]);
  });
});
