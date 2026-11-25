"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import {
  NORWAY_MUNICIPALITIES_TAX,
  calculatePropertyTax,
} from "@/data/norwayToolsData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

export function PropertyTaxTool({
  initialMunicipalityId,
}: {
  initialMunicipalityId?: string;
}) {
  const { lang, isModern } = useApp();

  const initialRule =
    NORWAY_MUNICIPALITIES_TAX.find((m) => m.id === initialMunicipalityId) ||
    NORWAY_MUNICIPALITIES_TAX[0];

  const [muniId, setMuniId] = useState<string>(initialRule.id);
  const [kind, setKind] = useState<"home" | "cabin">("home");
  const [marketValue, setMarketValue] = useState<number>(8_500_000);
  const [housingUnits, setHousingUnits] = useState<1 | 2>(1);

  const rule =
    NORWAY_MUNICIPALITIES_TAX.find((m) => m.id === muniId) ||
    NORWAY_MUNICIPALITIES_TAX[0];

  const baseCalc = calculatePropertyTax(rule, marketValue, kind);
  const supportsMultiUnit =
    rule.hasResidentialTax && kind === "home" && rule.bunnfradragHome > 0;
  const effectiveUnits = supportsMultiUnit ? housingUnits : 1;
  const effectiveBunnfradrag = baseCalc.bunnfradrag * effectiveUnits;
  const taxableBase = Math.max(0, baseCalc.reducedValue - effectiveBunnfradrag);
  const annualTax = rule.hasResidentialTax
    ? Math.round((taxableBase * baseCalc.promille) / 1000)
    : 0;
  const monthlyTax = Math.round(annualTax / 12);
  const tenYearTax = annualTax * 10;

  const reductionPct = Math.round(rule.reductionFactor * 100);
  const retainedPct = 100 - reductionPct;
  const taxFreeMarketThreshold =
    rule.hasResidentialTax && effectiveBunnfradrag > 0
      ? Math.round(effectiveBunnfradrag / (1 - rule.reductionFactor))
      : 0;

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  const headingTitle = initialMunicipalityId
    ? lang === "no"
      ? `Eiendomsskatt i ${rule.name} (2026) — Kalkulator`
      : `Property Tax Calculator for ${rule.name} (2026)`
    : lang === "no"
    ? "Kalkuler eiendomsskatt i din kommune"
    : "Municipal Property Tax Calculator (Norway)";

  const headingSub = initialMunicipalityId
    ? lang === "no"
      ? rule.noteNo
      : rule.noteEn
    : lang === "no"
    ? "Sjekk estimert eiendomsskatt for 2026 med kommunens bunnfradrag, 30 % lovbestemt reduksjonsfaktor og gjeldende promillesats."
    : "Pick from 20 Norwegian municipalities to estimate 2026 annual property tax with the 30% statutory reduction, local threshold, and promille rate.";

  return (
    <ToolShell
      slug="property-tax"
      iconKey="property-tax"
      title={headingTitle}
      subtitle={headingSub}
      ctaSource="property-tax"
      ctaHref={`/koble-til-megler?source=property-tax&type=house${
        rule.cityMatchId ? `&city=${rule.cityMatchId}` : ""
      }&price=${marketValue}&propTax=${annualTax}&municipality=${rule.id}`}
      ctaLabel={
        lang === "no"
          ? `Betaler du for høy eiendomsskatt i ${rule.name}? Få en fersk verdivurdering fra lokal megler`
          : `Think your ${rule.name} tax assessment is too high, or considering selling? Request a free valuation`
      }
    >
      <div className={panelClass}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="ptax-muni"
              className={`block text-[18px] sm:text-xl mb-2 ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "1. Velg norsk kommune" : "1. Select Municipality"}
            </label>
            <select
              id="ptax-muni"
              value={muniId}
              onChange={(e) => setMuniId(e.target.value)}
              className={`w-full min-h-[60px] sm:min-h-[66px] px-4 py-3 text-[19px] sm:text-xl font-semibold bg-[#FFFFFF] border-2 text-[#000000] cursor-pointer ${
                isModern
                  ? "border-[#9EB6AA] focus:border-[#147A53] rounded-xl"
                  : "border-[#5D726A] rounded-none"
              }`}
            >
              {NORWAY_MUNICIPALITIES_TAX.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({lang === "no" ? m.countyNo : m.countyEn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <span
              className={`block text-[18px] sm:text-xl mb-2 ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "2. Type eiendom" : "2. Property Category"}
            </span>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: "home", no: "Bolig", en: "Home" },
                  { id: "cabin", no: "Fritidsbolig", en: "Cabin" },
                ] as const
              ).map((opt) => {
                const active = kind === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setKind(opt.id)}
                    aria-pressed={active}
                    className={`${
                      isModern ? "nm-tap-card" : "kr-tap-card"
                    } min-h-[60px] sm:min-h-[66px] px-4 border-2 text-[17px] sm:text-[18px] font-semibold flex items-center justify-between gap-2 ${
                      active
                        ? isModern
                          ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                          : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                        : isModern
                        ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                        : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                    }`}
                  >
                    <span>{lang === "no" ? opt.no : opt.en}</span>
                    {active && (
                      <CheckMarkIcon
                        className={`w-5 h-5 shrink-0 ${
                          isModern ? "text-[#147A53]" : "text-[#5D726A]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="ptax-value"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "3. Boligverdi (Skatteetaten) eller kommunal takst"
                : "3. Assessed Market Value (Skatteetaten / Municipal Valuation)"}
            </label>
            <output
              htmlFor="ptax-value"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(marketValue)}
            </output>
          </div>
          <input
            id="ptax-value"
            type="range"
            min={1_500_000}
            max={25_000_000}
            step={100_000}
            value={marketValue}
            onChange={(e) => setMarketValue(Number(e.target.value))}
            style={
              {
                "--attr-min": 1_500_000,
                "--attr-max": 25_000_000,
                "--control-value": marketValue,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
          <p className={`text-[14px] mt-1.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
            {lang === "no" ? rule.noteNo : rule.noteEn}
          </p>
        </div>

        {supportsMultiUnit && (
          <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
            <p
              className={`text-[16px] sm:text-[17px] mb-2.5 ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "4. Antall godkjente selvstendige boenheter (gir bunnfradrag per boenhet)"
                : "4. Approved Independent Housing Units (threshold applies per unit)"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([1, 2] as const).map((u) => {
                const active = housingUnits === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setHousingUnits(u)}
                    aria-pressed={active}
                    className={`${
                      isModern ? "nm-tap-card" : "kr-tap-card"
                    } min-h-[56px] px-4 py-3 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
                      active
                        ? isModern
                          ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                          : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                        : isModern
                        ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                        : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                    }`}
                  >
                    <span>
                      {u === 1
                        ? lang === "no"
                          ? "1 boenhet (standard)"
                          : "1 unit (standard)"
                        : lang === "no"
                        ? "2 godkjente boenheter (f.eks. med godkjent utleiedel)"
                        : "2 approved units (e.g. with legal rental flat)"}
                    </span>
                    {active && (
                      <CheckMarkIcon
                        className={`w-5 h-5 shrink-0 ${
                          isModern ? "text-[#147A53]" : "text-[#5D726A]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Zero-Tax or Below-Threshold Banner */}
      {!rule.hasResidentialTax ? (
        <div
          className={`p-4 sm:p-5 border-2 ${
            isModern
              ? "bg-[#E6F2EC] border-[#147A53] rounded-2xl text-[#0F3D2E]"
              : "bg-[#DCE2CF] border-[#5D726A] rounded-none text-[#000000]"
          }`}
        >
          <p className="text-[17px] sm:text-[18px] font-semibold">
            {lang === "no"
              ? `${rule.name} har 0 kr i eiendomsskatt på bolig og fritidsbolig i 2026.`
              : `${rule.name} levies 0 kr residential and cabin property tax in 2026.`}
          </p>
        </div>
      ) : (
        taxFreeMarketThreshold > 0 &&
        annualTax === 0 && (
          <div
            className={`p-4 sm:p-5 border-2 ${
              isModern
                ? "bg-[#E6F2EC] border-[#147A53] rounded-2xl text-[#0F3D2E]"
                : "bg-[#DCE2CF] border-[#5D726A] rounded-none text-[#000000]"
            }`}
          >
            <p className="text-[17px] font-semibold">
              {lang === "no"
                ? `0 kr i eiendomsskatt: Boligverdien ligger under bunnfradragsgrensen på ca. ${formatNok(
                    taxFreeMarketThreshold
                  )} i ${rule.name}.`
                : `0 kr property tax: Value is below ${rule.name}'s tax-free threshold of ~${formatNok(
                    taxFreeMarketThreshold
                  )}.`}
            </p>
          </div>
        )
      )}

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
              {lang === "no"
                ? `Verdi etter ${reductionPct} % obligatorisk reduksjonsfaktor (× ${retainedPct} %)`
                : `Value After ${reductionPct}% Statutory Reduction (× ${retainedPct}%)`}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(baseCalc.reducedValue)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? `Kommunalt bunnfradrag (${rule.name}${
                    effectiveUnits > 1 ? ` × ${effectiveUnits} boenheter` : ""
                  })`
                : `Municipal Threshold (${rule.name}${
                    effectiveUnits > 1 ? ` × ${effectiveUnits} units` : ""
                  })`}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              − {formatNok(effectiveBunnfradrag)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? "Skattegrunnlag × Promillesats (÷ 1 000)"
                : "Taxable Base × Promille Rate (÷ 1,000)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(taxableBase)} × {baseCalc.promille.toFixed(2).replace(".", lang === "no" ? "," : ".")} ‰
            </span>
          </div>

          {taxFreeMarketThreshold > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3 text-[15px]">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? "Skattefri markedsverdi-grense (før skatt slår inn)"
                  : "Tax-Free Market Value Threshold"}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(taxFreeMarketThreshold)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Per måned / Over 10 år" : "Per Month / Over 10 Years"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(monthlyTax)} / {lang === "no" ? "mnd" : "mo"} · {formatNok(tenYearTax)}
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
          <span
            className={`text-[20px] sm:text-2xl font-semibold ${
              isModern ? "text-[#0F3D2E]" : "text-[#000000]"
            }`}
          >
            {lang === "no"
              ? `Estimert årlig eiendomsskatt i ${rule.name}`
              : `Estimated Annual Property Tax in ${rule.name}`}
          </span>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(annualTax)}
          </span>
        </div>
      </div>

      {/* Transparent Sources & Assumptions */}
      <div
        className={`p-4 sm:p-5 text-[14px] leading-relaxed space-y-2 ${
          isModern
            ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl text-[#3B4D44]"
            : "bg-[#F7F7F7] border border-[#BFBFBD] rounded-none text-[#292823]"
        }`}
      >
        <p className={`font-semibold text-[15px] ${isModern ? "text-[#121C17]" : "text-[#000000]"}`}>
          {lang === "no"
            ? "Kilder og forutsetninger (veiledende 2026-estimat)"
            : "Sources & Assumptions (Indicative 2026 Estimate)"}
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {lang === "no"
              ? "Eigedomsskattelova: Obligatorisk reduksjonsfaktor på minst 30 % for bolig og fritidsbolig (maks 70 % skattegrunnlag) og maksimal lovlig skattesats på 4 promille."
              : "Norwegian Property Tax Act (Eigedomsskattelova): Mandatory 30% minimum reduction (tax base max 70% of value) and statutory maximum rate of 4‰ for homes and cabins."}
          </li>
          <li>
            {lang === "no"
              ? "Skattegrunnlag: Kommuner som bruker Skatteetatens boligverdi (f.eks. Oslo, Bergen, Lillestrøm) benytter beregnet markedsverdi fra to år tilbake (2024-grunnlaget for skatteåret 2026). Fritidsboliger og kommuner med egen taksering (f.eks. Trondheim, Stavanger, Fredrikstad) bruker kommunal skattetakst som kan avvike fra dagens salgsverdi."
              : "Tax base: Municipalities using Skatteetaten's residential value (e.g., Oslo, Bergen, Lillestrøm) apply the assessed value from two years prior (2024 basis for 2026 tax). Cabins and locally assessed municipalities (e.g., Trondheim, Stavanger, Fredrikstad) use municipal valuations that may differ from current market price."}
          </li>
          <li>
            {lang === "no"
              ? "Kilde: SSB og kommunale skattevedtak for 2026. Satser og bunnfradrag vedtas årlig av kommunestyret — sjekk kommunens eiendomsskatteseddel for eksakt beløp."
              : "Source: SSB and 2026 municipal budget resolutions. Rates and thresholds are set annually by each municipal council — verify exact figures on your municipal tax notice."}
          </li>
        </ul>
      </div>

      {/* Programmatic SEO Internal Links to All 20 Norwegian Municipalities */}
      <div
        className={`p-4 sm:p-6 space-y-3 ${
          isModern
            ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl"
            : "bg-[#EDF0E7] border border-[#DCE2CF] rounded-none"
        }`}
      >
        <h2
          className={`text-[16px] sm:text-[17px] font-semibold ${
            isModern ? "text-[#121C17]" : "text-[#000000]"
          }`}
        >
          {lang === "no"
            ? "Se satser for eiendomsskatt i andre norske kommuner:"
            : "Check property tax rates by Norwegian municipality:"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {NORWAY_MUNICIPALITIES_TAX.map((m) => (
            <Link
              key={m.id}
              href={`/verktoy/eiendomsskatt/${m.id}`}
              className={`px-3 py-1.5 text-[14px] font-medium border transition-colors ${
                m.id === rule.id
                  ? isModern
                    ? "bg-[#147A53] border-[#147A53] text-[#FFFFFF] rounded-full"
                    : "bg-[#5D726A] border-[#5D726A] text-[#FFFFFF] rounded-none"
                  : isModern
                  ? "bg-[#FFFFFF] border-[#DCE5DF] hover:border-[#147A53] text-[#121C17] rounded-full"
                  : "bg-[#FFFFFF] border-[#BFBFBD] hover:border-[#5D726A] text-[#000000] rounded-none"
              }`}
            >
              {m.name}
            </Link>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
