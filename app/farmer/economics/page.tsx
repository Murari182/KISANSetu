"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Calendar,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassStat } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassModal } from "@/components/glass/GlassModal";
import { GlassChartContainer } from "@/components/glass/GlassChartContainer";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { economicsApi } from "@/lib/api";
import { EconomicsRecord } from "@/types";

export default function EconomicsPage() {
  const { activeFarm } = useSession();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [records, setRecords] = useState<EconomicsRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"expense" | "revenue">("expense");

  // Form fields
  const [category, setCategory] = useState<EconomicsRecord["category"]>("Fertilizer");
  const [cropName, setCropName] = useState("Wheat");
  const [amount, setAmount] = useState("");
  const [buyerOrVendor, setBuyerOrVendor] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    economicsApi.getRecords().then(setRecords);
  }, []);

  const totalExpense = records
    .filter((r) => r.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalRevenue = records
    .filter((r) => r.type === "revenue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalRevenue - totalExpense;
  const profitMarginPercent =
    totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    const created = await economicsApi.addRecord({
      farmId: activeFarm?.id || "farm-1",
      type: modalType,
      category,
      cropName,
      amount: val,
      date: new Date().toISOString().split("T")[0],
      buyerOrVendor: buyerOrVendor || undefined,
      notes: notes || undefined,
    });

    setRecords((prev) => [created, ...prev]);
    setIsModalOpen(false);

    showToast({
      type: "success",
      title: modalType === "revenue" ? "Revenue Recorded" : "Expense Recorded",
      message: `₹${val.toLocaleString("en-IN")} logged under ${category}.`,
    });

    setAmount("");
    setBuyerOrVendor("");
    setNotes("");
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("economics.title")}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            {t("economics.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="secondary"
            size="md"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => {
              setModalType("expense");
              setCategory("Fertilizer");
              setIsModalOpen(true);
            }}
          >
            {t("economics.logExpense")}
          </GlassButton>
          <GlassButton
            variant="primary"
            size="md"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={() => {
              setModalType("revenue");
              setCategory("Crop Sale");
              setIsModalOpen(true);
            }}
          >
            {t("economics.logRevenue")}
          </GlassButton>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStat
          label={t("economics.totalRevenue")}
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          change="+18.4% vs last year"
          changeType="positive"
          subtitle="From 2 harvested crops"
          icon={<ArrowUpRight className="w-5 h-5 text-emerald-600" />}
        />
        <GlassStat
          label={t("economics.totalExpense")}
          value={`₹${totalExpense.toLocaleString("en-IN")}`}
          change="Input spend controlled"
          changeType="neutral"
          subtitle="Fertilizer, seed & labor"
          icon={<ArrowDownRight className="w-5 h-5 text-rose-600" />}
        />
        <GlassStat
          label={t("economics.netProfit")}
          value={`₹${netProfit.toLocaleString("en-IN")}`}
          change="Healthy Margin"
          changeType="positive"
          subtitle="Net cash generated"
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
        />
        <GlassStat
          label={t("economics.profitMargin")}
          value={`${profitMarginPercent}%`}
          change="Strong Return"
          changeType="positive"
          subtitle="On operational costs"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Expense Category Breakdown & Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 cols: Category Breakdown Chart */}
        <div className="lg:col-span-5">
          <GlassChartContainer
            title={t("economics.expenseBreakdown")}
            subtitle="Distribution of seasonal operational costs"
            height={260}
          >
            <div className="space-y-3 pt-2">
              {[
                { name: "Labor & Sowing Crew", amount: 6000, color: "bg-emerald-600" },
                { name: "Fertilizer & DAP", amount: 5400, color: "bg-amber-500" },
                { name: "Machinery Rental", amount: 4500, color: "bg-sky-500" },
                { name: "Certified Seeds", amount: 3200, color: "bg-indigo-500" },
              ].map((cat, idx) => {
                const pct = Math.round((cat.amount / totalExpense) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                      <span>{cat.name}</span>
                      <span>₹{cat.amount.toLocaleString("en-IN")} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassChartContainer>
        </div>

        {/* Right 7 cols: Transactions Log Table */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">
              Financial Transaction Ledger
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {records.map((rec) => {
                const isRevenue = rec.type === "revenue";
                return (
                  <div
                    key={rec.id}
                    className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          isRevenue
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-500/20 text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {isRevenue ? "+" : "-"}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {rec.category} ({rec.cropName})
                        </div>
                        <div className="text-[11px] text-foreground/50">
                          {rec.buyerOrVendor || "Direct"} • {rec.date}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`font-extrabold text-sm ${
                        isRevenue
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-foreground"
                      }`}
                    >
                      {isRevenue ? "+" : "-"}₹{rec.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Record Expense/Revenue Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "revenue" ? "Record Crop Revenue" : "Record Farm Expense"}
        description="Maintain verifiable farm accounts for KCC loans and profitability."
      >
        <form onSubmit={handleAddRecord} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassSelect
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={
                modalType === "revenue"
                  ? [
                      { value: "Crop Sale", label: "Mandi / Trader Crop Sale" },
                      { value: "Other", label: "Subsidy / Other Inflow" },
                    ]
                  : [
                      { value: "Seeds", label: "Seeds Purchase" },
                      { value: "Fertilizer", label: "Fertilizers & Urea" },
                      { value: "Pesticide", label: "Pesticides & Fungicide" },
                      { value: "Labor", label: "Manual Labor Wages" },
                      { value: "Machinery", label: "Tractor & Thresher Rent" },
                      { value: "Irrigation", label: "Electricity / Diesel Pump" },
                      { value: "Transport", label: "Mandi Transportation" },
                    ]
              }
            />
            <GlassSelect
              label="Associated Crop"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              options={[
                { value: "Wheat", label: "Wheat" },
                { value: "Mustard", label: "Mustard" },
                { value: "Paddy", label: "Paddy" },
                { value: "Potato", label: "Potato" },
              ]}
            />
          </div>

          <GlassInput
            label="Amount (₹)"
            type="number"
            placeholder="e.g. 4500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <GlassInput
            label={modalType === "revenue" ? "Buyer / Mandi Trader" : "Vendor / Source"}
            placeholder="e.g. IFFCO Society / Malihabad APMC Trader"
            value={buyerOrVendor}
            onChange={(e) => setBuyerOrVendor(e.target.value)}
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
              Save Record
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
