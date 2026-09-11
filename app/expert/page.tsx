"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Stethoscope,
  Sparkles,
  FileCheck,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassStat } from "@/components/glass/GlassBadge";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { expertApi } from "@/lib/api";
import { Consultation } from "@/types";

export default function ExpertDashboardPage() {
  const { user } = useSession();
  const { t } = useTranslation();
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    expertApi.getConsultations().then(setConsultations);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Banner */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                ICAR Certified Agronomist
              </span>
              <span className="text-purple-200 text-xs">
                Plant Pathology & Soil Chemistry
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Expert Workspace, {user?.name || "Dr. Swaminathan"}
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/80 mt-1 max-w-xl">
              Review assigned field disease diagnostic cases, validate automated computer
              vision results, and consult directly with smallholder farmers.
            </p>
          </div>

          <Link href="/expert/cases">
            <GlassButton
              variant="secondary"
              size="md"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Review Pending Cases
            </GlassButton>
          </Link>
        </div>
      </section>

      {/* 4 Stats Cards (Section 47) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStat
          label="Pending Case Reviews"
          value="3 Cases"
          change="Requires action"
          changeType="negative"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <GlassStat
          label="Today's Consultations"
          value="2 Sessions"
          change="Next at 10:30 AM"
          changeType="positive"
          icon={<Calendar className="w-5 h-5 text-purple-600" />}
        />
        <GlassStat
          label="Active Farmers Supported"
          value="48 Farmers"
          change="Across 6 districts"
          changeType="neutral"
          icon={<Users className="w-5 h-5 text-emerald-600" />}
        />
        <GlassStat
          label="Resolved Prescriptions"
          value="142"
          change="98.2% Farmer Satisfaction"
          changeType="positive"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Pending Case Reviews List (Section 47 & 48) */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Farmer Diagnostic Cases Requiring Expert Assessment
            </h3>
            <p className="text-xs text-foreground/55 mt-0.5">
              Review AI preliminary leaf scans and issue certified recommendations.
            </p>
          </div>
          <Link
            href="/expert/cases"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            View All ({consultations.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-foreground text-sm">
                    {c.farmerName}
                  </h4>
                  <GlassBadge variant="warning" size="sm">
                    {c.status.toUpperCase()}
                  </GlassBadge>
                </div>
                <div className="text-foreground/60 mt-0.5">
                  Holding: {c.farmName} • Problem: {c.cropName}
                </div>
                <p className="text-foreground/80 mt-1 italic leading-relaxed max-w-xl">
                  &quot;{c.issueDescription}&quot;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/expert/cases">
                  <GlassButton variant="primary" size="sm">
                    Open Case File
                  </GlassButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
