"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Shield, Briefcase, ChevronDown, Check, LogOut } from "lucide-react";
import { useSession } from "@/lib/auth";
import { UserRole } from "@/types";
import { useTranslation } from "@/lib/i18n";

export const RoleSwitcher: React.FC = () => {
  const { user, role, setRole, logout } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsOpen(false);
    if (newRole === "farmer") router.push("/farmer");
    if (newRole === "expert") router.push("/expert");
    if (newRole === "admin") router.push("/admin");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground transition-all duration-200 shadow-xs"
        aria-label="User profile and role menu"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-700 dark:bg-emerald-500 text-white flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-4 h-4" />
          )}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
            {user?.name || "Kisan User"}
          </span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 capitalize font-medium">
            {t(`roles.${role}`)}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-foreground/50 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white/95 dark:bg-[#0f1713]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl p-2.5 z-50 animate-in zoom-in-95 duration-150">
            {/* User Info Header */}
            <div className="px-3 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 mb-2">
              <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-[11px] text-foreground/60 truncate">{user?.phone}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                {t(`roles.${role}`)}
              </span>
            </div>

            {/* Portal Switcher */}
            <div className="px-2 py-1 text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
              {t("app.role")} / पोर्टल बदलें
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => handleRoleChange("farmer")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                  role === "farmer"
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("roles.farmer")} Portal</span>
                </div>
                {role === "farmer" && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRoleChange("expert")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                  role === "expert"
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t("roles.expert")} Portal</span>
                </div>
                {role === "expert" && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRoleChange("admin")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                  role === "admin"
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{t("roles.admin")} Command</span>
                </div>
                {role === "admin" && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-1 border-t border-black/5 dark:border-white/5 mt-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  router.push("/login");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("nav.logout")}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
