import { describe, expect, it } from "vitest";
import { login, logout, signup } from "@/lib/auth";
import {
  addHabit,
  addUser,
  clearSession,
  deleteHabit,
  findUserByEmail,
  getHabits,
  getSession,
  getUsers,
  setHabits,
  setSession,
  setUsers,
  updateHabit,
} from "@/lib/storage";
import { Habit } from "@/types/habit";
import { User } from "@/types/auth";

const user: User = {
  id: "user-1",
  email: "user@example.com",
  password: "password123",
  createdAt: "2026-04-29T00:00:00.000Z",
};

const habit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "",
  frequency: "daily",
  createdAt: "2026-04-29T00:00:00.000Z",
  completions: [],
};

describe("local auth and storage", () => {
  it("stores, finds, and replaces users", () => {
    expect(getUsers()).toEqual([]);
    addUser(user);
    expect(findUserByEmail("user@example.com")).toEqual(user);

    const replacement = { ...user, id: "user-2", email: "two@example.com" };
    setUsers([replacement]);
    expect(getUsers()).toEqual([replacement]);
    expect(findUserByEmail("user@example.com")).toBeUndefined();
  });

  it("creates and clears sessions", () => {
    setSession({ userId: user.id, email: user.email });
    expect(getSession()).toEqual({ userId: user.id, email: user.email });

    clearSession();
    expect(getSession()).toBeNull();
  });

  it("stores, updates, and deletes habits", () => {
    expect(getHabits()).toEqual([]);
    addHabit(habit);
    expect(getHabits()).toEqual([habit]);

    const updated = { ...habit, name: "Drink More Water" };
    updateHabit(updated);
    expect(getHabits()).toEqual([updated]);

    updateHabit({ ...habit, id: "missing" });
    expect(getHabits()).toEqual([updated]);

    deleteHabit(habit.id);
    expect(getHabits()).toEqual([]);

    setHabits([habit]);
    expect(getHabits()).toEqual([habit]);
  });

  it("signs up, rejects duplicates, logs in, rejects invalid logins, and logs out", () => {
    expect(signup("auth@example.com", "password123")).toEqual({
      success: true,
    });
    expect(getSession()).toEqual(
      expect.objectContaining({ email: "auth@example.com" }),
    );

    expect(signup("auth@example.com", "password123")).toEqual({
      success: false,
      error: "User already exists",
    });

    logout();
    expect(getSession()).toBeNull();

    expect(login("auth@example.com", "password123")).toEqual({
      success: true,
    });
    expect(login("auth@example.com", "wrong")).toEqual({
      success: false,
      error: "Invalid email or password",
    });
    expect(signup("", "")).toEqual({
      success: false,
      error: "Email and password are required",
    });
    expect(login("", "")).toEqual({
      success: false,
      error: "Invalid email or password",
    });
  });
});
