"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  User,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  Droplets,
  Layers,
  Phone,
  FileCheck,
  Save,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassTextarea } from "@/components/glass/GlassSelect";
import { useToast } from "@/lib/toast";
import { expertApi } from "@/lib/api";
import { Consultation } from "@/types";

export default function ExpertCasesPage() {
  const { showToast } = useToast();
  const [cases, setCases] = useState<Consultation[]>([]);
  const [selectedCase, setSelectedCase] = useState<Consultation | null>(null);

  // Assessment formulation state
  const [assessmentText, setAssessmentText] = useState(
    "Mild stripe rust identified. Recommend foliar spray of Propiconazole 25% EC @ 1 ml/L before morning dew dries."
  );
  const [recommendationText, setRecommendationText] = useState(
    "Ensure 7-day waiting period before next foliar application. Avoid high nitrogen top-dressing during cloudy weather."
  );

  useEffect(() => {
    expertApi.getConsultations().then((res) => {
      setCases(res);
      if (res.length > 0) setSelectedCase(res[0]);
    });
  }, []);

  const handleResolveCase = async (id: string) => {
    await expertApi.updateConsultationStatus(
      id,
      "completed",
      `${assessmentText} | ${recommendationText}`
    );

    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "completed",
              expertAssessment: `${assessmentText} | ${recommendationText}`,
            }
          : c
      )
    );

    if (selectedCase?.id === id) {
      setSelectedCase((prev) =>
        prev
          ? {
              ...prev,
              status: "completed",
              expertAssessment: `${assessmentText} | ${recommendationText}`,
            }
          : null
      );
    }

    showToast({
      type: "success",
      title: "Case Resolved",
      message: "Certified agronomist diagnosis and prescription dispatched to farmer.",
    });
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge variant="info" size="sm" icon={<Briefcase className="w-3.5 h-3.5" />}>
            Diagnostic Case Workflows
          </GlassBadge>
          <span className="text-xs text-foreground/50">
            Certified Agronomist Verification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Farmer Diagnostic Cases
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
          Review leaf scans, cross-reference soil/weather baselines, and issue certified advisory prescriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cases Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50">
            Open Queue ({cases.length})
          </div>

          {cases.map((c) => {
            const isSelected = selectedCase?.id === c.id;
            return (
              <GlassCard
                key={c.id}
                hoverable
                onClick={() => setSelectedCase(c)}
                className={`p-4 transition-all ${
                  isSelected
                    ? "border-purple-600/70 dark:border-purple-500/50 ring-2 ring-purple-500/20 bg-white/85 dark:bg-[#0e1612]/85"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {c.farmerName}
                  </h4>
                  <GlassBadge
                    variant={c.status === "completed" ? "success" : "warning"}
                    size="sm"
                  >
                    {c.status.toUpperCase()}
                  </GlassBadge>
                </div>
                <div className="text-xs text-foreground/60 mt-1">
                  Holding: {c.farmName}
                </div>
                <p className="text-xs text-foreground/75 mt-1.5 line-clamp-2">
                  {c.issueDescription}
                </p>
              </GlassCard>
            );
          })}
        </div>

        {/* Selected Case Inspection & Formulation (8 cols) */}
        {selectedCase && (
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">
                    Case File: #{selectedCase.id}
                  </h2>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Farmer: {selectedCase.farmerName} • Phone: {selectedCase.farmerPhone}
                  </p>
                </div>
                <GlassBadge
                  variant={selectedCase.status === "completed" ? "success" : "warning"}
                  size="md"
                >
                  Status: {selectedCase.status.toUpperCase()}
                </GlassBadge>
              </div>

              {/* Farmer Problem Statement */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-foreground/50 uppercase">
                  Farmer Reported Issue
                </span>
                <p className="text-foreground/90 leading-relaxed font-medium">
                  &quot;{selectedCase.issueDescription}&quot;
                </p>
              </div>

              {/* Automated ML Preliminary Analysis (Section 48) */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Automated Vision Diagnostic (Preliminary)
                  </span>
                  <GlassBadge variant="success" size="sm">
                    91.4% Confidence
                  </GlassBadge>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  Preliminary prediction identified <strong>Yellow Rust (Puccinia striiformis)</strong> on Wheat leaves. Field weather indicates 58% humidity with no rain in next 48h.
                </p>
              </div>

              {/* Formulation Editor */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-foreground">
                  Formulate Certified Agronomist Prescription
                </h3>

                <GlassTextarea
                  label="Official Diagnostic Assessment"
                  value={assessmentText}
                  onChange={(e) => setAssessmentText(e.target.value)}
                  rows={3}
                />

                <GlassTextarea
                  label="Chemical / Biological Spray Instructions"
                  value={recommendationText}
                  onChange={(e) => setRecommendationText(e.target.value)}
                  rows={3}
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5 dark:border-white/5">
                  <GlassButton
                    variant="primary"
                    size="md"
                    onClick={() => handleResolveCase(selectedCase.id)}
                    iconRight={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Dispatch Prescription & Mark Resolved
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
