import { User, Session } from "@/types/auth";
import {
  findUserByEmail,
  addUser,
  setSession,
  getSession,
  clearSession,
} from "./storage";

export function signup(
  email: string,
  password: string,
): { success: boolean; error?: string } {
  // Validate inputs
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  // Check for duplicate
  if (findUserByEmail(email)) {
    return { success: false, error: "User already exists" };
  }

  // Create user
  const user: User = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  addUser(user);

  // Auto login
  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  setSession(session);

  return { success: true };
}

export function login(
  email: string,
  password: string,
): { success: boolean; error?: string } {
  // Validate inputs
  if (!email || !password) {
    return { success: false, error: "Invalid email or password" };
  }

  // Find user
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return { success: false, error: "Invalid email or password" };
  }

  // Create session
  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  setSession(session);

  return { success: true };
}

export function logout(): void {
  clearSession();
}

export function getAuthSession(): Session | null {
  return getSession();
}
