"use client";

import React from "react";

export interface GlassBadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "gold";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  variant = "neutral",
  size = "md",
  children,
  className = "",
  icon,
}) => {
  const variantStyles = {
    success:
      "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
    warning:
      "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
    danger:
      "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
    info:
      "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
    neutral:
      "bg-black/5 dark:bg-white/10 text-foreground/80 border-black/10 dark:border-white/10",
    gold:
      "bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/30",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full backdrop-blur-md border ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export interface GlassProgressProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "emerald" | "amber" | "rose" | "sky";
  className?: string;
}

export const GlassProgress: React.FC<GlassProgressProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  color = "emerald",
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorStyles = {
    emerald: "bg-emerald-600 dark:bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    sky: "bg-sky-500",
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs text-foreground/75 font-medium">
          {label && <span>{label}</span>}
          {showPercent && <span>{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md overflow-hidden p-0.5 border border-black/5 dark:border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export interface GlassStatProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const GlassStat: React.FC<GlassStatProps> = ({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  subtitle,
  className = "",
}) => {
  return (
    <div
      className={`rounded-3xl bg-white/70 dark:bg-[#0e1612]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {(change || subtitle) && (
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            {change && (
              <span
                className={`font-semibold ${
                  changeType === "positive"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : changeType === "negative"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-foreground/60"
                }`}
              >
                {change}
              </span>
            )}
            {subtitle && <span className="text-foreground/50">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
