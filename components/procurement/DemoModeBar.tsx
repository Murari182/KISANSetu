"use client";

import React from "react";
import {
  Play,
  RotateCcw,
  StepForward,
  CheckCircle2,
  Truck,
  Scale,
  FlaskConical,
  CreditCard,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";
import { ProcurementJourneyStage, ProcurementBooking } from "@/types";

interface DemoModeBarProps {
  currentStage: ProcurementJourneyStage;
  queuePosition: number;
  onAdvanceQueue: () => void;
  onAdvanceStage: (stage: ProcurementJourneyStage) => void;
  onResetDemo: () => void;
  isLoading?: boolean;
}

export const DemoModeBar: React.FC<DemoModeBarProps> = ({
  currentStage,
  queuePosition,
  onAdvanceQueue,
  onAdvanceStage,
  onResetDemo,
  isLoading = false,
}) => {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-sky-500/15 border border-amber-500/30 p-3.5 sm:p-4 backdrop-blur-xl shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Judge Demo Mode Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-foreground tracking-tight">
                SIH EVALUATION DEMO CONTROLLER
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
                1-Click Simulation
              </span>
            </div>
            <p className="text-[11px] text-foreground/60">
              Demonstrate live queue movement, AI ETA changes, mandi arrival, weighing, and DBT payment to judges.
            </p>
          </div>
        </div>

        {/* Action Controls for Demo Workflow */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Step 1: Advance Queue */}
          <button
            onClick={onAdvanceQueue}
            disabled={isLoading || queuePosition === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition shadow-xs disabled:opacity-50"
            title="Simulate next farmer called: advances currently serving token"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Next in Queue (+1)</span>
          </button>

          {/* Step 2: Mark Arrived */}
          {currentStage === "TOKEN_GENERATED" && (
            <button
              onClick={() => onAdvanceStage("ARRIVED")}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 text-xs font-bold transition shadow-xs"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Simulate: Gate Arrival</span>
            </button>
          )}

          {/* Step 3: Weighing */}
          {currentStage === "ARRIVED" && (
            <button
              onClick={() => onAdvanceStage("WEIGHING")}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-xs font-bold transition shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Simulate: Electronic Weighing</span>
            </button>
          )}

          {/* Step 4: Quality Check */}
          {currentStage === "WEIGHING" && (
            <button
              onClick={() => onAdvanceStage("QUALITY_CHECK")}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition shadow-xs"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Simulate: Moisture & Quality</span>
            </button>
          )}

          {/* Step 5: Procurement Completed */}
          {currentStage === "QUALITY_CHECK" && (
            <button
              onClick={() => onAdvanceStage("PROCUREMENT_COMPLETED")}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulate: Complete Intake</span>
            </button>
          )}

          {/* Step 6: Payment Initiated */}
          {currentStage === "PROCUREMENT_COMPLETED" && (
            <button
              onClick={() => onAdvanceStage("PAYMENT_INITIATED")}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Simulate: Initiate DBT Payment</span>
            </button>
          )}

          {/* Step 7: Payment Received */}
          {currentStage === "PAYMENT_INITIATED" && (
            <button
              onClick={() => onAdvanceStage("PAYMENT_RECEIVED")}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulate: Payment Credited</span>
            </button>
          )}

          {/* Reset Demo State */}
          <button
            onClick={onResetDemo}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-foreground/80 text-xs font-semibold transition"
            title="Reset to default initial evaluation state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
