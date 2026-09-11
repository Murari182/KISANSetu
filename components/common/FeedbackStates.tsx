"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  AlertCircle,
  Inbox,
  RefreshCw,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassModal } from "@/components/glass/GlassModal";

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = "Loading verified data...",
  className = "",
}) => (
  <div
    className={`w-full py-16 flex flex-col items-center justify-center gap-3 text-center ${className}`}
  >
    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
    <p className="text-xs font-semibold text-foreground/70 tracking-wide">
      {message}
    </p>
  </div>
);

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}> = ({
  title = "No records found",
  description = "There are no entries available for this view currently.",
  actionLabel,
  onAction,
  icon,
  className = "",
}) => (
  <GlassCard
    variant="subtle"
    className={`p-10 text-center flex flex-col items-center justify-center ${className}`}
  >
    <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground/40 mb-3">
      {icon || <Inbox className="w-7 h-7" />}
    </div>
    <h4 className="text-sm font-bold text-foreground tracking-tight">{title}</h4>
    <p className="text-xs text-foreground/50 mt-1 max-w-sm leading-relaxed">
      {description}
    </p>
    {actionLabel && onAction && (
      <div className="mt-4">
        <GlassButton variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </GlassButton>
      </div>
    )}
  </GlassCard>
);

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = "Unable to load information",
  message = "A network or server communication error occurred. Please retry.",
  onRetry,
  className = "",
}) => (
  <GlassCard
    variant="subtle"
    className={`p-8 text-center flex flex-col items-center justify-center border-rose-300/40 dark:border-rose-900/30 ${className}`}
  >
    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h4 className="text-sm font-bold text-foreground">{title}</h4>
    <p className="text-xs text-foreground/60 mt-1 max-w-xs">{message}</p>
    {onRetry && (
      <div className="mt-4">
        <GlassButton
          variant="secondary"
          size="sm"
          iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Retry Request
        </GlassButton>
      </div>
    )}
  </GlassCard>
);

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="w-full bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        You are offline. Farm journal and crop changes are cached locally and
        will sync once connected.
      </span>
    </div>
  );
};

export const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <GlassModal isOpen={isOpen} onClose={onCancel} maxWidth="sm">
      <div className="flex items-start gap-3">
        <div
          className={`p-2.5 rounded-2xl shrink-0 ${
            isDestructive
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">{title}</h4>
          <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-2.5">
        <GlassButton variant="secondary" size="sm" onClick={onCancel}>
          {cancelLabel}
        </GlassButton>
        <GlassButton
          variant={isDestructive ? "danger" : "primary"}
          size="sm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </GlassButton>
      </div>
    </GlassModal>
  );
};
