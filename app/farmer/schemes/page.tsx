"use client";

import React, { useState, useEffect } from "react";
import {
  Landmark,
  Search,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Calendar,
  Layers,
  Sparkles,
  Share2,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassTabs } from "@/components/glass/GlassAlert";
import { GlassModal } from "@/components/glass/GlassModal";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/lib/toast";
import { schemeApi } from "@/lib/api";
import { GovernmentScheme } from "@/types";

export default function SchemesPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    schemeApi.getSchemes().then(setSchemes);
  }, []);

  const handleToggleSave = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const isSaved = await schemeApi.toggleSaveScheme(id);
    setSchemes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isSaved } : s))
    );
    if (selectedScheme?.id === id) {
      setSelectedScheme((prev) => (prev ? { ...prev, isSaved } : null));
    }

    showToast({
      type: "success",
      title: isSaved ? "Scheme Bookmarked" : "Bookmark Removed",
      message: isSaved
        ? "Scheme saved to your profile for quick access."
        : "Scheme unbookmarked.",
    });
  };

  const categories = [
    { id: "all", label: "All Schemes" },
    { id: "Financial Support", label: "Financial Aid" },
    { id: "Insurance", label: "Crop Insurance" },
    { id: "Irrigation", label: "Micro Irrigation" },
    { id: "Input Subsidy", label: "Soil & Seeds" },
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = activeCategory === "all" || s.category === activeCategory;
    const matchesQuery =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GlassBadge variant="info" size="sm" icon={<Landmark className="w-3.5 h-3.5" />}>
            Verified Central & State Programs
          </GlassBadge>
          <span className="text-xs text-foreground/50">
            Direct Benefit Transfer (DBT) Ready
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("schemes.title")}
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
          {t("schemes.subtitle")}
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <GlassTabs
          tabs={categories}
          activeTab={activeCategory}
          onChange={setActiveCategory}
        />
        <div className="w-full sm:w-72">
          <GlassInput
            placeholder={t("schemes.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => (
          <GlassCard
            key={scheme.id}
            hoverable
            onClick={() => setSelectedScheme(scheme)}
            className="p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <GlassBadge variant="info" size="sm">
                  {scheme.category}
                </GlassBadge>

                <button
                  onClick={(e) => handleToggleSave(scheme.id, e)}
                  className={`p-2 rounded-xl transition ${
                    scheme.isSaved
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                      : "text-foreground/40 hover:text-foreground hover:bg-black/5"
                  }`}
                  aria-label="Save scheme"
                >
                  <Bookmark
                    className="w-4 h-4"
                    fill={scheme.isSaved ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <h3 className="text-base font-bold text-foreground leading-snug">
                {scheme.title}
              </h3>
              <p className="text-[11px] text-foreground/50 mt-0.5">
                {scheme.ministry}
              </p>

              <p className="text-xs text-foreground/75 mt-3 line-clamp-3 leading-relaxed">
                {scheme.summary}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="text-[11px] text-foreground/50 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {scheme.deadline}
              </span>

              <span className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                View Guidelines →
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Scheme Detail Modal (Section 36) */}
      {selectedScheme && (
        <GlassModal
          isOpen={!!selectedScheme}
          onClose={() => setSelectedScheme(null)}
          title={selectedScheme.title}
          description={selectedScheme.ministry}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Overview / Benefits */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider text-[11px] mb-1">
                {t("schemes.benefits")}
              </h4>
              <p className="text-foreground/80 leading-relaxed">
                {selectedScheme.benefits}
              </p>
            </div>

            {/* Verified Eligibility Criteria */}
            <div>
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t("schemes.eligibility")}</span>
              </h4>
              <ul className="space-y-1.5">
                {selectedScheme.eligibility.map((el, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-foreground/80 flex items-start gap-2"
                  >
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div>
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{t("schemes.requiredDocs")}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedScheme.requiredDocuments.map((doc, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 font-medium text-foreground/80"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleToggleSave(selectedScheme.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70 hover:text-foreground"
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={selectedScheme.isSaved ? "currentColor" : "none"}
                />
                <span>
                  {selectedScheme.isSaved
                    ? t("schemes.saved")
                    : t("schemes.saveScheme")}
                </span>
              </button>

              <a
                href={selectedScheme.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlassButton
                  variant="primary"
                  size="sm"
                  iconRight={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  {t("schemes.applyExternal")}
                </GlassButton>
              </a>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
}
