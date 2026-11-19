"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { HouseIcon, ArrowRightIcon, CheckMarkIcon } from "@/components/Icons";

export function ModernNetCash() {
  const { lang, trackClick, t } = useApp();

  const [expectedPrice, setExpectedPrice] = useState<number>(6800000);
  const [loanPayoff, setLoanPayoff] = useState<number>(1500000);
  const [isTaxFreePrimary, setIsTaxFreePrimary] = useState<boolean>(true);

  const minPrice = 1500000;
  const maxPrice = 25000000;
  const minLoan = 0;
  const maxLoan = 15000000;

  const legalAndBrokerFee = Math.round(expectedPrice * 0.0165 + 29500);
  const registrationAndMunicipalFee = 14800;
  const estimatedTax = isTaxFreePrimary
    ? 0
    : Math.round(expectedPrice * 0.25 * 0.22);
  const clampedLoan = Math.min(loanPayoff, expectedPrice);

  const netCashInPocket = Math.max(
    0,
    expectedPrice -
      legalAndBrokerFee -
      registrationAndMunicipalFee -
      estimatedTax -
      clampedLoan
  );

  const totalFees = legalAndBrokerFee + registrationAndMunicipalFee;
  const totalTaxAndLoan = estimatedTax + clampedLoan;

  const netSharePct =
    expectedPrice > 0 ? Math.round((netCashInPocket / expectedPrice) * 100) : 0;
  const feeSharePct =
    expectedPrice > 0
      ? Math.max(1, Math.round((totalFees / expectedPrice) * 100))
      : 0;
  const taxLoanSharePct = Math.max(0, 100 - netSharePct - feeSharePct);

  return (
    <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto nm-card p-4 sm:p-10 space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center shrink-0">
            <HouseIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="nm-h1">{t.tools.tool2.title}</h1>
            <p className="nm-body-lg mt-2">{t.tools.tool2.subtitle}</p>
          </div>
        </div>

        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="expected-price-slider"
                className="text-[18px] sm:text-xl font-semibold text-[#121C17]"
              >
                {t.tools.tool2.sliderLabel}
              </label>
              <output
                htmlFor="expected-price-slider"
                className="text-[28px] sm:text-4xl font-semibold text-[#0F3D2E] tabular-nums whitespace-nowrap"
              >
                {formatNok(expectedPrice)}
              </output>
            </div>
            <input
              id="expected-price-slider"
              type="range"
              min={minPrice}
              max={maxPrice}
              step={100000}
              value={expectedPrice}
              aria-valuetext={formatNok(expectedPrice)}
              onChange={(e) => setExpectedPrice(Number(e.target.value))}
              style={
                {
                  "--attr-min": minPrice,
                  "--attr-max": maxPrice,
                  "--control-value": expectedPrice,
                } as React.CSSProperties
              }
              className="nm-slider"
            />
            <div className="flex justify-between text-[13px] sm:text-sm font-medium text-[#3B4D44] tabular-nums mt-1">
              <span>{formatNok(minPrice)}</span>
              <span>{formatNok(12000000)}</span>
              <span>{formatNok(maxPrice)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DCE5DF]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="loan-payoff-slider"
                className="text-[17px] sm:text-lg font-semibold text-[#121C17]"
              >
                {t.tools.tool2.loanLabel}
              </label>
              <output
                htmlFor="loan-payoff-slider"
                className="text-[22px] sm:text-2xl font-semibold text-[#121C17] tabular-nums whitespace-nowrap"
              >
                {formatNok(loanPayoff)}
              </output>
            </div>
            <input
              id="loan-payoff-slider"
              type="range"
              min={minLoan}
              max={Math.min(maxLoan, expectedPrice)}
              step={100000}
              value={clampedLoan}
              aria-valuetext={formatNok(loanPayoff)}
              onChange={(e) => setLoanPayoff(Number(e.target.value))}
              style={
                {
                  "--attr-min": minLoan,
                  "--attr-max": Math.min(maxLoan, expectedPrice),
                  "--control-value": clampedLoan,
                } as React.CSSProperties
              }
              className="nm-slider"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsTaxFreePrimary(true)}
              aria-pressed={isTaxFreePrimary}
              className={`nm-tap-card min-h-[68px] px-4 sm:px-5 py-4 border-2 text-left font-medium text-[16px] sm:text-lg flex items-center justify-between gap-3 ${
                isTaxFreePrimary
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
              }`}
            >
              <span>{t.tools.tool2.taxFreeToggle}</span>
              {isTaxFreePrimary && (
                <CheckMarkIcon className="w-6 h-6 text-[#147A53] shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsTaxFreePrimary(false)}
              aria-pressed={!isTaxFreePrimary}
              className={`nm-tap-card min-h-[68px] px-4 sm:px-5 py-4 border-2 text-left font-medium text-[16px] sm:text-lg flex items-center justify-between gap-3 ${
                !isTaxFreePrimary
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
              }`}
            >
              <span>{t.tools.tool2.taxableToggle}</span>
              {!isTaxFreePrimary && (
                <CheckMarkIcon className="w-6 h-6 text-[#147A53] shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Live Stacked Cash-Breakdown Visual Bar */}
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[16px] font-semibold text-[#121C17]">
              {lang === "no"
                ? "Fordeling av salgssummen"
                : "Sale Proceeds Visual Breakdown"}
            </span>
            <span className="text-[15px] font-semibold text-[#147A53] tabular-nums">
              {netSharePct}%{" "}
              {lang === "no" ? "netto utbetalt" : "net cash in pocket"}
            </span>
          </div>

          <div
            role="img"
            aria-label={`Net cash ${netSharePct} percent, Fees ${feeSharePct} percent, Tax and loan ${taxLoanSharePct} percent`}
            className="h-5 w-full rounded-full overflow-hidden flex bg-[#F1F5F3]"
          >
            <div
              className="h-full bg-[#147A53] transition-all duration-300"
              style={{ width: `${netSharePct}%` }}
            />
            <div
              className="h-full bg-[#0F3D2E] transition-all duration-300"
              style={{ width: `${feeSharePct}%` }}
            />
            {taxLoanSharePct > 0 && (
              <div
                className="h-full bg-[#B8422C] transition-all duration-300"
                style={{ width: `${taxLoanSharePct}%` }}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-[14px] text-[#3B4D44]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#147A53]" />
              <span>
                {lang === "no" ? "Netto utbetalt" : "Net Cash"} ({netSharePct}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0F3D2E]" />
              <span>
                {lang === "no" ? "Megler & tinglysing" : "Fees & Deed"} ({feeSharePct}%)
              </span>
            </div>
            {totalTaxAndLoan > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#B8422C]" />
                <span>
                  {lang === "no" ? "Lån & eventuell skatt" : "Loan & Tax"} (
                  {taxLoanSharePct}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Financial Ledger */}
        <div className="bg-[#FFFFFF] border-2 border-[#147A53] rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-6 divide-y divide-[#DCE5DF] space-y-3 text-[16px] sm:text-lg">
            <div className="flex justify-between items-baseline gap-4 pt-1">
              <span className="font-medium text-[#3B4D44]">
                {t.tools.tool2.grossLabel}
              </span>
              <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(expectedPrice)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="text-[#3B4D44]">{t.tools.tool2.legalFeeLabel}</span>
              <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(legalAndBrokerFee)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="text-[#3B4D44]">{t.tools.tool2.regFeeLabel}</span>
              <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(registrationAndMunicipalFee)}
              </span>
            </div>

            {!isTaxFreePrimary && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="text-[#3B4D44]">{t.tools.tool2.taxFeeLabel}</span>
                <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(estimatedTax)}
                </span>
              </div>
            )}

            {clampedLoan > 0 && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="text-[#3B4D44]">
                  {t.tools.tool2.loanDeductionLabel}
                </span>
                <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(clampedLoan)}
                </span>
              </div>
            )}
          </div>

          <div className="bg-[#E6F2EC] border-t border-[#9EB6AA] p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-[20px] sm:text-2xl font-semibold text-[#0F3D2E]">
              {t.tools.tool2.netResultTitle}
            </span>
            <span className="text-[32px] sm:text-5xl font-semibold text-[#121C17] tabular-nums whitespace-nowrap">
              {formatNok(netCashInPocket)}
            </span>
          </div>
        </div>

        <Link
          href={`/connect-agency?source=net-cash&price=${expectedPrice}&net=${netCashInPocket}`}
          onClick={() => trackClick("net-cash")}
          className="nm-btn-primary w-full min-h-[72px] sm:min-h-[82px] px-5 sm:px-7 py-4 sm:py-5 text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool2.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
