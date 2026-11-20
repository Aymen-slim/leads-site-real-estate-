"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { ToolShell } from "@/components/ToolShell";

export function BridgeLoanTool() {
  const { lang, isModern } = useApp();

  const [currentHomeValue, setCurrentHomeValue] = useState<number>(6_200_000);
  const [remainingLoan, setRemainingLoan] = useState<number>(2_600_000);
  const [overlapMonths, setOverlapMonths] = useState<number>(3);
  const [bridgeRatePct, setBridgeRatePct] = useState<number>(6.8);

  const clampedLoan = Math.min(remainingLoan, currentHomeValue);
  const lockedEquity = Math.max(0, currentHomeValue - clampedLoan);
  const bankStressValue10 = Math.round(currentHomeValue * 0.9);
  const bankStressValue15 = Math.round(currentHomeValue * 0.85);
  const bridgeLoanAmount = lockedEquity;

  const monthlyInterestGross = Math.round(((bridgeLoanAmount * bridgeRatePct) / 100) / 12);
  const monthlyInterestAfterTax = Math.round(monthlyInterestGross * 0.78); // 22% rentefradrag
  const totalOverlapCostAfterTax = monthlyInterestAfterTax * overlapMonths;
  const riskLevel =
    overlapMonths >= 5 || bridgeLoanAmount > 5_000_000 ? "high" : overlapMonths >= 3 ? "medium" : "low";

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
          ? "Se hva mellomfinansiering koster per måned etter 22 % rentefradrag, og hvor mye banken trekker i sikkerhetsmargin (10–15 %) før du byr på ny bolig."
          : "Calculate monthly interest-only bridge loan cost after Norway's 22% tax deduction and see how banks stress-test your unsold home."
      }
      ctaSource="bridge-loan"
      ctaHref={`/connect-agency?source=bridge-loan&type=house&price=${currentHomeValue}&bridge=${totalOverlapCostAfterTax}`}
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
              {lang === "no" ? "1. Antatt verdi på boligen du skal selge" : "1. Estimated Value of Current Home"}
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
              {lang === "no" ? "2. Restlån på nåværende bolig" : "2. Remaining Mortgage on Current Home"}
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

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="bridge-rate"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "3. Rente på mellomfinansiering (snitt 6,3–7,5 %)" : "3. Bridge Loan Interest Rate"}
            </label>
            <output
              htmlFor="bridge-rate"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {bridgeRatePct.toFixed(1).replace(".", ",")} %
            </output>
          </div>
          <input
            id="bridge-rate"
            type="range"
            min={5.0}
            max={9.0}
            step={0.1}
            value={bridgeRatePct}
            onChange={(e) => setBridgeRatePct(Number(e.target.value))}
            style={
              {
                "--attr-min": 5.0,
                "--attr-max": 9.0,
                "--control-value": bridgeRatePct,
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
            {lang === "no" ? "4. Antall måneder med to boliger (overlapp)" : "4. Overlap Months Holding Two Homes"}
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
          {riskLevel === "high"
            ? lang === "no"
              ? "Anbefaling: Vurder å selge først (høy rente- og markedsrisiko)"
              : "Recommendation: Consider Selling First (high overlap cost & risk)"
            : lang === "no"
            ? "Anbefaling: Kjøpe først er håndterbart — men få sikker E-takst før bud"
            : "Recommendation: Buying First is manageable — secure a verified E-takst before bidding"}
        </p>
        <p className={`text-[15px] mt-1.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
          {lang === "no"
            ? `Banken vil normalt stressteste salgsprisen ned 10–15 % (til ${formatNok(
                bankStressValue15
              )} – ${formatNok(bankStressValue10)}) for å sikre at du tåler et tregere marked.`
            : `Norwegian banks typically apply a 10–15% haircut (to ${formatNok(
                bankStressValue15
              )} – ${formatNok(bankStressValue10)}) when approving bridge financing.`}
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
              {lang === "no" ? "Bundet egenkapital (mellomfinansieringsbehov)" : "Locked Equity (Bridge Loan Amount)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(bridgeLoanAmount)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Månedlig rente før skatt" : "Monthly Interest Before Tax"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(monthlyInterestGross)} / {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Månedlig rentekostnad etter 22 % skattefradrag" : "Monthly Net Interest (After 22% Tax Relief)"}
            </span>
            <span
              className={`font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#147A53]" : "text-[#5D726A]"
              }`}
            >
              {formatNok(monthlyInterestAfterTax)} / {lang === "no" ? "mnd" : "mo"}
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
              ? `Total netto rentekostnad (${overlapMonths} mnd.)`
              : `Total Net Bridge Interest (${overlapMonths} mo)`}
          </span>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(totalOverlapCostAfterTax)}
          </span>
        </div>
      </div>
    </ToolShell>
  );
}
