"use client";

import React, { useState, useEffect } from "react";
import {
  Sprout,
  Plus,
  Calendar,
  Layers,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Info,
  Clock,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassModal } from "@/components/glass/GlassModal";
import { ConfirmDialog } from "@/components/common/FeedbackStates";
import { useSession } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { useTranslation } from "@/lib/i18n";
import { cropApi } from "@/lib/api";
import { Crop, CropStage } from "@/types";

const STAGES: CropStage[] = [
  "Seed",
  "Germination",
  "Vegetative",
  "Flowering",
  "Fruiting",
  "Maturity",
  "Harvest",
];

const STAGE_ADVISORY: Record<
  CropStage,
  {
    irrigation: string;
    fertilizer: string;
    pestWatch: string;
    action: string;
  }
> = {
  Seed: {
    irrigation: "Pre-sowing irrigation (Rauni) to ensure optimal seed bed moisture.",
    fertilizer: "Apply basal dose of DAP @ 50kg/acre + Zinc Sulphate @ 5kg/acre.",
    pestWatch: "Treat seeds with Thiram or Trichoderma to prevent damping-off.",
    action: "Test seed germination rate and ensure proper seeding depth of 4-5 cm.",
  },
  Germination: {
    irrigation: "Avoid stagnant water; light sprinkler if soil crusting occurs.",
    fertilizer: "No direct chemical fertilizers at emergence; protect tender radicles.",
    pestWatch: "Monitor for cutworms and subterranean termites.",
    action: "Inspect field emergence uniformity; perform gap filling if required.",
  },
  Vegetative: {
    irrigation: "Critical CRI (Crown Root Initiation) irrigation at 21 days after sowing.",
    fertilizer: "First top dressing with Urea @ 30kg/acre + seaweed bio-stimulant.",
    pestWatch: "Watch for broadleaf weeds and early stem borers.",
    action: "Execute manual hoeing or apply selective post-emergence weedicide.",
  },
  Flowering: {
    irrigation: "Crucial stage: maintain uniform moisture. Never let soil crack.",
    fertilizer: "Foliar spray of 19:19:19 NPK @ 5g/litre for prolific anthesis.",
    pestWatch: "High aphid risk under overcast skies. Inspect lower foliage.",
    action: "Minimize disturbance during morning hours when pollination occurs.",
  },
  Fruiting: {
    irrigation: "Milk to dough stage irrigation. Prevents grain shriveling.",
    fertilizer: "Apply Potassium Nitrate (13:0:45) @ 1% to maximize grain weight.",
    pestWatch: "Monitor for head caterpillars or pod borers.",
    action: "Check grain filling density across 10 random sample spikes.",
  },
  Maturity: {
    irrigation: "Stop all field irrigation 10-14 days before intended harvest.",
    fertilizer: "Cease all nutrient applications; allow natural dry-down.",
    pestWatch: "Watch for bird damage and storage pests in nearby godowns.",
    action: "Measure grain moisture (aim for 12-14% moisture before cutting).",
  },
  Harvest: {
    irrigation: "Dry field condition required for combine harvester movement.",
    fertilizer: "None.",
    pestWatch: "Ensure immediate threshing and clean canvas storage.",
    action: "Harvest during dry, sunny hours; clean and pack in dry jute bags.",
  },
};

