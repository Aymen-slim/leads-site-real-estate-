"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, ABVariant, LandingVariant, TRANSLATIONS } from "@/data/translations";
import { trackCtaAndGa } from "@/lib/trackerClient";
import { writeCookie } from "@/lib/consent";

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  landingVariant: LandingVariant;
  funnelVariant: ABVariant;
  isModern: boolean;
  isAdmin: boolean;
  isPreview: boolean;
  trackClick: (source: string) => void;
  t: (typeof TRANSLATIONS)[Language];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
  initialLang?: Language;
  initialLandingVariant?: LandingVariant;
  initialFunnelVariant?: ABVariant;
  isAdmin?: boolean;
  isPreview?: boolean;
}

export function AppProvider({
  children,
  initialLang = "no",
  initialLandingVariant = "A",
  initialFunnelVariant = "A",
  isAdmin = false,
  isPreview = false,
}: AppProviderProps) {
  const [lang, setLangState] = useState<Language>(initialLang);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("kr_lang") as Language | null;
      if ((savedLang === "no" || savedLang === "en") && savedLang !== initialLang) {
        writeCookie("kr_lang", initialLang, 60 * 60 * 24 * 365);
      }
    } catch {
      // Ignore storage access errors in private mode
    }
  }, [initialLang]);

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem("kr_lang", next);
      writeCookie("kr_lang", next, 60 * 60 * 24 * 365);
    } catch {
      // Ignore storage access errors
    }
  };

  const trackClick = (source: string) => {
    trackCtaAndGa(source, {
      landingVariant: initialLandingVariant,
      funnelVariant: initialFunnelVariant,
    });
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        landingVariant: initialLandingVariant,
        funnelVariant: initialFunnelVariant,
        isModern: initialLandingVariant === "M",
        isAdmin,
        isPreview,
        trackClick,
        t: TRANSLATIONS[lang],
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
