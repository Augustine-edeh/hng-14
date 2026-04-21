import type { Config } from "tailwindcss";

const config = {
  // darkMode: ["class"],
  darkMode: "class",
  // content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        spartan: ['"League Spartan"', "sans-serif"],
      },
      colors: {
        invoice: {
          primary: "#7C5DFA",
          "primary-hover": "#9277FF",
          "bg-light": "#F8F8FB",
          "bg-dark": "#141625",
          "card-light": "#FFFFFF",
          "card-dark": "#1E2139",
          "text-primary": "#0C0E16",
          "text-secondary": "#888EB0",
          "text-light": "#DFE3FA",
          "status-paid": "#33D69F",
          "status-paid-bg": "rgba(51, 214, 159, 0.1)",
          "status-pending": "#FF8F00",
          "status-pending-bg": "rgba(255, 143, 0, 0.1)",
          "status-draft": "#373B53",
          "status-draft-bg": "rgba(55, 59, 83, 0.1)",
        },
      },
      boxShadow: {
        invoice: "0 10px 40px rgba(72, 84, 159, 0.25)",
        "invoice-md": "0 2px 8px rgba(72, 84, 159, 0.15)",
      },
      spacing: {
        "invoice-xs": "0.5rem",
        "invoice-sm": "1rem",
        "invoice-md": "1.5rem",
        "invoice-lg": "2rem",
        "invoice-xl": "3rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
