/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: ["class", "media"],
  theme: {
    extend: {
      colors: {
        // Aviation brand colors
        "aviation-dark": "#0f172a",
        "aviation-darker": "#0a0e27",
        "aviation-blue": "#0ea5e9",
        "aviation-cyan": "#06b6d4",
        "aviation-accent": "#06b6d4",

        // Dark theme palette
        "dark-bg": "#0f172a",
        "dark-card": "#1e293b",
        "dark-border": "#334155",
        "dark-text": "#e2e8f0",
        "dark-text-secondary": "#94a3b8",

        // Light theme palette
        "light-bg": "#f8fafc",
        "light-card": "#ffffff",
        "light-border": "#e2e8f0",
        "light-text": "#0f172a",
        "light-text-secondary": "#64748b",

        // Semantic colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#06b6d4",
      },
      backgroundColor: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        overlay: "var(--bg-overlay)",
      },
      textColor: {
        base: "var(--text-base)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
      },
      borderColor: {
        base: "var(--border-base)",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
        "4xl": "4rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        slideIn: {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, .05) 25%, rgba(6, 182, 212, .05) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, .05) 75%, rgba(6, 182, 212, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, .05) 25%, rgba(6, 182, 212, .05) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, .05) 75%, rgba(6, 182, 212, .05) 76%, transparent 77%, transparent)",
      },
      backgroundSize: {
        grid: "50px 50px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        premium: "0 20px 60px rgba(0, 0, 0, 0.3)",
        "glow-sm": "0 0 10px rgba(6, 182, 212, 0.2)",
        "glow-md": "0 0 20px rgba(6, 182, 212, 0.3)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  plugins: [],
};
