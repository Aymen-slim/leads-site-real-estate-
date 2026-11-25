"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  getConsent,
  onConsentOpen,
  setConsent,
} from "@/lib/consent";
import { CheckMarkIcon, ShieldCheckIcon } from "@/components/Icons";

export function CookieBanner() {
  const pathname = usePathname();
  const { lang, isModern } = useApp();

  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const state = getConsent();
    if (!state.decided) {
      setOpen(true);
      setAnalyticsEnabled(true);
    } else {
      setAnalyticsEnabled(state.analytics);
    }
    return onConsentOpen(() => {
      const current = getConsent();
      setAnalyticsEnabled(current.decided ? current.analytics : true);
      setSettingsOpen(true);
      setOpen(true);
    });
  }, []);

  if (!open || pathname.startsWith("/admin")) return null;

  const copy =
    lang === "no"
      ? {
          title: "Informasjonskapsler og personvern",
          body: "Vi bruker nødvendige informasjonskapsler for at siden, språkvalg og skjemaet skal fungere. Med ditt samtykke bruker vi også analyseverktøy (inkludert Google Analytics og Google Ads) for å måle besøk, konverteringer og forbedre tjenesten.",
          necessaryTitle: "Nødvendige informasjonskapsler",
          necessaryDesc: "Alltid aktiv — husker språkvalg, sideversjon og samtykkevalget ditt.",
          analyticsTitle: "Analyse, Google Analytics og Google Ads",
          analyticsDesc:
            "Valgfri — måler sidevisninger, tid brukt på siden og hvilke annonser og verktøy som hjelper selgere best.",
          acceptAll: "Godta alle",
          necessaryOnly: "Kun nødvendige",
          saveChoice: "Lagre mine valg",
          customize: "Tilpass valg",
          hideCustomize: "Skjul innstillinger",
          privacyLink: "Les personvernerklæringen",
        }
      : {
          title: "Cookies & privacy preferences",
          body: "We use strictly necessary cookies so the site, language setting, and seller form work properly. With your consent, we also use analytics and conversion measurement (including Google Analytics and Google Ads) to measure visits, conversions, and improve our tools.",
          necessaryTitle: "Strictly necessary cookies",
          necessaryDesc: "Always active — remembers your language, page layout, and consent choice.",
          analyticsTitle: "Analytics, Google Analytics & Google Ads",
          analyticsDesc:
            "Optional — measures page views, conversions, and which ads and tools help homeowners most.",
          acceptAll: "Accept all",
          necessaryOnly: "Necessary only",
          saveChoice: "Save preferences",
          customize: "Cookie settings",
          hideCustomize: "Hide settings",
          privacyLink: "Read Privacy Policy",
        };

  const handleSave = (allowAnalytics: boolean) => {
    setConsent(allowAnalytics);
    setOpen(false);
    setSettingsOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="kr-cookie-title"
      className={`fixed bottom-[86px] md:bottom-5 left-3 right-3 md:left-auto md:right-5 md:max-w-[520px] z-50 bg-[#FFFFFF] p-5 sm:p-6 ${
        isModern
          ? "rounded-2xl border border-[#DCE2D4] shadow-[0_16px_44px_rgba(29,40,28,0.18)]"
          : "rounded-none border-2 border-[#5D726A] shadow-[0_12px_32px_rgba(41,40,35,0.18)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`w-9 h-9 flex items-center justify-center shrink-0 mt-0.5 ${
            isModern
              ? "rounded-xl bg-[#E7ECE0] border border-[#D4DCCB] text-[#243323]"
              : "bg-[#EDF0E7] border border-[#DCE2CF] text-[#5D726A]"
          }`}
        >
          <ShieldCheckIcon className="w-5 h-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="kr-cookie-title" className="text-[18px] font-semibold text-[#000000] leading-snug">
            {copy.title}
          </h2>
          <p className="mt-1.5 text-[14px] sm:text-[15px] leading-relaxed text-[#292823]">
            {copy.body}{" "}
            <Link
              href="/personvern"
              className="underline decoration-[#5D726A] text-[#000000] hover:text-[#5D726A] font-medium"
            >
              {copy.privacyLink}
            </Link>
            .
          </p>
        </div>
      </div>

      {settingsOpen && (
        <div
          className={`mt-4 space-y-2.5 p-3.5 ${
            isModern
              ? "rounded-xl bg-[#F4F5F0] border border-[#DCE2D4]"
              : "bg-[#EDF0E7] border border-[#DCE2CF]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] font-semibold text-[#000000]">{copy.necessaryTitle}</p>
              <p className="text-[13px] text-[#292823] leading-snug mt-0.5">
                {copy.necessaryDesc}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold shrink-0 ${
                isModern
                  ? "rounded-full bg-[#E7ECE0] text-[#1D281C]"
                  : "bg-[#DCE2CF] text-[#000000]"
              }`}
            >
              <CheckMarkIcon className="w-3.5 h-3.5 text-[#5D726A]" />
              <span>{lang === "no" ? "Aktiv" : "Active"}</span>
            </span>
          </div>

          <div className="pt-2.5 border-t border-[#DCE2CF] flex items-start justify-between gap-3">
            <label htmlFor="kr-analytics-toggle" className="cursor-pointer flex-1">
              <span className="block text-[14px] font-semibold text-[#000000]">
                {copy.analyticsTitle}
              </span>
              <span className="block text-[13px] text-[#292823] leading-snug mt-0.5">
                {copy.analyticsDesc}
              </span>
            </label>
            <input
              id="kr-analytics-toggle"
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-[#147A53] cursor-pointer shrink-0"
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
        <button
          type="button"
          onClick={() => handleSave(true)}
          className={`min-h-[44px] px-4 py-2 text-[15px] font-medium cursor-pointer transition-colors ${
            isModern
              ? "rounded-full bg-[#243323] hover:bg-[#172216] text-[#FFFFFF] font-semibold"
              : "rounded-none bg-[#B8C49E] hover:bg-[#C5D0AF] border border-[#5D726A] text-[#000000]"
          }`}
        >
          {copy.acceptAll}
        </button>

        <button
          type="button"
          onClick={() => handleSave(false)}
          className={`min-h-[44px] px-4 py-2 text-[15px] font-medium cursor-pointer transition-colors ${
            isModern
              ? "rounded-full bg-[#E7ECE0] hover:bg-[#DCE4D2] border border-[#CFD7C6] text-[#1D281C]"
              : "rounded-none bg-[#EDF0E7] hover:bg-[#DCE2CF] border border-[#BFBFBD] text-[#000000]"
          }`}
        >
          {copy.necessaryOnly}
        </button>

        {settingsOpen ? (
          <button
            type="button"
            onClick={() => handleSave(analyticsEnabled)}
            className={`min-h-[44px] px-4 py-2 text-[14px] font-medium cursor-pointer transition-colors sm:ml-auto ${
              isModern
                ? "rounded-full bg-[#147A53] hover:bg-[#0D5E3F] text-[#FFFFFF]"
                : "rounded-none bg-[#292823] hover:bg-[#000000] text-[#FFFFFF]"
            }`}
          >
            {copy.saveChoice}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="min-h-[44px] px-3 py-2 text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] text-[14px] font-medium cursor-pointer sm:ml-auto"
          >
            {copy.customize}
          </button>
        )}
      </div>
    </div>
  );
}
