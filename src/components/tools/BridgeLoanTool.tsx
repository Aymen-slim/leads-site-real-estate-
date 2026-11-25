"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { ToolShell } from "@/components/ToolShell";

export function BridgeLoanTool() {
  const { lang, isModern } = useApp();

  const [currentHomeValue, setCurrentHomeValue] = useState<number>(6_200_000);
  const [remainingLoan, setRemainingLoan] = useState<number>(2_600_000);
  const [bridgeRatePct, setBridgeRatePct] = useState<number>(6.8);
  const [existingRatePct, setExistingRatePct] = useState<number>(5.3); // SSB 2026 average floating mortgage rate
  const [monthlyExtraOperating, setMonthlyExtraOperating] = useState<number>(3_500);
  const [overlapMonths, setOverlapMonths] = useState<number>(3);

  const clampedLoan = Math.min(remainingLoan, currentHomeValue);
  const lockedEquity = Math.max(0, currentHomeValue - clampedLoan);

  const bankStressValue10 = Math.round(currentHomeValue * 0.9);
  const bankStressValue15 = Math.round(currentHomeValue * 0.85);
  const maxBankBridgeHigh = Math.max(0, bankStressValue10 - clampedLoan);
  const maxBankBridgeLow = Math.max(0, bankStressValue15 - clampedLoan);
  const underwaterAt15 = bankStressValue15 < clampedLoan;

  // 1. Interest on bridge loan (locked equity)
  const monthlyBridgeGross = Math.round(((lockedEquity * bridgeRatePct) / 100) / 12);
  const monthlyBridgeNet = Math.round(monthlyBridgeGross * 0.78); // 22% rentefradrag

  // 2. Interest on existing mortgage while old home remains unsold
  const monthlyExistingGross = Math.round(((clampedLoan * existingRatePct) / 100) / 12);
  const monthlyExistingNet = Math.round(monthlyExistingGross * 0.78); // 22% rentefradrag

  const monthlyTotalInterestGross = monthlyBridgeGross + monthlyExistingGross;
  const monthlyTotalInterestNet = monthlyBridgeNet + monthlyExistingNet;
  const monthlyTaxRelief = monthlyTotalInterestGross - monthlyTotalInterestNet;

  // 3. Total monthly double-housing extra cost during overlap
  const monthlyTotalOverlapCost = monthlyTotalInterestNet + monthlyExtraOperating;
  const totalOverlapCost = monthlyTotalOverlapCost * overlapMonths;
  const totalBridgeInterestOnly = monthlyBridgeNet * overlapMonths;

  const riskLevel =
    underwaterAt15 || overlapMonths >= 5 || monthlyTotalOverlapCost > 38_000
      ? "high"
      : overlapMonths >= 3
      ? "medium"
      : "low";

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  return (
    <ToolShell
      slug="bridge-loan"
      iconKey="bridge-loan"
      title={
        lang === "no"
          ? "Mellomfinansiering & «Kjøpe eller selge først?»"
          : "Bridge Loan & Buy-vs-Sell-First Calculator"
      }
      subtitle={
        lang === "no"
          ? "Se hele den månedlige ekstrakostnaden ved to boliger samtidig — mellomfinansieringsrente, eksisterende lån, 22 % rentefradrag, doble driftskostnader og bankens 10–15 % prisfall-buffer."
          : "See your full monthly double-housing cost — bridge loan interest, existing mortgage interest, 22% tax relief, extra running costs, and banks' 10–15% valuation haircut."
      }
      ctaSource="bridge-loan"
      ctaHref={`/koble-til-megler?source=bridge-loan&type=house&price=${currentHomeValue}&bridge=${totalOverlapCost}`}
      ctaLabel={
        lang === "no"
          ? "Få eksakt prisvurdering og forventet salgstid i ditt nabolag før du legger inn bud"
          : "Get an accurate valuation and local days-to-sell forecast before placing a bid"
      }
    >
      <div className={panelClass}>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="bridge-home-val"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "1. Antatt verdi på boligen du skal selge"
                : "1. Estimated Value of Current Home"}
            </label>
            <output
              htmlFor="bridge-home-val"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(currentHomeValue)}
            </output>
          </div>
          <input
            id="bridge-home-val"
            type="range"
            min={2_000_000}
            max={20_000_000}
            step={100_000}
            value={currentHomeValue}
            onChange={(e) => setCurrentHomeValue(Number(e.target.value))}
            style={
              {
                "--attr-min": 2_000_000,
                "--attr-max": 20_000_000,
                "--control-value": currentHomeValue,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="bridge-rem-loan"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "2. Restlån på nåværende bolig"
                : "2. Remaining Mortgage on Current Home"}
            </label>
            <output
              htmlFor="bridge-rem-loan"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {formatNok(clampedLoan)}
            </output>
          </div>
          <input
            id="bridge-rem-loan"
            type="range"
            min={0}
            max={currentHomeValue}
            step={100_000}
            value={clampedLoan}
            onChange={(e) => setRemainingLoan(Number(e.target.value))}
            style={
              {
                "--attr-min": 0,
                "--attr-max": currentHomeValue,
                "--control-value": clampedLoan,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div
          className={`pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6 ${
            isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"
          }`}
        >
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <label
                htmlFor="bridge-rate"
                className={`text-[16px] sm:text-[17px] ${
                  isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
                }`}
              >
                {lang === "no"
                  ? "3. Mellomfinansieringsrente (typisk 6,0–7,8 %)"
                  : "3. Bridge Loan Rate (typical 6.0–7.8%)"}
              </label>
              <output
                htmlFor="bridge-rate"
                className={`text-[20px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                  isModern ? "text-[#121C17]" : "text-[#000000]"
                }`}
              >
                {bridgeRatePct.toFixed(1).replace(".", lang === "no" ? "," : ".")} %
              </output>
            </div>
            <input
              id="bridge-rate"
              type="range"
              min={5.0}
              max={9.5}
              step={0.1}
              value={bridgeRatePct}
              onChange={(e) => setBridgeRatePct(Number(e.target.value))}
              style={
                {
                  "--attr-min": 5.0,
                  "--attr-max": 9.5,
                  "--control-value": bridgeRatePct,
                } as React.CSSProperties
              }
              className={sliderClass}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <label
                htmlFor="bridge-existing-rate"
                className={`text-[16px] sm:text-[17px] ${
                  isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
                }`}
              >
                {lang === "no"
                  ? "4. Rente på nåværende boliglån (snitt ca. 5,3 %)"
                  : "4. Current Mortgage Rate (avg ~5.3%)"}
              </label>
              <output
                htmlFor="bridge-existing-rate"
                className={`text-[20px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                  isModern ? "text-[#121C17]" : "text-[#000000]"
                }`}
              >
                {existingRatePct.toFixed(1).replace(".", lang === "no" ? "," : ".")} %
              </output>
            </div>
            <input
              id="bridge-existing-rate"
              type="range"
              min={4.0}
              max={7.5}
              step={0.1}
              value={existingRatePct}
              onChange={(e) => setExistingRatePct(Number(e.target.value))}
              style={
                {
                  "--attr-min": 4.0,
                  "--attr-max": 7.5,
                  "--control-value": existingRatePct,
                } as React.CSSProperties
              }
              className={sliderClass}
            />
          </div>
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="bridge-extra-ops"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "5. Faste bokostnader på gammel bolig (felleskostn., strøm, forsikring)"
                : "5. Running Costs on Unsold Home (HOA, power, insurance)"}
            </label>
            <output
              htmlFor="bridge-extra-ops"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {formatNok(monthlyExtraOperating)} / {lang === "no" ? "mnd" : "mo"}
            </output>
          </div>
          <input
            id="bridge-extra-ops"
            type="range"
            min={0}
            max={15_000}
            step={500}
            value={monthlyExtraOperating}
            onChange={(e) => setMonthlyExtraOperating(Number(e.target.value))}
            style={
              {
                "--attr-min": 0,
                "--attr-max": 15_000,
                "--control-value": monthlyExtraOperating,
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
              ? "6. Antall måneder med to boliger (overlapp)"
              : "6. Overlap Months Holding Two Homes"}
          </p>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 6].map((m) => {
              const active = overlapMonths === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setOverlapMonths(m)}
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
                  <span>{m}</span>
                  <span className="text-[12px] font-medium">
                    {lang === "no" ? "mnd" : "mo"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strategy Recommendation Banner */}
      <div
        className={`p-5 sm:p-6 border-2 ${
          isModern
            ? riskLevel === "high"
              ? "bg-[#FEF2F0] border-[#B8422C] rounded-2xl"
              : "bg-[#E6F2EC] border-[#147A53] rounded-2xl"
            : riskLevel === "high"
            ? "bg-[#FFF7D4] border-[#BA5B3E] rounded-none"
            : "bg-[#DCE2CF] border-[#5D726A] rounded-none"
        }`}
      >
        <p className="text-[18px] sm:text-xl font-semibold text-[#000000]">
          {underwaterAt15
            ? lang === "no"
              ? "Anbefaling: Selg først — for lite egenkapital etter bankens 15 % sikkerhetsmargin"
              : "Recommendation: Sell First — insufficient equity buffer after bank's 15% haircut"
            : riskLevel === "high"
            ? lang === "no"
              ? "Anbefaling: Vurder å selge først (høy rente- og overlappskostnad)"
              : "Recommendation: Consider Selling First (high monthly overlap cost & risk)"
            : lang === "no"
            ? "Anbefaling: Kjøpe først kan være håndterbart — men få sikker E-takst før bud"
            : "Recommendation: Buying First may be manageable — secure a verified E-takst first"}
        </p>
        <p className={`text-[15px] mt-1.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
          {lang === "no"
            ? `Banken stresstester normalt salgsprisen ned 10–15 % (til ${formatNok(
                bankStressValue15
              )} – ${formatNok(
                bankStressValue10
              )}). Etter restlån gir det en tilgjengelig egenkapitalbuffer på ${formatNok(
                maxBankBridgeLow
              )} – ${formatNok(maxBankBridgeHigh)}.`
            : `Norwegian banks typically apply a 10–15% haircut (to ${formatNok(
                bankStressValue15
              )} – ${formatNok(
                bankStressValue10
              )}), leaving ${formatNok(maxBankBridgeLow)} – ${formatNok(
                maxBankBridgeHigh
              )} in recognized bridge equity after your existing mortgage.`}
        </p>
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
              {lang === "no"
                ? "Bundet egenkapital (mellomfinansieringsbehov)"
                : "Locked Equity (Bridge Loan Amount)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(lockedEquity)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              <span className="block">
                {lang === "no"
                  ? `Renter på mellomfinansiering (${bridgeRatePct.toFixed(1).replace(".", ",")} %)`
                  : `Bridge Loan Interest (${bridgeRatePct.toFixed(1)}%)`}
              </span>
              <span className="block text-[13px] opacity-80">
                {lang === "no"
                  ? `Før skatt: ${formatNok(monthlyBridgeGross)} / mnd → etter 22 % rentefradrag`
                  : `Pre-tax: ${formatNok(monthlyBridgeGross)} / mo → after 22% tax relief`}
              </span>
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(monthlyBridgeNet)} / {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              <span className="block">
                {lang === "no"
                  ? `Renter på eksisterende lån på gammel bolig (${existingRatePct
                      .toFixed(1)
                      .replace(".", ",")} %)`
                  : `Interest on Existing Mortgage (${existingRatePct.toFixed(1)}%)`}
              </span>
              <span className="block text-[13px] opacity-80">
                {lang === "no"
                  ? `Før skatt: ${formatNok(monthlyExistingGross)} / mnd → etter 22 % rentefradrag`
                  : `Pre-tax: ${formatNok(monthlyExistingGross)} / mo → after 22% tax relief`}
              </span>
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(monthlyExistingNet)} / {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? "Samlet 22 % skattefradrag på renter (allerede trukket fra)"
                : "Combined 22% Interest Tax Deduction (already applied)"}
            </span>
            <span
              className={`font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#147A53]" : "text-[#5D726A]"
              }`}
            >
              − {formatNok(monthlyTaxRelief)} / {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? "Faste driftskostnader på bolig nr. 2 (ikke fradragsberettiget)"
                : "Running Expenses on 2nd Home (non-deductible)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(monthlyExtraOperating)} / {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className="font-medium text-[#000000]">
              {lang === "no"
                ? "Samlet månedlig ekstrakostnad ved to boliger (etter skatt)"
                : "Total Monthly Extra Double-Housing Cost (After Tax)"}
            </span>
            <span
              className={`font-semibold tabular-nums whitespace-nowrap text-[18px] sm:text-xl ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(monthlyTotalOverlapCost)} / {lang === "no" ? "mnd" : "mo"}
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
                ? `Total netto overlappskostnad (${overlapMonths} mnd.)`
                : `Total Net Overlap Cost (${overlapMonths} mo)`}
            </span>
            <span
              className={`block text-[14px] mt-0.5 ${
                isModern ? "text-[#3B4D44]" : "text-[#292823]"
              }`}
            >
              {lang === "no"
                ? `Herav rene mellomfinansieringsrenter etter skatt: ${formatNok(
                    totalBridgeInterestOnly
                  )}`
                : `Of which pure bridge-loan interest after tax: ${formatNok(
                    totalBridgeInterestOnly
                  )}`}
            </span>
          </div>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(totalOverlapCost)}
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
            ? "Kilder og forutsetninger (veiledende estimat)"
            : "Sources & Assumptions (Indicative Estimate)"}
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {lang === "no"
              ? "Norges Bank & SSB (2026): Med styringsrente på 4,50 % ligger gjennomsnittlig flytende boliglånsrente rundt 5,3 %. Mellomfinansiering ligger typisk 1–2,5 prosentpoeng høyere (ca. 6,0–7,8 %, varierer mellom banker)."
              : "Norges Bank & SSB (2026): With the policy rate at 4.50%, average floating mortgage rates sit around 5.3%. Bridge financing typically runs 1–2.5 percentage points higher (~6.0–7.8%, varying by bank)."}
          </li>
          <li>
            {lang === "no"
              ? "Skatteetaten: Alle betalte gjeldsrenter gir 22 % skattefradrag (effektiv rentekostnad = 78 % av brutto renter). Løpende driftsutgifter som strøm, felleskostnader og forsikring gir ikke skattefradrag."
              : "Skatteetaten: All mortgage and bridge interest qualifies for Norway's 22% tax deduction (78% net cost). Running expenses (HOA, power, insurance) are not tax-deductible."}
          </li>
          <li>
            {lang === "no"
              ? "Beregningsforutsetning: Mellomfinansiering og eksisterende lån er beregnet som avdragsfrie i overlappsperioden (vanlig praksis opptil 6 mnd.). Eventuelt etableringsgebyr i banken (typisk 2 000–5 000 kr) og tinglysing av pant (545 kr hos Kartverket) kommer i tillegg."
              : "Assumptions: Both loans are modeled interest-only during overlap (standard up to 6 months). Bank setup fees (~2,000–5,000 kr) and Kartverket filing (545 kr) are excluded."}
          </li>
        </ul>
      </div>
    </ToolShell>
  );
}
