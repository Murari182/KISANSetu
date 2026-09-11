"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sprout, Bell } from "lucide-react";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { FarmSwitcher } from "@/components/common/FarmSwitcher";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";

export const GlassNavbar: React.FC = () => {
  const { role } = useSession();
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY <= 20) {
            setIsVisible(true);
          } else {
            const scrollDelta = currentScrollY - lastScrollY;
            if (scrollDelta > 6 && currentScrollY > 60) {
              setIsVisible(false);
            } else if (scrollDelta < -6) {
              setIsVisible(true);
            }
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-40 w-full px-2.5 sm:px-6 pt-2.5 pb-2 transition-all duration-300 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-[1720px] mx-auto rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#0c1410]/80 backdrop-blur-2xl border border-white/85 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-3 transition-all">
        {/* Brand Logo & Name */}
        <Link
          href={role === "farmer" ? "/farmer" : role === "expert" ? "/expert" : "/admin"}
          className="flex items-center gap-2.5 group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(21,128,61,0.3)] group-hover:scale-105 transition-transform duration-200">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-foreground flex items-center gap-1.5 leading-tight">
              <span>{t("app.name")}</span>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30">
                PROD
              </span>
            </span>
            <span className="text-[10px] text-foreground/50 hidden md:inline -mt-0.5 truncate max-w-[210px]">
              {t("app.tagline")}
            </span>
          </div>
        </Link>

        {/* Center: Active Farm Switcher (Farmer role) */}
        <div className="hidden sm:flex items-center gap-2">
          {role === "farmer" && <FarmSwitcher />}
        </div>

        {/* Right Action Controls: Search, Bell, Language, Theme, Role */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick search shortcut trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground/60 text-xs transition"
            aria-label="Search or press Cmd+K"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t("common.search") || "Search"}...</span>
            <kbd className="text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold">
              ⌘K
            </kbd>
          </button>

          {/* Alert / Notification bell */}
          <Link
            href={role === "farmer" ? "/farmer/alerts" : "#"}
            className="p-2 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground transition-all shadow-xs relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-foreground/75" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c1410]" />
          </Link>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* User Profile & Role Switcher */}
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
};
