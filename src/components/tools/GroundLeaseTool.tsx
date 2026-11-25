"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

// Statutory 2026 Norwegian Ground Lease Act (Tomtefesteloven) & Kartverket figures
const ENGANGSLOFT_MAX_PER_DEKAR_2026 = 16_060; // CPI-adjusted annually from 9,000 kr (2002); ~15,580 in 2025 -> ~16,060 in 2026
const KARTVERKET_DEED_FEE_2026 = 545; // 2025/2026 Kartverket tinglysingsgebyr per document (sletting av festekontrakt = 0 kr)

export function GroundLeaseTool() {
  const { lang, isModern } = useApp();

  const [plotKind, setPlotKind] = useState<"bolig" | "hytte">("bolig");
  const [currentAnnualRent, setCurrentAnnualRent] = useState<number>(12_000);
  const [rawLandValue, setRawLandValue] = useState<number>(1_600_000);
  const [kpiIncreasePct, setKpiIncreasePct] = useState<number>(25);
  const [ruleMode, setRuleMode] = useState<"25x" | "40pct">("25x");

  const adjustedAnnualRent = Math.round(currentAnnualRent * (1 + kpiIncreasePct / 100));
  const engangsloftRaw2Pct = Math.round(rawLandValue * 0.02);
  const engangsloftCapped1Dekar = Math.min(
    engangsloftRaw2Pct,
    ENGANGSLOFT_MAX_PER_DEKAR_2026
  );

  const buyout25x = adjustedAnnualRent * 25;
  const buyout40pct = Math.round(rawLandValue * 0.4);
  const selectedBuyout = ruleMode === "25x" ? buyout25x : buyout40pct;
  const tenYearRentTotal = adjustedAnnualRent * 10;

  // 2.5% dokumentavgift on buyout sum (assuming registered festekontrakt) + 545 kr Kartverket skjøte fee
  const stampDuty = Math.round(selectedBuyout * 0.025);
  const publicRegistrationTotal = stampDuty + KARTVERKET_DEED_FEE_2026;
  const totalBuyoutWithFees = selectedBuyout + publicRegistrationTotal;

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  return (
    <ToolShell
      slug="ground-lease"
      iconKey="ground-lease"
      title={
        lang === "no"
          ? "Kalkulator for tomtefeste og innløsning (Festeavgift)"
          : "Ground Lease (Tomtefeste) & Buyout Calculator"
      }
      subtitle={
        lang === "no"
          ? "Beregn lovfestet innløsningssum (25× festeavgift eller 40 % råtomt), KPI-regulering, engangsløft-tak (2026) og tinglysingskostnader etter Tomtefesteloven."
          : "Calculate statutory buyout pricing under Norway's Ground Lease Act (25× CPI-adjusted rent or 40% raw plot value), the 2026 extension cap, and deed fees."
      }
      ctaSource="ground-lease"
      ctaHref={`/koble-til-megler?source=ground-lease&type=land&price=${rawLandValue}&leaseBuyout=${totalBuyoutWithFees}`}
      ctaLabel={
        lang === "no"
          ? "Usikker på om du bør innløse festetomten før salg? Få gratis vurdering fra lokal eiendomsmegler"
          : "Unsure whether to buy out your leased plot before selling? Get free advice from a local agency"
      }
    >
      <div className={panelClass}>
        {/* Plot Kind (Bolig vs Hytte for § 32 intervals) */}
        <div>
          <p
            className={`text-[17px] sm:text-lg mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no"
              ? "1. Type festetomt (styrer innløsningsintervall etter § 32)"
              : "1. Lease Type (determines statutory buyout interval, § 32)"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlotKind("bolig")}
              aria-pressed={plotKind === "bolig"}
              className={`${
                isModern ? "nm-tap-card" : "kr-tap-card"
              } min-h-[64px] px-4 py-3 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
                plotKind === "bolig"
                  ? isModern
                    ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                    : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : isModern
                  ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                  : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
              }`}
            >
              <div>
                <span className="block">{lang === "no" ? "Boligtomt" : "Residential Plot (Boligtomt)"}</span>
                <span className="block text-[13px] font-normal opacity-85">
                  {lang === "no" ? "Innløsning etter 30 år, deretter hvert 2. år" : "Buyout after 30 yrs, then every 2 yrs"}
                </span>
              </div>
              {plotKind === "bolig" && (
                <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setPlotKind("hytte")}
              aria-pressed={plotKind === "hytte"}
              className={`${
                isModern ? "nm-tap-card" : "kr-tap-card"
              } min-h-[64px] px-4 py-3 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
                plotKind === "hytte"
                  ? isModern
                    ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                    : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : isModern
                  ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                  : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
              }`}
            >
              <div>
                <span className="block">{lang === "no" ? "Fritidstomt (hytte)" : "Cabin Plot (Fritidstomt)"}</span>
                <span className="block text-[13px] font-normal opacity-85">
                  {lang === "no" ? "Innløsning etter 30 år, deretter hvert 10. år" : "Buyout after 30 yrs, then every 10 yrs"}
                </span>
              </div>
              {plotKind === "hytte" && (
                <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
              )}
            </button>
          </div>
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="lease-rent"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "2. Nåværende årlig festeavgift" : "2. Current Annual Ground Rent"}
            </label>
            <output
              htmlFor="lease-rent"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(currentAnnualRent)} / {lang === "no" ? "år" : "yr"}
            </output>
          </div>
          <input
            id="lease-rent"
            type="range"
            min={2_000}
            max={60_000}
            step={500}
            value={currentAnnualRent}
            onChange={(e) => setCurrentAnnualRent(Number(e.target.value))}
            style={
              {
                "--attr-min": 2_000,
                "--attr-max": 60_000,
                "--control-value": currentAnnualRent,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <p
            className={`text-[17px] sm:text-lg mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no"
              ? "3. KPI-økning siden siste regulering (§ 15 — normalt hvert 10. år)"
              : "3. CPI Increase Since Last Adjustment (§ 15 — normally every 10 yrs)"}
          </p>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {[0, 15, 25, 40].map((pct) => {
              const active = kpiIncreasePct === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setKpiIncreasePct(pct)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[58px] border-2 text-[17px] sm:text-[18px] font-semibold tabular-nums ${
                    active
                      ? isModern
                        ? "bg-[#147A53] border-[#0F3D2E] text-[#FFFFFF]"
                        : "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#121C17]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#000000]"
                  }`}
                >
                  +{pct} %
                </button>
              );
            })}
          </div>
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="lease-rawland"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "4. Estimert råtomtverdi (ubebygd, uten dine påkostninger)"
                : "4. Estimated Raw Plot Value (excluding your improvements)"}
            </label>
            <output
              htmlFor="lease-rawland"
              className="text-[22px] font-semibold tabular-nums whitespace-nowrap"
            >
              {formatNok(rawLandValue)}
            </output>
          </div>
          <input
            id="lease-rawland"
            type="range"
            min={300_000}
            max={10_000_000}
            step={100_000}
            value={rawLandValue}
            onChange={(e) => setRawLandValue(Number(e.target.value))}
            style={
              {
                "--attr-min": 300_000,
                "--attr-max": 10_000_000,
                "--control-value": rawLandValue,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRuleMode("25x")}
            aria-pressed={ruleMode === "25x"}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[76px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              ruleMode === "25x"
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <div>
              <span className="block">
                {lang === "no" ? "Hovedregel (§ 37): 25× festeavgift" : "Default Rule (§ 37): 25× Annual Rent"}
              </span>
              <span className="block text-[13px] font-normal opacity-85">
                {formatNok(buyout25x)} · {lang === "no" ? "enerådende ved tidsubegrenset avtale" : "sole rule on indefinite leases"}
              </span>
            </div>
            {ruleMode === "25x" && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setRuleMode("40pct")}
            aria-pressed={ruleMode === "40pct"}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[76px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              ruleMode === "40pct"
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <div>
              <span className="block">
                {lang === "no" ? "Tidsbegrenset avtale: 40 % av råtomt" : "Fixed-Term Lease: 40% Raw Plot"}
              </span>
              <span className="block text-[13px] font-normal opacity-85">
                {formatNok(buyout40pct)} · {lang === "no" ? "bortfester kan kreve det høyeste" : "landlord may demand higher option"}
              </span>
            </div>
            {ruleMode === "40pct" && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Results Ledger */}
      <div
        className={`overflow-hidden ${
          isModern
            ? "bg-[#FFFFFF] border-2 border-[#147A53] rounded-2xl"
            : "bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none"
        }`}
      >
        <div
          className={`p-4 sm:p-6 divide-y space-y-3 text-[16px] sm:text-lg ${
            isModern ? "divide-[#DCE5DF]" : "divide-[#DFDFDF]"
          }`}
        >
          <div className="flex justify-between items-baseline gap-4 pt-1">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "KPI-regulert årlig festeavgift" : "CPI-Adjusted Annual Ground Rent"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(adjustedAnnualRent)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Samlet festeavgift over 10 år uten innløsning" : "10-Year Cumulative Ground Rent"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(tenYearRentTotal)}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Innløsningssum til grunneier (§ 37)" : "Statutory Buyout Price (§ 37)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(selectedBuyout)}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? `Dokumentavgift (2,5 % = ${formatNok(stampDuty)}) + tinglysing skjøte (${KARTVERKET_DEED_FEE_2026} kr)`
                : `2.5% Stamp Duty (${formatNok(stampDuty)}) + Kartverket Deed Fee (${KARTVERKET_DEED_FEE_2026} kr)`}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(publicRegistrationTotal)}
            </span>
          </div>
        </div>

        <div
          className={`p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 ${
            isModern
              ? "bg-[#E6F2EC] border-t border-[#9EB6AA]"
              : "bg-[#DCE2CF] border-t-2 border-[#5D726A]"
          }`}
        >
          <div>
            <span
              className={`block text-[20px] sm:text-2xl font-semibold ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {lang === "no" ? "Total kostnad for å eie tomten selv" : "Total Cost to Convert to Freehold"}
            </span>
            <span className={`block text-[13px] mt-0.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no"
                ? "Sletting av festekontrakt koster 0 kr. Ev. nytt pantedokument (+545 kr) og kommunalt oppmålingsgebyr kan komme i tillegg."
                : "Canceling the lease deed is 0 kr. Any new mortgage filing (+545 kr) or municipal survey fee applies separately."}
            </span>
          </div>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(totalBuyoutWithFees)}
          </span>
        </div>
      </div>

      {/* § 15 Engangsløft Cap & § 32 / § 36 Timeline Callout */}
      <div
        className={`p-4 sm:p-5 text-[14px] leading-relaxed space-y-2 border ${
          isModern
            ? "bg-[#FFFFFF] border-[#DCE5DF] rounded-xl text-[#3B4D44]"
            : "bg-[#FFFFFF] border-[#BFBFBD] rounded-none text-[#292823]"
        }`}
      >
        <p className={`font-semibold ${isModern ? "text-[#0F3D2E]" : "text-[#000000]"}`}>
          {lang === "no"
            ? "Engangsløft (§ 15 · 2026-tak) og innløsningsfrister (§§ 32 & 36)"
            : "Extension Rent Cap (§ 15 · 2026) & Statutory Deadlines (§§ 32 & 36)"}
        </p>
        <p>
          {lang === "no"
            ? `Ved forlengelse av utløpt festekontrakt kan bortfester kreve ett engangsløft til 2 % av råtomtverdien (${formatNok(
                engangsloftRaw2Pct
              )}/år), oppad begrenset til ca. ${formatNok(
                ENGANGSLOFT_MAX_PER_DEKAR_2026
              )} per dekar i 2026 (KPI-justert fra 9 000 kr i 2002; gjelder fullt ut også for tomter under 1 dekar). For en tomt ≤ 1 dekar betyr dette maks ${formatNok(
                engangsloftCapped1Dekar
              )}/år (25× = ${formatNok(engangsloftCapped1Dekar * 25)}).`
            : `When a lease term expires and extends, the landlord may apply a one-time adjustment (engangsløft) up to 2% of raw plot value (${formatNok(
                engangsloftRaw2Pct
              )}/yr), capped at ~${formatNok(
                ENGANGSLOFT_MAX_PER_DEKAR_2026
              )} per dekar (1,000 m²) in 2026 (applies in full even to plots under 1 dekar). For a ≤1 dekar plot, the capped rent is ${formatNok(
                engangsloftCapped1Dekar
              )}/yr (25× = ${formatNok(engangsloftCapped1Dekar * 25)}).`}
        </p>
        <p>
          {plotKind === "bolig"
            ? lang === "no"
              ? "Innløsningsfrist for boligtomt: Etter 30 år av festetiden, deretter hvert 2. år (30, 32, 34 ... år) eller når festetiden løper ut. Skriftlig krav må sendes senest 1 år før innløsningstidspunktet (§ 36)."
              : "Residential buyout window: After 30 years of lease, then every 2 years (30, 32, 34...) or at lease expiry. Written notice must be sent at least 1 year in advance (§ 36)."
            : lang === "no"
            ? "Innløsningsfrist for fritidstomt (hytte): Etter 30 år av festetiden, deretter hvert 10. år (30, 40, 50 ... år) eller når festetiden løper ut. Skriftlig krav må sendes senest 1 år før innløsningstidspunktet (§ 36)."
            : "Cabin buyout window: After 30 years of lease, then every 10 years (30, 40, 50...) or at lease expiry. Written notice must be sent at least 1 year in advance (§ 36)."}
        </p>
      </div>

      {/* Sources & Assumptions */}
      <div
        className={`p-4 sm:p-5 text-[14px] leading-relaxed space-y-1.5 border ${
          isModern
            ? "bg-[#F8FAF9] border-[#DCE5DF] rounded-xl text-[#3B4D44]"
            : "bg-[#EDF0E7] border-[#DCE2CF] rounded-none text-[#292823]"
        }`}
      >
        <p className={`font-semibold ${isModern ? "text-[#0F3D2E]" : "text-[#000000]"}`}>
          {lang === "no" ? "Kilder og forutsetninger (2025/2026)" : "Sources & Assumptions (2025/2026)"}
        </p>
        <p>
          {lang === "no"
            ? "Beregningen bygger på Tomtefesteloven §§ 15, 32, 36 og 37 samt Kartverkets gjeldende satser (2,5 % dokumentavgift på innløsningssummen forutsatt tidligere tinglyst festekontrakt + 545 kr tinglysingsgebyr). Enkelte eldre kontrakter eller landbruks-/allmenningsunntak (landbruksunntaket § 34) kan gi andre vilkår — kontroller alltid selve festekontrakten."
            : "Based on the Norwegian Ground Lease Act §§ 15, 32, 36, and 37 plus Kartverket 2025/2026 rates (2.5% stamp duty on buyout price assuming a registered lease + 545 kr deed fee). Specific contract terms or agricultural land exemptions (§ 34) can differ — always verify your lease deed."}
        </p>
        <p className="text-[13px] opacity-85">
          {lang === "no"
            ? "Kilder: Lovdata (Tomtefesteloven §§ 15, 32, 36, 37), Regjeringen / SSB (KPI og 2026 maksimalbeløp per dekar) og Kartverket (tinglysingsgebyr 2025/2026)."
            : "Sources: Lovdata (Ground Lease Act §§ 15, 32, 36, 37), Norwegian Government / SSB (CPI & 2026 dekar cap), and Kartverket (2025/2026 deed fees)."}
        </p>
      </div>
    </ToolShell>
  );
}
