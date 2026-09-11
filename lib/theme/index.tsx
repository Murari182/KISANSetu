"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // STRICT REQUIREMENT: Default theme MUST be "light"
  const [theme, setThemeState] = useState<Theme>("light");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check if user has explicitly toggled to dark theme
    const isExplicit = localStorage.getItem("kisan_theme_explicit");
    const saved = localStorage.getItem("kisan_setu_theme") as Theme | null;

    if (isExplicit === "true" && saved === "dark") {
      setThemeState("dark");
      setActualTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      // Default: Clean White / Light theme
      setThemeState("light");
      setActualTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("kisan_setu_theme", "light");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    let resolved: "light" | "dark" = "light";
    if (newTheme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = newTheme;
    }

    setThemeState(newTheme);
    setActualTheme(resolved);
    localStorage.setItem("kisan_setu_theme", newTheme);
    localStorage.setItem("kisan_theme_explicit", "true");

    if (resolved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
