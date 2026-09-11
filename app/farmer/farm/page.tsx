"use client";

import React, { useState } from "react";
import {
  Tractor,
  MapPin,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Droplets,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
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
import { Farm } from "@/types";

export default function MyFarmPage() {
  const { farms, activeFarm, setActiveFarm, addFarm, deleteFarm } = useSession();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // New farm form state
  const [newFarmName, setNewFarmName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDistrict, setNewDistrict] = useState("Lucknow");
  const [newState, setNewState] = useState("Uttar Pradesh");
  const [newPinCode, setNewPinCode] = useState("226102");
  const [newAcres, setNewAcres] = useState("3.0");
  const [newLandType, setNewLandType] = useState<Farm["landType"]>("irrigated");
  const [newIrrigation, setNewIrrigation] = useState<Farm["irrigation"]>("drip");
  const [newSoilType, setNewSoilType] = useState<Farm["soilType"]>("alluvial");

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim()) return;

    const created = addFarm({
      name: newFarmName,
      location: newLocation || `${newDistrict}, ${newState}`,
      district: newDistrict,
      state: newState,
      pinCode: newPinCode,
      acres: parseFloat(newAcres) || 2.5,
      landType: newLandType,
      irrigation: newIrrigation,
      soilType: newSoilType,
      coordinates: { lat: 26.85, lng: 80.95 },
      healthScore: 84,
      activeCropsCount: 1,
      documentsCount: 1,
    });

    setIsAddModalOpen(false);
    showToast({
      type: "success",
      title: "Farm Registered",
      message: `"${created.name}" is now active in your profile.`,
    });

    // Reset fields
    setNewFarmName("");
    setNewLocation("");
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteFarm(deleteTargetId);
      setDeleteTargetId(null);
      showToast({
        type: "success",
        title: "Farm Removed",
        message: "The farm holding was removed from your account.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header with Add Farm CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("farm.title")}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            {t("farm.subtitle")}
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          iconLeft={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          {t("farm.addFarm")}
        </GlassButton>
      </div>

      {/* Farms List / Switcher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {farms.map((farm) => {
          const isActive = activeFarm?.id === farm.id;
          return (
            <GlassCard
              key={farm.id}
              className={`p-6 transition-all relative ${
                isActive
                  ? "border-emerald-600/60 dark:border-emerald-500/40 ring-2 ring-emerald-500/20 bg-white/85 dark:bg-[#0f1713]/85"
                  : "hover:border-black/20 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "bg-black/5 dark:bg-white/5 text-foreground/60"
                    }`}
                  >
                    <Tractor className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {farm.name}
                      </h3>
                      {isActive && (
                        <GlassBadge variant="success" size="sm">
                          Active Farm
                        </GlassBadge>
                      )}
                    </div>
                    <p className="text-xs text-foreground/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      {farm.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {farms.length > 1 && (
                    <button
                      onClick={() => setDeleteTargetId(farm.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition"
                      aria-label="Delete farm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Specs Pill Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                    Area
                  </span>
                  <div className="font-bold text-foreground">{farm.acres} Acres</div>
                </div>
                <div>
                  <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                    Irrigation
                  </span>
                  <div className="font-bold text-foreground capitalize">
                    {farm.irrigation}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                    Soil
                  </span>
                  <div className="font-bold text-foreground capitalize">
                    {farm.soilType}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-foreground/50 uppercase font-semibold">
                    Health
                  </span>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">
                    {farm.healthScore}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-[11px] text-foreground/50">
                  Registered: {farm.createdAt}
                </span>

                {!isActive ? (
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveFarm(farm)}
                  >
                    Switch to this Farm
                  </GlassButton>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Selected
                  </span>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Active Farm Detail Inspection Panel */}
      {activeFarm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          {/* Farm Boundary Map / GIS Preview Container (Section 74) */}
          <GlassCard className="p-6 lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Farm GIS Boundary & Coordinates
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  GPS: {activeFarm.coordinates.lat}° N, {activeFarm.coordinates.lng}° E
                </p>
              </div>
              <GlassBadge variant="info" size="sm">
                Surveyed Plot
              </GlassBadge>
            </div>

            {/* Stylized Satellite / Topographic Liquid Map Preview */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-tr from-emerald-950 via-[#102419] to-emerald-900 flex items-center justify-center p-4 border border-emerald-500/20 shadow-inner">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Visualized Field Boundary Polygon */}
              <div className="relative border-2 border-emerald-400 bg-emerald-500/20 rounded-2xl p-6 sm:p-10 backdrop-blur-xs flex flex-col items-center justify-center text-center text-white shadow-2xl">
                <Tractor className="w-8 h-8 text-emerald-300 mb-2" />
                <span className="font-bold text-sm tracking-wide">
                  {activeFarm.name}
                </span>
                <span className="text-xs text-emerald-200 mt-0.5">
                  {activeFarm.acres} Acres Boundary Polygon
                </span>
                <div className="mt-3 flex items-center gap-2 text-[11px] bg-black/40 px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Pin: {activeFarm.pinCode}</span>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 text-[10px] text-white/60 bg-black/40 px-2.5 py-1 rounded-lg">
                Survey of India GIS Grid
              </div>
            </div>
          </GlassCard>

          {/* Land Documents Section (Section 17) */}
          <GlassCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground">
                  Land Documents
                </h3>
                <GlassBadge variant="neutral" size="sm">
                  Verified
                </GlassBadge>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Khatauni Land Record", size: "1.2 MB PDF", date: "Verified 2026" },
                  { name: "Kisan Credit Card (KCC)", size: "840 KB PDF", date: "Active" },
                  { name: "Soil Health Card", size: "1.8 MB PDF", date: "Aug 2026" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate">
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-foreground/50">
                          {doc.size} • {doc.date}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-foreground/40 shrink-0 cursor-pointer hover:text-foreground" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
              <GlassButton variant="outline" size="sm" className="w-full">
                Upload New Land Document
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Add Farm Modal */}
      <GlassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Agricultural Holding"
        description="Register a new farm plot with land, irrigation, and soil details."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateFarm} className="space-y-4">
          <GlassInput
            label="Holding / Farm Name"
            placeholder="e.g. Barabanki River Basin Farm"
            value={newFarmName}
            onChange={(e) => setNewFarmName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput
              label="Location / Village"
              placeholder="e.g. Malihabad Tehsil"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              required
            />
            <GlassInput
              label="District"
              value={newDistrict}
              onChange={(e) => setNewDistrict(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassInput
              label="Total Size (Acres)"
              type="number"
              step="0.1"
              value={newAcres}
              onChange={(e) => setNewAcres(e.target.value)}
              required
            />
            <GlassSelect
              label="Irrigation Source"
              value={newIrrigation}
              onChange={(e) => setNewIrrigation(e.target.value as any)}
              options={[
                { value: "drip", label: "Drip Irrigation" },
                { value: "sprinkler", label: "Sprinkler" },
                { value: "borewell", label: "Tube Well" },
                { value: "canal", label: "Canal" },
                { value: "rainfed", label: "Rainfed" },
              ]}
            />
            <GlassSelect
              label="Soil Type"
              value={newSoilType}
              onChange={(e) => setNewSoilType(e.target.value as any)}
              options={[
                { value: "alluvial", label: "Alluvial" },
                { value: "black", label: "Black Cotton" },
                { value: "clayey", label: "Clayey" },
                { value: "sandy_loam", label: "Sandy Loam" },
              ]}
            />
          </div>

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
              Save Farm Holding
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Remove Farm Holding"
        message="Are you sure you want to delete this farm? Its associated historical records and soil logs will be detached."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
