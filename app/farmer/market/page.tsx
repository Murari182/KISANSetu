"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Search,
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  MapPin,
  Calendar,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassSelect } from "@/components/glass/GlassSelect";
import { GlassModal } from "@/components/glass/GlassModal";
import { GlassChartContainer } from "@/components/glass/GlassChartContainer";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { marketApi } from "@/lib/api";
import { MarketPrice, PriceAlert } from "@/types";

export default function MarketPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<MarketPrice | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // New alert form
  const [alertCommodity, setAlertCommodity] = useState("Wheat (गेहूं)");
  const [alertTargetPrice, setAlertTargetPrice] = useState("2450");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");

  useEffect(() => {
    marketApi.getMarketPrices().then((res) => {
      setPrices(res);
      if (res.length > 0) setSelectedCommodity(res[0]);
    });
    marketApi.getPriceAlerts().then(setAlerts);
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await marketApi.addPriceAlert({
      commodity: alertCommodity,
      targetPrice: parseFloat(alertTargetPrice) || 2400,
      condition: alertCondition,
    });
    setAlerts((prev) => [created, ...prev]);
    setIsAlertModalOpen(false);

    showToast({
      type: "success",
      title: "Price Alert Created",
      message: `You'll be notified when ${alertCommodity} goes ${alertCondition} ₹${alertTargetPrice}/Q.`,
    });
  };

  const handleToggleAlert = async (id: string) => {
    await marketApi.togglePriceAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleDeleteAlert = async (id: string) => {
    await marketApi.deletePriceAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast({
      type: "info",
      title: "Alert Removed",
      message: "Price alert deleted.",
    });
  };

  const filteredPrices = prices.filter(
    (p) =>
      p.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mandi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GlassBadge variant="success" size="sm" icon={<TrendingUp className="w-3.5 h-3.5" />}>
              Agmarknet & APMC Live Feeds
            </GlassBadge>
            <span className="text-xs text-foreground/50">
              Verified Daily Rates
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t("market.title")}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
            {t("market.subtitle")}
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          iconLeft={<Bell className="w-4 h-4" />}
          onClick={() => setIsAlertModalOpen(true)}
        >
          {t("market.createAlert")}
        </GlassButton>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <GlassInput
          placeholder={t("market.searchCommodity")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          iconLeft={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Grid: Mandi Rates Cards on Left, Price Trend Graph on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Mandi Rate Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filteredPrices.map((item) => {
            const isSelected = selectedCommodity?.id === item.id;
            const isPositive = item.priceChangePercent >= 0;

            return (
              <GlassCard
                key={item.id}
                hoverable
                onClick={() => setSelectedCommodity(item)}
                className={`p-4 sm:p-5 transition-all ${
                  isSelected
                    ? "border-emerald-600/70 dark:border-emerald-500/50 ring-2 ring-emerald-500/20 bg-white/85 dark:bg-[#0e1612]/85"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {item.commodity}
                      </h3>
                      <span className="text-xs text-foreground/50">
                        ({item.variety})
                      </span>
                    </div>
                    <p className="text-xs text-foreground/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {item.mandi}, {item.district}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-extrabold text-foreground">
                      ₹{item.modalPrice.toLocaleString("en-IN")}
                    </div>
                    <div
                      className={`text-xs font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                        isPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {item.priceChangePercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-foreground/60">
                  <span>
                    Range: ₹{item.minPrice} - ₹{item.maxPrice} / Q
                  </span>
                  <span className="text-[11px] text-foreground/45">
                    Updated: {item.date}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Right 5 cols: Selected Commodity 7-Day Trend Chart & Active Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {selectedCommodity && (
            <GlassChartContainer
              title={`${selectedCommodity.commodity} 7-Day Price Trend`}
              subtitle={`APMC Modal rates at ${selectedCommodity.mandi}`}
              height={260}
            >
              {/* CSS Liquid Bar Visualization */}
              <div className="h-full flex flex-col justify-between pt-2">
                <div className="h-44 flex items-end justify-between gap-2 px-2 border-b border-black/10 dark:border-white/10 pb-2">
                  {selectedCommodity.historicalTrend.map((pt, idx) => {
                    const minP = Math.min(...selectedCommodity.historicalTrend.map((x) => x.price)) * 0.95;
                    const maxP = Math.max(...selectedCommodity.historicalTrend.map((x) => x.price)) * 1.05;
                    const heightPercent = Math.round(((pt.price - minP) / (maxP - minP)) * 100);

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-1 group"
                      >
                        <span className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ₹{pt.price}
                        </span>
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-emerald-700 to-emerald-500 group-hover:from-emerald-600 group-hover:to-emerald-400 transition-all shadow-xs"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] text-foreground/50">
                          {pt.date.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-foreground/50 pt-1">
                  <span>Lowest: ₹{Math.min(...selectedCommodity.historicalTrend.map((x) => x.price))}</span>
                  <span>Highest: ₹{Math.max(...selectedCommodity.historicalTrend.map((x) => x.price))}</span>
                </div>
              </div>
            </GlassChartContainer>
          )}

          {/* User Price Alerts Section (Section 34) */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t("market.activeAlerts")}</span>
              </h3>
              <span className="text-xs text-foreground/50">
                {alerts.length} Configured
              </span>
            </div>

            <div className="space-y-2">
              {alerts.length === 0 ? (
                <div className="text-xs text-foreground/50 text-center py-4">
                  No active price alerts. Click &quot;Create Price Alert&quot; to set thresholds.
                </div>
              ) : (
                alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-foreground">
                        {alt.commodity}
                      </div>
                      <div className="text-[11px] text-foreground/60">
                        Alert when {alt.condition} ₹{alt.targetPrice} / Q
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAlert(alt.id)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition ${
                          alt.active
                            ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
                            : "bg-black/10 dark:bg-white/10 text-foreground/50"
                        }`}
                      >
                        {alt.active ? "Active" : "Paused"}
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alt.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                        aria-label="Delete alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Create Price Alert Modal (Section 34) */}
      <GlassModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title={t("market.alertTitle")}
        description="Receive instant SMS notifications when mandi transactions cross your price target."
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <GlassSelect
            label="Commodity"
            value={alertCommodity}
            onChange={(e) => setAlertCommodity(e.target.value)}
            options={[
              { value: "Wheat (गेहूं)", label: "Wheat (गेहूं)" },
              { value: "Mustard (सरसों)", label: "Mustard (सरसों)" },
              { value: "Basmati Paddy (धान)", label: "Basmati Paddy (धान)" },
              { value: "Potato (आलू)", label: "Potato (आलू)" },
            ]}
          />

          <GlassSelect
            label={t("market.alertCondition")}
            value={alertCondition}
            onChange={(e) => setAlertCondition(e.target.value as any)}
            options={[
              { value: "above", label: "Exceeds or goes Above Target" },
              { value: "below", label: "Drops Below Target" },
            ]}
          />

          <GlassInput
            label={t("market.targetPrice")}
            type="number"
            value={alertTargetPrice}
            onChange={(e) => setAlertTargetPrice(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAlertModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm">
              Activate Price Alert
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
