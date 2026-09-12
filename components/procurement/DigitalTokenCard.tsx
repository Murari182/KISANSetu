"use client";

import React, { useState } from "react";
import {
  QrCode,
  Printer,
  Share2,
  XCircle,
  Eye,
  CheckCircle2,
  Sparkles,
  Building2,
  Calendar,
  Clock,
  User,
  Wheat,
  ShieldCheck,
  Download,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassModal } from "@/components/glass/GlassModal";
import { useToast } from "@/lib/toast";
import { ProcurementBooking } from "@/types";

interface DigitalTokenCardProps {
  booking: ProcurementBooking;
  onCancelBooking?: () => void;
}

export const DigitalTokenCard: React.FC<DigitalTokenCardProps> = ({
  booking,
  onCancelBooking,
}) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `🌾 Kisan Setu Smart Procurement Token\nToken: ${booking.tokenNumber}\nFarmer: ${booking.farmerName}\nCentre: ${booking.centreName}\nDate: ${booking.date} (${booking.slotTime})\nBooking ID: ${booking.bookingCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Procurement Token - ${booking.tokenNumber}`,
          text: shareText,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(shareText);
      showToast({
        title: "Token Copied to Clipboard",
        message: "You can paste and share this token via WhatsApp or SMS.",
        type: "success",
      });
    }
  };

  const handleDownload = () => {
    showToast({
      title: "Digital Pass Downloaded",
      message: `Saved ${booking.tokenNumber}-procurement-pass.pdf offline.`,
      type: "success",
    });
  };

  return (
    <>
      <GlassCard variant="glow" className="p-5 sm:p-6 relative overflow-hidden">
        {/* Decorative corner seal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                Govt. Mandi Verification Pass
              </span>
              <h3 className="text-base sm:text-lg font-black text-foreground">
                KISAN SETU SMART PROCUREMENT TOKEN
              </h3>
            </div>
          </div>

          <GlassBadge variant="success" size="md" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            CONFIRMED
          </GlassBadge>
        </div>

        {/* The Realistic Printable Ticket Card */}
        <div className="my-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0e2118] to-slate-950 text-white p-5 sm:p-6 shadow-2xl relative border border-emerald-500/30 overflow-hidden">
          {/* Top header strip */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-[11px] font-black text-slate-950">
                KS
              </div>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-200">
                Department of Agricultural Marketing & Mandi Intake
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300/80">
              {booking.bookingCode}
            </span>
          </div>

          {/* Core Token Number & QR Code Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-2">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
                DIGITAL TOKEN NUMBER
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono mt-1">
                {booking.tokenNumber}
              </div>
              <div className="text-xs text-emerald-200/80 mt-1 flex items-center gap-2">
                <span>Gate Ramp 2 Assigned</span>
                <span>•</span>
                <span>Security Token Valid</span>
              </div>
            </div>

            {/* Realistic Stylized QR Visual */}
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white text-slate-900 shrink-0 shadow-lg">
              <div className="w-24 h-24 sm:w-28 sm:h-28 grid grid-cols-6 grid-rows-6 gap-1 p-1 bg-white">
                {/* QR corner squares */}
                <div className="col-span-2 row-span-2 bg-slate-900 rounded-xs flex items-center justify-center p-1">
                  <div className="w-full h-full bg-white rounded-2xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                  </div>
                </div>
                <div className="col-span-2 bg-slate-900" />
                <div className="col-span-2 row-span-2 bg-slate-900 rounded-xs flex items-center justify-center p-1">
                  <div className="w-full h-full bg-white rounded-2xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                  </div>
                </div>

                <div className="bg-slate-900" />
                <div className="bg-slate-900" />
                <div className="col-span-2 bg-slate-900" />
                <div className="bg-slate-900" />
                <div className="bg-slate-900" />

                <div className="col-span-2 row-span-2 bg-slate-900 rounded-xs flex items-center justify-center p-1">
                  <div className="w-full h-full bg-white rounded-2xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                  </div>
                </div>
                <div className="bg-slate-900" />
                <div className="bg-slate-900" />
                <div className="col-span-2 bg-slate-900" />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-600 mt-1 uppercase">
                Scan at Gate
              </span>
            </div>
          </div>

          {/* Ticket Body Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-[10px] uppercase text-white/50 block font-semibold">
                Farmer Name
              </span>
              <span className="font-bold text-white block mt-0.5 truncate">
                {booking.farmerName}
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">
                {booking.farmerPhone}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-white/50 block font-semibold">
                Crop & Quantity
              </span>
              <span className="font-bold text-white block mt-0.5">
                {booking.cropName}
              </span>
              <span className="text-[10px] text-emerald-300">
                {booking.estimatedQuantityKg} kg (Est)
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-white/50 block font-semibold">
                Procurement Centre
              </span>
              <span className="font-bold text-white block mt-0.5 truncate">
                {booking.centreName}
              </span>
              <span className="text-[10px] text-white/70 truncate block">
                Malihabad Mandi
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-white/50 block font-semibold">
                Scheduled Slot
              </span>
              <span className="font-bold text-white block mt-0.5">
                {booking.slotTime}
              </span>
              <span className="text-[10px] text-emerald-300">
                {booking.date}
              </span>
            </div>
          </div>

          {/* Barcode Strip representation at bottom */}
          <div className="mt-4 pt-3 border-t border-dashed border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-1 opacity-70">
              <span className="w-1 h-5 bg-white" />
              <span className="w-2 h-5 bg-white" />
              <span className="w-0.5 h-5 bg-white" />
              <span className="w-3 h-5 bg-white" />
              <span className="w-1 h-5 bg-white" />
              <span className="w-2 h-5 bg-white" />
              <span className="w-0.5 h-5 bg-white" />
              <span className="w-1.5 h-5 bg-white" />
              <span className="w-2 h-5 bg-white" />
              <span className="w-1 h-5 bg-white" />
              <span className="w-0.5 h-5 bg-white" />
              <span className="w-3 h-5 bg-white" />
              <span className="w-1 h-5 bg-white" />
              <span className="w-2 h-5 bg-white" />
              <span className="w-0.5 h-5 bg-white" />
            </div>
            <span className="text-[10px] font-mono opacity-60">
              AUTH: SECURE-E-GOV-INTAKE-2026
            </span>
          </div>
        </div>

        {/* 4 Core Action Buttons (Section 5 User prompt) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <GlassButton
            variant="secondary"
            size="sm"
            iconLeft={<Eye className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            View Full Token
          </GlassButton>

          <GlassButton
            variant="secondary"
            size="sm"
            iconLeft={<Download className="w-4 h-4" />}
            onClick={handleDownload}
          >
            Download / Print
          </GlassButton>

          <GlassButton
            variant="secondary"
            size="sm"
            iconLeft={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
          >
            Share
          </GlassButton>

          {onCancelBooking && (
            <GlassButton
              variant="danger"
              size="sm"
              iconLeft={<XCircle className="w-4 h-4" />}
              onClick={onCancelBooking}
            >
              Cancel Booking
            </GlassButton>
          )}
        </div>
      </GlassCard>

      {/* Full Modal View Dialog */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Digital Token Pass: ${booking.tokenNumber}`}
        description="Official electronic entry pass for Mandi weighbridge and intake."
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-100 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-sm block">Entry Pass Confirmed</span>
              <span className="opacity-80">Show this QR code at Mandi Gate 1 for instant barrier lift.</span>
            </div>
            <span className="font-mono font-bold text-lg">{booking.tokenNumber}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
            <div>
              <span className="text-foreground/50 block font-semibold uppercase text-[10px]">Booking Code</span>
              <span className="font-mono font-bold text-foreground">{booking.bookingCode}</span>
            </div>
            <div>
              <span className="text-foreground/50 block font-semibold uppercase text-[10px]">MSP Value</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">₹{booking.totalAmount?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-foreground/50 block font-semibold uppercase text-[10px]">Centre</span>
              <span className="font-medium text-foreground">{booking.centreName}</span>
            </div>
            <div>
              <span className="text-foreground/50 block font-semibold uppercase text-[10px]">Slot</span>
              <span className="font-medium text-foreground">{booking.slotTime}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="primary" size="sm" iconLeft={<Printer className="w-4 h-4" />} onClick={handlePrint}>
              Print Verification Card
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </>
  );
};
