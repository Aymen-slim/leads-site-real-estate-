"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

export function CabinCostTool() {
  const { lang, isModern } = useApp();

  const [cabinValue, setCabinValue] = useState<number>(3_800_000);
  const [cabinLoan, setCabinLoan] = useState<number>(1_600_000);
  const [annualFixedFees, setAnnualFixedFees] = useState<number>(46_000); // strøm, kommunale, brøyting, feste, forsikring
  const [nightsPerYear, setNightsPerYear] = useState<number>(30);
  const [usedFiveOfEightYears, setUsedFiveOfEightYears] = useState<boolean>(true);

  const clampedLoan = Math.min(cabinLoan, cabinValue);
  const equityInCabin = Math.max(0, cabinValue - clampedLoan);

  const annualInterestAfterTax = Math.round(clampedLoan * 0.056 * 0.78);
  const annualOpportunityCost = Math.round(equityInCabin * 0.035); // ~4.5% safe return after 22% tax
  const annualMaintenance = Math.round(cabinValue * 0.008); // ~0.8% upkeep
  const totalAnnualCost =
    annualFixedFees + annualInterestAfterTax + annualMaintenance + annualOpportunityCost;
  const directOutOfPocketAnnual = annualFixedFees + annualInterestAfterTax + annualMaintenance;

  const costPerNightTrue = Math.round(totalAnnualCost / nightsPerYear);
  const costPerNightDirect = Math.round(directOutOfPocketAnnual / nightsPerYear);
  const netCashIfSold = Math.max(
    0,
    cabinValue - Math.round(cabinValue * 0.025 + 25_000) - clampedLoan
  );

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  return (
    <ToolShell
      slug="cabin-cost"
      iconKey="cabin-cost"
      title={
        lang === "no"
          ? "Hyttekostnad & Hyttesalg Kalkulator"
          : "Cabin Annual Cost & Tax-Free Sale Calculator"
      }
      subtitle={
        lang === "no"
          ? "Regn ut hva hytta faktisk koster deg i året og per bruksdøgn — og sjekk om du kan selge fritidsboligen helt skattefritt etter 5-av-8-årsregelen."
          : "Calculate what your Norwegian cabin truly costs per year and per night used — and check Norway's 5-of-8-year tax-free sale rule."
      }
      ctaSource="cabin-cost"
      ctaHref={`/connect-agency?source=cabin-cost&type=house&price=${cabinValue}&net=${netCashIfSold}&cabinNight=${costPerNightTrue}`}
      ctaLabel={
        lang === "no"
          ? "Bruker du hytta mindre enn før? Få en uforpliktende verdivurdering fra lokal hyttemegler"
          : "Using the cabin less than before? Request a free valuation from a local cabin specialist"
      }
    >
      <div className={panelClass}>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="cabin-val"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "1. Antatt markedsverdi på hytta" : "1. Estimated Cabin Market Value"}
            </label>
            <output
              htmlFor="cabin-val"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(cabinValue)}
            </output>
          </div>
          <input
            id="cabin-val"
            type="range"
            min={800_000}
            max={15_000_000}
            step={100_000}
            value={cabinValue}
            onChange={(e) => setCabinValue(Number(e.target.value))}
            style={
              {
                "--attr-min": 800_000,
                "--attr-max": 15_000_000,
                "--control-value": cabinValue,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="cabin-loan"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "2. Lån knyttet til hytta" : "2. Mortgage on Cabin"}
            </label>
            <output
              htmlFor="cabin-loan"
              className="text-[22px] font-semibold tabular-nums whitespace-nowrap"
            >
              {formatNok(clampedLoan)}
            </output>
          </div>
          <input
            id="cabin-loan"
            type="range"
            min={0}
            max={cabinValue}
            step={100_000}
            value={clampedLoan}
            onChange={(e) => setCabinLoan(Number(e.target.value))}
            style={
              {
                "--attr-min": 0,
                "--attr-max": cabinValue,
                "--control-value": clampedLoan,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="cabin-fixed"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "3. Årlige faste utgifter (strøm, kommunale, vei/brøyting, feste, forsikring)"
                : "3. Annual Fixed Costs (power, municipal fees, plowing, lease, insurance)"}
            </label>
            <output
              htmlFor="cabin-fixed"
              className="text-[22px] font-semibold tabular-nums whitespace-nowrap"
            >
              {formatNok(annualFixedFees)} / {lang === "no" ? "år" : "yr"}
            </output>
          </div>
          <input
            id="cabin-fixed"
            type="range"
            min={15_000}
            max={150_000}
            step={2_000}
            value={annualFixedFees}
            onChange={(e) => setAnnualFixedFees(Number(e.target.value))}
            style={
              {
                "--attr-min": 15_000,
                "--attr-max": 150_000,
                "--control-value": annualFixedFees,
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
            {lang === "no" ? "4. Hvor mange døgn brukes hytta i året?" : "4. Nights Used Per Year"}
          </p>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[10, 20, 30, 50, 75].map((n) => {
              const active = nightsPerYear === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNightsPerYear(n)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[64px] border-2 font-semibold text-xl sm:text-2xl tabular-nums flex flex-col items-center justify-center ${
                    active
                      ? isModern
                        ? "bg-[#147A53] border-[#0F3D2E] text-[#FFFFFF]"
                        : "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#121C17]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#000000]"
                  }`}
                >
                  <span>{n}</span>
                  <span className="text-[12px] font-medium">
                    {lang === "no" ? "døgn" : "nights"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setUsedFiveOfEightYears(true)}
            aria-pressed={usedFiveOfEightYears}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              usedFiveOfEightYears
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <span>
              {lang === "no"
                ? "Eid & brukt 5 av siste 8 år (Skattefritt salg)"
                : "Owned & used 5 of last 8 yrs (Tax-free sale)"}
            </span>
            {usedFiveOfEightYears && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setUsedFiveOfEightYears(false)}
            aria-pressed={!usedFiveOfEightYears}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              !usedFiveOfEightYears
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <span>
              {lang === "no"
                ? "Under 5 år eiertid (22 % gevinstskatt)"
                : "Under 5 years owned (22% tax on gain)"}
            </span>
            {!usedFiveOfEightYears && (
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
              {lang === "no" ? "Direkte årsutgift (drift + renter etter skatt + vedlikehold)" : "Direct Annual Out-of-Pocket Cost"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(directOutOfPocketAnnual)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Alternativkostnad på bundet egenkapital (ca. 3,5 % etter skatt)" : "Opportunity Cost on Equity (~3.5% net)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(annualOpportunityCost)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Total reell hyttekostnad per år" : "Total True Annual Cabin Cost"}
            </span>
            <span className={`font-semibold tabular-nums whitespace-nowrap ${isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"}`}>
              {formatNok(totalAnnualCost)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Estimert netto frigjort kapital ved salg i dag" : "Estimated Net Cash Unlocked if Sold Today"}
            </span>
            <span className={`font-semibold tabular-nums whitespace-nowrap ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`}>
              {formatNok(netCashIfSold)} ({usedFiveOfEightYears ? (lang === "no" ? "skattefritt" : "tax-free") : "22 %"})
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
              {lang === "no"
                ? `Reell kostnad per bruksdøgn (${nightsPerYear} døgn/år)`
                : `True Cost Per Night Used (${nightsPerYear} nights/yr)`}
            </span>
            <span className={`block text-[14px] mt-0.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no"
                ? `Direkte kontantutlegg per døgn (uten kapitalkostnad): ${formatNok(costPerNightDirect)}`
                : `Direct cash cost per night (excluding equity opportunity): ${formatNok(costPerNightDirect)}`}
            </span>
          </div>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(costPerNightTrue)}
          </span>
        </div>
      </div>
    </ToolShell>
  );
}
