import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import { Habit } from "@/types/habit";

describe("toggleHabitCompletion", () => {
  const mockHabit: Habit = {
    id: "1",
    userId: "user-1",
    name: "drink water",
    createdAt: "2024-01-01T00:00:00Z",
    completions: [],
  };

  it("adds completion when not present", () => {
    const date = "2024-01-01";
    const result = toggleHabitCompletion(mockHabit, date);
    expect(result.completions).toContain(date);
  });

  it("removes completion when already present", () => {
    const date = "2024-01-01";
    const habitWithCompletion = {
      ...mockHabit,
      completions: [date],
    };
    const result = toggleHabitCompletion(habitWithCompletion, date);
    expect(result.completions).not.toContain(date);
  });

  it("does not mutate original habit", () => {
    const date = "2024-01-01";
    const original = { ...mockHabit, completions: [...mockHabit.completions] };
    toggleHabitCompletion(mockHabit, date);
    expect(mockHabit).toEqual(original);
  });

  it("preserves other completions", () => {
    const habitWithCompletions = {
      ...mockHabit,
      completions: ["2024-01-01", "2024-01-02"],
    };
    const result = toggleHabitCompletion(habitWithCompletions, "2024-01-03");
    expect(result.completions).toHaveLength(3);
    expect(result.completions).toContain("2024-01-01");
    expect(result.completions).toContain("2024-01-02");
    expect(result.completions).toContain("2024-01-03");
  });
});
