"use client";

import React from "react";
import {
  Building2,
  MapPin,
  Users,
  Timer,
  CalendarCheck2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";
import { ProcurementCentre } from "@/types";

interface SmartCentreRecommendationProps {
  centres: ProcurementCentre[];
  selectedCentreId?: string;
  onSelectCentre?: (centre: ProcurementCentre) => void;
}

export const SmartCentreRecommendation: React.FC<SmartCentreRecommendationProps> = ({
  centres,
  selectedCentreId,
  onSelectCentre,
}) => {
  const recommendedCentre = centres.find((c) => c.isRecommended) || centres[0];
  const alternativeCentres = centres.filter((c) => c.id !== recommendedCentre.id);

  return (
    <GlassCard variant="elevated" className="p-5 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
              AI Geo-Load Balancing
            </span>
            <h3 className="text-base sm:text-lg font-black text-foreground mt-0.5">
              Recommended Procurement Centre
            </h3>
          </div>
        </div>

        <span className="text-xs font-semibold text-foreground/60 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Multi-Mandi Dynamic Queue Comparison
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5">
        {/* Recommended Centre Card (Hero Highlight) */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-white/80 dark:via-[#0e1712]/90 to-emerald-500/10 border-2 border-emerald-500/50 p-5 sm:p-6 shadow-md relative flex flex-col justify-between">
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              ⭐ RECOMMENDED
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <MapPin className="w-4 h-4" />
              {recommendedCentre.distanceKm} km from your farm
            </div>

            <h4 className="text-lg sm:text-xl font-extrabold text-foreground pr-28">
              {recommendedCentre.name}
            </h4>
            <p className="text-xs text-foreground/60 mt-1 max-w-md">
              {recommendedCentre.address}
            </p>

            {/* Recommendation badge & reason (Section 8 Requirement) */}
            <div className="mt-3.5 p-3 rounded-2xl bg-emerald-500/15 text-emerald-950 dark:text-emerald-100 border border-emerald-500/25 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>&ldquo;Best option based on current queue and availability.&rdquo;</span>
            </div>

            {/* 4 Metrics for recommended centre */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#121c17]/70 border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-foreground/50 uppercase font-bold block">
                  Current Queue
                </span>
                <span className="text-lg font-black text-foreground mt-0.5 block">
                  {recommendedCentre.queueLength} Farmers
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#121c17]/70 border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-foreground/50 uppercase font-bold block">
                  Estimated Wait
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                  ~32 min
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#121c17]/70 border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-foreground/50 uppercase font-bold block">
                  Available Slots
                </span>
                <span className="text-lg font-black text-foreground mt-0.5 block">
                  {recommendedCentre.availableSlotsCount}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#121c17]/70 border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-foreground/50 uppercase font-bold block">
                  Active Counters
                </span>
                <span className="text-lg font-black text-foreground mt-0.5 block">
                  {recommendedCentre.activeCounters} Lines
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-foreground/60">
              Hours: {recommendedCentre.operatingHours}
            </span>
            {onSelectCentre && (
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => onSelectCentre(recommendedCentre)}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Choose Recommended Centre
              </GlassButton>
            )}
          </div>
        </div>

        {/* Alternative Centres Comparison (Section 8 Requirement) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
            Nearby Alternative Centres
          </span>

          {alternativeCentres.slice(0, 2).map((alt) => (
            <div
              key={alt.id}
              className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col justify-between transition-all hover:bg-black/10 dark:hover:bg-white/10"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">
                    Alternative Option
                  </span>
                  <span className="text-xs font-bold text-foreground/70">
                    {alt.distanceKm} km
                  </span>
                </div>

                <h5 className="text-sm font-bold text-foreground mt-0.5">
                  {alt.name}
                </h5>

                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-black/20">
                    <span className="text-[9px] text-foreground/50 uppercase block">Queue</span>
                    <span className="font-extrabold text-foreground">
                      {alt.queueLength} farmers
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/60 dark:bg-black/20">
                    <span className="text-[9px] text-foreground/50 uppercase block">Wait</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">
                      {alt.queueLength > 20 ? "1 hr 08 min" : "18 min"}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/60 dark:bg-black/20">
                    <span className="text-[9px] text-foreground/50 uppercase block">Slots</span>
                    <span className="font-extrabold text-foreground">
                      {alt.availableSlotsCount}
                    </span>
                  </div>
                </div>
              </div>

              {onSelectCentre && (
                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex justify-end">
                  <button
                    onClick={() => onSelectCentre(alt)}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Select Alternative Centre →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
