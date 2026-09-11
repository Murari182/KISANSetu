"use client";

import React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "glow" | "elevated" | "accent";
  hoverable?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = "default",
  hoverable = false,
  className = "",
  children,
  ...props
}) => {
  const variantStyles = {
    default:
      "bg-white/75 dark:bg-[#0e1612]/75 border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
    subtle:
      "bg-white/45 dark:bg-[#0e1612]/45 border-white/50 dark:border-white/5 shadow-sm",
    glow:
      "bg-white/85 dark:bg-[#0e1612]/85 border-emerald-500/30 dark:border-emerald-500/20 shadow-[0_0_25px_-5px_rgba(22,163,74,0.18)] dark:shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]",
    elevated:
      "bg-white/85 dark:bg-[#121c17]/85 border-white/90 dark:border-white/15 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)]",
    accent:
      "bg-gradient-to-br from-emerald-50/80 via-white/80 to-emerald-50/40 dark:from-emerald-950/30 dark:via-[#0e1612]/80 dark:to-emerald-950/10 border-emerald-200/60 dark:border-emerald-700/30 shadow-sm",
  };

  return (
    <div
      className={`relative rounded-3xl backdrop-blur-xl border transition-all duration-200 ${
        variantStyles[variant]
      } ${
        hoverable
          ? "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.5)] cursor-pointer"
          : ""
      } ${className}`}
      {...props}
    >
      {/* Liquid glass specular top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/20 to-transparent pointer-events-none rounded-t-3xl" />
      {children}
    </div>
  );
};
