"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

// 2025/2026 SSB average floating residential mortgage rate (~5.35%, Norges Bank policy rate 4.50%)
const MORTGAGE_RATE = 0.0535;
const TAX_DEDUCTION_FACTOR = 0.78; // 22% interest tax deduction
const EQUITY_OPPORTUNITY_NET_RATE = 0.035; // ~4.5% safe deposit yield after 22% tax

export function CabinCostTool() {
  const { lang, isModern } = useApp();

  const [cabinValue, setCabinValue] = useState<number>(3_800_000);
  const [cabinLoan, setCabinLoan] = useState<number>(1_600_000);
  const [annualFixedFees, setAnnualFixedFees] = useState<number>(38_000);
  const [nightsPerYear, setNightsPerYear] = useState<number>(30);
  const [includeOpportunityCost, setIncludeOpportunityCost] = useState<boolean>(false);
  const [usedFiveOfEightYears, setUsedFiveOfEightYears] = useState<boolean>(true);
  const [purchaseBasis, setPurchaseBasis] = useState<number>(2_900_000);

  const clampedLoan = Math.min(cabinLoan, cabinValue);
  const clampedBasis = Math.min(purchaseBasis, cabinValue);
  const equityInCabin = Math.max(0, cabinValue - clampedLoan);

  const annualInterestAfterTax = Math.round(
    clampedLoan * MORTGAGE_RATE * TAX_DEDUCTION_FACTOR
  );
  // Realistic cabin upkeep (~0.5% of value, bounded 12k–45k kr/yr so land value doesn't inflate repairs)
  const annualMaintenance = Math.round(
    Math.min(45_000, Math.max(12_000, cabinValue * 0.005))
  );
  const annualOpportunityCost = Math.round(equityInCabin * EQUITY_OPPORTUNITY_NET_RATE);

  const directOutOfPocketAnnual =
    annualFixedFees + annualInterestAfterTax + annualMaintenance;
  const totalEconomicAnnual = directOutOfPocketAnnual + annualOpportunityCost;
  const activeAnnualCost = includeOpportunityCost
    ? totalEconomicAnnual
    : directOutOfPocketAnnual;

  const costPerNightDirect = Math.round(directOutOfPocketAnnual / nightsPerYear);
  const costPerNightTotal = Math.round(totalEconomicAnnual / nightsPerYear);
  const activeCostPerNight = includeOpportunityCost
    ? costPerNightTotal
    : costPerNightDirect;

  // Realistic cabin brokerage cost (~1.4% commission min 40k + ~45k package/report; varies by office)
  const estimatedSaleCost =
    Math.max(40_000, Math.round(cabinValue * 0.014)) + 45_000;
  const taxableGain = usedFiveOfEightYears
    ? 0
    : Math.max(0, cabinValue - clampedBasis - estimatedSaleCost);
  const capitalGainsTax = Math.round(taxableGain * 0.22);
  const netCashIfSold = Math.max(
    0,
    cabinValue - estimatedSaleCost - capitalGainsTax - clampedLoan
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
          ? "Hva koster hytta deg egentlig?"
          : "Cabin Annual Cost & Tax-Free Sale Calculator"
      }
      subtitle={
        lang === "no"
          ? "Regn ut hva hytta faktisk koster deg per år og per bruksdøgn — og sjekk regelen for skattefritt hyttesalg (5 av 8 år)"
          : "Calculate what your Norwegian cabin truly costs per year and per night used — and check Norway's 5-of-8-year tax-free sale rule."
      }
      ctaSource="cabin-cost"
      ctaHref={`/koble-til-megler?source=cabin-cost&type=cabin&price=${cabinValue}&net=${netCashIfSold}&cabinNight=${costPerNightDirect}`}
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
                ? "3. Årlige faste driftsutgifter"
                : "3. Annual Fixed Operating Costs"}
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
            min={8_000}
            max={120_000}
            step={2_000}
            value={annualFixedFees}
            onChange={(e) => setAnnualFixedFees(Number(e.target.value))}
            style={
              {
                "--attr-min": 8_000,
                "--attr-max": 120_000,
                "--control-value": annualFixedFees,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
          <p className={`text-[13px] mt-2 leading-relaxed ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
            {lang === "no"
              ? "Typiske norske nivåer (2025/2026): strøm/nettleie 10–22 000 kr (hytter kan velge Norgespris 50 øre/kWh opptil 1 000 kWh/mnd), kommunale avgifter 5–12 000 kr, forsikring 4–9 000 kr, vei/brøyting 4–10 000 kr, ev. eiendomsskatt (0–7 000 kr) og festeavgift (0–16 000 kr)."
              : "Typical Norwegian ranges (2025/2026): power/grid 10–22k kr (cabins qualify for Norgespris 50 øre/kWh up to 1,000 kWh/mo), municipal fees 5–12k kr, insurance 4–9k kr, plowing/road 4–10k kr, optional property tax (0–7k) & ground lease (0–16k)."}
          </p>
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

        <div className={`pt-4 border-t space-y-3 ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <button
            type="button"
            onClick={() => setIncludeOpportunityCost((v) => !v)}
            aria-pressed={includeOpportunityCost}
            className={`w-full ${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[58px] px-4 py-3 border-2 text-left text-[15px] font-semibold flex items-center justify-between gap-2 ${
              includeOpportunityCost
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
                ? `Inkluder alternativkostnad på bundet egenkapital (+${formatNok(annualOpportunityCost)}/år ved 3,5 % etter skatt)`
                : `Include equity opportunity cost (+${formatNok(annualOpportunityCost)}/yr at 3.5% net return)`}
            </span>
            {includeOpportunityCost && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUsedFiveOfEightYears(true)}
              aria-pressed={usedFiveOfEightYears}
              className={`${
                isModern ? "nm-tap-card" : "kr-tap-card"
              } min-h-[68px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
                usedFiveOfEightYears
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
                  {lang === "no"
                    ? "Eid > 5 år & brukt 5 av siste 8 år"
                    : "Owned >5 yrs & used 5 of last 8 yrs"}
                </span>
                <span className="block text-[13px] font-normal opacity-85">
                  {lang === "no" ? "100 % skattefritt hyttesalg" : "100% tax-free cabin sale"}
                </span>
              </div>
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
              } min-h-[68px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
                !usedFiveOfEightYears
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
                  {lang === "no"
                    ? "Ikke oppfylt 5-av-8-årsregelen"
                    : "Under 5-of-8-year rule"}
                </span>
                <span className="block text-[13px] font-normal opacity-85">
                  {lang === "no" ? "22 % skatt kun på netto gevinst" : "22% tax on net capital gain only"}
                </span>
              </div>
              {!usedFiveOfEightYears && (
                <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
              )}
            </button>
          </div>

          {!usedFiveOfEightYears && (
            <div
              className={`p-4 border ${
                isModern
                  ? "bg-[#FFFFFF] border-[#DCE5DF] rounded-xl"
                  : "bg-[#FFFFFF] border-[#BFBFBD] rounded-none"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                <label
                  htmlFor="cabin-basis"
                  className="text-[15px] sm:text-[16px] font-semibold text-[#000000]"
                >
                  {lang === "no"
                    ? "Opprinnelig kjøpesum + påkostninger (for gevinstskatt)"
                    : "Original Purchase Price + Improvements (tax basis)"}
                </label>
                <output
                  htmlFor="cabin-basis"
                  className="text-[19px] font-semibold tabular-nums whitespace-nowrap"
                >
                  {formatNok(clampedBasis)}
                </output>
              </div>
              <input
                id="cabin-basis"
                type="range"
                min={400_000}
                max={cabinValue}
                step={100_000}
                value={clampedBasis}
                onChange={(e) => setPurchaseBasis(Number(e.target.value))}
                style={
                  {
                    "--attr-min": 400_000,
                    "--attr-max": cabinValue,
                    "--control-value": clampedBasis,
                  } as React.CSSProperties
                }
                className={sliderClass}
              />
            </div>
          )}
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
              {lang === "no" ? "Faste driftsutgifter per år" : "Fixed Annual Operating Costs"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(annualFixedFees)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? "Renter på hyttelån (5,35 % SSB-snitt · etter 22 % rentefradrag)"
                : "Cabin Mortgage Interest (5.35% SSB avg. · after 22% tax relief)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(annualInterestAfterTax)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? "Estimert årlig vedlikehold (ca. 0,5 % · avrundet 12–45k)"
                : "Estimated Annual Upkeep (~0.5% · bounded 12k–45k)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(annualMaintenance)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>

          {includeOpportunityCost && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? `Alternativkostnad på bundet egenkapital (${formatNok(equityInCabin)} × 3,5 %)`
                  : `Equity Opportunity Cost (${formatNok(equityInCabin)} × 3.5% net)`}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(annualOpportunityCost)} / {lang === "no" ? "år" : "yr"}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={`font-medium ${isModern ? "text-[#121C17]" : "text-[#000000]"}`}>
              {includeOpportunityCost
                ? lang === "no"
                  ? "Totaløkonomisk hyttekostnad per år (inkl. egenkapital)"
                  : "Total Economic Cabin Cost per Year (incl. equity)"
                : lang === "no"
                ? "Samlet direkte årsutgift (drift + renter + vedlikehold)"
                : "Total Direct Annual Out-of-Pocket Cost"}
            </span>
            <span
              className={`font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"
              }`}
            >
              {formatNok(activeAnnualCost)} / {lang === "no" ? "år" : "yr"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? `Estimert netto frigjort kapital ved salg (etter lån, megler ca. ${formatNok(estimatedSaleCost)}${
                    capitalGainsTax > 0 ? ` og ${formatNok(capitalGainsTax)} gevinstskatt` : ""
                  })`
                : `Est. Net Cash if Sold Today (after loan, ~${formatNok(estimatedSaleCost)} sale fees${
                    capitalGainsTax > 0 ? ` & ${formatNok(capitalGainsTax)} gains tax` : ""
                  })`}
            </span>
            <span
              className={`font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#147A53]" : "text-[#5D726A]"
              }`}
            >
              {formatNok(netCashIfSold)} (
              {usedFiveOfEightYears
                ? lang === "no"
                  ? "skattefritt"
                  : "tax-free"
                : lang === "no"
                ? "etter 22 % skatt på gevinst"
                : "after 22% tax on gain"}
              )
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
              {includeOpportunityCost
                ? lang === "no"
                  ? `Totaløkonomisk kostnad per døgn (${formatNok(activeAnnualCost)} ÷ ${nightsPerYear})`
                  : `Full Economic Cost Per Night (${formatNok(activeAnnualCost)} ÷ ${nightsPerYear})`
                : lang === "no"
                ? `Direkte utgift per bruksdøgn (${formatNok(activeAnnualCost)} ÷ ${nightsPerYear})`
                : `Direct Cash Cost Per Night (${formatNok(activeAnnualCost)} ÷ ${nightsPerYear})`}
            </span>
            <span className={`block text-[14px] mt-1 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {includeOpportunityCost
                ? lang === "no"
                  ? `Uten alternativkostnad på egenkapital: ${formatNok(costPerNightDirect)} / døgn`
                  : `Direct cash cost excluding equity opportunity: ${formatNok(costPerNightDirect)} / night`
                : lang === "no"
                ? `Inkludert 3,5 % alternativkostnad på egenkapital: ${formatNok(costPerNightTotal)} / døgn`
                : `Including 3.5% net equity opportunity cost: ${formatNok(costPerNightTotal)} / night`}
            </span>
          </div>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(activeCostPerNight)}
          </span>
        </div>
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
            ? "Skattefritt salg av fritidsbolig krever både eiertid over 5 år OG egen fritidsbruk i minst 5 av de siste 8 årene bakover fra aksept av bud (Skatteloven § 9-3 (4)). Renteberegning bruker 5,35 % flytende snittrente (SSB 2026) med 22 % rentefradrag. Hytter omfattes ikke av ordinær strømstøtte, men kan velge Norgespris (50 øre/kWh inkl. mva, 40 øre i Nord-Norge, opptil 1 000 kWh/mnd ut 2026) pluss nettleie. Meglerkostnad varierer mellom kontor."
            : "Tax-free cabin sales require >5 years ownership AND personal leisure use in at least 5 of the last 8 years counted backward from bid acceptance (Tax Act § 9-3 (4)). Loan interest uses 5.35% floating average (SSB 2026) with 22% tax relief. Cabins do not get regular electricity subsidies but can opt into Norgespris (50 øre/kWh incl. VAT up to 1,000 kWh/mo through 2026) plus grid fees. Brokerage costs vary by office."}
        </p>
        <p className="text-[13px] opacity-85">
          {lang === "no"
            ? "Kilder: Skatteetaten (Skatteloven § 9-3), SSB (utlånsrenter 2026), Elhub / Norgespris og Huseierne / Smarte Penger."
            : "Sources: Skatteetaten (Tax Act § 9-3), SSB (2026 mortgage rates), Elhub / Norgespris, and Huseierne / Smarte Penger."}
        </p>
      </div>
    </ToolShell>
  );
}
