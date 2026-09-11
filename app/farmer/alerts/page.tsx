"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  Trash2,
  CheckCheck,
  Settings,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { alertApi } from "@/lib/api";
import { AlertNotification } from "@/types";

export default function AlertsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    alertApi.getAlerts().then(setAlerts);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await alertApi.markAsRead(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleMarkAllRead = async () => {
    await alertApi.markAllRead();
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast({
      type: "success",
      title: "All Alerts Read",
      message: "Notification center updated.",
    });
  };

  const filtered = alerts.filter(
    (a) => filterCategory === "all" || a.category === filterCategory
  );

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("nav.alerts")}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            Real-time weather warnings, mandi price thresholds, and scheme cutoffs.
          </p>
        </div>

        <GlassButton
          variant="secondary"
          size="md"
          iconLeft={<CheckCheck className="w-4 h-4" />}
          onClick={handleMarkAllRead}
        >
          Mark All as Read
        </GlassButton>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Alerts" },
          { id: "weather", label: "Weather" },
          { id: "market", label: "Mandi Prices" },
          { id: "pest", label: "Pest & Disease" },
          { id: "government", label: "Government" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filterCategory === tab.id
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-black/5 dark:bg-white/5 text-foreground/70 hover:bg-black/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const isUrgent = alert.priority === "urgent";
          const isWarning = alert.priority === "warning";

          return (
            <GlassCard
              key={alert.id}
              className={`p-5 transition-all ${
                !alert.read
                  ? "border-l-4 border-l-emerald-600 bg-white/90 dark:bg-[#0f1713]/90"
                  : "opacity-75"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                      isUrgent
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        : isWarning
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                    }`}
                  >
                    {isUrgent ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isWarning ? (
                      <CloudSun className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">
                        {alert.title}
                      </h3>
                      {!alert.read && (
                        <GlassBadge variant="success" size="sm">
                          New
                        </GlassBadge>
                      )}
                      <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                        {alert.category}
                      </span>
                    </div>

                    <p className="text-xs text-foreground/75 mt-1 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="text-foreground/45 text-[11px]">
                        {alert.timestamp}
                      </span>

                      {alert.actionUrl && (
                        <Link
                          href={alert.actionUrl}
                          className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                        >
                          View Details →
                        </Link>
                      )}

                      {!alert.read && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="text-foreground/50 hover:text-foreground text-[11px]"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
