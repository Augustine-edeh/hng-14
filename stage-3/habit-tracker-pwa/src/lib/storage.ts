import { User, Session } from "@/types/auth";
import { Habit } from "@/types/habit";

const USERS_KEY = "habit-tracker-users";
const SESSION_KEY = "habit-tracker-session";
const HABITS_KEY = "habit-tracker-habits";

// Users
export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function setUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  setUsers(users);
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email === email);
}

// Session
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function setSession(session: Session): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

// Habits
export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(HABITS_KEY);
  return data ? JSON.parse(data) : [];
}

export function setHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function addHabit(habit: Habit): void {
  const habits = getHabits();
  habits.push(habit);
  setHabits(habits);
}

export function updateHabit(habit: Habit): void {
  const habits = getHabits();
  const index = habits.findIndex((h) => h.id === habit.id);
  if (index > -1) {
    habits[index] = habit;
    setHabits(habits);
  }
}

export function deleteHabit(habitId: string): void {
  const habits = getHabits();
  const filtered = habits.filter((h) => h.id !== habitId);
  setHabits(filtered);
}
