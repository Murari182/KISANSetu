"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Search,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassTextarea } from "@/components/glass/GlassSelect";
import { GlassModal } from "@/components/glass/GlassModal";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { expertApi } from "@/lib/api";
import { ExpertProfile, Consultation } from "@/types";

export default function ExpertsPage() {
  const { user, activeFarm } = useSession();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Booking fields
  const [chosenSlot, setChosenSlot] = useState("");
  const [cropName, setCropName] = useState("Wheat");
  const [issueDescription, setIssueDescription] = useState("");

  useEffect(() => {
    expertApi.getExperts().then(setExperts);
    expertApi.getConsultations().then(setConsultations);
  }, []);

  const handleStartBooking = (exp: ExpertProfile) => {
    setSelectedExpert(exp);
    setChosenSlot(exp.availableSlots[0] || "Tomorrow 10:00 AM");
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert) return;

    const created = await expertApi.bookConsultation({
      farmerId: user?.id || "usr-1",
      farmerName: user?.name || "Farmer",
      farmerPhone: user?.phone || "+91 98765 43210",
      farmName: activeFarm?.name || "Primary Farm",
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      cropName,
      scheduledSlot: chosenSlot,
      issueDescription,
      photos: [],
    });

    setConsultations((prev) => [created, ...prev]);
    setIsBookingOpen(false);

    showToast({
      type: "success",
      title: "Consultation Scheduled",
      message: `Appointment with ${selectedExpert.name} requested for ${chosenSlot}.`,
    });

    setIssueDescription("");
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge variant="success" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            ICAR & Agricultural University Verified
          </GlassBadge>
          <span className="text-xs text-foreground/50">
            Certified Agronomists & Plant Pathologists
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("experts.title")}
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
          {t("experts.subtitle")}
        </p>
      </div>

      {/* Existing Consultations Tracker (Section 45) */}
      {consultations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50">
            Your Scheduled & Past Consultations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consultations.map((con) => (
              <GlassCard key={con.id} className="p-5 border-emerald-500/20">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {con.expertName}
                    </h4>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      Crop: {con.cropName}
                    </span>
                  </div>
                  <GlassBadge
                    variant={con.status === "confirmed" ? "success" : "neutral"}
                    size="sm"
                  >
                    {con.status.toUpperCase()}
                  </GlassBadge>
                </div>

                <p className="text-xs text-foreground/70 line-clamp-2 mt-1">
                  &quot;{con.issueDescription}&quot;
                </p>

                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-foreground/60">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {con.scheduledSlot}
                  </span>
                  <span className="text-[11px]">Ref: #{con.id}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Agronomist Directory Grid (Section 44) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50">
          Available Certified Agronomists ({experts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {experts.map((expert) => (
            <GlassCard
              key={expert.id}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={expert.avatarUrl}
                    alt={expert.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-foreground">
                        {expert.name}
                      </h4>
                      {expert.verified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-foreground/60 leading-tight mt-0.5">
                      {expert.qualification}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{expert.rating}</span>
                      <span className="text-[10px] text-foreground/40 font-normal">
                        ({expert.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-foreground/75 mb-4">
                  <div>
                    <span className="text-foreground/50 font-semibold">
                      Specialization:{" "}
                    </span>
                    {expert.specialization}
                  </div>
                  <div>
                    <span className="text-foreground/50 font-semibold">
                      Languages:{" "}
                    </span>
                    {expert.languages.join(", ")}
                  </div>
                  <div>
                    <span className="text-foreground/50 font-semibold">
                      Experience:{" "}
                    </span>
                    {expert.experienceYears} Years Field Practice
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/5">
                <GlassButton
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleStartBooking(expert)}
                >
                  Book Consultation Slot
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Booking Slot Modal */}
      {selectedExpert && (
        <GlassModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          title={`Consult with ${selectedExpert.name}`}
          description={selectedExpert.specialization}
        >
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <GlassSelect
              label="Select Available Time Slot"
              value={chosenSlot}
              onChange={(e) => setChosenSlot(e.target.value)}
              options={selectedExpert.availableSlots.map((s) => ({
                value: s,
                label: s,
              }))}
            />

            <GlassSelect
              label="Crop Problem Area"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              options={[
                { value: "Wheat (HD-2967)", label: "Wheat (HD-2967)" },
                { value: "Mustard (Pusa Bold)", label: "Mustard (Pusa Bold)" },
                { value: "Basmati Paddy", label: "Basmati Paddy" },
                { value: "Soil & Nutrient Dosage", label: "Soil & Nutrient Dosage" },
              ]}
            />

            <GlassTextarea
              label="Describe Your Field Issue"
              placeholder="Describe symptoms, duration, or fertilizer applied..."
              rows={3}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              required
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
              <GlassButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsBookingOpen(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="sm">
                Confirm Booking
              </GlassButton>
            </div>
          </form>
        </GlassModal>
      )}
    </div>
  );
}
