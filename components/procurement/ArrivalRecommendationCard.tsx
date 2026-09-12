"use client";

import React from "react";
import {
  Navigation,
  Clock,
  MapPin,
  CheckCircle2,
  CalendarCheck2,
  Compass,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { ProcurementBooking } from "@/types";

interface ArrivalRecommendationCardProps {
  booking: ProcurementBooking;
  onViewLiveQueue?: () => void;
}

export const ArrivalRecommendationCard: React.FC<ArrivalRecommendationCardProps> = ({
  booking,
  onViewLiveQueue,
}) => {
  const openDirections = () => {
    // Open directions in Google Maps
    const destination = encodeURIComponent(
      `${booking.centreName}, Malihabad, Lucknow, Uttar Pradesh`
    );
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank");
  };

  return (
    <GlassCard variant="elevated" className="p-5 sm:p-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/25">
              Zero-Idle Dispatch
            </span>
            <h3 className="text-base sm:text-lg font-black text-foreground mt-0.5">
              WHEN SHOULD I ARRIVE?
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-2xl border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          Guaranteed Gate Access
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-5">
        {/* Your Slot */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
            Your Booked Slot
          </span>
          <div className="text-lg sm:text-xl font-black text-foreground mt-1">
            {booking.slotTime}
          </div>
          <span className="text-[11px] text-foreground/60 mt-0.5 block">
            {booking.date}
          </span>
        </div>

        {/* Recommended Arrival */}
        <div className="p-4 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30">
          <span className="text-[10px] font-extrabold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
            Recommended Arrival
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
            {booking.recommendedArrivalTime}
          </div>
          <span className="text-[11px] text-emerald-900/70 dark:text-emerald-300/70 mt-0.5 block font-medium">
            10 min buffer before weighbridge
          </span>
        </div>

        {/* Queue Wait */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">
            Estimated Queue Wait
          </span>
          <div className="text-lg sm:text-xl font-black text-foreground mt-1">
            ~{booking.estimatedWaitMinutes} min
          </div>
          <span className="text-[11px] text-foreground/60 mt-0.5 block">
            Position: {booking.queuePosition} farmers ahead
          </span>
        </div>
      </div>

      {/* Rationale explanation for farmer */}
      <p className="text-xs text-foreground/75 mb-4 leading-relaxed">
        Do not leave your home early and sit in long roadside traffic queues. Our automated slot coordinator reserves your counter space. Arriving at <strong>{booking.recommendedArrivalTime}</strong> guarantees smooth entry with zero unnecessary waiting.
      </p>

      {/* Clear CTAs (Section 9 Requirement) */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <GlassButton
          variant="primary"
          size="md"
          iconLeft={<Navigation className="w-4 h-4" />}
          iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
          onClick={openDirections}
        >
          GET DIRECTIONS
        </GlassButton>

        {onViewLiveQueue && (
          <GlassButton
            variant="secondary"
            size="md"
            iconLeft={<Clock className="w-4 h-4" />}
            onClick={onViewLiveQueue}
          >
            VIEW LIVE QUEUE
          </GlassButton>
        )}
      </div>
    </GlassCard>
  );
};
