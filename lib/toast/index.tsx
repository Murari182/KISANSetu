"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, durationMs = 4000 }: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, title, message, durationMs }]);

      if (durationMs > 0) {
        setTimeout(() => {
          removeToast(id);
        }, durationMs);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container floating at top-right on desktop, top-center on mobile */}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed top-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 pointer-events-none max-w-sm sm:w-full"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl backdrop-blur-xl border shadow-xl transition-all animate-in fade-in slide-in-from-top-3 ${
              toast.type === "success"
                ? "bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-100"
                : toast.type === "error"
                ? "bg-rose-50/90 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700/60 text-rose-900 dark:text-rose-100"
                : toast.type === "warning"
                ? "bg-amber-50/90 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-100"
                : "bg-sky-50/90 dark:bg-sky-950/80 border-sky-300 dark:border-sky-700/60 text-sky-900 dark:text-sky-100"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
              {toast.message && <p className="text-xs mt-1 opacity-90 leading-normal">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-current opacity-70 hover:opacity-100 transition"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
