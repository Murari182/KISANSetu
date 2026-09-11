"use client";

import React, { useState } from "react";
import { Tractor, ChevronDown, Check, Plus, MapPin } from "lucide-react";
import { useSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const FarmSwitcher: React.FC = () => {
  const { activeFarm, farms, setActiveFarm } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!activeFarm) return null;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20 border border-emerald-500/25 text-foreground transition-all duration-200 group shadow-xs"
        aria-label="Switch active farm"
      >
        <div className="w-6 h-6 rounded-xl bg-emerald-700 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Tractor className="w-3.5 h-3.5" />
        </div>
        <div className="text-left hidden sm:flex flex-col">
          <span className="text-xs font-bold leading-tight truncate max-w-[140px]">
            {activeFarm.name}
          </span>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">
            {activeFarm.acres} Acres • {activeFarm.district}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-foreground/50 group-hover:text-foreground shrink-0 transition" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 sm:left-auto right-auto sm:right-0 mt-2 w-72 rounded-3xl bg-white/95 dark:bg-[#0f1713]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl p-2 z-50 animate-in zoom-in-95 duration-150">
            <div className="px-3 py-2 text-[11px] font-bold text-foreground/50 uppercase tracking-wider border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <span>My Farms / मेरे खेत</span>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                {farms.length} Registered
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto p-1 space-y-1">
              {farms.map((farm) => {
                const isSelected = activeFarm.id === farm.id;
                return (
                  <button
                    key={farm.id}
                    onClick={() => {
                      setActiveFarm(farm);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-2.5 rounded-2xl text-left transition-colors ${
                      isSelected
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold truncate">
                        {farm.name}
                      </span>
                      <span className="text-[11px] text-foreground/60 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        {farm.location}
                      </span>
                      <span className="text-[10px] text-foreground/50 mt-1">
                        {farm.acres} Acres • {farm.irrigation} • Health {farm.healthScore}%
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-1 border-t border-black/5 dark:border-white/5 mt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/farmer/farm?action=new");
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Farm</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
