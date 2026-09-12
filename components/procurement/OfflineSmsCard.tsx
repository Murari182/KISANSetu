"use client";

import React, { useState } from "react";
import {
  WifiOff,
  Radio,
  Smartphone,
  CheckCircle2,
  Copy,
  Info,
  ShieldCheck,
  Signal,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { useToast } from "@/lib/toast";

interface OfflineSmsCardProps {
  tokenNumber: string;
  bookingCode: string;
}

export const OfflineSmsCard: React.FC<OfflineSmsCardProps> = ({
  tokenNumber,
  bookingCode,
}) => {
  const { showToast } = useToast();
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  const copySmsFormat = () => {
    const text = `KS ${tokenNumber}`;
    navigator.clipboard.writeText(text);
    showToast({
      title: "SMS Syntax Copied",
      message: `Send "${text}" to 51969 to check queue position via basic feature phone.`,
      type: "info",
    });
  };

  return (
    <GlassCard variant="subtle" className="p-4 sm:p-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-foreground shrink-0">
            {isSimulatedOffline ? (
              <WifiOff className="w-4 h-4 text-amber-500" />
            ) : (
              <Signal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                {isSimulatedOffline
                  ? "Network Unstable — Last synced 2 min ago"
                  : "Sync Status: Connected • Local Cache Active"}
              </span>
              <GlassBadge
                variant={isSimulatedOffline ? "warning" : "success"}
                size="sm"
              >
                {isSimulatedOffline ? "Offline Mode" : "Real-time Live"}
              </GlassBadge>
            </div>
            <p className="text-[11px] text-foreground/60 mt-0.5">
              Token {tokenNumber} and entry credentials remain accessible without active mobile internet.
            </p>
          </div>
        </div>

        {/* SMS Fallback Query for basic feature phones */}
        <div className="flex items-center gap-2">
          <button
            onClick={copySmsFormat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[11px] font-semibold text-foreground/80 transition"
            title="Copy SMS format for feature phones"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>SMS: <strong>KS {tokenNumber}</strong> to <strong>51969</strong></span>
            <Copy className="w-3 h-3 text-foreground/40 ml-1" />
          </button>

          <button
            onClick={() => setIsSimulatedOffline((prev) => !prev)}
            className="text-[10px] text-foreground/50 hover:underline shrink-0"
          >
            {isSimulatedOffline ? "Simulate Online" : "Test Offline UI"}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
