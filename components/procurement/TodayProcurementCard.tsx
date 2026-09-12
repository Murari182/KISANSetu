"use client";

import React from "react";
import {
  Building2,
  Calendar,
  Clock,
  Ticket,
  Users,
  Timer,
  CheckCircle2,
  AlertCircle,
  Radio,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { ProcurementBooking, ProcurementCentre } from "@/types";

interface TodayProcurementCardProps {
  booking: ProcurementBooking;
  centre?: ProcurementCentre;
  onViewToken?: () => void;
  onViewQueue?: () => void;
}

export const TodayProcurementCard: React.FC<TodayProcurementCardProps> = ({
  booking,
  centre,
  onViewToken,
  onViewQueue,
}) => {
  const isServingNow = booking.queuePosition === 0;
  const isNear = booking.queuePosition > 0 && booking.queuePosition <= 3;

  return (
    <GlassCard variant="elevated" className="p-5 sm:p-6 overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Ticket className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
                Today&apos;s Active Token
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground/60">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                Live Center Feed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-0.5">
              Token {booking.tokenNumber}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {centre && (
            <GlassBadge
              variant={
                centre.status === "OPEN"
                  ? "success"
                  : centre.status === "BUSY"
                  ? "warning"
                  : "danger"
              }
              size="md"
            >
              Centre Status: {centre.status}
            </GlassBadge>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-foreground/80 font-mono">
            ID: {booking.bookingCode}
          </span>
        </div>
      </div>

      {/* Core Operational Details Grid (Section 3 of User Spec) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 my-5">
        {/* Selected Centre */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Procurement Centre
          </span>
          <div className="font-extrabold text-sm sm:text-base text-foreground mt-1 truncate" title={booking.centreName}>
            {booking.centreName}
          </div>
          <span className="text-[11px] text-foreground/60 block truncate mt-0.5">
            Malihabad Mandi Campus
          </span>
        </div>

        {/* Commodity / Crop */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Crop / Commodity
          </span>
          <div className="font-extrabold text-sm sm:text-base text-foreground mt-1 truncate">
            {booking.cropName}
          </div>
          <span className="text-[11px] text-foreground/60 block mt-0.5">
            Est: {booking.estimatedQuantityKg.toLocaleString()} kg (FAQ Grade)
          </span>
        </div>

        {/* Date & Slot */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            Date & Slot
          </span>
          <div className="font-extrabold text-sm sm:text-base text-foreground mt-1 truncate">
            {booking.slotTime}
          </div>
          <span className="text-[11px] text-foreground/60 block mt-0.5">
            {booking.date}
          </span>
        </div>

        {/* Serving Token & Active Counters */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Serving & Counters
          </span>
          <div className="font-extrabold text-sm sm:text-base text-foreground mt-1 flex items-center gap-2">
            <span className="text-emerald-700 dark:text-emerald-400">Serving A130</span>
          </div>
          <span className="text-[11px] text-foreground/60 block mt-0.5">
            4 Active Intake Counters
          </span>
        </div>
      </div>

      {/* Hero Callout Banner: Position & Estimated Wait */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isServingNow
            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-950 dark:text-emerald-100"
            : isNear
            ? "bg-amber-500/15 border-amber-500/30 text-amber-950 dark:text-amber-100"
            : "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20 text-emerald-950 dark:text-emerald-100"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">
              Current Queue Position
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight">
              {booking.queuePosition === 0 ? "Serving Now!" : `${booking.queuePosition} Ahead`}
            </span>
          </div>

          <div className="h-10 w-px bg-black/10 dark:bg-white/10" />

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              Estimated Wait
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-800 dark:text-emerald-300">
              {booking.queuePosition === 0
                ? "0 min (Gate Call)"
                : `~${booking.estimatedWaitMinutes} minutes`}
            </span>
          </div>
        </div>

        {/* Quick assurance tagline */}
        <div className="text-right sm:text-right flex flex-col items-start sm:items-end">
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Arrive with certainty.
          </span>
          <span className="text-[11px] opacity-75 mt-0.5">
            Recommended arrival: {booking.recommendedArrivalTime}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
