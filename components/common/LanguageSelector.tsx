"use client";

import React, { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

export const LanguageSelector: React.FC<{ variant?: "compact" | "full" }> = ({
  variant = "compact",
}) => {
  const { language, setLanguage, languageInfo, openLanguageModal } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/15 backdrop-blur-md border border-black/10 dark:border-white/10 text-xs font-semibold text-foreground transition-all shadow-xs"
        aria-label="Change language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>{languageInfo.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-foreground/50 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white/95 dark:bg-[#101914]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl p-2 z-50 animate-in zoom-in-95 duration-150">
            <div className="px-3 py-2 text-[11px] font-bold text-foreground/50 uppercase tracking-wider border-b border-black/5 dark:border-white/5">
              Select Language / भाषा चुनें
            </div>
            <div className="max-h-64 overflow-y-auto p-1 space-y-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                      isSelected
                        ? "bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 font-semibold"
                        : "text-foreground hover:bg-black/5 dark:hover:bg-white/5 font-normal"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm leading-tight">
                        {lang.nativeName}
                      </span>
                      <span className="text-[10px] text-foreground/50">
                        {lang.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-1.5 mt-1 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openLanguageModal();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center transition-colors"
              >
                Full Screen Selection • भाषा चयन
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
