import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "@/app/dashboard/page";
import { createHabit } from "@/lib/habits";
import { getHabits, setSession, updateHabit } from "@/lib/storage";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const session = { userId: "user-1", email: "user@example.com" };

function renderDashboard() {
  setSession(session);
  return render(<DashboardPage />);
}

describe("habit form", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("shows a validation error when habit name is empty", async () => {
    renderDashboard();

    fireEvent.click(await screen.findByTestId("create-habit-button"));
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Habit name is required",
    );
  });

  it("creates a new habit and renders it in the list", async () => {
    renderDashboard();

    fireEvent.click(await screen.findByTestId("create-habit-button"));
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });
    fireEvent.change(screen.getByTestId("habit-description-input"), {
      target: { value: "Two glasses before noon" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    expect(await screen.findByTestId("habit-card-drink-water")).toBeVisible();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const habit = createHabit(session.userId, "Read Books", "Ten pages");
    renderDashboard();

    fireEvent.click(await screen.findByTestId("habit-edit-read-books"));
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Read Fiction" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const updated = getHabits()[0];
      expect(updated).toMatchObject({
        id: habit.id,
        userId: habit.userId,
        createdAt: habit.createdAt,
        completions: habit.completions,
        frequency: "daily",
        name: "Read Fiction",
      });
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    createHabit(session.userId, "Stretch", "");
    renderDashboard();

    fireEvent.click(await screen.findByTestId("habit-delete-stretch"));
    expect(screen.getByTestId("habit-card-stretch")).toBeVisible();

    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      expect(screen.queryByTestId("habit-card-stretch")).not.toBeInTheDocument();
      expect(getHabits()).toEqual([]);
    });
  });

  it("toggles completion and updates the streak display", async () => {
    const habit = createHabit(session.userId, "Exercise", "");
    updateHabit({ ...habit, completions: [] });
    renderDashboard();

    fireEvent.click(await screen.findByTestId("habit-complete-exercise"));

    await waitFor(() => {
      expect(screen.getByTestId("habit-streak-exercise")).toHaveTextContent("1");
    });
  });
});
