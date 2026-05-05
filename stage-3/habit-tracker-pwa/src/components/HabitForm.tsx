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
  const [frequency] = useState<"daily">("daily");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error || "Habit name is required");
      return;
    }

    setIsLoading(true);

    try {
      let result: Habit | null;

      if (habit) {
        result = editHabit(habit.id, {
          name: validation.value,
          description: description.trim(),
          frequency,
        });
      } else {
        result = createHabit(userId, validation.value, description.trim());
      }

      if (result) {
        onSuccess(result);
      } else {
        setError("Failed to save habit");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="w-full space-y-4"
    >
      <h2 className="text-2xl font-bold mb-6">
        {habit ? "Edit Habit" : "New Habit"}
      </h2>

      {error && (
        <div
          data-testid="error-message"
          role="alert"
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="habit-name" className="mb-2 block text-sm font-medium">
          Habit Name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="habit-description"
          className="mb-2 block text-sm font-medium"
        >
          Description (optional)
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label
          htmlFor="habit-frequency"
          className="mb-2 block text-sm font-medium"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value={frequency}
          disabled
          className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          data-testid="habit-save-button"
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
