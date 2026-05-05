"use client";

import { Habit } from "@/types/habit";
import { HabitCard } from "./HabitCard";
import { useMemo } from "react";

interface HabitListProps {
  userId: string;
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onToggle: (habit: Habit, date: string) => void;
}

export function HabitList({
  userId,
  habits,
  onEdit,
  onDelete,
  onToggle,
}: HabitListProps) {
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const userHabits = useMemo(() => {
    return habits.filter((habit) => habit.userId === userId);
  }, [habits, userId]);

  if (userHabits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="text-center py-12 bg-gray-50 rounded-lg"
      >
        <p className="text-gray-500 text-lg">No habits yet</p>
        <p className="text-gray-400 text-sm">
          Create your first habit to get started
        </p>
      </div>
    );
  }

  return (
    <div data-testid="habit-list" className="space-y-4">
      {userHabits.map((habit) => {
        const isCompleted = habit.completions.includes(today);

        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            isCompleted={isCompleted}
            onToggle={() => onToggle(habit, today)}
            onEdit={() => onEdit(habit)}
            onDelete={() => onDelete(habit.id)}
          />
        );
      })}
    </div>
  );
}
