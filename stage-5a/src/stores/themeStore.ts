import { defineStore } from "pinia";
import { ref } from "vue";

export type Theme = "dark" | "light" | "system";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<Theme>("dark");
  const resolvedTheme = ref<"dark" | "light">("dark");

  const initializeTheme = () => {
    // Try to load from localStorage
    const stored = localStorage.getItem("aeropulse-theme") as Theme | null;
    if (stored) {
      theme.value = stored;
    }

    // Apply theme
    applyTheme(theme.value);
  };

  const applyTheme = (newTheme: Theme) => {
    let finalTheme: "dark" | "light" = newTheme as "dark" | "light";

    if (newTheme === "system") {
      finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    resolvedTheme.value = finalTheme;

    // Update DOM
    if (finalTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        finalTheme === "dark" ? "#0f172a" : "#f8fafc",
      );
    }
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem("aeropulse-theme", newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = resolvedTheme.value === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  // Watch for system theme changes
  if (theme.value === "system") {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (theme.value === "system") {
          applyTheme("system");
        }
      });
  }

  return {
    theme,
    resolvedTheme,
    initializeTheme,
    setTheme,
    toggleTheme,
  };
});
