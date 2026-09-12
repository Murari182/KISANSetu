"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  CalendarCheck2,
  Clock,
  QrCode,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Layers,
  Radio,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { TodayProcurementCard } from "@/components/procurement/TodayProcurementCard";
import { LiveQueueCard } from "@/components/procurement/LiveQueueCard";
import { AiEtaCard } from "@/components/procurement/AiEtaCard";
import { ArrivalRecommendationCard } from "@/components/procurement/ArrivalRecommendationCard";
import { ProcurementTimeline } from "@/components/procurement/ProcurementTimeline";
import { DigitalTokenCard } from "@/components/procurement/DigitalTokenCard";
import { SmartCentreRecommendation } from "@/components/procurement/SmartCentreRecommendation";
import { SlotBookingWizard } from "@/components/procurement/SlotBookingWizard";
import { PaymentStatusCard } from "@/components/procurement/PaymentStatusCard";
import { OfflineSmsCard } from "@/components/procurement/OfflineSmsCard";
import { DemoModeBar } from "@/components/procurement/DemoModeBar";
import { procurementApi } from "@/lib/api";
import { predictProcurementEta } from "@/lib/data/procurement";
import {
  ProcurementBooking,
  ProcurementCentre,
  QueueLiveState,
  ProcurementPayment,
  ProcurementJourneyStage,
} from "@/types";
import { useToast } from "@/lib/toast";

