"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, ABVariant, TRANSLATIONS } from "@/data/translations";

interface ConversionStats {
  landingA: number;
  landingB: number;
  funnelA: number;
  funnelB: number;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  landingVariant: ABVariant;
  setLandingVariant: (v: ABVariant) => void;
  funnelVariant: ABVariant;
  setFunnelVariant: (v: ABVariant) => void;
  stats: ConversionStats;
  recordConversion: (source: string) => void;
  t: (typeof TRANSLATIONS)[Language];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [landingVariant, setLandingVariantState] = useState<ABVariant>("A");
  const [funnelVariant, setFunnelVariantState] = useState<ABVariant>("A");
  const [stats, setStats] = useState<ConversionStats>({
    landingA: 14,
    landingB: 19,
    funnelA: 22,
    funnelB: 27,
  });

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("kr_lang") as Language | null;
      if (savedLang === "no" || savedLang === "en") {
        setLangState(savedLang);
      }
      const savedLanding = localStorage.getItem("kr_ab_landing") as ABVariant | null;
      if (savedLanding === "A" || savedLanding === "B") {
        setLandingVariantState(savedLanding);
      } else {
        const assigned: ABVariant = Math.random() < 0.5 ? "A" : "B";
        localStorage.setItem("kr_ab_landing", assigned);
        setLandingVariantState(assigned);
      }
      const savedFunnel = localStorage.getItem("kr_ab_funnel") as ABVariant | null;
      if (savedFunnel === "A" || savedFunnel === "B") {
        setFunnelVariantState(savedFunnel);
      } else {
        const assignedF: ABVariant = Math.random() < 0.5 ? "A" : "B";
        localStorage.setItem("kr_ab_funnel", assignedF);
        setFunnelVariantState(assignedF);
      }
    } catch {
      // Ignore storage access errors in private mode
    }
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem("kr_lang", next);
    } catch {}
  };

  const setLandingVariant = (v: ABVariant) => {
    setLandingVariantState(v);
    try {
      localStorage.setItem("kr_ab_landing", v);
    } catch {}
  };

  const setFunnelVariant = (v: ABVariant) => {
    setFunnelVariantState(v);
    try {
      localStorage.setItem("kr_ab_funnel", v);
    } catch {}
  };

  const recordConversion = (_source: string) => {
    setStats((prev) => ({
      landingA: landingVariant === "A" ? prev.landingA + 1 : prev.landingA,
      landingB: landingVariant === "B" ? prev.landingB + 1 : prev.landingB,
      funnelA: funnelVariant === "A" ? prev.funnelA + 1 : prev.funnelA,
      funnelB: funnelVariant === "B" ? prev.funnelB + 1 : prev.funnelB,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        landingVariant,
        setLandingVariant,
        funnelVariant,
        setFunnelVariant,
        stats,
        recordConversion,
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
