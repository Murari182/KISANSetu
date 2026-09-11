"use client";

import React, { useState } from "react";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme";

export const ThemeToggle: React.FC = () => {
  const { theme, actualTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-2 rounded-2xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground transition-all shadow-xs"
        aria-label="Toggle theme mode"
      >
        {actualTheme === "dark" ? (
          <Moon className="w-4 h-4 text-emerald-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
        <ChevronDown className="w-3 h-3 text-foreground/50" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white/95 dark:bg-[#101914]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xl p-1.5 z-50 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                theme === "light"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                theme === "dark"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                theme === "system"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-foreground/60" />
              <span>System</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
