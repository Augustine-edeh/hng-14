import { Habit } from "@/types/habit";
import { addHabit, updateHabit, deleteHabit, getHabits } from "./storage";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...habit.completions];
  const dateIndex = completions.indexOf(date);

  if (dateIndex > -1) {
    completions.splice(dateIndex, 1);
  } else {
    completions.push(date);
  }

  return {
    ...habit,
    completions,
  };
}

export function createHabit(
  userId: string,
  name: string,
  description?: string,
): Habit {
  const habit: Habit = {
    id: `habit-${Date.now()}`,
    userId,
    name,
    description,
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
    createdAt: habit.createdAt,
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