export default function SmartProcurementPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"live" | "book" | "centres">("live");
  const [booking, setBooking] = useState<ProcurementBooking | null>(null);
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);
  const [queueState, setQueueState] = useState<QueueLiveState | null>(null);
  const [payment, setPayment] = useState<ProcurementPayment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch initial data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [bookingRes, centresRes, queueRes, paymentRes] = await Promise.all([
        procurementApi.getActiveBooking(),
        procurementApi.getCentres(),
        procurementApi.getLiveQueue(),
        procurementApi.getPaymentDetails(),
      ]);
      setBooking(bookingRes);
      setCentres(centresRes);
      setQueueState(queueRes);
      setPayment(paymentRes);
    } catch (e) {
      console.error("Failed to load procurement data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Demo advance queue (+1 token)
  const handleAdvanceQueue = async () => {
    try {
      setIsUpdating(true);
      const result = await procurementApi.advanceServingToken();
      setQueueState(result.queueState);
      setBooking(result.booking);
      showToast({
        title: "Queue Advanced",
        message: `Serving token is now A${result.servingNum}. Your position updated to ${result.booking.queuePosition}.`,
        type: "info",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Advance journey stage
  const handleAdvanceStage = async (nextStage: ProcurementJourneyStage) => {
    if (!booking) return;
    try {
      setIsUpdating(true);
      const updatedBooking = await procurementApi.updateBookingStage(booking.id, nextStage);
      setBooking(updatedBooking);

      // If stage reached payment initiated/received, update payment
      if (nextStage === "PAYMENT_INITIATED" || nextStage === "PAYMENT_RECEIVED") {
        const paymentRes = await procurementApi.getPaymentDetails(booking.id);
        const updatedPayment: ProcurementPayment = {
          ...paymentRes,
          status: nextStage === "PAYMENT_RECEIVED" ? "PAID" : "PROCESSING",
        };
        await procurementApi.savePaymentDetails(updatedPayment);
        setPayment(updatedPayment);
      }

      showToast({
        title: "Procurement Stage Updated",
        message: `Successfully progressed to ${nextStage.replace(/_/g, " ")}.`,
        type: "success",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset demo
  const handleResetDemo = async () => {
    try {
      setIsUpdating(true);
      await procurementApi.resetDemo();
      await loadData();
      showToast({
        title: "Demo State Reset",
        message: "Restored initial Token A142 and queue state for judge evaluation.",
        type: "info",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = () => {
    if (confirm("Are you sure you want to cancel this procurement slot booking?")) {
      handleResetDemo();
      showToast({
        title: "Booking Cancelled",
        message: "Your slot has been released back to the centre queue.",
        type: "warning",
      });
    }
  };

  // Computed AI ETA Prediction
  const currentCentre = centres.find((c) => c.id === booking?.centreId) || centres[0];
  const etaPrediction = predictProcurementEta(
    booking?.queuePosition || 12,
    currentCentre?.activeCounters || 4,
    currentCentre?.avgProcessingTimeMinutes || 4.2
  );

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Hero Banner */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-[11px] font-black tracking-wide uppercase border border-emerald-400/30 text-emerald-300">
                ⭐ SIH PRIMARY CORE MODULE
              </span>
              <span className="text-emerald-200/90 text-xs font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Mandi Intake & Direct Benefit Transfer Network
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              SMART PROCUREMENT
            </h1>
            <p className="text-xs sm:text-base text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
              Transforming uncertain agricultural queues into scheduled digital tokens, real-time ETA predictions, and guaranteed direct payments.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Core Promise: &ldquo;Arrive with certainty.&rdquo;</span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <GlassButton
              variant={activeTab === "live" ? "primary" : "secondary"}
              size="md"
              iconLeft={<Clock className="w-4 h-4" />}
              onClick={() => setActiveTab("live")}
            >
              Live Queue & Token
            </GlassButton>

            <GlassButton
              variant={activeTab === "book" ? "primary" : "secondary"}
              size="md"
              iconLeft={<Plus className="w-4 h-4" />}
              onClick={() => setActiveTab("book")}
            >
              Book Slot
            </GlassButton>

            <GlassButton
              variant={activeTab === "centres" ? "primary" : "secondary"}
              size="md"
              iconLeft={<Building2 className="w-4 h-4" />}
              onClick={() => setActiveTab("centres")}
            >
              Compare Centres
            </GlassButton>
          </div>
        </div>
      </section>

      {/* Controlled SIH Demo Controller Bar (Section 18 Requirement) */}
      <DemoModeBar
        currentStage={booking?.stage || "TOKEN_GENERATED"}
        queuePosition={booking?.queuePosition || 12}
        onAdvanceQueue={handleAdvanceQueue}
        onAdvanceStage={handleAdvanceStage}
        onResetDemo={handleResetDemo}
        isLoading={isUpdating}
      />

      {/* View: Book Slot Wizard */}
      {activeTab === "book" && (
        <SlotBookingWizard
          onBookingComplete={(newBooking) => {
            setBooking(newBooking);
            setActiveTab("live");
          }}
          onCancel={() => setActiveTab("live")}
        />
      )}

      {/* View: Compare Centres */}
      {activeTab === "centres" && (
        <SmartCentreRecommendation
          centres={centres}
          selectedCentreId={booking?.centreId}
          onSelectCentre={(c) => {
            showToast({
              title: "Centre Selected",
              message: `You can now book a slot at ${c.name}.`,
              type: "info",
            });
            setActiveTab("book");
          }}
        />
      )}

      {/* View: Live Active Intake Dashboard */}
      {activeTab === "live" && booking && queueState && payment && (
        <div className="flex flex-col gap-6">
          {/* Section 3: Today's Procurement Status */}
          <TodayProcurementCard
            booking={booking}
            centre={currentCentre}
            onViewToken={() => {
              const el = document.getElementById("digital-token-card");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onViewQueue={() => {
              const el = document.getElementById("live-queue-card");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Section 6: Dedicated LIVE QUEUE & Telemetry */}
          <div id="live-queue-card">
            <LiveQueueCard
              queueState={queueState}
              booking={booking}
              onRefresh={loadData}
              isLoading={isLoading}
            />
          </div>

          {/* Two-Column Grid: Section 7 AI ETA + Section 9 Arrival Recommendation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AiEtaCard
              prediction={etaPrediction}
              queuePosition={booking.queuePosition}
            />

            <ArrivalRecommendationCard
              booking={booking}
              onViewLiveQueue={() => {
                const el = document.getElementById("live-queue-card");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>

          {/* Section 10: 8-Stage Procurement Status Tracking */}
          <ProcurementTimeline
            booking={booking}
            onAdvanceStage={handleAdvanceStage}
            isUpdating={isUpdating}
          />

          {/* Two-Column Grid: Section 5 Digital Token + Section 11 Payment Tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="digital-token-card">
              <DigitalTokenCard
                booking={booking}
                onCancelBooking={handleCancelBooking}
              />
            </div>

            <PaymentStatusCard
              payment={payment}
              booking={booking}
            />
          </div>

          {/* Section 8: Recommended Centre Quick Preview */}
          <SmartCentreRecommendation
            centres={centres}
            selectedCentreId={booking.centreId}
            onSelectCentre={(c) => {
              setActiveTab("book");
            }}
          />

          {/* Section 14: Offline + SMS Ready Design Indicator */}
          <OfflineSmsCard
            tokenNumber={booking.tokenNumber}
            bookingCode={booking.bookingCode}
          />
        </div>
      )}
    </div>
  );
}
