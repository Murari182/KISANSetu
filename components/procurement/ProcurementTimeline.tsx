"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  Scale,
  FlaskConical,
  FileCheck,
  CreditCard,
  CheckCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";
import { ProcurementBooking, ProcurementJourneyStage } from "@/types";
import { JOURNEY_STAGES_LIST } from "@/lib/data/procurement";

interface ProcurementTimelineProps {
  booking: ProcurementBooking;
  onAdvanceStage?: (nextStage: ProcurementJourneyStage) => void;
  isUpdating?: boolean;
}

const STAGE_ICONS: Record<ProcurementJourneyStage, React.ReactNode> = {
  SLOT_BOOKED: <Clock className="w-4 h-4" />,
  TOKEN_GENERATED: <CheckCircle2 className="w-4 h-4" />,
  ARRIVED: <Truck className="w-4 h-4" />,
  WEIGHING: <Scale className="w-4 h-4" />,
  QUALITY_CHECK: <FlaskConical className="w-4 h-4" />,
  PROCUREMENT_COMPLETED: <FileCheck className="w-4 h-4" />,
  PAYMENT_INITIATED: <CreditCard className="w-4 h-4" />,
  PAYMENT_RECEIVED: <CheckCheck className="w-4 h-4" />,
};

export const ProcurementTimeline: React.FC<ProcurementTimelineProps> = ({
  booking,
  onAdvanceStage,
  isUpdating = false,
}) => {
  const currentIdx = JOURNEY_STAGES_LIST.findIndex((s) => s.stage === booking.stage);
  const currentStageInfo = JOURNEY_STAGES_LIST[currentIdx] || JOURNEY_STAGES_LIST[1];

  const nextStage =
    currentIdx >= 0 && currentIdx < JOURNEY_STAGES_LIST.length - 1
      ? JOURNEY_STAGES_LIST[currentIdx + 1].stage
      : null;

  return (
    <GlassCard variant="elevated" className="p-5 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
            Step-by-Step Transparency
          </span>
          <h3 className="text-base sm:text-lg font-black text-foreground mt-0.5">
            PROCUREMENT STATUS TRACKING
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <GlassBadge variant="success" size="md">
            Stage {currentIdx + 1} of {JOURNEY_STAGES_LIST.length}
          </GlassBadge>
        </div>
      </div>

      {/* Prominent Current Stage Hero Banner */}
      <div className="my-5 p-4 sm:p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            {STAGE_ICONS[booking.stage]}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/70 dark:text-emerald-200/70">
              CURRENT STATUS
            </span>
            <h4 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-emerald-100">
              {currentStageInfo.label}
            </h4>
            <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 mt-0.5 max-w-xl">
              {booking.stageDetails || currentStageInfo.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {nextStage && onAdvanceStage && (
            <GlassButton
              variant="primary"
              size="sm"
              loading={isUpdating}
              onClick={() => onAdvanceStage(nextStage)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              {booking.stage === "TOKEN_GENERATED"
                ? "Mark I Have Arrived"
                : booking.stage === "ARRIVED"
                ? "Begin Weighing"
                : booking.stage === "WEIGHING"
                ? "Submit Quality Check"
                : booking.stage === "QUALITY_CHECK"
                ? "Complete Intake"
                : booking.stage === "PROCUREMENT_COMPLETED"
                ? "Initiate Payment"
                : "Acknowledge Payment"}
            </GlassButton>
          )}
        </div>
      </div>

      {/* 8-Stage Progress Stepper Bar */}
      <div className="my-6">
        <div className="relative">
          {/* Connector line behind steps */}
          <div className="hidden md:block absolute top-5 inset-x-8 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
          <div
            className="hidden md:block absolute top-5 left-8 h-1 bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIdx) / (JOURNEY_STAGES_LIST.length - 1)) * 90}%`,
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
            {JOURNEY_STAGES_LIST.map((step, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={step.stage} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 ${
                      isCurrent
                        ? "bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-400/40 scale-110"
                        : isPast
                        ? "bg-emerald-700 text-white"
                        : "bg-black/5 dark:bg-white/10 text-foreground/40 border border-black/10 dark:border-white/10"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-bold mt-2 leading-tight ${
                      isCurrent
                        ? "text-emerald-700 dark:text-emerald-400"
                        : isPast
                        ? "text-foreground"
                        : "text-foreground/45"
                    }`}
                  >
                    {step.label}
                  </span>

                  <span className="text-[9px] text-foreground/50 hidden lg:block mt-0.5 leading-tight">
                    {isPast ? "Completed ✓" : isCurrent ? "Active Stage" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
