import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithOAuth,
  signOut as serviceSignOut,
  getCurrentUser,
} from "../shared/services/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => Boolean(user.value));

  const setUser = (authUser: User | null) => {
    user.value = authUser;
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    const result = await signInWithEmail(email, password);

    if (!result.success) {
      error.value = result.error || "Unable to sign in.";
    } else {
      setUser(result.user ?? null);
    }

    isLoading.value = false;
    return result;
  };

  const signup = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    const result = await signUpWithEmail(email, password);

    if (!result.success) {
      error.value = result.error || "Unable to create account.";
    } else {
      setUser(result.user ?? null);
    }

    isLoading.value = false;
    return result;
  };

  const loginWithOAuth = async (provider: "github" | "google") => {
    isLoading.value = true;
    error.value = null;

    const result = await signInWithOAuth(provider);

    if (!result.success) {
      error.value = result.error || `Unable to sign in with ${provider}.`;
    } else {
      setUser(result.user ?? null);
    }

    isLoading.value = false;
    return result;
  };

  const logout = async () => {
    isLoading.value = true;
    error.value = null;

    const result = await serviceSignOut();

    if (!result.success) {
      error.value = result.error || "Unable to sign out.";
    } else {
      setUser(null);
    }

    isLoading.value = false;
    return result;
  };

  const initialize = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    signup,
    loginWithOAuth,
    logout,
    initialize,
  };
});
