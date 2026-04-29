import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HabitForm } from "@/components/HabitForm";
import { createHabit, editHabit } from "@/lib/habits";
import { getHabits } from "@/lib/storage";

describe("Habit Form Integration", () => {
  const userId = "test-user-1";

  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a new habit with valid input", async () => {
    let savedHabit: any;
    const handleSuccess = (habit: any) => {
      savedHabit = habit;
    };

    render(
      <HabitForm
        userId={userId}
        onSuccess={handleSuccess}
        onCancel={() => {}}
      />,
    );

    const nameInput = screen.getByTestId("habit-name-input");
    const submitButton = screen.getByTestId("habit-submit-button");

    fireEvent.change(nameInput, { target: { value: "drink water" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(savedHabit).toBeDefined();
      expect(savedHabit.name).toBe("drink water");
      expect(savedHabit.userId).toBe(userId);
    });
  });

  it("validates habit name length", async () => {
    render(
      <HabitForm userId={userId} onSuccess={() => {}} onCancel={() => {}} />,
    );

    const nameInput = screen.getByTestId("habit-name-input");
    const submitButton = screen.getByTestId("habit-submit-button");
    const longName = "a".repeat(101);

    fireEvent.change(nameInput, { target: { value: longName } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMsg = screen.getByTestId("error-message");
      expect(errorMsg).toHaveTextContent("1-100 characters");
    });
  });

  it("allows cancelling habit creation", () => {
    const handleCancel = vi.fn();
    render(
      <HabitForm
        userId={userId}
        onSuccess={() => {}}
        onCancel={handleCancel}
      />,
    );

    const cancelButton = screen.getByTestId("habit-cancel-button");
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalled();
  });

  it("edits an existing habit", async () => {
    const habit = createHabit(userId, "old name", "old description");

    let savedHabit: any;
    const handleSuccess = (habit: any) => {
      savedHabit = habit;
    };

    render(
      <HabitForm
        userId={userId}
        habit={habit}
        onSuccess={handleSuccess}
        onCancel={() => {}}
      />,
    );

    const nameInput = screen.getByTestId(
      "habit-name-input",
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("old name");

    fireEvent.change(nameInput, { target: { value: "new name" } });
    const submitButton = screen.getByTestId("habit-submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(savedHabit.name).toBe("new name");
      expect(savedHabit.id).toBe(habit.id);
    });
  });

  it("trims whitespace from habit name", async () => {
    let savedHabit: any;
    const handleSuccess = (habit: any) => {
      savedHabit = habit;
    };

    render(
      <HabitForm
        userId={userId}
        onSuccess={handleSuccess}
        onCancel={() => {}}
      />,
    );

    const nameInput = screen.getByTestId("habit-name-input");
    const submitButton = screen.getByTestId("habit-submit-button");

    fireEvent.change(nameInput, { target: { value: "  drink water  " } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(savedHabit.name).toBe("drink water");
    });
  });
});
