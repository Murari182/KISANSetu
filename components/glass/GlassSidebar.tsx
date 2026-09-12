"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tractor,
  Sprout,
  Stethoscope,
  Bot,
  CloudSun,
  TrendingUp,
  Landmark,
  Layers,
  BookOpen,
  DollarSign,
  UserCheck,
  Bell,
  Settings,
  Shield,
  Briefcase,
  Cpu,
  Users,
  BarChart3,
  Calendar,
  Scale,
} from "lucide-react";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";

export const GlassSidebar: React.FC = () => {
  const pathname = usePathname();
  const { role } = useSession();
  const { t } = useTranslation();

  const farmerNav = [
    { href: "/farmer", label: t("nav.home"), icon: LayoutDashboard },
    {
      href: "/farmer/procurement",
      label: "Smart Procurement",
      icon: Scale,
      isCore: true,
    },
    { href: "/farmer/farm", label: t("nav.myFarm"), icon: Tractor },
    { href: "/farmer/crops", label: t("nav.myCrops"), icon: Sprout },
    { href: "/farmer/crop-doctor", label: t("nav.cropDoctor"), icon: Stethoscope },
    { href: "/farmer/ai", label: t("nav.kisanAI"), icon: Bot },
    { href: "/farmer/weather", label: t("nav.weather"), icon: CloudSun },
    { href: "/farmer/market", label: t("nav.market"), icon: TrendingUp },
    { href: "/farmer/schemes", label: t("nav.schemes"), icon: Landmark },
    { href: "/farmer/soil", label: t("nav.soil"), icon: Layers },
    { href: "/farmer/journal", label: t("nav.journal"), icon: BookOpen },
    { href: "/farmer/economics", label: t("nav.economics"), icon: DollarSign },
    { href: "/farmer/experts", label: t("nav.experts"), icon: UserCheck },
    { href: "/farmer/alerts", label: t("nav.alerts"), icon: Bell },
    { href: "/farmer/profile", label: t("nav.settings"), icon: Settings },
  ];

  const expertNav = [
    { href: "/expert", label: t("nav.home"), icon: LayoutDashboard },
    { href: "/expert/cases", label: t("nav.cases"), icon: Briefcase },
    { href: "/expert/consultations", label: t("nav.consultations"), icon: Calendar },
    { href: "/expert/farmers", label: t("nav.farmers"), icon: Users },
  ];

  const adminNav = [
    { href: "/admin", label: t("nav.home"), icon: LayoutDashboard },
    { href: "/admin/procurement", label: "Smart Procurement Control", icon: Scale, isCore: true },
    { href: "/admin/farmers", label: t("nav.farmers"), icon: Users },
    { href: "/admin/experts", label: t("nav.experts"), icon: UserCheck },
    { href: "/admin/schemes", label: t("nav.schemes"), icon: Landmark },
    { href: "/admin/ml", label: t("nav.mlModels"), icon: Cpu },
    { href: "/admin/analytics", label: t("nav.analytics"), icon: BarChart3 },
  ];

  const navItems =
    role === "farmer" ? farmerNav : role === "expert" ? expertNav : adminNav;

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-20 h-[calc(100vh-6rem)] pb-4 select-none">
      <div className="flex-1 rounded-3xl bg-white/70 dark:bg-[#0c1410]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] p-3 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-foreground/45 uppercase tracking-wider">
            {role === "farmer"
              ? "Farmer Portal"
              : role === "expert"
              ? "Expert Workspace"
              : "Admin Command"}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/farmer" &&
                item.href !== "/expert" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-emerald-600 dark:bg-emerald-600 text-white shadow-[0_4px_16px_rgba(21,128,61,0.25)] dark:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                    : "text-foreground/75 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-white" : "text-foreground/60 group-hover:text-foreground"
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {(item as any).isCore && (
                  <span className={`ml-auto text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    isActive ? "bg-white/25 text-white" : "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                  }`}>
                    CORE
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Advisory safety footer pill */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-[11px] text-emerald-950 dark:text-emerald-200">
          <div className="font-bold mb-0.5">🌾 Kisan Safety First</div>
          <p className="opacity-80 leading-relaxed text-[10px]">
            AI advisories are verified with ICAR agronomic research.
          </p>
        </div>
      </div>
    </aside>
  );
};
