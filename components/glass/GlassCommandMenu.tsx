"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sprout,
  Stethoscope,
  Bot,
  CloudSun,
  TrendingUp,
  Landmark,
  Layers,
  BookOpen,
  UserCheck,
  Globe,
  Sun,
  Moon,
  X,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Preferences";
  icon: React.ReactNode;
  action: () => void;
}

export const GlassCommandMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const items: CommandItem[] = [
    {
      id: "nav-crops",
      title: "My Crops & Lifecycle Tracker",
      category: "Navigation",
      icon: <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      action: () => {
        router.push("/farmer/crops");
        setIsOpen(false);
      },
    },
    {
      id: "nav-doctor",
      title: "Crop Doctor - AI Leaf Disease Diagnosis",
      category: "Navigation",
      icon: <Stethoscope className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      action: () => {
        router.push("/farmer/crop-doctor");
        setIsOpen(false);
      },
    },
    {
      id: "nav-ai",
      title: "Kisan AI Agronomic Assistant",
      category: "Navigation",
      icon: <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      action: () => {
        router.push("/farmer/ai");
        setIsOpen(false);
      },
    },
    {
      id: "nav-weather",
      title: "Weather Intelligence & Spraying Advisory",
      category: "Navigation",
      icon: <CloudSun className="w-4 h-4 text-amber-500" />,
      action: () => {
        router.push("/farmer/weather");
        setIsOpen(false);
      },
    },
    {
      id: "nav-market",
      title: "Mandi Market Prices & Price Alerts",
      category: "Navigation",
      icon: <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      action: () => {
        router.push("/farmer/market");
        setIsOpen(false);
      },
    },
    {
      id: "nav-schemes",
      title: "Government Schemes & Subsidies",
      category: "Navigation",
      icon: <Landmark className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      action: () => {
        router.push("/farmer/schemes");
        setIsOpen(false);
      },
    },
    {
      id: "nav-soil",
      title: "Soil Health & NPK Balance",
      category: "Navigation",
      icon: <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      action: () => {
        router.push("/farmer/soil");
        setIsOpen(false);
      },
    },
    {
      id: "nav-journal",
      title: "Farm Operations Journal",
      category: "Navigation",
      icon: <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      action: () => {
        router.push("/farmer/journal");
        setIsOpen(false);
      },
    },
    {
      id: "nav-experts",
      title: "Consult Certified Agronomists",
      category: "Navigation",
      icon: <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      action: () => {
        router.push("/farmer/experts");
        setIsOpen(false);
      },
    },
    {
      id: "lang-hi",
      title: "Switch Language to हिन्दी (Hindi)",
      category: "Preferences",
      icon: <Globe className="w-4 h-4 text-indigo-500" />,
      action: () => {
        setLanguage("hi");
        setIsOpen(false);
      },
    },
    {
      id: "lang-en",
      title: "Switch Language to English",
      category: "Preferences",
      icon: <Globe className="w-4 h-4 text-indigo-500" />,
      action: () => {
        setLanguage("en");
        setIsOpen(false);
      },
    },
    {
      id: "theme-toggle",
      title: `Toggle Theme (Currently ${theme})`,
      category: "Preferences",
      icon:
        theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Moon className="w-4 h-4 text-sky-500" />
        ),
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setIsOpen(false);
      },
    },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4"
    >
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-xl rounded-3xl bg-white/95 dark:bg-[#0f1713]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-black/5 dark:border-white/5">
          <Search className="w-5 h-5 text-foreground/45 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kisan Setu (crops, mandis, weather, schemes, diagnosis)..."
            className="flex-1 bg-transparent text-foreground placeholder:text-foreground/40 text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-foreground/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-foreground/50">
              No matching actions or pages found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl hover:bg-emerald-500/10 text-foreground text-left transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium truncate">
                    {item.title}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-foreground/40 shrink-0 uppercase tracking-wider">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="px-5 py-2.5 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-foreground/50">
          <span>Navigate with <strong>↑</strong> <strong>↓</strong></span>
          <span>Press <strong>ESC</strong> to close</span>
        </div>
      </div>
    </div>
  );
};
