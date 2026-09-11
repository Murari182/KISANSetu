"use client";

import React, { forwardRef } from "react";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, hint, iconLeft, iconRight, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-foreground/80 tracking-wide select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <span className="absolute left-3.5 text-foreground/45 pointer-events-none shrink-0">
              {iconLeft}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-2xl bg-white/60 dark:bg-[#0c1410]/60 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground placeholder:text-foreground/35 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner transition-all duration-200 ${
              iconLeft ? "pl-10" : ""
            } ${iconRight ? "pr-10" : ""} ${
              error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""
            } ${className}`}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3.5 text-foreground/45 shrink-0">
              {iconRight}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        {!error && hint && <span className="text-xs text-foreground/50">{hint}</span>}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
