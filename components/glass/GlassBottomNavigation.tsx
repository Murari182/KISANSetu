"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tractor,
  Bot,
  TrendingUp,
  Menu,
  X,
  Sprout,
  Stethoscope,
  CloudSun,
  Landmark,
  Layers,
  BookOpen,
  DollarSign,
  UserCheck,
  Bell,
  Settings,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useSession } from "@/lib/auth";

export const GlassBottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { role } = useSession();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Bottom navigation only visible on mobile/tablet (lg:hidden)
  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-3 inset-x-3 z-40 lg:hidden"
      >
        <div className="rounded-3xl bg-white/85 dark:bg-[#0d1511]/85 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] px-2 py-1.5 flex items-center justify-around">
          <Link
            href="/farmer"
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              pathname === "/farmer"
                ? "text-emerald-700 dark:text-emerald-400 font-bold"
                : "text-foreground/60"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t("nav.home")}</span>
          </Link>

          <Link
            href="/farmer/farm"
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              pathname === "/farmer/farm"
                ? "text-emerald-700 dark:text-emerald-400 font-bold"
                : "text-foreground/60"
            }`}
          >
            <Tractor className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t("nav.myFarm")}</span>
          </Link>

          {/* Centered highlighted Kisan AI button */}
          <Link
            href="/farmer/ai"
            className="flex flex-col items-center -mt-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(21,128,61,0.4)] ring-4 ring-white dark:ring-[#090d0b]">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 mt-1">
              AI
            </span>
          </Link>

          <Link
            href="/farmer/market"
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              pathname === "/farmer/market"
                ? "text-emerald-700 dark:text-emerald-400 font-bold"
                : "text-foreground/60"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t("nav.market")}</span>
          </Link>

          <button
            onClick={() => setIsMoreOpen(true)}
            className="flex flex-col items-center py-1 px-3 rounded-2xl text-foreground/60 hover:text-foreground transition-all"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t("nav.more")}</span>
          </button>
        </div>
      </nav>

      {/* More Bottom Sheet on Mobile */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="relative w-full max-h-[85vh] rounded-t-3xl bg-white/95 dark:bg-[#0e1612]/95 backdrop-blur-2xl border-t border-white/80 dark:border-white/10 p-6 z-10 shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">
                All Kisan Setu Modules
              </h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-foreground/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pb-8">
              {[
                { href: "/farmer/crops", label: t("nav.myCrops"), icon: Sprout, color: "text-emerald-600" },
                { href: "/farmer/crop-doctor", label: t("nav.cropDoctor"), icon: Stethoscope, color: "text-rose-600" },
                { href: "/farmer/weather", label: t("nav.weather"), icon: CloudSun, color: "text-amber-500" },
                { href: "/farmer/schemes", label: t("nav.schemes"), icon: Landmark, color: "text-sky-600" },
                { href: "/farmer/soil", label: t("nav.soil"), icon: Layers, color: "text-amber-600" },
                { href: "/farmer/journal", label: t("nav.journal"), icon: BookOpen, color: "text-emerald-700" },
                { href: "/farmer/economics", label: t("nav.economics"), icon: DollarSign, color: "text-emerald-600" },
                { href: "/farmer/experts", label: t("nav.experts"), icon: UserCheck, color: "text-purple-600" },
                { href: "/farmer/alerts", label: t("nav.alerts"), icon: Bell, color: "text-amber-600" },
                { href: "/farmer/profile", label: t("nav.profile"), icon: Settings, color: "text-foreground" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/10 transition text-center"
                  >
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-[#152019] shadow-xs mb-1.5">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-[11px] font-medium text-foreground leading-tight line-clamp-2">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
