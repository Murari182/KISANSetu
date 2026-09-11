"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassProgress } from "@/components/glass/GlassBadge";
import { useToast } from "@/lib/toast";
import { adminApi } from "@/lib/api";
import { MLModelMetric } from "@/types";

export default function AdminMLPage() {
  const { showToast } = useToast();
  const [models, setModels] = useState<MLModelMetric[]>([]);
  const [isRetraining, setIsRetraining] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getMLMetrics().then(setModels);
  }, []);

  const handleRetrain = (modelId: string, modelName: string) => {
    setIsRetraining(modelId);
    setTimeout(() => {
      setIsRetraining(null);
      showToast({
        type: "success",
        title: "Model Pipeline Dispatched",
        message: `Staging checkpoint initiated for "${modelName}".`,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GlassBadge variant="info" size="sm" icon={<Cpu className="w-3.5 h-3.5" />}>
              Machine Learning Operations (MLOps)
            </GlassBadge>
            <span className="text-xs text-foreground/50">
              FastAPI Inference Cluster
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Agricultural ML Model Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            Production computer vision and predictive models serving real-time farmer queries.
          </p>
        </div>
      </div>

      {/* Grid of Model Telemetry Cards (Section 52) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <GlassCard key={model.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {model.name}
                  </h3>
                  <span className="text-[11px] text-foreground/50 font-mono">
                    Version: {model.version}
                  </span>
                </div>
                <GlassBadge variant="success" size="sm">
                  {model.status.toUpperCase()}
                </GlassBadge>
              </div>

              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs mb-5">
                <div className="flex items-center justify-between text-foreground/75 mb-1">
                  <span>Task:</span>
                  <span className="font-semibold text-foreground">{model.task}</span>
                </div>
                <div className="flex items-center justify-between text-foreground/75 mb-1">
                  <span>Avg Latency:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {model.avgLatencyMs} ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-foreground/75">
                  <span>Updated:</span>
                  <span className="font-semibold text-foreground">
                    {model.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Progress bars for Accuracy, Precision, Recall, F1 */}
              <div className="space-y-3">
                <GlassProgress
                  label="Validation Accuracy"
                  value={model.accuracy}
                  color="emerald"
                />
                <GlassProgress
                  label="Precision"
                  value={model.precision}
                  color="emerald"
                />
                <GlassProgress
                  label="Recall (Sensitivity)"
                  value={model.recall}
                  color="emerald"
                />
                <GlassProgress
                  label="Harmonic F1-Score"
                  value={model.f1Score}
                  color="emerald"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
              <GlassButton
                variant="outline"
                size="sm"
                className="w-full"
                loading={isRetraining === model.id}
                onClick={() => handleRetrain(model.id, model.name)}
                iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Trigger Fine-Tuning Pipeline
              </GlassButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
