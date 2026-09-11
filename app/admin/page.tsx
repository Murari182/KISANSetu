"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  UserCheck,
  Stethoscope,
  Landmark,
  Cpu,
  TrendingUp,
  Activity,
  ArrowRight,
  Server,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassStat } from "@/components/glass/GlassBadge";
import { useTranslation } from "@/lib/i18n";
import { adminApi } from "@/lib/api";
import { MLModelMetric } from "@/types";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<MLModelMetric[]>([]);

  useEffect(() => {
    adminApi.getMLMetrics().then(setMetrics);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Banner */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-950 via-slate-900 to-emerald-950 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                System Command Center
              </span>
              <span className="text-sky-300 text-xs">
                National Agricultural Data Infrastructure
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t("admin.title")}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/80 mt-1 max-w-xl">
              Platform telemetry, ML model precision metrics, agronomist credentialing,
              and pan-India mandi integration status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/ml">
              <GlassButton
                variant="primary"
                size="md"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Inspect ML Telemetry
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Platform Metrics (Section 49) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStat
          label={t("admin.totalFarmers")}
          value="2,418,920"
          change="+14,200 this week"
          changeType="positive"
          subtitle="Across 28 States & UTs"
          icon={<Users className="w-5 h-5 text-emerald-600" />}
        />
        <GlassStat
          label={t("admin.verifiedExperts")}
          value="1,480"
          change="98.8% Active Availability"
          changeType="positive"
          subtitle="ICAR & State Univ Certified"
          icon={<UserCheck className="w-5 h-5 text-purple-600" />}
        />
        <GlassStat
          label={t("admin.diagnosesRun")}
          value="684,120"
          change="Average 142ms response"
          changeType="positive"
          subtitle="Leaf Computer Vision Scans"
          icon={<Stethoscope className="w-5 h-5 text-rose-600" />}
        />
        <GlassStat
          label={t("admin.activeSchemes")}
          value="42 Programs"
          change="100% DBT Verified"
          changeType="neutral"
          subtitle="Central & State Welfare"
          icon={<Landmark className="w-5 h-5 text-sky-600" />}
        />
      </div>

      {/* ML Diagnostic Models Status (Section 52) */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Production ML Inference Telemetry
            </h3>
            <p className="text-xs text-foreground/55 mt-0.5">
              Real-time validation metrics from active agronomic vision models.
            </p>
          </div>
          <Link
            href="/admin/ml"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            View Full Telemetry →
          </Link>
        </div>

        <div className="space-y-3">
          {metrics.map((model) => (
            <div
              key={model.id}
              className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {model.name}
                  </h4>
                  <GlassBadge variant="success" size="sm">
                    {model.status.toUpperCase()}
                  </GlassBadge>
                  <span className="text-[10px] text-foreground/50 font-mono">
                    v{model.version}
                  </span>
                </div>
                <div className="text-foreground/60 mt-0.5">
                  Task: {model.task} • Latency: {model.avgLatencyMs}ms
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                    Accuracy
                  </span>
                  <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
                    {model.accuracy}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                    F1-Score
                  </span>
                  <div className="text-base font-black text-foreground">
                    {model.f1Score}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
