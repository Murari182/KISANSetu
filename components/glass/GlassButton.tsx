"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  className = "",
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none overflow-hidden";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
    icon: "p-2.5 w-10 h-10 rounded-2xl",
  };

  const variantStyles = {
    primary:
      "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-[0_4px_16px_rgba(21,128,61,0.28)] dark:shadow-[0_4px_16px_rgba(16,185,129,0.3)] border border-emerald-600/50",
    secondary:
      "bg-white/70 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/15 text-foreground backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm",
    ghost:
      "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-foreground",
    outline:
      "bg-transparent border border-emerald-700/30 dark:border-emerald-400/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-[0_4px_16px_rgba(225,29,72,0.25)] border border-rose-500/50",
    gold:
      "bg-amber-600 hover:bg-amber-700 text-white shadow-[0_4px_16px_rgba(217,119,6,0.25)] border border-amber-500/50",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Specular sheen on top */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        iconLeft && <span className="shrink-0">{iconLeft}</span>
      )}
      <span>{children}</span>
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
