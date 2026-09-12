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
  Scale,
  Clock,
  Truck,
  Check,
  RefreshCw,
  Layers,
  Radio,
  CreditCard,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassStat } from "@/components/glass/GlassBadge";
import { useTranslation } from "@/lib/i18n";
import { adminApi, procurementApi } from "@/lib/api";
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

      {/* SMART PROCUREMENT CONTROL (Section 13 User Requirement) */}
      <GlassCard variant="elevated" className="p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Scale className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  SIH Mandi Officer Command
                </span>
                <span className="text-xs font-bold text-foreground/75 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Mandal Procurement Centre (Malihabad)
                </span>
              </div>
              <h3 className="text-lg font-black text-foreground mt-0.5">
                SMART PROCUREMENT CONTROL
              </h3>
            </div>
          </div>

          <Link href="/farmer/procurement">
            <GlassButton variant="secondary" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>
              Open Farmer View
            </GlassButton>
          </Link>
        </div>

        {/* 8 Core Procurement Admin Telemetry Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 my-5">
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-center">
            <span className="text-[10px] uppercase text-foreground/50 font-bold block">
              Total Today
            </span>
            <span className="text-xl font-black text-foreground mt-0.5 block">248</span>
            <span className="text-[9px] text-foreground/50">Farmers</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-center">
            <span className="text-[10px] uppercase text-foreground/50 font-bold block">
              Scheduled
            </span>
            <span className="text-xl font-black text-sky-700 dark:text-sky-400 mt-0.5 block">194</span>
            <span className="text-[9px] text-foreground/50">Booked Slots</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 text-center border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-900 dark:text-amber-200 font-bold block">
              Waiting
            </span>
            <span className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5 block">18</span>
            <span className="text-[9px] text-amber-900/70 dark:text-amber-200/70">In Queue</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-center border border-emerald-500/20">
            <span className="text-[10px] uppercase text-emerald-900 dark:text-emerald-200 font-bold block">
              Being Served
            </span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">4</span>
            <span className="text-[9px] text-emerald-900/70 dark:text-emerald-200/70">At Counters</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-center">
            <span className="text-[10px] uppercase text-foreground/50 font-bold block">
              Completed
            </span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">172</span>
            <span className="text-[9px] text-foreground/50">Weighed & Certified</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-center">
            <span className="text-[10px] uppercase text-foreground/50 font-bold block">
              Active Counters
            </span>
            <span className="text-xl font-black text-foreground mt-0.5 block">4 / 5</span>
            <span className="text-[9px] text-foreground/50">Operating Lines</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-center">
            <span className="text-[10px] uppercase text-foreground/50 font-bold block">
              Avg Wait Time
            </span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">32 min</span>
            <span className="text-[9px] text-foreground/50">Per Intake Call</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-center">
            <span className="text-[10px] uppercase text-foreground/50 font-bold block">
              Centre Load
            </span>
            <span className="text-xl font-black text-foreground mt-0.5 block">78%</span>
            <span className="text-[9px] text-foreground/50">Optimal Flow</span>
          </div>
        </div>

        {/* Live Queue Management Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Live Mandi Queue & Intake Management
            </h4>
            <span className="text-[11px] text-foreground/50">
              Procurement Officer Console • Live Gate Dispatch
            </span>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-foreground/60 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-3.5">Token</th>
                  <th className="py-3 px-3.5">Farmer</th>
                  <th className="py-3 px-3.5">Crop</th>
                  <th className="py-3 px-3.5">Slot</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Counter</th>
                  <th className="py-3 px-3.5">ETA</th>
                  <th className="py-3 px-3.5 text-right">Officer Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {[
                  {
                    token: "A130",
                    farmer: "Sukhdev Singh",
                    crop: "Paddy (1,800 kg)",
                    slot: "10:00 – 10:30 AM",
                    status: "BEING_SERVED",
                    statusLabel: "At Weighbridge",
                    counter: "Counter 2",
                    eta: "0 min (Serving)",
                    badge: "success" as const,
                  },
                  {
                    token: "A131",
                    farmer: "Mahendra Verma",
                    crop: "Paddy (1,250 kg)",
                    slot: "10:00 – 10:30 AM",
                    status: "CALLED",
                    statusLabel: "Called to Gate",
                    counter: "Counter 3",
                    eta: "~2 min",
                    badge: "info" as const,
                  },
                  {
                    token: "A132",
                    farmer: "Bhanu Pratap Singh",
                    crop: "Wheat (2,100 kg)",
                    slot: "10:30 – 11:00 AM",
                    status: "ARRIVED",
                    statusLabel: "Arrived at Gate",
                    counter: "Unassigned",
                    eta: "~6 min",
                    badge: "warning" as const,
                  },
                  {
                    token: "A142",
                    farmer: "Rameshwar Prasad Patel",
                    crop: "Basmati Paddy (1,480 kg)",
                    slot: "10:30 – 11:00 AM",
                    status: "SCHEDULED",
                    statusLabel: "Token Active (You)",
                    counter: "Ramp 2 (Reserved)",
                    eta: "~32 min",
                    badge: "gold" as const,
                    isUser: true,
                  },
                  {
                    token: "A143",
                    farmer: "Kallu Ram",
                    crop: "Mustard (850 kg)",
                    slot: "10:30 – 11:00 AM",
                    status: "SCHEDULED",
                    statusLabel: "Scheduled",
                    counter: "Waiting",
                    eta: "~36 min",
                    badge: "neutral" as const,
                  },
                  {
                    token: "A129",
                    farmer: "Harishankar Yadav",
                    crop: "Paddy (1,500 kg)",
                    slot: "09:30 – 10:00 AM",
                    status: "COMPLETED",
                    statusLabel: "Intake Completed",
                    counter: "Counter 1",
                    eta: "Completed (Paid)",
                    badge: "success" as const,
                  },
                ].map((row) => (
                  <tr
                    key={row.token}
                    className={`hover:bg-black/5 dark:hover:bg-white/5 transition ${
                      row.isUser ? "bg-emerald-500/10 font-medium" : ""
                    }`}
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-foreground flex items-center gap-1.5">
                      {row.token}
                      {row.isUser && (
                        <span className="text-[8px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full uppercase">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-foreground">
                      {row.farmer}
                    </td>
                    <td className="py-3 px-3.5 text-foreground/75">
                      {row.crop}
                    </td>
                    <td className="py-3 px-3.5 text-foreground/70 font-mono text-[11px]">
                      {row.slot}
                    </td>
                    <td className="py-3 px-3.5">
                      <GlassBadge variant={row.badge} size="sm">
                        {row.statusLabel}
                      </GlassBadge>
                    </td>
                    <td className="py-3 px-3.5 font-medium text-foreground/80">
                      {row.counter}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-emerald-700 dark:text-emerald-400">
                      {row.eta}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            alert(`Token ${row.token} marked as ARRIVED at gate.`);
                          }}
                          className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[10px] font-semibold text-foreground transition"
                        >
                          Mark Arrived
                        </button>
                        <button
                          onClick={() => {
                            alert(`Counter assigned for token ${row.token}.`);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold transition"
                        >
                          Assign Counter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

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
