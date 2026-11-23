"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

export function GroundLeaseTool() {
  const { lang, isModern } = useApp();

  const [currentAnnualRent, setCurrentAnnualRent] = useState<number>(12_000);
  const [rawLandValue, setRawLandValue] = useState<number>(1_600_000);
  const [kpiIncreasePct, setKpiIncreasePct] = useState<number>(25);
  const [ruleMode, setRuleMode] = useState<"25x" | "40pct">("25x");

  const adjustedAnnualRent = Math.round(currentAnnualRent * (1 + kpiIncreasePct / 100));
  const buyout25x = adjustedAnnualRent * 25;
  const buyout40pct = Math.round(rawLandValue * 0.4);
  const selectedBuyout = ruleMode === "25x" ? buyout25x : buyout40pct;
  const tenYearRentTotal = adjustedAnnualRent * 10;
  const stampDutyOnBuyout = Math.round(selectedBuyout * 0.025) + 1_000;
  const totalBuyoutWithFees = selectedBuyout + stampDutyOnBuyout;

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
          ? "Beregn lovfestet innløsningssum for festetomt, KPI-regulering og effekt på salgsprisen."
          : "Calculate statutory buyout pricing under Norway's Ground Lease Act (25× CPI-adjusted rent or 40% raw plot value) before selling a house or cabin."
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
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="lease-rent"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "1. Nåværende årlig festeavgift" : "1. Current Annual Ground Rent"}
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
              ? "2. KPI-økning siden siste regulering av festeavgiften"
              : "2. CPI Increase Since Last Rent Adjustment"}
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
              {lang === "no" ? "3. Estimert råtomtverdi (ubebygd verdi)" : "3. Estimated Raw Plot Value"}
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
            } min-h-[68px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
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
              <span className="block">{lang === "no" ? "Hovedregel: 25× festeavgift" : "Standard: 25× Annual Rent"}</span>
              <span className="block text-[13px] font-normal opacity-85">{formatNok(buyout25x)}</span>
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
            } min-h-[68px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
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
              <span className="block">{lang === "no" ? "Tidsbegrenset: 40 % av råtomt" : "Fixed-Term: 40% Raw Land"}</span>
              <span className="block text-[13px] font-normal opacity-85">{formatNok(buyout40pct)}</span>
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
              {lang === "no" ? "Innløsningssum til grunneier" : "Statutory Buyout Price"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(selectedBuyout)}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Dokumentavgift (2,5 %) + tinglysing ved innløsning" : "2.5% Stamp Duty + Deed Filing"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(stampDutyOnBuyout)}
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
            {lang === "no" ? "Total kostnad for å eie tomten selv" : "Total Cost to Convert to Freehold"}
          </span>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(totalBuyoutWithFees)}
          </span>
        </div>
      </div>
    </ToolShell>
  );
}
