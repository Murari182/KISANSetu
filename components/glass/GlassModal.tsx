"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} rounded-3xl bg-white/90 dark:bg-[#0f1713]/90 backdrop-blur-2xl border border-white/80 dark:border-white/10 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] z-10 animate-in zoom-in-95 duration-200`}
      >
        {/* Top liquid shine */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none rounded-t-3xl" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-foreground/60 mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-foreground/70 hover:text-foreground transition-all duration-150"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
