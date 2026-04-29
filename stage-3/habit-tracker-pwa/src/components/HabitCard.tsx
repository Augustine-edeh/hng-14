"use client";

import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({
  habit,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{habit.name}</h3>
        <div className="flex gap-2">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {habit.description && (
        <p className="text-gray-600 text-sm mb-3">{habit.description}</p>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            data-testid={`habit-complete-${slug}`}
            onClick={onToggle}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isCompleted
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isCompleted ? "✓ Done" : "Not Done"}
          </button>
        </div>
        <div data-testid={`habit-streak-${slug}`} className="text-right">
          <div className="text-2xl font-bold text-blue-600">{streak}</div>
          <div className="text-xs text-gray-500">day streak</div>
        </div>
      </div>
    </div>
  );
}
