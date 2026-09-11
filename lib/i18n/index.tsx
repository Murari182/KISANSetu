"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LanguageInfo } from "./languages";

import en from "./translations/en.json";
import hi from "./translations/hi.json";
import te from "./translations/te.json";
import mr from "./translations/mr.json";
import ta from "./translations/ta.json";
import kn from "./translations/kn.json";
import bn from "./translations/bn.json";
import gu from "./translations/gu.json";
import pa from "./translations/pa.json";
import ml from "./translations/ml.json";
import or from "./translations/or.json";
import ur from "./translations/ur.json";

// Native dictionary map with fallback to English for any missing keys
const dictionaries: Record<string, any> = {
  en,
  hi,
  te,
  mr,
  ta,
  kn,
  bn,
  gu,
  pa,
  ml,
  or,
  ur,
};

interface LanguageContextType {
  language: string;
  languageInfo: LanguageInfo;
  setLanguage: (code: string) => void;
  confirmLanguageSelection: (code: string) => void;
  hasChosenLanguage: boolean;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);
  const [hasChosenLanguage, setHasChosenLanguage] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has confirmed language in this session
    const sessionConfirmed = sessionStorage.getItem("kisan_language_session_confirmed");
    const saved = localStorage.getItem("kisan_setu_lang");

    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
    }

    if (sessionConfirmed === "true") {
      setHasChosenLanguage(true);
    } else {
      // By default: ask language on initial visit / new session!
      setHasChosenLanguage(false);
    }
  }, []);

  const languageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRTL = languageInfo.direction === "rtl";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", language);
    }
  }, [language, isRTL]);

  const setLanguage = (code: string) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      setLanguageState(code);
      localStorage.setItem("kisan_setu_lang", code);
    }
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  const confirmLanguageSelection = (code: string) => {
    setLanguage(code);
    setHasChosenLanguage(true);
    setIsLanguageModalOpen(false);
    sessionStorage.setItem("kisan_language_session_confirmed", "true");
    localStorage.setItem("kisan_setu_lang", code);
    localStorage.setItem("kisan_language_chosen", "true");
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split(".");
    let current: any = dictionaries[language] || dictionaries.en;
    let fallback: any = dictionaries.en;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    let result = current;
    if (result === undefined || typeof result !== "string") {
      for (const key of keys) {
        if (fallback && typeof fallback === "object" && key in fallback) {
          fallback = fallback[key];
        } else {
          fallback = undefined;
          break;
        }
      }
      result = typeof fallback === "string" ? fallback : path;
    }

    if (params && typeof result === "string") {
      Object.entries(params).forEach(([paramKey, val]) => {
        result = result.replace(new RegExp(`{${paramKey}}`, "g"), String(val));
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageInfo,
        setLanguage,
        confirmLanguageSelection,
        hasChosenLanguage,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
