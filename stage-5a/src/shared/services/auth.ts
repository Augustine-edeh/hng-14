import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const authError = (message: string) => ({ success: false, error: message });

export type AuthResponse = {
  success: boolean;
  user?: User | null;
  session?: unknown;
  url?: string;
  error?: string;
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (!supabase) {
    console.warn("[Auth] Supabase is not configured.");
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("[Auth] getCurrentUser error", error.message);
    return null;
  }

  return data.user;
};

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  if (!supabase) {
    return authError(
      "Supabase auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY.",
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return authError(error.message);
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  if (!supabase) {
    return authError(
      "Supabase auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY.",
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return authError(error.message);
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
};

export const signInWithOAuth = async (
  provider: "github" | "google",
): Promise<AuthResponse> => {
  if (!supabase) {
    return authError(
      "Supabase auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY.",
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    return authError(error.message);
  }

  return {
    success: true,
    url: data.url,
  };
};

export const signOut = async (): Promise<AuthResponse> => {
  if (!supabase) {
    return authError(
      "Supabase auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY.",
    );
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return authError(error.message);
  }

  return { success: true };
};
