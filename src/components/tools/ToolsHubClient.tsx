"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { NORWAY_CITIES } from "@/data/norwayData";
import {
  TOOL_CATALOG,
  TOOL_CATEGORIES,
  ToolCategory,
} from "@/data/norwayToolsData";
import { ArrowRightIcon, ShieldCheckIcon } from "@/components/Icons";
import { ToolIcon } from "@/components/ToolIcon";
import { ModernToolsHub } from "@/components/modern/ModernToolsHub";

export function ToolsHubClient() {
  const { lang, isModern, trackClick, t } = useApp();
  const [activeCat, setActiveCat] = useState<"all" | ToolCategory>("all");

  if (isModern) return <ModernToolsHub />;

  const visibleTools =
    activeCat === "all"
      ? TOOL_CATALOG
      : TOOL_CATALOG.filter((tool) => tool.category === activeCat);

  return (
    <main className="bg-[#FFFFFF] min-h-[calc(100vh-140px)] py-10 sm:py-14 lg:py-16">
      <div className="kr-container space-y-8 sm:space-y-10">
        <div className="max-w-3xl space-y-3">
          <h1 className="kr-h1">{t.landing.toolsSectionTitle}</h1>
          <p className="kr-body-lg">
            {lang === "no"
              ? "Få en rask tilbakemelding på din boligverdi, kostnader ved salg og mye mer - alt på et sted"
              : "Get fast feedback on your home value, selling costs, and much more — all in one place."}
          </p>
        </div>

        {/* Transparent 2026 Norwegian Data Sources Strip */}
        <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-[#5D726A] shrink-0 mt-0.5" />
            <p className="text-[14px] sm:text-[15px] text-[#292823] leading-snug">
              <strong className="font-semibold text-[#000000]">
                {lang === "no"
                  ? "Åpne norske kilder (2026): "
                  : "Transparent Norwegian sources (2026): "}
              </strong>
              {lang === "no"
                ? "SSB, Skatteetaten, Kartverket, Enova, Eiendom Norge, Forbrukerrådet, Lovdata og Byggstart/Mittanbud. Hvert verktøy viser eget beregningsgrunnlag og forbehold."
                : "SSB, Skatteetaten, Kartverket, Enova, Eiendom Norge, Forbrukerrådet, Lovdata, and Byggstart/Mittanbud. Every tool documents its methodology and caveats."}
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="group"
          aria-label={lang === "no" ? "Filtrer kalkulatorer" : "Filter calculators"}
          className="flex flex-wrap gap-2"
        >
          {TOOL_CATEGORIES.map((cat) => {
            const active = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCat(cat.id)}
                aria-pressed={active}
                className={`min-h-[48px] px-4 sm:px-5 py-2.5 rounded-none border-2 text-[15px] sm:text-[16px] font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-[#5D726A] border-[#5D726A] text-[#FFFFFF]"
                    : "bg-[#EDF0E7] border-[#DCE2CF] hover:bg-[#DCE2CF] text-[#000000]"
                }`}
              >
                {lang === "no" ? cat.labelNo : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Tools List */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {visibleTools.map((tool) => (
            <div
              key={tool.slug}
              className="bg-[#FFFFFF] border border-[#BFBFBD] hover:border-[#5D726A] rounded-none p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 transition-colors"
            >
              <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
                <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
                  <ToolIcon iconKey={tool.iconKey} className="w-6 h-6 sm:w-7 sm:h-7" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-[20px] sm:text-[24px] font-medium text-[#000000] leading-snug">
                      {lang === "no" ? tool.titleNo : tool.titleEn}
                    </h2>
                    {tool.isNew && (
                      <span className="px-2 py-0.5 bg-[#FFF7D4] border border-[#5D726A] text-[#000000] text-[12px] font-semibold uppercase tracking-wide">
                        {lang === "no" ? "Ny" : "New"}
                      </span>
                    )}
                  </div>
                  <p className="text-[16px] sm:text-[17px] text-[#292823] mt-2 leading-relaxed">
                    {lang === "no" ? tool.descNo : tool.descEn}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
                <Link
                  href={tool.path}
                  className="kr-btn-primary w-full sm:w-auto border border-[#5D726A] min-h-[56px]"
                >
                  <span>{t.landing.openToolBtn}</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Local SEO City Price Directory */}
        <section className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-5 sm:p-8 space-y-4">
          <h2 className="kr-h3">
            {lang === "no"
              ? "Lokale boligpriser per m² i norske storbyer"
              : "Local Price per m² Across Major Norwegian Cities"}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {NORWAY_CITIES.map((city) => (
              <Link
                key={city.id}
                href={`/boligpris/${city.id}`}
                className="px-4 py-2 bg-[#FFFFFF] border border-[#BFBFBD] hover:border-[#5D726A] hover:bg-[#DCE2CF] text-[15px] font-medium text-[#000000] transition-colors"
              >
                {lang === "no" ? `Boligpris ${city.name}` : `${city.name} m² Prices`}
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-[#DCE2CF] border border-[#5D726A] rounded-none p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="kr-h2-serif">
              {lang === "no"
                ? "Klar for å selge boligen?"
                : "Ready to sell your home?"}
            </h2>
            <p className="kr-body-lg mt-1">
              {lang === "no"
                ? "Få en uforpliktende verdivurdering og tilbud direkte fra lokale meglere og kjøpere."
                : "Get a free valuation and compare offers from local Norwegian agencies."}
            </p>
          </div>
          <Link
            href="/koble-til-megler?source=tools-hub"
            onClick={() => trackClick("tools-hub")}
            className="kr-btn-primary w-full sm:w-auto border border-[#5D726A] shrink-0 min-h-[58px]"
          >
            <span>
              {lang === "no"
                ? "Koble til megler nå"
                : "Connect Agency — Get Best Price"}
            </span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
