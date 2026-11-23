"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

export function PartnerBuyoutTool() {
  const { lang, isModern } = useApp();

  const [marketValue, setMarketValue] = useState<number>(6_400_000);
  const [sharedLoan, setSharedLoan] = useState<number>(3_200_000);
  const [stayingSharePct, setStayingSharePct] = useState<number>(50);
  const [extraEquityStaying, setExtraEquityStaying] = useState<number>(0);
  const [exemptFromStampDuty, setExemptFromStampDuty] = useState<boolean>(true);

  const clampedLoan = Math.min(sharedLoan, marketValue);
  const totalNetEquity = Math.max(0, marketValue - clampedLoan);
  const clampedExtra = Math.min(extraEquityStaying, totalNetEquity);
  const sharedNetPool = Math.max(0, totalNetEquity - clampedExtra);

  const leavingShareRatio = (100 - stayingSharePct) / 100;
  const buyoutAmount = Math.round(sharedNetPool * leavingShareRatio);
  const stayingEquity = totalNetEquity - buyoutAmount;

  const stampDutyCost = exemptFromStampDuty
    ? 0
    : Math.round(marketValue * leavingShareRatio * 0.025);
  const newTotalMortgageNeeded = clampedLoan + buyoutAmount + stampDutyCost;
  const requiredGrossIncome = Math.round(newTotalMortgageNeeded / 5);

  const stayingPctBar =
    totalNetEquity > 0 ? Math.round((stayingEquity / totalNetEquity) * 100) : 50;
  const leavingPctBar = 100 - stayingPctBar;

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  const splitOptions = [
    { pct: 50, label: "50 / 50" },
    { pct: 60, label: "60 / 40" },
    { pct: 70, label: "70 / 30" },
    { pct: 40, label: "40 / 60" },
  ];

  return (
    <ToolShell
      slug="partner-buyout"
      iconKey="partner-buyout"
      title={
        lang === "no"
          ? "Samlivsbruddkalkulator"
          : "Partner Buyout & Separation Split Calculator"
      }
      subtitle={
        lang === "no"
          ? "Finn ut hva det koster å kjøpe ut partneren. Regn ut utkjøpssum, lånebehov og inntektskrav."
          : "Calculate exact buyout payout, required new mortgage, and Norway's 5× income cap if one partner keeps the home — or request a neutral E-takst."
      }
      ctaSource="partner-buyout"
      ctaHref={`/koble-til-megler?source=partner-buyout&type=house&price=${marketValue}&net=${buyoutAmount}&buyout=${buyoutAmount}`}
      ctaLabel={
        lang === "no"
          ? "Trenger dere en nøytral verdivurdering (E-takst) eller vurderer å selge samlet? Koble til lokal megler"
          : "Need a neutral E-takst valuation both partners trust, or considering selling together?"
      }
    >
      <div className={panelClass}>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="buyout-value"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "1. Boligens antatte markedsverdi (E-takst)" : "1. Estimated Market Value (E-takst)"}
            </label>
            <output
              htmlFor="buyout-value"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(marketValue)}
            </output>
          </div>
          <input
            id="buyout-value"
            type="range"
            min={1_500_000}
            max={20_000_000}
            step={100_000}
            value={marketValue}
            onChange={(e) => setMarketValue(Number(e.target.value))}
            style={
              {
                "--attr-min": 1_500_000,
                "--attr-max": 20_000_000,
                "--control-value": marketValue,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="buyout-loan"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "2. Felles boliglån som overtas" : "2. Shared Mortgage Remaining"}
            </label>
            <output
              htmlFor="buyout-loan"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {formatNok(clampedLoan)}
            </output>
          </div>
          <input
            id="buyout-loan"
            type="range"
            min={0}
            max={marketValue}
            step={100_000}
            value={clampedLoan}
            onChange={(e) => setSharedLoan(Number(e.target.value))}
            style={
              {
                "--attr-min": 0,
                "--attr-max": marketValue,
                "--control-value": clampedLoan,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="buyout-extra-equity"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "3. Eventuell særskilt egenkapital fra den som overtar"
                : "3. Separate Initial Down-Payment (Staying Partner)"}
            </label>
            <output
              htmlFor="buyout-extra-equity"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {formatNok(clampedExtra)}
            </output>
          </div>
          <input
            id="buyout-extra-equity"
            type="range"
            min={0}
            max={Math.max(100_000, Math.min(3_000_000, totalNetEquity))}
            step={50_000}
            value={clampedExtra}
            onChange={(e) => setExtraEquityStaying(Number(e.target.value))}
            style={
              {
                "--attr-min": 0,
                "--attr-max": Math.max(100_000, Math.min(3_000_000, totalNetEquity)),
                "--control-value": clampedExtra,
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
              ? "4. Eierbrøk (den som overtar / den som flytter ut)"
              : "4. Ownership Split (Staying / Moving Out)"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {splitOptions.map((opt) => {
              const active = stayingSharePct === opt.pct;
              return (
                <button
                  key={opt.pct}
                  type="button"
                  onClick={() => setStayingSharePct(opt.pct)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[60px] px-4 py-3 border-2 text-[18px] font-semibold tabular-nums flex items-center justify-center gap-2 ${
                    active
                      ? isModern
                        ? "bg-[#147A53] border-[#0F3D2E] text-[#FFFFFF]"
                        : "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#121C17]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#000000]"
                  }`}
                >
                  <span>{opt.label} %</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setExemptFromStampDuty(true)}
            aria-pressed={exemptFromStampDuty}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              exemptFromStampDuty
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
                ? "Gift eller samboer 2+ år / felles barn (0 kr avgift)"
                : "Married or 2+ yrs / shared children (0 kr duty)"}
            </span>
            {exemptFromStampDuty && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setExemptFromStampDuty(false)}
            aria-pressed={!exemptFromStampDuty}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              !exemptFromStampDuty
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
                ? "Samboer under 2 år uten barn (2,5 % avgift)"
                : "Cohabitant under 2 yrs, no children (2.5% duty)"}
            </span>
            {!exemptFromStampDuty && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Modern Visual Split Bar */}
      {isModern && (
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[16px] font-semibold text-[#121C17]">
              {lang === "no" ? "Fordeling av netto egenkapital" : "Net Equity Split"}
            </span>
            <span className="text-[15px] font-semibold text-[#147A53] tabular-nums">
              {formatNok(totalNetEquity)}
            </span>
          </div>
          <div className="h-5 w-full rounded-full overflow-hidden flex gap-0.5 bg-[#F1F5F3]">
            <div
              className="h-full bg-[#147A53] transition-all duration-300"
              style={{ width: `${stayingPctBar}%` }}
            />
            <div
              className="h-full bg-[#0F3D2E] transition-all duration-300"
              style={{ width: `${leavingPctBar}%` }}
            />
          </div>
          <div className="flex flex-wrap justify-between gap-3 text-[13px] text-[#3B4D44]">
            <span>
              {lang === "no" ? "Den som overtar" : "Staying partner"}: <strong>{formatNok(stayingEquity)}</strong> ({stayingPctBar}%)
            </span>
            <span>
              {lang === "no" ? "Utkjøpssum til utflytter" : "Buyout payout"}: <strong>{formatNok(buyoutAmount)}</strong> ({leavingPctBar}%)
            </span>
          </div>
        </div>
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
              {lang === "no" ? "Samlet netto egenkapital i boligen" : "Total Net Home Equity"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(totalNetEquity)}
            </span>
          </div>

          {stampDutyCost > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no" ? "Dokumentavgift (2,5 % på overtatt andel)" : "Stamp Duty (2.5% on Transferred Share)"}
              </span>
              <span
                className={`font-semibold tabular-nums whitespace-nowrap ${
                  isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"
                }`}
              >
                {formatNok(stampDutyCost)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? "Nytt totalt boliglån for den som overtar alene"
                : "New Total Mortgage Needed Alone"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(newTotalMortgageNeeded)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no"
                ? "Veiledende minste brutto årsinntekt (5× regel)"
                : "Estimated Minimum Gross Income (5× Rule)"}
            </span>
            <span
              className={`font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#5D726A]"
              }`}
            >
              {formatNok(requiredGrossIncome)} / {lang === "no" ? "år" : "yr"}
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
            {lang === "no" ? "Utkjøpssum som skal utbetales" : "Buyout Sum to Pay Out"}
          </span>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(buyoutAmount)}
          </span>
        </div>
      </div>
    </ToolShell>
  );
}