export default function MyCropsPage() {
  const { activeFarm } = useSession();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCropId, setDeleteCropId] = useState<string | null>(null);

  // Add crop form state
  const [newCropName, setNewCropName] = useState("Wheat (गेहूं)");
  const [newVariety, setNewVariety] = useState("HD-3086");
  const [newArea, setNewArea] = useState("2.0");
  const [newSowingDate, setNewSowingDate] = useState("2025-11-15");
  const [newHarvestDate, setNewHarvestDate] = useState("2026-03-30");
  const [newSeason, setNewSeason] = useState<Crop["season"]>("Rabi");

  useEffect(() => {
    cropApi.getCrops().then((res) => {
      setCrops(res);
      if (res.length > 0 && !selectedCrop) {
        setSelectedCrop(res[0]);
      }
    });
  }, [selectedCrop]);

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await cropApi.addCrop({
      farmId: activeFarm?.id || "farm-1",
      farmName: activeFarm?.name || "Active Farm",
      name: newCropName,
      variety: newVariety,
      areaAcres: parseFloat(newArea) || 1.0,
      sowingDate: newSowingDate,
      expectedHarvest: newHarvestDate,
      season: newSeason,
      currentStage: "Vegetative",
      health: "good",
      pestRisk: "low",
      diseaseRisk: "low",
      weatherCondition: "Favorable dry air",
      irrigationStatus: "Irrigated on schedule",
    });

    setCrops((prev) => [created, ...prev]);
    setSelectedCrop(created);
    setIsAddModalOpen(false);

    showToast({
      type: "success",
      title: "Crop Registered",
      message: `${created.name} (${created.variety}) added to crop lifecycle monitor.`,
    });
  };

  const handleStageChange = async (cropId: string, stage: CropStage) => {
    const updated = await cropApi.updateCropStage(cropId, stage);
    setCrops((prev) => prev.map((c) => (c.id === cropId ? updated : c)));
    setSelectedCrop(updated);
    showToast({
      type: "success",
      title: "Crop Stage Updated",
      message: `Stage set to "${stage}". Guidance updated accordingly.`,
    });
  };

  const handleDeleteCrop = async () => {
    if (deleteCropId) {
      await cropApi.deleteCrop(deleteCropId);
      const remaining = crops.filter((c) => c.id !== deleteCropId);
      setCrops(remaining);
      setSelectedCrop(remaining.length > 0 ? remaining[0] : null);
      setDeleteCropId(null);
      showToast({
        type: "success",
        title: "Crop Deleted",
        message: "Crop record was removed.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("crops.title")}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            {t("crops.subtitle")}
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          iconLeft={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          {t("crops.addCrop")}
        </GlassButton>
      </div>

      {/* Main Grid: Crop Selector Cards on Left, Detailed Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Crops List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50 px-1">
            Active Plantings ({crops.length})
          </div>

          {crops.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;
            return (
              <GlassCard
                key={crop.id}
                hoverable
                onClick={() => setSelectedCrop(crop)}
                className={`p-4 transition-all ${
                  isSelected
                    ? "border-emerald-600/70 dark:border-emerald-500/50 ring-2 ring-emerald-500/20 bg-white/85 dark:bg-[#0e1612]/85"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {crop.name}
                      </h4>
                      <p className="text-xs text-foreground/60">
                        {crop.variety} • {crop.areaAcres} Acres
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <GlassBadge variant="success" size="sm">
                          {crop.currentStage}
                        </GlassBadge>
                        <span className="text-[10px] text-foreground/45">
                          {crop.season}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCropId(crop.id);
                    }}
                    className="p-1.5 rounded-xl text-rose-500/60 hover:text-rose-600 hover:bg-rose-500/10 transition"
                    aria-label="Delete crop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Right 2 Cols: Selected Crop Visual Timeline & Guidance */}
        {selectedCrop && (
          <div className="lg:col-span-2 space-y-6">
            {/* Top Crop Overview Card */}
            <GlassCard className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-foreground">
                      {selectedCrop.name}
                    </h2>
                    <GlassBadge variant="success" size="sm">
                      {selectedCrop.health} health
                    </GlassBadge>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Variety: {selectedCrop.variety} • Farm: {selectedCrop.farmName}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                      Sown Date
                    </span>
                    <div className="font-bold text-foreground">
                      {selectedCrop.sowingDate}
                    </div>
                  </div>
                  <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
                  <div>
                    <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                      Expected Harvest
                    </span>
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">
                      {selectedCrop.expectedHarvest}
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Stage Visual Lifecycle Stepper (Section 22) */}
              <div className="pt-5">
                <div className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-3">
                  Crop Lifecycle Stage Progression (Click to Update)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {STAGES.map((stage, idx) => {
                    const currentIndex = STAGES.indexOf(selectedCrop.currentStage);
                    const isPast = idx < currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <button
                        key={stage}
                        onClick={() => handleStageChange(selectedCrop.id, stage)}
                        className={`p-2.5 rounded-2xl flex flex-col items-center text-center transition-all border ${
                          isCurrent
                            ? "bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30 scale-105"
                            : isPast
                            ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border-emerald-500/30"
                            : "bg-black/5 dark:bg-white/5 text-foreground/50 border-black/5 dark:border-white/5 hover:bg-black/10"
                        }`}
                      >
                        <div className="text-[10px] font-bold opacity-70 mb-0.5">
                          #{idx + 1}
                        </div>
                        <span className="text-xs font-bold leading-tight">
                          {stage}
                        </span>
                        <div className="mt-1.5">
                          {isPast && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isCurrent && <Sprout className="w-3.5 h-3.5 text-emerald-200" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </GlassCard>

            {/* Stage Specific Agricultural Guidance (Section 22) */}
            <GlassCard className="p-6 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-foreground">
                  Official Guidance for &quot;{selectedCrop.currentStage}&quot; Stage
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1.5">
                    <Droplets className="w-4 h-4" />
                    <span>Irrigation Advisory</span>
                  </div>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {STAGE_ADVISORY[selectedCrop.currentStage].irrigation}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Nutrient & Fertilizer Management</span>
                  </div>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {STAGE_ADVISORY[selectedCrop.currentStage].fertilizer}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Pest & Disease Vigilance</span>
                  </div>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {STAGE_ADVISORY[selectedCrop.currentStage].pestWatch}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Key Agronomic Action</span>
                  </div>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {STAGE_ADVISORY[selectedCrop.currentStage].action}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Add Crop Modal */}
      <GlassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Crop Planting"
        description="Configure crop variety, sowing schedule, and allocated area."
      >
        <form onSubmit={handleCreateCrop} className="space-y-4">
          <GlassSelect
            label="Crop Name"
            value={newCropName}
            onChange={(e) => setNewCropName(e.target.value)}
            options={[
              { value: "Wheat (गेहूं)", label: "Wheat (गेहूं)" },
              { value: "Mustard (सरसों)", label: "Mustard (सरसों)" },
              { value: "Paddy (धान)", label: "Paddy (धान)" },
              { value: "Gram / Chana (चना)", label: "Gram / Chana (चना)" },
              { value: "Potato (आलू)", label: "Potato (आलू)" },
              { value: "Sugarcane (गन्ना)", label: "Sugarcane (गन्ना)" },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput
              label="Variety"
              placeholder="e.g. HD-2967 / Pusa Bold"
              value={newVariety}
              onChange={(e) => setNewVariety(e.target.value)}
              required
            />
            <GlassInput
              label="Allocated Area (Acres)"
              type="number"
              step="0.1"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput
              label="Sowing Date"
              type="date"
              value={newSowingDate}
              onChange={(e) => setNewSowingDate(e.target.value)}
              required
            />
            <GlassInput
              label="Expected Harvest Date"
              type="date"
              value={newHarvestDate}
              onChange={(e) => setNewHarvestDate(e.target.value)}
              required
            />
          </div>

          <GlassSelect
            label="Season"
            value={newSeason}
            onChange={(e) => setNewSeason(e.target.value as any)}
            options={[
              { value: "Rabi", label: "Rabi (Winter Season)" },
              { value: "Kharif", label: "Kharif (Monsoon Season)" },
              { value: "Zaid", label: "Zaid (Summer Season)" },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              Save Crop Planting
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Delete Crop Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCropId}
        title="Delete Crop Planting"
        message="Are you sure you want to remove this crop from your farm? Historical stage data and journal links will be archived."
        onConfirm={handleDeleteCrop}
        onCancel={() => setDeleteCropId(null)}
      />
    </div>
  );
}
