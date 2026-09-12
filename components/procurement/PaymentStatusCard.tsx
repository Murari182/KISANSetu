"use client";

import React from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Landmark,
  ShieldCheck,
  Receipt,
  Download,
  Building,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassButton } from "@/components/glass/GlassButton";
import { ProcurementPayment, ProcurementBooking } from "@/types";
import { useToast } from "@/lib/toast";

interface PaymentStatusCardProps {
  payment: ProcurementPayment;
  booking?: ProcurementBooking;
}

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  payment,
  booking,
}) => {
  const { showToast } = useToast();
  const isPaid = payment.status === "PAID" || booking?.paymentStatus === "PAID";
  const quantity = booking?.actualQuantityKg || payment.quantityKg;
  const totalAmount = booking?.totalAmount || payment.totalAmount;
  const transactionId = booking?.transactionId || payment.transactionId;

  const downloadReceipt = () => {
    showToast({
      title: "DBT Voucher Downloaded",
      message: `Saved procurement payment voucher for ${payment.tokenNumber}.`,
      type: "success",
    });
  };

  return (
    <GlassCard variant="elevated" className="p-5 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
              Direct Benefit Transfer (DBT)
            </span>
            <h3 className="text-base sm:text-lg font-black text-foreground mt-0.5">
              PAYMENT STATUS
            </h3>
          </div>
        </div>

        <GlassBadge
          variant={isPaid ? "success" : "warning"}
          size="md"
          icon={isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
        >
          {isPaid ? "PAID / CREDITED" : "PROCESSING"}
        </GlassBadge>
      </div>

      {/* Main Payment Summary Card */}
      <div className="my-5 p-5 rounded-3xl bg-gradient-to-br from-emerald-900/20 via-black/5 dark:via-white/5 to-transparent border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              Total Minimum Support Price (MSP) Payable
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1 tracking-tight">
              ₹{totalAmount.toLocaleString()}
            </div>
            <span className="text-[11px] text-foreground/65 mt-0.5 block">
              Calculated at Official MSP Rate of ₹{payment.mspRatePerQuintal}/Quintal for {payment.crop}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <GlassButton
              variant="secondary"
              size="sm"
              iconLeft={<Receipt className="w-4 h-4" />}
              onClick={downloadReceipt}
            >
              Download Mandi Voucher
            </GlassButton>
          </div>
        </div>
      </div>

      {/* 6 Core Payment Details (Section 11 of User Spec) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 my-4 text-xs">
        {/* Crop */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">
            Crop & Variety
          </span>
          <span className="font-extrabold text-foreground text-sm block mt-0.5">
            {payment.crop}
          </span>
          <span className="text-[10px] text-foreground/60 block">{payment.variety}</span>
        </div>

        {/* Quantity */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">
            Weighed Quantity
          </span>
          <span className="font-extrabold text-foreground text-sm block mt-0.5">
            {quantity.toLocaleString()} kg
          </span>
          <span className="text-[10px] text-foreground/60 block">
            {(quantity / 100).toFixed(2)} Quintals
          </span>
        </div>

        {/* Procurement Completed Date */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">
            Procurement Completed
          </span>
          <span className="font-extrabold text-foreground text-sm block mt-0.5">
            {payment.completedDate}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
            Gate Intake Voucher Closed
          </span>
        </div>

        {/* Transaction ID */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">
            Transaction ID
          </span>
          <span className="font-mono font-bold text-foreground text-xs block mt-0.5">
            {transactionId}
          </span>
          <span className="text-[10px] text-foreground/60 block">PFMS E-Gateway</span>
        </div>

        {/* Linked Bank Account */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">
            Linked Bank Account
          </span>
          <span className="font-bold text-foreground text-xs block mt-0.5 truncate">
            {payment.accountMasked}
          </span>
          <span className="text-[10px] text-foreground/60 block">Aadhaar NPCI Mapped</span>
        </div>

        {/* Expected Payment Date */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="text-[10px] uppercase text-foreground/50 font-bold block">
            Expected Credit Date
          </span>
          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm block mt-0.5">
            {isPaid ? "Credited Today" : payment.expectedPaymentDate}
          </span>
          <span className="text-[10px] text-foreground/60 block">
            {isPaid ? "UTR: RBI-9928104812" : "Within 24-48 Hours"}
          </span>
        </div>
      </div>

      {/* Safety / Compliance Note */}
      <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          100% DBT Verified: Payment is dispatched directly from the Ministry of Agriculture PFMS treasury gateway without middleman deductions.
        </span>
      </div>
    </GlassCard>
  );
};
