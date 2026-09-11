"use client";

import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface GlassAlertProps {
  type?: "info" | "warning" | "error" | "success";
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const GlassAlert: React.FC<GlassAlertProps> = ({
  type = "info",
  title,
  children,
  onDismiss,
  className = "",
}) => {
  const styles = {
    info: "bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/30 text-sky-900 dark:text-sky-200",
    warning: "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200",
    error: "bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30 text-rose-900 dark:text-rose-200",
    success: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-200",
  };

  const icons = {
    info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`rounded-2xl backdrop-blur-xl border p-4 flex items-start gap-3.5 transition-all ${
        styles[type]
      } ${className}`}
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        {title && <h5 className="text-sm font-semibold mb-0.5">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface GlassTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const GlassTabs: React.FC<GlassTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 backdrop-blur-lg border border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap select-none ${
              isActive
                ? "bg-white dark:bg-[#14201a] text-emerald-800 dark:text-emerald-300 shadow-md border border-white/80 dark:border-white/10"
                : "text-foreground/70 hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5"
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-black/10 dark:bg-white/10 text-foreground/70"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
