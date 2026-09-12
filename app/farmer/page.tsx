"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sun,
  CloudSun,
  CloudRain,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Stethoscope,
  Bot,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight,
  Flame,
  ShieldAlert,
  Plus,
  FileText,
  HelpCircle,
  RefreshCw,
  Tractor,
  Scale,
  QrCode,
  Ticket,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassProgress } from "@/components/glass/GlassBadge";
import { useSession } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { weatherApi, cropApi, alertApi, marketApi, procurementApi } from "@/lib/api";
import { WeatherData, Crop, AlertNotification, MarketPrice, Farm, ProcurementBooking } from "@/types";

interface DailyAction {
  id: string;
  title: string;
  reason: string;
  priority: "urgent" | "high" | "normal";
  recommendedTime: string;
  ctaText: string;
  ctaHref: string;
  isCompleted: boolean;
  category: "irrigation" | "pest" | "weather" | "market" | "scheme";
}

export default function FarmerDashboard() {
  const { user, activeFarm, farms, setActiveFarm } = useSession();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [marketSnapshot, setMarketSnapshot] = useState<MarketPrice[]>([]);
  const [procurementBooking, setProcurementBooking] = useState<ProcurementBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic daily actions based on active crops
  const [actions, setActions] = useState<DailyAction[]>([]);

  useEffect(() => {
    setIsLoading(true);

    // Fetch weather, crops, alerts, market snapshot, and active procurement booking via typed services
    Promise.all([
      weatherApi.getWeather(activeFarm?.district || "Lucknow"),
      cropApi.getCrops(activeFarm?.id),
      alertApi.getAlerts(),
      marketApi.getMarketPrices(),
      procurementApi.getActiveBooking(),
    ])
      .then(([weatherRes, cropsRes, alertsRes, marketRes, procRes]) => {
        setWeather(weatherRes);
        setProcurementBooking(procRes);

        // Check if there are user-created crops in localStorage from onboarding
        const localSavedCrops = localStorage.getItem("kisan_crops");
        let activeCrops = cropsRes;
        if (localSavedCrops) {
          try {
            const parsedLocal = JSON.parse(localSavedCrops);
            if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
              activeCrops = parsedLocal;
            }
          } catch (e) {}
        }
        setCrops(activeCrops);
        setAlerts(alertsRes);
        setMarketSnapshot(marketRes.slice(0, 3));

        // Generate tailored daily actions matching the farm's active crops
        const generatedActions: DailyAction[] = [];
        const hasWheat = activeCrops.some((c) => c.name.toLowerCase().includes("wheat") || c.name.includes("गेहूं"));
        const hasMustard = activeCrops.some((c) => c.name.toLowerCase().includes("mustard") || c.name.includes("सरसों"));

        if (hasMustard) {
          generatedActions.push({
            id: "act-aphid",
            title: "Inspect South Ridge for Mustard Aphid (माहो)",
            reason: "High relative humidity in morning hours elevates mustard aphid reproduction.",
            priority: "high",
            recommendedTime: "07:30 AM - 09:30 AM",
            ctaText: "Open Crop Doctor",
            ctaHref: "/farmer/crop-doctor",
            isCompleted: false,
            category: "pest",
          });
        }

        if (hasWheat) {
          generatedActions.push({
            id: "act-irrigation",
            title: "Hold Heavy Irrigation on Wheat Field",
            reason: "Regional forecast anticipates 10-15mm rain. Holding irrigation prevents root water-logging.",
            priority: "urgent",
            recommendedTime: "Throughout Day",
            ctaText: "Check Weather Outlook",
            ctaHref: "/farmer/weather",
            isCompleted: false,
            category: "weather",
          });
        }

        // Standard mandi check action
        generatedActions.push({
          id: "act-mandi",
          title: "Check Today's APMC Mandi Rates for Regional Produce",
          reason: "Modal prices for Rabi commodities updated this morning at 09:00 AM.",
          priority: "normal",
          recommendedTime: "Before 01:00 PM",
          ctaText: "View Mandi Rates",
          ctaHref: "/farmer/market",
          isCompleted: false,
          category: "market",
        });

        // Government Scheme verification
        generatedActions.push({
          id: "act-scheme",
          title: "Verify Aadhaar e-KYC for PM-KISAN Installment",
          reason: "Ensure bank account seeding for direct benefit transfer eligibility.",
          priority: "normal",
          recommendedTime: "Convenient Time",
          ctaText: "Review Scheme",
          ctaHref: "/farmer/schemes",
          isCompleted: true,
          category: "scheme",
        });

        setActions(generatedActions);
      })
      .catch((err) => {
        console.error("Dashboard initial load failed", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeFarm]);

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const updated = !act.isCompleted;
          if (updated) {
            showToast({
              type: "success",
              title: "Action Recorded",
              message: `"${act.title}" updated in farm log.`,
            });
          }
          return { ...act, isCompleted: updated };
        }
        return act;
      })
    );
  };

  // Dynamic greeting based on time of day
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? t("dashboard.goodMorning")
      : currentHour < 17
      ? t("dashboard.goodAfternoon")
      : t("dashboard.goodEvening");

  const completedCount = actions.filter((a) => a.isCompleted).length;

  // Empty dashboard state check (Section 42)
  const isDashboardEmpty = !activeFarm && farms.length === 0;

  if (isDashboardEmpty) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center animate-in fade-in">
        <GlassCard className="p-8 sm:p-12 max-w-2xl text-center flex flex-col items-center gap-6 border-emerald-500/20 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Tractor className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Your farm intelligence is getting ready.
            </h2>
            <p className="text-sm text-foreground/65 mt-2 leading-relaxed max-w-md mx-auto">
              Once your farm data is connected, Kisan Setu will organize your weather, crops, soil, and market insights here.
            </p>
          </div>

          {/* Action buttons as specified in Section 42 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-2">
            <Link href="/farmer/farm">
              <GlassButton variant="primary" size="sm" className="w-full text-xs">
                Add Farm
              </GlassButton>
            </Link>
            <Link href="/farmer/crops">
              <GlassButton variant="secondary" size="sm" className="w-full text-xs">
                Add Crop
              </GlassButton>
            </Link>
            <Link href="/farmer/soil">
              <GlassButton variant="secondary" size="sm" className="w-full text-xs">
                Upload Soil Report
              </GlassButton>
            </Link>
            <Link href="/farmer/ai">
              <GlassButton variant="secondary" size="sm" className="w-full text-xs">
                Ask Kisan AI
              </GlassButton>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Top Banner: Greeting, Farm Selector & Quick Weather (Section 41) */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white shadow-xl overflow-hidden">
        {/* Decorative background sun icon */}
        <div className="absolute right-0 bottom-0 w-80 h-80 opacity-10 pointer-events-none">
          <Sun className="w-full h-full" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Farm Selector Dropdown */}
              {farms.length > 1 ? (
                <select
                  value={activeFarm?.id}
                  onChange={(e) => {
                    const selected = farms.find((f) => f.id === e.target.value);
                    if (selected) setActiveFarm(selected);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-white border border-white/20 outline-none cursor-pointer"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id} className="text-foreground bg-white">
                      {f.name} ({f.acres} Acres)
                    </option>
                  ))}
                </select>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                  {activeFarm?.name || "Active Holding"}
                </span>
              )}

              <span className="text-emerald-200 text-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {activeFarm?.location || `${activeFarm?.district}, ${activeFarm?.state}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {greeting},{" "}
              <span className="text-emerald-300">
                {user?.name ? user.name.split(" ")[0] : "Farmer"}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
              {weather?.farmingRecommendation ||
                "Seasonal weather advisory active. Micro-climate station sync operational."}
            </p>
          </div>

          {/* Quick Weather Snapshot Pill */}
          {weather && (
            <div className="shrink-0 flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15">
              <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-300">
                <Sun className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl font-black leading-none">
                  {weather.currentTemp}°C
                </div>
                <div className="text-xs text-emerald-100 font-medium mt-1">
                  {weather.condition} • Humidity {weather.humidity}%
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-0.5">
                  Rain: {weather.rainProbabilityPercent}% chance • Wind {weather.windSpeedKmH} km/h
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SMART PROCUREMENT PRIMARY SPOTLIGHT (SIH CORE FEATURE) */}
      <section className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-500/15 via-white/80 dark:via-[#0e1712]/80 to-emerald-500/10 border-2 border-emerald-500/40 backdrop-blur-xl shadow-[0_12px_36px_rgba(16,185,129,0.1)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Scale className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  ⭐ PRIMARY CORE FEATURE
                </span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  &ldquo;Arrive with certainty.&rdquo;
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                Smart Procurement & Live Mandi Queue
              </h3>
              <p className="text-xs text-foreground/70 mt-0.5 max-w-xl">
                Zero waiting uncertainty: Reserve digital intake slots, receive biometric QR token passes, and track live weighbridge queue call times in real-time.
              </p>
            </div>
          </div>

          {/* Quick Token & Status Snippet */}
          <div className="flex flex-wrap items-center gap-3">
            {procurementBooking ? (
              <div className="flex items-center gap-3 p-2.5 px-3.5 rounded-2xl bg-white/90 dark:bg-[#131e18] border border-black/10 dark:border-white/10 shadow-xs">
                <div className="text-right">
                  <span className="text-[10px] text-foreground/50 uppercase font-bold block">
                    Active Token
                  </span>
                  <span className="font-mono font-black text-base text-emerald-700 dark:text-emerald-400">
                    {procurementBooking.tokenNumber}
                  </span>
                </div>
                <div className="h-7 w-px bg-black/10 dark:bg-white/10" />
                <div>
                  <span className="text-[10px] text-foreground/50 uppercase font-bold block">
                    Queue Wait
                  </span>
                  <span className="font-bold text-xs text-foreground">
                    ~{procurementBooking.estimatedWaitMinutes}m ({procurementBooking.queuePosition} ahead)
                  </span>
                </div>
              </div>
            ) : null}

            <Link href="/farmer/procurement">
              <GlassButton
                variant="primary"
                size="md"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Enter Smart Procurement
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Action Shortcuts Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/farmer/crop-doctor" className="block">
          <GlassCard
            hoverable
            className="p-3.5 sm:p-4 flex items-center gap-3 border-rose-500/20 dark:border-rose-500/10"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {t("dashboard.diagnoseCrop")}
              </h4>
              <p className="text-[10px] text-foreground/50 truncate">
                Instant leaf AI scan
              </p>
            </div>
          </GlassCard>
        </Link>

        <Link href="/farmer/ai" className="block">
          <GlassCard
            hoverable
            className="p-3.5 sm:p-4 flex items-center gap-3 border-emerald-500/20 dark:border-emerald-500/10"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {t("dashboard.askAI")}
              </h4>
              <p className="text-[10px] text-foreground/50 truncate">
                Voice & chat advisory
              </p>
            </div>
          </GlassCard>
        </Link>

        <Link href="/farmer/market" className="block">
          <GlassCard
            hoverable
            className="p-3.5 sm:p-4 flex items-center gap-3 border-amber-500/20 dark:border-amber-500/10"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {t("dashboard.checkPrices")}
              </h4>
              <p className="text-[10px] text-foreground/50 truncate">
                Live APMC mandi rates
              </p>
            </div>
          </GlassCard>
        </Link>

        <Link href="/farmer/journal" className="block">
          <GlassCard
            hoverable
            className="p-3.5 sm:p-4 flex items-center gap-3 border-sky-500/20 dark:border-sky-500/10"
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {t("dashboard.recordJournal")}
              </h4>
              <p className="text-[10px] text-foreground/50 truncate">
                Log spray or irrigation
              </p>
            </div>
          </GlassCard>
        </Link>
      </section>

      {/* Main Grid: "What should I do today?" + Farm Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: "What should I do today?" */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                  {t("dashboard.todayActions")}
                </h2>
                <GlassBadge variant="success" size="sm">
                  {completedCount}/{actions.length} Completed
                </GlassBadge>
              </div>
              <p className="text-xs text-foreground/60 mt-0.5">
                {t("dashboard.actionSubtitle")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {actions.map((action) => (
              <GlassCard
                key={action.id}
                className={`p-4 sm:p-5 transition-all duration-200 ${
                  action.isCompleted
                    ? "opacity-60 bg-white/40 dark:bg-[#0c1410]/40"
                    : "border-l-4 " +
                      (action.priority === "urgent"
                        ? "border-l-rose-500"
                        : action.priority === "high"
                        ? "border-l-amber-500"
                        : "border-l-emerald-600")
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleAction(action.id)}
                      className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                        action.isCompleted
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "border-2 border-black/20 dark:border-white/20 hover:border-emerald-600 text-transparent"
                      }`}
                      aria-label="Toggle action completion status"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-sm font-bold text-foreground leading-snug ${
                            action.isCompleted ? "line-through text-foreground/50" : ""
                          }`}
                        >
                          {action.title}
                        </h3>

                        <GlassBadge
                          variant={
                            action.priority === "urgent"
                              ? "danger"
                              : action.priority === "high"
                              ? "warning"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {action.priority.toUpperCase()}
                        </GlassBadge>
                      </div>

                      <p className="text-xs text-foreground/65 mt-1 leading-relaxed">
                        {action.reason}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground/50">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-foreground/40" />
                          {action.recommendedTime}
                        </span>

                        <Link
                          href={action.ctaHref}
                          className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>{action.ctaText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Market Snapshot Preview Card */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-foreground">Nearby APMC Mandi Rates</h3>
              </div>
              <Link
                href="/farmer/market"
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                View Full Mandi Board →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {marketSnapshot.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground truncate">{m.commodity}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        m.priceChangePercent > 0
                          ? "text-emerald-600"
                          : m.priceChangePercent < 0
                          ? "text-rose-600"
                          : "text-foreground/50"
                      }`}
                    >
                      {m.priceChangePercent > 0
                        ? `▲ +${m.priceChangePercent}%`
                        : m.priceChangePercent < 0
                        ? `▼ ${m.priceChangePercent}%`
                        : "— Stable"}
                    </span>
                  </div>
                  <div className="text-base font-black text-foreground mt-1">
                    ₹{m.modalPrice.toLocaleString("en-IN")}{" "}
                    <span className="text-[10px] font-normal text-foreground/50">/ {m.unit}</span>
                  </div>
                  <div className="text-[10px] text-foreground/50 truncate mt-0.5">
                    {m.mandi}, {m.district}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Right Col: Farm Health Overview & Active Crops */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              {t("dashboard.farmHealth")}
            </h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Live index calculated across 5 field parameters.
            </p>
          </div>

          <GlassCard className="p-6 flex flex-col gap-6 border-emerald-500/20">
            {/* Health Score Large Visualization */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  {t("dashboard.scoreLabel")}
                </span>
                <div className="text-4xl font-black text-emerald-950 dark:text-emerald-200 mt-1">
                  {activeFarm?.healthScore || 85}
                  <span className="text-lg font-normal text-foreground/50">/100</span>
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mt-1">
                  Optimal Condition (उत्कृष्ट स्थिति)
                </div>
              </div>

              <div className="w-16 h-16 rounded-full bg-emerald-700 dark:bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            {/* Parameter Breakdowns */}
            <div className="space-y-3.5">
              <GlassProgress
                label={`${t("dashboard.cropHealth")} (Leaf Vigour)`}
                value={90}
                color="emerald"
              />
              <GlassProgress
                label={`${t("dashboard.soilHealth")} (NPK Balance)`}
                value={82}
                color="emerald"
              />
              <GlassProgress
                label={`${t("dashboard.waterStatus")} (Moisture Index)`}
                value={78}
                color="emerald"
              />
              <GlassProgress
                label={`${t("dashboard.weatherRisk")} (Rain & Frost)`}
                value={35}
                color="amber"
              />
              <GlassProgress
                label={`${t("dashboard.pestRisk")} (Vigilance Alert)`}
                value={25}
                color="emerald"
              />
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-foreground/50">
              <span>Updated: Today 08:30 AM</span>
              <Link
                href="/farmer/farm"
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Farm Analytics →
              </Link>
            </div>
          </GlassCard>

          {/* Active Crops Quick Card */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Active Crops</h3>
              <Link
                href="/farmer/crops"
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                View All ({crops.length})
              </Link>
            </div>

            <div className="space-y-2">
              {crops.length > 0 ? (
                crops.slice(0, 3).map((crop) => (
                  <Link
                    key={crop.id}
                    href="/farmer/crops"
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/10 transition group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                        {crop.name}
                      </h4>
                      <p className="text-[10px] text-foreground/50">
                        Stage: {crop.currentStage} • {crop.areaAcres} Acres
                      </p>
                    </div>
                    <GlassBadge variant="success" size="sm">
                      {crop.health}
                    </GlassBadge>
                  </Link>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-black/10 dark:border-white/10 text-center text-xs text-foreground/50">
                  No crops registered yet.{" "}
                  <Link href="/farmer/crops" className="text-emerald-600 font-bold hover:underline">
                    Add crop
                  </Link>
                </div>
              )}
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
