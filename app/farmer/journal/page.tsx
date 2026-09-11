"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Droplets,
  Sprout,
  Layers,
  Bug,
  Calendar,
  DollarSign,
  Filter,
  CheckCircle2,
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
import { journalApi } from "@/lib/api";
import { JournalEntry } from "@/types";

export default function FarmJournalPage() {
  const { activeFarm } = useSession();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New entry state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<JournalEntry["type"]>("irrigation");
  const [newCropName, setNewCropName] = useState("Wheat");
  const [newDescription, setNewDescription] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newCost, setNewCost] = useState("");

  useEffect(() => {
    journalApi.getEntries().then(setEntries);
  }, []);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = await journalApi.addEntry({
      farmId: activeFarm?.id || "farm-1",
      cropName: newCropName,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      type: newType,
      title: newTitle,
      description: newDescription,
      quantity: newQuantity || undefined,
      cost: newCost ? parseFloat(newCost) : undefined,
    });

    setEntries((prev) => [created, ...prev]);
    setIsModalOpen(false);

    showToast({
      type: "success",
      title: "Operation Logged",
      message: `"${created.title}" saved to farm journal.`,
    });

    setNewTitle("");
    setNewDescription("");
    setNewQuantity("");
    setNewCost("");
  };

  const filtered = entries.filter((e) => filterType === "all" || e.type === filterType);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("journal.title")}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            {t("journal.subtitle")}
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          iconLeft={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          {t("journal.newEntry")}
        </GlassButton>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Records" },
          { id: "irrigation", label: "Irrigation" },
          { id: "fertilizer", label: "Fertilizer" },
          { id: "pesticide", label: "Pesticide & Spray" },
          { id: "sowing", label: "Sowing & Planting" },
          { id: "harvest", label: "Harvest" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filterType === tab.id
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-black/5 dark:bg-white/5 text-foreground/70 hover:bg-black/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Entries Timeline List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <GlassCard key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                  {item.type === "irrigation" ? (
                    <Droplets className="w-5 h-5" />
                  ) : item.type === "fertilizer" ? (
                    <Layers className="w-5 h-5" />
                  ) : item.type === "pesticide" ? (
                    <Bug className="w-5 h-5" />
                  ) : (
                    <Sprout className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {item.title}
                    </h3>
                    <GlassBadge variant="neutral" size="sm">
                      {item.cropName}
                    </GlassBadge>
                    <span className="text-[11px] text-foreground/50 capitalize">
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-foreground/55">
                    {item.quantity && <span>Qty: {item.quantity}</span>}
                    {item.cost && (
                      <span className="font-semibold text-foreground">
                        Cost: ₹{item.cost.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-foreground/45 shrink-0 font-medium">
                {item.date}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Journal Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Field Operation"
        description="Record labor, chemical dosage, irrigation run time, or expenses."
      >
        <form onSubmit={handleAddEntry} className="space-y-4">
          <GlassInput
            label="Operation Title"
            placeholder="e.g. Second Urea Top Dressing"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassSelect
              label="Operation Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              options={[
                { value: "irrigation", label: "Irrigation" },
                { value: "fertilizer", label: "Fertilizer / Nutrient" },
                { value: "pesticide", label: "Pesticide / Spray" },
                { value: "sowing", label: "Sowing / Seed Treatment" },
                { value: "harvest", label: "Harvest Operation" },
                { value: "expense", label: "Machinery / Labor Expense" },
              ]}
            />
            <GlassSelect
              label="Crop"
              value={newCropName}
              onChange={(e) => setNewCropName(e.target.value)}
              options={[
                { value: "Wheat", label: "Wheat (गेहूं)" },
                { value: "Mustard", label: "Mustard (सरसों)" },
                { value: "Paddy", label: "Basmati Paddy (धान)" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput
              label="Quantity / Measure (Optional)"
              placeholder="e.g. 50 kg / 4 hours"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
            <GlassInput
              label="Cost Incurred (₹)"
              type="number"
              placeholder="e.g. 1350"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
            />
          </div>

          <GlassTextarea
            label="Field Notes & Observations"
            placeholder="Condition of soil, sprayer nozzles used, or weather..."
            rows={3}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              Save Entry
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
