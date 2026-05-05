import { describe, expect, it } from "vitest";
import {
  createHabit,
  deleteHabitWithId,
  editHabit,
  getHabitsByUser,
} from "@/lib/habits";
import { getHabits } from "@/lib/storage";
import { cn } from "@/lib/utils";

describe("habit domain helpers", () => {
  it("creates daily habits for a user and filters by owner", () => {
    const first = createHabit("user-1", "Drink Water", "Morning");
    const second = createHabit("user-2", "Read Books", "");

    expect(first).toEqual(
      expect.objectContaining({
        userId: "user-1",
        name: "Drink Water",
        description: "Morning",
        frequency: "daily",
        completions: [],
      }),
    );
    expect(getHabits()).toHaveLength(2);
    expect(getHabitsByUser("user-1")).toEqual([first]);
    expect(getHabitsByUser("user-2")).toEqual([second]);
  });

  it("edits mutable fields and preserves immutable habit fields", () => {
    const habit = createHabit("user-1", "Old Name", "Old");
    const updated = editHabit(habit.id, {
      id: "changed",
      userId: "changed",
      name: "New Name",
      description: "New",
      createdAt: "changed",
      frequency: "daily",
      completions: ["2026-04-29"],
    });

    expect(updated).toEqual({
      ...habit,
      name: "New Name",
      description: "New",
      frequency: "daily",
      completions: [],
    });
    expect(editHabit("missing", { name: "Nope" })).toBeNull();
  });

  it("requires confirmation before deleting a habit", () => {
    const habit = createHabit("user-1", "Stretch", "");

    expect(deleteHabitWithId(habit.id, false)).toBe(false);
    expect(getHabits()).toHaveLength(1);

    expect(deleteHabitWithId(habit.id, true)).toBe(true);
    expect(getHabits()).toEqual([]);
  });

  it("merges class names predictably", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
  });
});
