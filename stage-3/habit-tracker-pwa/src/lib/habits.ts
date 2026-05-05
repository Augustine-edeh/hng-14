import { Habit } from "@/types/habit";
import { addHabit, deleteHabit, getHabits, updateHabit } from "./storage";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = new Set(habit.completions);

  if (completions.has(date)) {
    completions.delete(date);
  } else {
    completions.add(date);
  }

  return {
    ...habit,
    completions: Array.from(completions).sort(),
  };
}

export function createHabit(
  userId: string,
  name: string,
  description = "",
): Habit {
  const habit: Habit = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `habit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    userId,
    name,
    description,
    frequency: "daily",
    createdAt: new Date().toISOString(),
    completions: [],
  };

  addHabit(habit);
  return habit;
}

export function editHabit(
  habitId: string,
  updates: Partial<Habit>,
): Habit | null {
  const habits = getHabits();
  const habit = habits.find((h) => h.id === habitId);

  if (!habit) return null;

  // Preserve immutable fields
  const updated: Habit = {
    ...habit,
    ...updates,
    id: habit.id,
    userId: habit.userId,
    frequency: "daily",
    createdAt: habit.createdAt,
    completions: habit.completions,
  };

  updateHabit(updated);
  return updated;
}

export function deleteHabitWithId(
  habitId: string,
  confirmDelete: boolean,
): boolean {
  if (!confirmDelete) return false;
  deleteHabit(habitId);
  return true;
}

export function getHabitsByUser(userId: string): Habit[] {
  const habits = getHabits();
  return habits.filter((h) => h.userId === userId);
}
