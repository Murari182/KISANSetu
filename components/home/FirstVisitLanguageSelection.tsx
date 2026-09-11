"use client";

import React, { useState } from "react";
import { Sprout, Check, ArrowRight, ArrowLeft, Globe, Sparkles, X } from "lucide-react";
import { SUPPORTED_LANGUAGES, LanguageInfo } from "@/lib/i18n/languages";
import { useTranslation } from "@/lib/i18n";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassBadge } from "@/components/glass/GlassBadge";

interface FirstVisitLanguageSelectionProps {
  onContinue?: () => void;
}

export const FirstVisitLanguageSelection: React.FC<FirstVisitLanguageSelectionProps> = ({
  onContinue,
}) => {
  const { language, setLanguage, confirmLanguageSelection, hasChosenLanguage, t, isRTL } = useTranslation();
  const [selectedCode, setSelectedCode] = useState<string>(language || "en");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (code: string) => {
    setSelectedCode(code);
    // Instant preview so titles/labels dynamically update to the chosen language
    setLanguage(code);
  };

  const handleConfirm = () => {
    if (!selectedCode) return;
    setIsSubmitting(true);
    setTimeout(() => {
      confirmLanguageSelection(selectedCode);
      if (onContinue) onContinue();
    }, 200);
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`w-full min-h-[100dvh] flex flex-col justify-between items-center bg-[#fbfcf9] text-[#122017] relative z-20 py-8 px-4 sm:px-6 lg:px-10 overflow-x-hidden select-none outline-none ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Subtle organic morning glow mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-radial from-emerald-500/10 via-amber-400/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[650px] h-[650px] bg-radial from-emerald-600/10 via-emerald-800/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Top Header: Kisan Setu Agricultural Brand Identity */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-emerald-600 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(21,128,61,0.25)]">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#122017] flex items-center gap-1.5 leading-none">
              <span>KISAN SETU</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-emerald-700 mt-1 uppercase">
              Smart Agriculture. Better Decisions.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Globe className="w-3.5 h-3.5" />
            <span>12 Indian Languages</span>
          </div>

          {hasChosenLanguage && onContinue && (
            <button
              onClick={onContinue}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#122017]/70 hover:text-[#122017] transition-colors"
              aria-label="Close language selection"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Centerpiece: Language Selection Canvas */}
      <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-900 border border-emerald-500/20 text-xs font-bold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>भाषा चयन • Language Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#122017] leading-tight max-w-2xl">
          {t("language.title") || "Choose Your Language"}
        </h1>

        <p className="text-sm sm:text-base text-[#122017]/70 mt-2 max-w-xl font-normal leading-relaxed">
          {t("language.subtitle") || "Select your preferred language to explore Kisan Setu."}
        </p>

        {/* 12 Indian Languages Grid (Touch-friendly, responsive) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
          {SUPPORTED_LANGUAGES.map((lang: LanguageInfo) => {
            const isSelected = selectedCode === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between h-24 sm:h-28 group ${
                  isSelected
                    ? "bg-white text-emerald-950 border-2 border-emerald-600 shadow-[0_8px_24px_rgba(21,128,61,0.18)] ring-4 ring-emerald-600/10 scale-[1.02]"
                    : "bg-white/80 hover:bg-white text-[#122017] border border-black/10 hover:border-emerald-500/40 shadow-xs hover:shadow-md"
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between w-full">
                  <span
                    className={`text-xl sm:text-2xl font-black leading-tight ${
                      isSelected ? "text-emerald-800" : "text-[#122017] group-hover:text-emerald-700"
                    }`}
                  >
                    {lang.nativeName}
                  </span>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "border border-black/20 group-hover:border-emerald-500 text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div className="flex items-center justify-between w-full text-xs font-semibold text-[#122017]/55">
                  <span>{lang.name}</span>
                  {lang.direction === "rtl" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-black/5 text-foreground/70 font-mono">
                      RTL
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button: Continue */}
        <div className="mt-10 flex flex-col items-center gap-3 w-full sm:w-auto">
          <GlassButton
            variant="primary"
            size="lg"
            disabled={!selectedCode || isSubmitting}
            loading={isSubmitting}
            onClick={handleConfirm}
            className="w-full sm:w-auto sm:px-14 py-4 text-base font-bold shadow-[0_10px_30px_rgba(21,94,56,0.3)] hover:shadow-[0_14px_36px_rgba(21,94,56,0.4)] transition-all"
            iconRight={
              isRTL ? (
                <ArrowLeft className="w-4 h-4 mr-1" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-1" />
              )
            }
          >
            {t("language.continue") || "Continue"}
          </GlassButton>

          <span className="text-xs text-[#122017]/50 font-medium">
            {t("language.prompt") || "You can change your language anytime from the menu."}
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto pt-4 border-t border-black/5 text-center text-xs text-[#122017]/50">
        KISAN SETU • National Digital Agriculture Platform for Indian Farmers
      </footer>
    </main>
  );
};
