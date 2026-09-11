import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          light: "rgba(255, 255, 255, 0.72)",
          dark: "rgba(18, 26, 22, 0.75)",
        },
        kisan: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
          emerald: "#10b981",
          deep: "#154d30",
          gold: "#d97706",
          terracotta: "#9a3412",
        },
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
        "glass-lg": "24px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
        "glass-glow": "0 0 25px -5px rgba(22, 163, 74, 0.25)",
        floating: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        glass: "20px",
        "glass-sm": "12px",
        "glass-lg": "28px",
      },
    },
  },
  plugins: [],
};

export default config;
