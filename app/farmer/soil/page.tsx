"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Droplets,
  Activity,
  Plus,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassProgress } from "@/components/glass/GlassBadge";
import { GlassModal } from "@/components/glass/GlassModal";
import { GlassUpload } from "@/components/glass/GlassUpload";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { soilApi } from "@/lib/api";
import { SoilRecord } from "@/types";

export default function SoilHealthPage() {
  const { activeFarm } = useSession();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [soil, setSoil] = useState<SoilRecord | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  useEffect(() => {
    if (activeFarm) {
      soilApi.getSoilRecord(activeFarm.id).then(setSoil);
    }
  }, [activeFarm]);

  const handleUploadReport = () => {
    setIsUploadModalOpen(false);
    showToast({
      type: "success",
      title: "Soil Health Card Submitted",
      message: "Your laboratory test card has been attached to this farm plot.",
    });
  };

  if (!soil) return null;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GlassBadge variant="warning" size="sm" icon={<Layers className="w-3.5 h-3.5" />}>
              National Soil Health Card Scheme
            </GlassBadge>
            <span className="text-xs text-foreground/50">
              Lab Calibrated Chemistry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("soil.title")}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            {t("soil.subtitle")}
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          iconLeft={<UploadCloud className="w-4 h-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          {t("soil.uploadCard")}
        </GlassButton>
      </div>

      {/* Soil Quality Score Overview Card */}
      <GlassCard className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50/70 via-white/80 to-amber-50/40 dark:from-emerald-950/40 dark:via-[#0e1612]/80 dark:to-amber-950/10 border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              Soil Quality Index • {activeFarm?.name}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-foreground mt-1">
              {soil.healthScore}
              <span className="text-lg font-normal text-foreground/50">/100</span>
            </div>
            <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
              Texture: <strong>Alluvial Loam</strong> • Moisture:{" "}
              <strong>{soil.moisturePercent}% (Adequate)</strong>. Excellent macronutrient balance with minor nitrogen replenishment indicated.
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#121c17]/80 border border-black/5 dark:border-white/10 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between gap-4 font-semibold text-foreground">
              <span>Last Soil Test Date:</span>
              <span className="text-emerald-700 dark:text-emerald-400">{soil.date}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-foreground/60">
              <span>Laboratory Document:</span>
              <span>{soil.reportFile}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Nutrient Breakdown Matrix (N-P-K & pH) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nitrogen (N) */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground/60 uppercase">
                Nitrogen (N)
              </span>
              <GlassBadge variant="warning" size="sm">
                Slightly Low
              </GlassBadge>
            </div>
            <div className="text-2xl font-black text-foreground mt-2">
              {soil.nitrogenKgHa} <span className="text-xs font-normal">kg/ha</span>
            </div>
            <p className="text-[11px] text-foreground/50 mt-1">
              Target: 280 - 450 kg/ha
            </p>
          </div>
          <div className="mt-4">
            <GlassProgress value={62} color="amber" showPercent={false} />
          </div>
        </GlassCard>

        {/* Phosphorus (P) */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground/60 uppercase">
                Phosphorus (P)
              </span>
              <GlassBadge variant="success" size="sm">
                Optimal
              </GlassBadge>
            </div>
            <div className="text-2xl font-black text-foreground mt-2">
              {soil.phosphorusKgHa} <span className="text-xs font-normal">kg/ha</span>
            </div>
            <p className="text-[11px] text-foreground/50 mt-1">
              Target: 20 - 30 kg/ha
            </p>
          </div>
          <div className="mt-4">
            <GlassProgress value={85} color="emerald" showPercent={false} />
          </div>
        </GlassCard>

        {/* Potassium (K) */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground/60 uppercase">
                Potassium (K)
              </span>
              <GlassBadge variant="success" size="sm">
                High / Abundant
              </GlassBadge>
            </div>
            <div className="text-2xl font-black text-foreground mt-2">
              {soil.potassiumKgHa} <span className="text-xs font-normal">kg/ha</span>
            </div>
            <p className="text-[11px] text-foreground/50 mt-1">
              Target: 250 - 350 kg/ha
            </p>
          </div>
          <div className="mt-4">
            <GlassProgress value={90} color="emerald" showPercent={false} />
          </div>
        </GlassCard>

        {/* pH Balance */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground/60 uppercase">
                Soil Reaction (pH)
              </span>
              <GlassBadge variant="success" size="sm">
                Neutral
              </GlassBadge>
            </div>
            <div className="text-2xl font-black text-foreground mt-2">
              {soil.ph} <span className="text-xs font-normal">pH</span>
            </div>
            <p className="text-[11px] text-foreground/50 mt-1">
              Target: 6.5 - 7.5 (Optimal)
            </p>
          </div>
          <div className="mt-4">
            <GlassProgress value={88} color="emerald" showPercent={false} />
          </div>
        </GlassCard>
      </div>

      {/* Soil Improvement Recommendations (Section 37) */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("soil.recommendations")}</span>
        </h3>

        <div className="space-y-2.5">
          {soil.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-start gap-3 text-xs leading-relaxed text-foreground/80"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Soil Report Upload Modal (Section 38) */}
      <GlassModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={t("soil.uploadCard")}
        description="Upload official laboratory Soil Health Card issued by Krishi Vigyan Kendra (PDF or Image)."
      >
        <div className="space-y-4">
          <GlassUpload
            onFileSelect={(file, base64) => setUploadedFile(base64)}
            title="Drag & drop Soil Health Card here"
            hint="Supports PDF, JPG, PNG up to 10MB"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              disabled={!uploadedFile}
              onClick={handleUploadReport}
            >
              Submit Report
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
