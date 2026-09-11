"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface GlassSelectOption {
  value: string;
  label: string;
}

export interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: GlassSelectOption[];
  error?: string;
  hint?: string;
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ label, options, error, hint, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-foreground/80 tracking-wide select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none rounded-2xl bg-white/60 dark:bg-[#0c1410]/60 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner pr-10 cursor-pointer transition-all duration-200 ${
              error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-white dark:bg-[#0f1713] text-foreground"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3.5 pointer-events-none text-foreground/50">
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>
        {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        {!error && hint && <span className="text-xs text-foreground/50">{hint}</span>}
      </div>
    );
  }
);

GlassSelect.displayName = "GlassSelect";

export interface GlassTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-foreground/80 tracking-wide select-none"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full rounded-2xl bg-white/60 dark:bg-[#0c1410]/60 backdrop-blur-md border border-black/10 dark:border-white/10 text-foreground placeholder:text-foreground/35 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner transition-all duration-200 ${
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
        {!error && hint && <span className="text-xs text-foreground/50">{hint}</span>}
      </div>
    );
  }
);

GlassTextarea.displayName = "GlassTextarea";
