"use client";

import { useState } from "react";
import { validateHabitName } from "@/lib/validators";
import { createHabit, editHabit } from "@/lib/habits";
import { Habit } from "@/types/habit";

interface HabitFormProps {
  userId: string;
  habit?: Habit;
  onSuccess: (habit: Habit) => void;
  onCancel: () => void;
}

export function HabitForm({
  userId,
  habit,
  onSuccess,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateHabitName(name)) {
      setError("Habit name must be 1-100 characters");
      return;
    }

    setIsLoading(true);

    try {
      let result: Habit | null;

      if (habit) {
        result = editHabit(habit.id, {
          name: name.trim(),
          description: description.trim(),
        });
      } else {
        result = createHabit(userId, name.trim(), description.trim());
      }

      if (result) {
        onSuccess(result);
      } else {
        setError("Failed to save habit");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">
        {habit ? "Edit Habit" : "New Habit"}
      </h2>

      {error && (
        <div
          data-testid="error-message"
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Habit Name</label>
        <input
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description (optional)
        </label>
        <textarea
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          data-testid="habit-submit-button"
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Habit"}
        </button>
        <button
          data-testid="habit-cancel-button"
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
