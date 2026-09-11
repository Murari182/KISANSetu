"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Bot,
  CloudSun,
  TrendingUp,
  Landmark,
  Layers,
  UserCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  Droplets,
  Award,
  Globe,
  Lock,
  Phone,
  HelpCircle,
  Clock,
} from "lucide-react";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { FirstVisitLanguageSelection } from "@/components/home/FirstVisitLanguageSelection";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { useTranslation } from "@/lib/i18n";

export default function HomePage() {
  const { t, hasChosenLanguage, isRTL } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // First Visit Experience: Show Language Selection immediately before the home page
  if (mounted && !hasChosenLanguage) {
    return <FirstVisitLanguageSelection />;
  }

  return (
    <div className="w-full min-h-[100dvh] flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Public Floating Navigation Bar */}
      <HomeNavbar />

      {/* =========================================================================
          HERO SECTION (80–100vh Viewport Coverage) - Section 7, 8, 9, 10
          ========================================================================= */}
      <section
        id="hero"
        className="relative w-full min-h-[92dvh] lg:min-h-[100dvh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-10 overflow-hidden"
      >
        {/* Cinematic Indian Farmland Landscape Background with Fog / Sunlight layers */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle photographic agricultural depth */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.08] dark:opacity-[0.05] scale-105 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop')",
            }}
          />
          {/* Rich morning light gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-background/80 to-background" />
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-radial from-amber-400/15 via-emerald-500/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[900px] h-[900px] bg-radial from-emerald-600/15 via-emerald-900/5 to-transparent blur-3xl rounded-full" />
        </div>

        {/* Hero Content Canvas */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-8">
          {/* Left Column: Heading, Manifesto, CTAs & Quick Badges */}
          <div className="flex-1 max-w-3xl flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <GlassBadge
                variant="success"
                size="md"
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Agricultural Operating System
              </GlassBadge>
              <span className="text-xs text-foreground/60 font-medium">
                National Digital Farming Platform
              </span>
            </div>

            {/* Main Manifesto Heading (Section 8) */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-foreground leading-[1.08]">
              Your Farm. <br />
              Your Data. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-200">
                Your Decisions.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-foreground/75 leading-relaxed font-normal max-w-2xl">
              Kisan Setu brings AI-powered agricultural intelligence, crop guidance,
              weather insights, market information and government support together in one
              simple platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/register">
                <GlassButton
                  variant="primary"
                  size="lg"
                  iconRight={
                    isRTL ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )
                  }
                >
                  Get Started
                </GlassButton>
              </Link>

              <a href="#features">
                <GlassButton variant="secondary" size="lg">
                  Explore Kisan Setu
                </GlassButton>
              </a>
            </div>

            {/* Quick Hero Features Pills (Section 10) */}
            <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              {[
                { icon: "🌱", label: "Crop Intelligence" },
                { icon: "🌦️", label: "Weather" },
                { icon: "🧪", label: "Soil Health" },
                { icon: "📈", label: "Market Prices" },
                { icon: "🤖", label: "Kisan AI" },
              ].map((feat) => (
                <div
                  key={feat.label}
                  className="px-3.5 py-1.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 text-xs font-semibold text-foreground/80 flex items-center gap-1.5 shadow-xs"
                >
                  <span>{feat.icon}</span>
                  <span>{feat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Floating Liquid Glass AI Card (Section 9) */}
          <div className="flex-1 max-w-xl w-full">
            <GlassCard
              variant="glow"
              className="p-6 sm:p-8 relative overflow-hidden border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl"
            >
              {/* Card top specular shine */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Kisan AI</h3>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                      Live Agro-Advisory
                    </span>
                  </div>
                </div>

                <GlassBadge variant="success" size="sm">
                  Active Assistant
                </GlassBadge>
              </div>

              {/* Advisory Dialogue Box (Section 9) */}
              <div className="p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs sm:text-sm text-foreground/85 leading-relaxed space-y-2">
                <div className="font-bold text-foreground">Good morning 👋</div>
                <p>
                  Rain is expected tomorrow. Based on your farm conditions, you may
                  want to review today&apos;s irrigation plan.
                </p>
                <div className="pt-2 text-[11px] text-foreground/50 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Calculated for Lucknow Shivalik Holding</span>
                </div>
              </div>

              {/* Action Buttons inside AI card */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link href="/farmer">
                  <GlassButton variant="primary" size="sm">
                    View Recommendation
                  </GlassButton>
                </Link>
                <Link href="/farmer/ai">
                  <GlassButton variant="secondary" size="sm">
                    Ask Kisan AI
                  </GlassButton>
                </Link>
              </div>

              {/* Disclaimers */}
              <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 text-[10px] text-foreground/45">
                UI illustration based on certified agronomic models. Actual advice adapts
                to your farm data upon connection.
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          "WHAT WE OFFER" — 8 PRECISION MODULES (Section 11 to 19)
          ========================================================================= */}
      <section
        id="features"
        className="w-full py-20 px-4 sm:px-6 lg:px-10 border-t border-black/5 dark:border-white/5"
      >
        <div className="w-full max-w-[1720px] mx-auto space-y-12">
          {/* Section Heading */}
          <div className="max-w-3xl space-y-3">
            <GlassBadge variant="success" size="sm">
              Comprehensive Platform Capabilities
            </GlassBadge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Everything Your Farm Needs. <br />
              In One Place.
            </h2>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              From sowing to harvest, Kisan Setu helps farmers make better decisions at
              every stage.
            </p>
          </div>

          {/* 8 Feature Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Feature 1: Crop Intelligence (Section 12) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Know Your Crop Better
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  Monitor crop health, botanical growth stages, disease vulnerabilities,
                  and scheduled operations.
                </p>
                <div className="space-y-1.5 text-xs text-foreground/75">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>7-stage crop lifecycle timeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pest & disease risk alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phenological stage guidance</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/crops"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Crop Intelligence</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Feature 2: Crop Doctor (Section 13) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Identify Crop Problems Early
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  Upload a crop image and let Kisan Setu&apos;s computer vision identify
                  potential leaf diseases with actionable guidance.
                </p>
                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-[11px] space-y-1 text-foreground/70">
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Leaf Blight Detection</span>
                    <span className="text-emerald-700 dark:text-emerald-400">92%</span>
                  </div>
                  <div>Severity: Moderate • Action: Neem spray</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/crop-doctor"
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>Launch Crop Doctor</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Feature 3: Kisan AI (Section 14) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Your Agricultural Assistant
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  Ask questions about crops, soil, weather, mandi rates, and farming
                  practices in your preferred regional language.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5">
                    Voice Input
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5">
                    12 Languages
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5">
                    Photo Attach
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/ai"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Meet Kisan AI</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Feature 4: Weather Intelligence (Section 15) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                  <CloudSun className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Weather & Field Advisory
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  Don&apos;t just view temperature. Understand exactly what rain, wind, and
                  humidity mean for your spraying and irrigation.
                </p>
                <div className="space-y-1.5 text-xs text-foreground/75">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Spraying safety window</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rain delay irrigation advice</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/weather"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View Weather Insights</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Feature 5: Soil Intelligence (Section 16) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Understand Your Soil
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  Track N-P-K nutrient levels, pH reaction, and organic carbon to avoid
                  over-fertilization and maximize yields.
                </p>
                <div className="space-y-1 text-xs text-foreground/70">
                  <div>• Soil Health Card upload (PDF / JPG)</div>
                  <div>• Custom dosage recommendations</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/soil"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Check Soil Health</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Feature 6: Market Intelligence (Section 17) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Know Your Market
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  Compare modal rates across nearby APMC mandis and set price threshold
                  alerts via SMS.
                </p>
                <div className="space-y-1 text-xs text-foreground/70">
                  <div>• Agmarknet verified price trends</div>
                  <div>• Custom SMS price alert triggers</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/market"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Mandi Prices</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Feature 7: Government Schemes (Section 18) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Government Support
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  Discover central and state agricultural welfare schemes with verified
                  eligibility checklists and direct application portals.
                </p>
                <div className="space-y-1 text-xs text-foreground/70">
                  <div>• PM-KISAN, PMFBY, Micro-irrigation</div>
                  <div>• Required documents checklist</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/schemes"
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore Schemes</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Feature 8: Expert Support (Section 19) */}
            <GlassCard hoverable className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Certified Human Experts
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed mb-4">
                  When you need a second opinion, book 1-on-1 consultations with verified
                  ICAR agronomists and plant pathologists.
                </p>
                <div className="space-y-1 text-xs text-foreground/70">
                  <div>• AI guidance + Human expert validation</div>
                  <div>• Video, audio, and photo reviews</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <Link
                  href="/farmer/experts"
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <span>Consult an Agronomist</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          "HOW KISAN SETU WORKS" — FROM QUESTION TO ACTION (Section 20)
          ========================================================================= */}
      <section
        id="how-it-works"
        className="w-full py-20 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-transparent via-black/[0.015] to-transparent border-t border-black/5 dark:border-white/5"
      >
        <div className="w-full max-w-[1720px] mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <GlassBadge variant="neutral" size="sm">
              Simple 4-Step Process
            </GlassBadge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              From Question to Action
            </h2>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              How Kisan Setu transforms raw agricultural data into confident field
              decisions.
            </p>
          </div>

          {/* Progressive Timeline Grid (Horizontal Desktop, Vertical Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Create Your Farm Profile",
                description: "Tell Kisan Setu about your land boundaries, soil type, and active crops.",
              },
              {
                step: "02",
                title: "Connect Your Farm Data",
                description: "Hyperlocal weather stations, soil health cards, and nearby APMC mandis link automatically.",
              },
              {
                step: "03",
                title: "Get Intelligent Guidance",
                description: "AI and agricultural models synthesize weather, crop stage, and soil moisture into clear action items.",
              },
              {
                step: "04",
                title: "Take Better Decisions",
                description: "Spray on time, irrigate accurately, apply for subsidies, and sell at the highest market rate.",
              },
            ].map((item, idx) => (
              <GlassCard key={item.step} className="p-6 relative overflow-hidden">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600/30 dark:text-emerald-400/20 block mb-3 font-mono">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-foreground/65 leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          "WHY KISAN SETU" — 5 CORE PILLARS (Section 21)
          ========================================================================= */}
      <section
        id="why-kisan-setu"
        className="w-full py-20 px-4 sm:px-6 lg:px-10 border-t border-black/5 dark:border-white/5"
      >
        <div className="w-full max-w-[1720px] mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <GlassBadge variant="success" size="sm">
              The Kisan Setu Difference
            </GlassBadge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Why Indian Farmers Trust Kisan Setu
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                title: "One Platform",
                desc: "Crops, weather, soil, mandis, and schemes united without juggling separate apps.",
              },
              {
                title: "Local Language",
                desc: "Designed from ground up in 12 regional languages with voice accessibility.",
              },
              {
                title: "AI + Human Expertise",
                desc: "Computer vision backed by university agronomists for verified trust.",
              },
              {
                title: "Actionable Insights",
                desc: "Not endless raw numbers. Specific 'What should I do today?' recommendations.",
              },
              {
                title: "Farmer First",
                desc: "Engineered for low-end devices, poor connectivity, and offline persistence.",
              },
            ].map((pillar, idx) => (
              <GlassCard key={idx} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-foreground/65 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRUST & DATA TRANSPARENCY (Section 22)
          ========================================================================= */}
      <section
        id="trust"
        className="w-full py-16 px-4 sm:px-6 lg:px-10 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5"
      >
        <div className="w-full max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                Farmer Data Sovereignty
              </h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Your farm boundaries and revenue records remain private and encrypted.
                We never sell farmer land data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                Transparent Advisory
              </h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                All AI suggestions disclose scientific confidence levels and reference
                ICAR and State Agricultural University research.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                National Coverage
              </h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Integrated with 14,800+ APMC mandis and IMD weather stations spanning all
                28 States and Union Territories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL IMMERSIVE CTA (Section 23)
          ========================================================================= */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-10 border-t border-black/5 dark:border-white/5">
        <div className="w-full max-w-[1720px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 bg-gradient-to-tr from-emerald-900 via-emerald-800 to-emerald-950 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Your Farm Deserves <br />
                Better Decisions.
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
                Join over 2.4 million Indian farmers growing smarter with Kisan Setu.
                Start free in your regional language.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/register">
                <GlassButton
                  variant="secondary"
                  size="lg"
                  className="bg-white text-emerald-950 font-bold hover:bg-emerald-50 shadow-lg"
                  iconRight={
                    isRTL ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )
                  }
                >
                  Get Started Free
                </GlassButton>
              </Link>
              <Link href="/login">
                <GlassButton
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Sign In
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FULL-WIDTH RESPONSIVE FOOTER (Section 24)
          ========================================================================= */}
      <footer className="w-full pt-16 pb-12 px-4 sm:px-6 lg:px-10 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-black/20">
        <div className="w-full max-w-[1720px] mx-auto flex flex-col gap-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tight text-foreground">
                  KISAN SETU
                </span>
              </div>
              <p className="text-xs text-foreground/60 max-w-sm leading-relaxed">
                Technology that connects every farmer to a better harvest. Empowering
                Indian agriculture with verified intelligence and human expertise.
              </p>
              <div className="text-[11px] text-foreground/50">
                Government of India Digital Agriculture Initiative Alignment
              </div>
            </div>

            {/* Platform links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-foreground/70">
                <li>
                  <Link href="/farmer/crops" className="hover:text-foreground">
                    Crop Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/farmer/crop-doctor" className="hover:text-foreground">
                    Crop Doctor ML
                  </Link>
                </li>
                <li>
                  <Link href="/farmer/ai" className="hover:text-foreground">
                    Kisan AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/farmer/weather" className="hover:text-foreground">
                    Weather Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/farmer/market" className="hover:text-foreground">
                    Mandi Rates
                  </Link>
                </li>
                <li>
                  <Link href="/farmer/schemes" className="hover:text-foreground">
                    Government Schemes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Portals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Workspaces
              </h4>
              <ul className="space-y-2 text-xs text-foreground/70">
                <li>
                  <Link href="/farmer" className="hover:text-foreground">
                    Farmer Portal
                  </Link>
                </li>
                <li>
                  <Link href="/expert" className="hover:text-foreground">
                    Agricultural Expert Portal
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-foreground">
                    Administrator Command
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground">
                    Farmer Registration
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground">
                    Account Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Languages */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Languages & Trust
              </h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Available in English, हिन्दी, తెలుగు, मराठी, தமிழ், ಕನ್ನಡ, বাংলা, ગુજરાતી,
                ਪੰਜਾਬੀ, മലയാളം, ଓଡ଼ିଆ, and اردو with RTL support.
              </p>
              <div className="pt-2 text-xs text-foreground/60 space-x-3">
                <a href="#trust" className="hover:text-foreground">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="#trust" className="hover:text-foreground">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/50">
            <div>
              © 2026 Kisan Setu Digital Agriculture Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Made with pride for Indian Farmers 🌾</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
