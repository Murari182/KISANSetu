"use client";

import React, { useState, useEffect } from "react";
import {
  Sprout,
  Building2,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wheat,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { useToast } from "@/lib/toast";
import { useSession } from "@/lib/auth";
import {
  ProcurementCentre,
  ProcurementSlot,
  ProcurementBooking,
  SlotAvailability,
} from "@/types";
import {
  PROCUREMENT_CROPS,
  DEFAULT_PROCUREMENT_CENTRES,
  generateDailySlots,
} from "@/lib/data/procurement";
import { procurementApi } from "@/lib/api";

interface SlotBookingWizardProps {
  onBookingComplete: (booking: ProcurementBooking) => void;
  onCancel?: () => void;
}

export const SlotBookingWizard: React.FC<SlotBookingWizardProps> = ({
  onBookingComplete,
  onCancel,
}) => {
  const { user, activeFarm } = useSession();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [selectedCrop, setSelectedCrop] = useState(PROCUREMENT_CROPS[0]);
  const [selectedCentre, setSelectedCentre] = useState<ProcurementCentre>(DEFAULT_PROCUREMENT_CENTRES[0]);
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-12");
  const [availableSlots, setAvailableSlots] = useState<ProcurementSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ProcurementSlot | null>(null);
  const [estimatedQuantity, setEstimatedQuantity] = useState<number>(1480);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load slots whenever centre or date changes
  useEffect(() => {
    const slots = generateDailySlots(selectedCentre.id, selectedDate);
    setAvailableSlots(slots);
    // Select first available slot
    const firstAvail = slots.find((s) => s.status !== "FULL");
    if (firstAvail) setSelectedSlot(firstAvail);
  }, [selectedCentre, selectedDate]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      showToast({ title: "Slot required", message: "Please select an available time slot.", type: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await procurementApi.createBooking({
        cropName: selectedCrop.name,
        commodity: selectedCrop.id,
        variety: selectedCrop.variety,
        estimatedQuantityKg: estimatedQuantity,
        centreId: selectedCentre.id,
        date: selectedDate === "2026-09-12" ? "12 September 2026" : selectedDate,
        slotTime: selectedSlot.displayTime,
        farmerName: user?.name || "Rameshwar Prasad Patel",
        farmerPhone: user?.phone || "+91 98765 43210",
        farmName: activeFarm?.name || "Lucknow Shivalik Farm",
      });

      showToast({
        title: "Procurement Slot Booked!",
        message: `Token ${newBooking.tokenNumber} generated successfully for ${selectedCentre.name}.`,
        type: "success",
      });

      onBookingComplete(newBooking);
    } catch (error) {
      showToast({
        title: "Booking Failed",
        message: "Unable to reserve procurement slot. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard variant="elevated" className="p-5 sm:p-7 relative overflow-hidden">
      {/* Wizard Step Indicator Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
            Mandi Direct Slot Portal
          </span>
          <h3 className="text-lg sm:text-xl font-black text-foreground mt-0.5">
            Book Procurement Slot
          </h3>
        </div>

        {/* 5 Step Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[
            { num: 1, label: "Crop" },
            { num: 2, label: "Centre" },
            { num: 3, label: "Date" },
            { num: 4, label: "Slot" },
            { num: 5, label: "Confirm" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                    : step > s.num
                    ? "bg-emerald-700 text-white"
                    : "bg-black/5 dark:bg-white/10 text-foreground/50"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className={`text-xs hidden sm:inline ${step === s.num ? "font-bold text-foreground" : "text-foreground/50"}`}>
                {s.label}
              </span>
              {s.num < 5 && <span className="text-foreground/25">›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Crop */}
      {step === 1 && (
        <div className="my-6 space-y-4 animate-in fade-in">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Step 1: Select Crop / Commodity
            </h4>
            <p className="text-xs text-foreground/60 mt-0.5">
              Choose the harvested agricultural commodity you wish to bring for official Mandi procurement.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PROCUREMENT_CROPS.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              return (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Wheat className={`w-5 h-5 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/50"}`} />
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="font-extrabold text-foreground text-sm block">
                      {crop.name}
                    </span>
                    <span className="text-[11px] text-foreground/60 block mt-0.5">
                      {crop.variety}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-2 block">
                      MSP ₹{crop.mspPerQuintal}/Q
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-xs pt-2">
            <GlassInput
              label="Estimated Quantity to Sell (Kg)"
              type="number"
              value={estimatedQuantity}
              onChange={(e) => setEstimatedQuantity(Number(e.target.value) || 0)}
              hint={`Equivalent to ${(estimatedQuantity / 100).toFixed(2)} quintals. Approx MSP: ₹${Math.round(
                (estimatedQuantity / 100) * selectedCrop.mspPerQuintal
              ).toLocaleString()}`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-black/5 dark:border-white/10">
            {onCancel && (
              <GlassButton variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </GlassButton>
            )}
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Select Centre
            </GlassButton>
          </div>
        </div>
      )}

      {/* Step 2: Select Procurement Centre */}
      {step === 2 && (
        <div className="my-6 space-y-4 animate-in fade-in">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Step 2: Select Procurement Centre
            </h4>
            <p className="text-xs text-foreground/60 mt-0.5">
              Available intake hubs near Lucknow & Barabanki with live queue status.
            </p>
          </div>

          <div className="space-y-3">
            {DEFAULT_PROCUREMENT_CENTRES.map((centre) => {
              const isSelected = selectedCentre.id === centre.id;
              return (
                <div
                  key={centre.id}
                  onClick={() => setSelectedCentre(centre)}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm sm:text-base">
                          {centre.name}
                        </span>
                        {centre.isRecommended && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            RECOMMENDED
                          </span>
                        )}
                        <GlassBadge
                          variant={
                            centre.status === "OPEN"
                              ? "success"
                              : centre.status === "BUSY"
                              ? "warning"
                              : "danger"
                          }
                          size="sm"
                        >
                          {centre.status}
                        </GlassBadge>
                      </div>
                      <span className="text-xs text-foreground/60 mt-0.5 block">
                        {centre.address} • {centre.distanceKm} km from farm
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-foreground/50 uppercase block font-semibold">
                          Queue
                        </span>
                        <span className="font-bold text-foreground">
                          {centre.queueLength} Farmers
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-foreground/50 uppercase block font-semibold">
                          Wait
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          ~{Math.round((centre.queueLength / centre.activeCounters) * centre.avgProcessingTimeMinutes)}m
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-foreground/50 uppercase block font-semibold">
                          Slots
                        </span>
                        <span className="font-bold text-foreground">
                          {centre.availableSlotsCount} Left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/10">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setStep(1)}
              iconLeft={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </GlassButton>
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => setStep(3)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Select Date
            </GlassButton>
          </div>
        </div>
      )}

      {/* Step 3: Select Date */}
      {step === 3 && (
        <div className="my-6 space-y-4 animate-in fade-in">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Step 3: Select Date
            </h4>
            <p className="text-xs text-foreground/60 mt-0.5">
              Choose your preferred day of arrival at {selectedCentre.name}.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { date: "2026-09-12", display: "Today (12 Sep)", tag: "Recommended", available: true },
              { date: "2026-09-13", display: "Tomorrow (13 Sep)", tag: "Open", available: true },
              { date: "2026-09-14", display: "Monday (14 Sep)", tag: "High Intake", available: true },
              { date: "2026-09-15", display: "Tuesday (15 Sep)", tag: "Open", available: true },
            ].map((d) => {
              const isSelected = selectedDate === d.date;
              return (
                <div
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  <CalendarIcon className={`w-5 h-5 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/50"}`} />
                  <div className="mt-3">
                    <span className="font-extrabold text-foreground text-sm block">
                      {d.display}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block mt-1">
                      {d.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/10">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setStep(2)}
              iconLeft={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </GlassButton>
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => setStep(4)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Choose Time Slot
            </GlassButton>
          </div>
        </div>
      )}

      {/* Step 4: Show Available Time Slots (AVAILABLE / LIMITED / FULL) */}
      {step === 4 && (
        <div className="my-6 space-y-4 animate-in fade-in">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Step 4: Choose Arrival Time Slot
            </h4>
            <p className="text-xs text-foreground/60 mt-0.5">
              Available half-hour entry slots for {selectedDate} at {selectedCentre.name}.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isFull = slot.status === "FULL";

              return (
                <div
                  key={slot.id}
                  onClick={() => !isFull && setSelectedSlot(slot)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isFull
                      ? "opacity-50 cursor-not-allowed bg-black/5 dark:bg-white/5 border-dashed"
                      : isSelected
                      ? "bg-emerald-500/15 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20 cursor-pointer"
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-sm text-foreground">
                      {slot.displayTime}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <GlassBadge
                      variant={
                        slot.status === "AVAILABLE"
                          ? "success"
                          : slot.status === "LIMITED"
                          ? "warning"
                          : "danger"
                      }
                      size="sm"
                    >
                      {slot.status}
                    </GlassBadge>
                    <span className="text-[10px] text-foreground/50">
                      {slot.bookedCount}/{slot.capacity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/10">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setStep(3)}
              iconLeft={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </GlassButton>
            <GlassButton
              variant="primary"
              size="md"
              disabled={!selectedSlot}
              onClick={() => setStep(5)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Review & Confirm Booking
            </GlassButton>
          </div>
        </div>
      )}

      {/* Step 5: Confirm Booking & Generate Token */}
      {step === 5 && (
        <div className="my-6 space-y-4 animate-in fade-in">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Step 5: Confirm Details & Issue Digital Token
            </h4>
            <p className="text-xs text-foreground/60 mt-0.5">
              Review your procurement intake schedule before final electronic submission.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] uppercase text-foreground/50 font-bold block">
                  Commodity
                </span>
                <span className="font-extrabold text-foreground text-sm block mt-0.5">
                  {selectedCrop.name}
                </span>
                <span className="text-[11px] text-foreground/60 block">{selectedCrop.variety}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-foreground/50 font-bold block">
                  Procurement Centre
                </span>
                <span className="font-extrabold text-foreground text-sm block mt-0.5">
                  {selectedCentre.name}
                </span>
                <span className="text-[11px] text-foreground/60 block">{selectedCentre.distanceKm} km from farm</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-foreground/50 font-bold block">
                  Intake Slot
                </span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm block mt-0.5">
                  {selectedSlot?.displayTime}
                </span>
                <span className="text-[11px] text-foreground/60 block">{selectedDate}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-foreground/50 font-bold block">
                  Quantity & MSP Total
                </span>
                <span className="font-extrabold text-foreground text-sm block mt-0.5">
                  {estimatedQuantity.toLocaleString()} kg
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
                  Est. ₹{Math.round((estimatedQuantity / 100) * selectedCrop.mspPerQuintal).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                By confirming, a digital QR token will be generated immediately with real-time queue position tracking.
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/10">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setStep(4)}
              iconLeft={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </GlassButton>
            <GlassButton
              variant="primary"
              size="lg"
              loading={isSubmitting}
              onClick={handleConfirmBooking}
              iconRight={<CheckCircle2 className="w-5 h-5" />}
            >
              Confirm Booking & Generate Token
            </GlassButton>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
