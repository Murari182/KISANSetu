"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  UserCheck,
  RotateCcw,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassUpload } from "@/components/glass/GlassUpload";
import { LoadingState } from "@/components/common/FeedbackStates";
import { useSession } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { useTranslation } from "@/lib/i18n";
import { cropDoctorApi } from "@/lib/api";
import { DiseasePrediction } from "@/types";

export default function CropDoctorPage() {
  const { activeFarm } = useSession();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();

  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null);

  const handleFileSelect = (file: File, base64: string) => {
    setUploadedBase64(base64);
    setPrediction(null);
  };

  const handleStartAnalysis = async () => {
    if (!uploadedBase64) return;
    setIsAnalyzing(true);
    try {
      const result = await cropDoctorApi.diagnoseImage(uploadedBase64);
      setPrediction(result);
      showToast({
        type: "success",
        title: "Crop Analysis Complete",
        message: `Diagnosis: ${result.diseaseName} (${result.confidencePercent}% confidence)`,
      });
    } catch (e) {
      showToast({
        type: "error",
        title: "Analysis Failed",
        message: "Unable to process image. Please try another angle.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedBase64(null);
    setPrediction(null);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge variant="danger" size="sm" icon={<Stethoscope className="w-3.5 h-3.5" />}>
            Agricultural Computer Vision
          </GlassBadge>
          <span className="text-xs text-foreground/50">
            ICAR-Trained Diagnostics Contract
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("cropDoctor.title")}
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
          {t("cropDoctor.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Crop Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              1. Select Affected Crop
            </h3>
            <GlassSelect
              label="Field Planting"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              options={[
                { value: "Wheat", label: "Wheat (HD-2967) - Lucknow Farm" },
                { value: "Mustard", label: "Mustard (Pusa Bold) - Lucknow Farm" },
                { value: "Paddy", label: "Basmati Paddy (1121) - Barabanki Farm" },
                { value: "Potato", label: "Potato (Kufri Jyoti)" },
                { value: "Cotton", label: "Cotton (Bt Cereal)" },
              ]}
            />

            <div className="pt-2">
              <h3 className="text-sm font-bold text-foreground mb-1">
                2. Leaf or Stem Specimen Photo
              </h3>
              <p className="text-xs text-foreground/50 mb-3">
                Ensure good daytime lighting and focus closely on the lesion or discoloration.
              </p>

              <GlassUpload
                onFileSelect={handleFileSelect}
                onClear={handleReset}
                previewUrl={uploadedBase64 || undefined}
                title="Drop leaf image here or take photo"
                hint="Supports JPG, PNG up to 10MB"
                allowCamera={true}
              />
            </div>

            {uploadedBase64 && !prediction && (
              <GlassButton
                variant="primary"
                size="lg"
                className="w-full mt-2"
                loading={isAnalyzing}
                onClick={handleStartAnalysis}
                iconRight={<Sparkles className="w-4 h-4" />}
              >
                Run Disease Analysis
              </GlassButton>
            )}

            {prediction && (
              <GlassButton
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleReset}
                iconLeft={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Scan Another Leaf
              </GlassButton>
            )}
          </GlassCard>

          {/* AI Safety Advisory Note (Section 72 & 73) */}
          <GlassCard variant="accent" className="p-4 border-amber-500/30">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-amber-950 dark:text-amber-200">
                <strong>Advisory AI Notice:</strong> Computer vision predictions are
                guidelines. Always cross-verify with certified agronomists or your local
                Krishi Vigyan Kendra before applying chemical fungicides.
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Analysis Loading or Detailed Prediction Results (7 cols) */}
        <div className="lg:col-span-7">
          {isAnalyzing ? (
            <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
              <LoadingState message="Extracting leaf tissue patterns & querying AgriVision ML models..." />
            </GlassCard>
          ) : prediction ? (
            <GlassCard className="p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 border-emerald-500/30">
              {/* Diagnosis Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">
                      {t("cropDoctor.diagnosisResult")}
                    </span>
                    <GlassBadge
                      variant={
                        prediction.severity === "Severe"
                          ? "danger"
                          : prediction.severity === "Moderate"
                          ? "warning"
                          : "info"
                      }
                      size="sm"
                    >
                      {prediction.severity} Severity
                    </GlassBadge>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    {prediction.diseaseName}
                  </h2>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Specimen: {prediction.cropName} • Model: {prediction.modelVersion}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                    {prediction.confidencePercent}%
                  </div>
                  <span className="text-[10px] text-foreground/50 font-semibold uppercase">
                    {t("cropDoctor.confidence")}
                  </span>
                </div>
              </div>

              {/* Observed Symptoms List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("cropDoctor.symptoms")}</span>
                </h4>
                <ul className="space-y-1.5">
                  {prediction.symptoms.map((sym, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-foreground/80 flex items-start gap-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl"
                    >
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("cropDoctor.recommendedActions")}</span>
                </h4>
                <div className="space-y-2">
                  {prediction.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium"
                    >
                      {idx + 1}. {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Prevention Practices */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{t("cropDoctor.prevention")}</span>
                </h4>
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs text-foreground/75 space-y-1">
                  {prediction.prevention.map((prev, idx) => (
                    <div key={idx}>• {prev}</div>
                  ))}
                </div>
              </div>

              {/* Certified Agronomist Review CTA (Section 25) */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-foreground/60">
                  Need a certified prescription before spraying?
                </div>
                <Link href="/farmer/experts">
                  <GlassButton
                    variant="primary"
                    size="md"
                    iconLeft={<UserCheck className="w-4 h-4" />}
                    iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {t("cropDoctor.consultExpert")}
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <GlassCard
              variant="subtle"
              className="p-12 text-center flex flex-col items-center justify-center h-full min-h-[350px]"
            >
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                No Scan in Progress
              </h3>
              <p className="text-xs text-foreground/50 mt-1 max-w-sm">
                Upload or capture an image of the affected plant on the left to run
                real-time computer vision disease detection.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
