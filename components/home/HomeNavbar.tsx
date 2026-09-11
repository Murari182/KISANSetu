"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Globe,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useTranslation } from "@/lib/i18n";

export const HomeNavbar: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Always show when at or near top
          if (currentScrollY <= 25) {
            setIsVisible(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);

            // Check scroll direction with a delta threshold
            const scrollDelta = currentScrollY - lastScrollY;

            // When scrolling down (content scrolls up), smoothly hide navbar
            if (scrollDelta > 6 && currentScrollY > 70) {
              setIsVisible(false);
            }
            // When scrolling up (content scrolls down), smoothly show navbar
            else if (scrollDelta < -6) {
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

  const navLinks = [
    { label: t("navigation.home") || "Home", href: "/#hero" },
    { label: "Kisan AI", href: "/ai" },
    { label: t("navigation.features") || "Features", href: "/#features" },
    { label: t("navigation.howItWorks") || "How It Works", href: "/#how-it-works" },
    { label: t("navigation.solutions") || "Solutions", href: "/#why-kisan-setu" },
    { label: t("navigation.about") || "About", href: "/#trust" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out px-2.5 sm:px-6 lg:px-10 ${
          isScrolled ? "pt-2 pb-2" : "pt-3.5 pb-2"
        } ${
          isVisible || mobileMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-28 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#0c1410]/85 backdrop-blur-2xl border border-white/90 dark:border-white/10 shadow-[0_8px_32px_rgba(18,32,23,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 transition-all duration-300">
          {/* Brand Logo & Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-emerald-600 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(21,128,61,0.25)] group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-100" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-black tracking-tight text-foreground flex items-center gap-1.5 leading-none">
                <span>KISAN SETU</span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10.5px] font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 mt-0.5 uppercase truncate">
                Smart Agriculture. Better Decisions.
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-2xl text-xs xl:text-sm font-semibold text-foreground/75 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Actions: Language, Theme, Login, Get Started */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 shrink-0">
            <LanguageSelector />
            <ThemeToggle />

            <Link href="/login">
              <GlassButton variant="ghost" size="sm">
                {t("navigation.login") || "Sign In"}
              </GlassButton>
            </Link>

            <Link href="/register">
              <GlassButton
                variant="primary"
                size="sm"
                className="shadow-[0_4px_14px_rgba(21,94,56,0.25)]"
                iconRight={
                  isRTL ? (
                    <ArrowLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )
                }
              >
                {t("navigation.getStarted") || "Get Started"}
              </GlassButton>
            </Link>
          </div>

          {/* Mobile Right Controls: Language, Theme, Hamburger */}
          <div className="flex items-center gap-1.5 sm:hidden shrink-0">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-foreground transition-colors hover:bg-black/10 dark:hover:bg-white/15"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Glass Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-full rounded-t-3xl bg-white/95 dark:bg-[#0c1410]/95 backdrop-blur-2xl border-t border-white/80 dark:border-white/10 p-6 shadow-2xl z-50 flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 rounded-full bg-black/20 dark:bg-white/20 mx-auto mb-2" />

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex flex-col gap-2.5">
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <GlassButton variant="primary" size="md" className="w-full">
                  {t("navigation.getStarted") || "Get Started Free"}
                </GlassButton>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <GlassButton variant="secondary" size="md" className="w-full">
                  {t("navigation.login") || "Sign In to Account"}
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
