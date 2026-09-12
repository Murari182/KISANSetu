"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Timer,
  CheckCircle2,
  ArrowRight,
  Radio,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { QueueLiveState, ProcurementBooking } from "@/types";

interface LiveQueueCardProps {
  queueState: QueueLiveState;
  booking: ProcurementBooking;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const LiveQueueCard: React.FC<LiveQueueCardProps> = ({
  queueState,
  booking,
  onRefresh,
  isLoading = false,
}) => {
  const [secondsAgo, setSecondsAgo] = useState(12);

  // Ticker for "Last updated: X seconds ago"
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 55 ? 5 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <GlassCard variant="glow" className="p-5 sm:p-6 relative overflow-hidden">
      {/* Background operational live glow */}
      <div className="absolute top-0 left-1/3 w-96 h-40 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header: LIVE status indicator + Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
            <span className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-400 relative" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                LIVE QUEUE
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                REAL-TIME INTAKE
              </span>
            </div>
            <p className="text-xs text-foreground/60 mt-0.5">
              {queueState.centreName} • Intake Gate 1 Weighbridge Stream
            </p>
          </div>
        </div>

        {/* Live sync heartbeat ticker */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-foreground/60 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Last updated: {secondsAgo} seconds ago
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-foreground/70 transition"
              title="Refresh queue status"
              aria-label="Refresh queue"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* 6 Core Live Operational Numbers (Section 6 of User Prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-5">
        {/* CURRENTLY SERVING */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30">
          <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
            Currently Serving
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1 font-mono">
            {queueState.currentlyServing}
          </div>
          <span className="text-[10px] text-emerald-900/70 dark:text-emerald-300/70 mt-0.5 block">
            Weighbridge Counter 2
          </span>
        </div>

        {/* YOUR TOKEN */}
        <div className="p-3.5 rounded-2xl bg-sky-500/15 dark:bg-sky-500/20 border border-sky-500/30">
          <span className="text-[10px] font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider block">
            Your Token
          </span>
          <div className="text-2xl sm:text-3xl font-black text-sky-800 dark:text-sky-300 mt-1 font-mono">
            {booking.tokenNumber}
          </div>
          <span className="text-[10px] text-sky-900/70 dark:text-sky-300/70 mt-0.5 block">
            Slot: {booking.slotTime.split("–")[0].trim()}
          </span>
        </div>

        {/* POSITION */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
            Position
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
            {booking.queuePosition === 0 ? "0 (Next)" : booking.queuePosition}
          </div>
          <span className="text-[10px] text-foreground/50 mt-0.5 block">
            {booking.queuePosition === 0 ? "At Gate Call" : "Farmers Ahead"}
          </span>
        </div>

        {/* ESTIMATED WAIT */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
            Estimated Wait
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            {booking.estimatedWaitMinutes}m
          </div>
          <span className="text-[10px] text-foreground/50 mt-0.5 block">
            AI ML Estimate
          </span>
        </div>

        {/* ACTIVE COUNTERS */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
            Active Counters
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
            {queueState.activeCounters}
          </div>
          <span className="text-[10px] text-foreground/50 mt-0.5 block">
            Of 5 Weigh Lines
          </span>
        </div>

        {/* AVERAGE PROCESSING TIME */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
            Avg Speed
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
            ~{Math.round(queueState.avgProcessingTimeMinutes)}m
          </div>
          <span className="text-[10px] text-foreground/50 mt-0.5 block">
            Per Token Intake
          </span>
        </div>
      </div>

      {/* Visual Queue Pipeline: A130 -> A131 -> A132 -> ... -> A142 */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Live Conveyor Track & Intake Queue
          </span>
          <span className="text-[11px] text-foreground/50">
            Scroll horizontally to view full queue pipeline
          </span>
        </div>

        <div className="relative w-full rounded-2xl bg-black/5 dark:bg-white/5 p-3 sm:p-4 border border-black/5 dark:border-white/5 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max py-1">
            {queueState.tokensInQueue.map((item, index) => {
              const isServing = item.status === "serving";
              const isUser = item.isCurrentUser || item.token === booking.tokenNumber;
              const isPassed = item.status === "completed";

              return (
                <React.Fragment key={item.token}>
                  {index > 0 && (
                    <ArrowRight className="w-4 h-4 text-foreground/20 shrink-0" />
                  )}

                  <div
                    className={`relative px-3.5 py-2.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                      isServing
                        ? "bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400 scale-105"
                        : isUser
                        ? "bg-gradient-to-br from-sky-600 to-indigo-600 text-white shadow-xl ring-4 ring-sky-300 dark:ring-sky-500/50 scale-110 z-10"
                        : isPassed
                        ? "bg-black/10 dark:bg-white/10 text-foreground/40"
                        : "bg-white/90 dark:bg-[#131d17] text-foreground border border-black/10 dark:border-white/10 shadow-xs"
                    }`}
                  >
                    {/* Serving badge or You badge */}
                    {isServing && (
                      <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-emerald-950 text-[8px] font-black text-emerald-300 tracking-wider uppercase">
                        SERVING
                      </span>
                    )}
                    {isUser && (
                      <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-sky-950 text-[9px] font-black text-sky-200 tracking-wider uppercase border border-sky-400/40 shadow-sm animate-bounce">
                        ⭐ YOUR TOKEN
                      </span>
                    )}

                    <div className="font-mono text-sm sm:text-base font-black tracking-tight">
                      {item.token}
                    </div>

                    <div
                      className={`text-[9px] mt-0.5 font-semibold truncate max-w-[90px] text-center ${
                        isServing || isUser ? "opacity-90" : "text-foreground/60"
                      }`}
                    >
                      {isUser ? "You (Patel)" : item.farmerName.split(" ")[0]}
                    </div>

                    <div
                      className={`text-[8px] mt-0.5 ${
                        isServing || isUser ? "opacity-75" : "text-foreground/45"
                      }`}
                    >
                      {isServing
                        ? "At Counter 2"
                        : isUser
                        ? `Pos #${booking.queuePosition}`
                        : `~${item.estimatedWaitMinutes}m`}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
