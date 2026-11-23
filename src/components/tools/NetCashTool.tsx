"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { HouseIcon, ArrowRightIcon, CheckMarkIcon } from "@/components/Icons";
import { ModernNetCash } from "@/components/modern/ModernNetCash";
import { ToolSeoGuide } from "@/components/ToolSeoGuide";

export function NetCashTool() {
  const { isModern } = useApp();
  if (isModern) {
    return (
      <div className="bg-[#F8FAF9] pb-12">
        <ModernNetCash />
        <div className="px-3 sm:px-6">
          <ToolSeoGuide slug="net-cash" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#FFFFFF] pb-12">
      <ClassicNetCash />
      <div className="px-4 sm:px-6">
        <ToolSeoGuide slug="net-cash" />
      </div>
    </div>
  );
}

function ClassicNetCash() {
  const { trackClick, t } = useApp();

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

  const netCashInPocket = Math.max(
    0,
    expectedPrice -
      legalAndBrokerFee -
      registrationAndMunicipalFee -
      estimatedTax -
      loanPayoff
  );

  return (
    <main className="bg-[#FFFFFF] pt-10 px-4 sm:pt-14 sm:px-6 lg:pt-16">
      <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-12">
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
            <HouseIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="kr-h1">{t.tools.tool2.title}</h1>
            <p className="kr-body-lg mt-2">{t.tools.tool2.subtitle}</p>
          </div>
        </div>

        <div className="bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6 sm:space-y-8 mb-6 sm:mb-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="expected-price-slider"
                className="text-[18px] sm:text-xl font-medium text-[#000000]"
              >
                {t.tools.tool2.sliderLabel}
              </label>
              <output
                htmlFor="expected-price-slider"
                className="text-[28px] sm:text-4xl font-medium text-[#000000] tabular-nums whitespace-nowrap"
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
              className="kr-slider"
            />
            <div className="flex justify-between text-[13px] sm:text-sm font-medium text-[#292823] tabular-nums mt-1">
              <span>{formatNok(minPrice)}</span>
              <span>{formatNok(12000000)}</span>
              <span>{formatNok(maxPrice)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#BFBFBD]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="loan-payoff-slider"
                className="text-[17px] sm:text-lg font-medium text-[#000000]"
              >
                {t.tools.tool2.loanLabel}
              </label>
              <output
                htmlFor="loan-payoff-slider"
                className="text-[22px] sm:text-2xl font-medium text-[#000000] tabular-nums whitespace-nowrap"
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
              value={Math.min(loanPayoff, expectedPrice)}
              aria-valuetext={formatNok(loanPayoff)}
              onChange={(e) => setLoanPayoff(Number(e.target.value))}
              style={
                {
                  "--attr-min": minLoan,
                  "--attr-max": Math.min(maxLoan, expectedPrice),
                  "--control-value": Math.min(loanPayoff, expectedPrice),
                } as React.CSSProperties
              }
              className="kr-slider"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsTaxFreePrimary(true)}
              aria-pressed={isTaxFreePrimary}
              className={`kr-tap-card min-h-[68px] px-4 sm:px-5 py-4 border-2 text-left font-medium text-[17px] sm:text-lg flex items-center justify-between gap-3 ${
                isTaxFreePrimary
                  ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
              }`}
            >
              <span>{t.tools.tool2.taxFreeToggle}</span>
              {isTaxFreePrimary && (
                <CheckMarkIcon className="w-6 h-6 text-[#5D726A] shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsTaxFreePrimary(false)}
              aria-pressed={!isTaxFreePrimary}
              className={`kr-tap-card min-h-[68px] px-4 sm:px-5 py-4 border-2 text-left font-medium text-[17px] sm:text-lg flex items-center justify-between gap-3 ${
                !isTaxFreePrimary
                  ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
              }`}
            >
              <span>{t.tools.tool2.taxableToggle}</span>
              {!isTaxFreePrimary && (
                <CheckMarkIcon className="w-6 h-6 text-[#5D726A] shrink-0" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 divide-y divide-[#DFDFDF] space-y-3 text-[16px] sm:text-lg">
            <div className="flex justify-between items-baseline gap-4 pt-1">
              <span className="font-medium text-[#292823]">
                {t.tools.tool2.grossLabel}
              </span>
              <span className="font-medium text-[#000000] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(expectedPrice)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-normal text-[#292823]">
                {t.tools.tool2.legalFeeLabel}
              </span>
              <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(legalAndBrokerFee)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-normal text-[#292823]">
                {t.tools.tool2.regFeeLabel}
              </span>
              <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(registrationAndMunicipalFee)}
              </span>
            </div>

            {!isTaxFreePrimary && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="font-normal text-[#292823]">
                  {t.tools.tool2.taxFeeLabel}
                </span>
                <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(estimatedTax)}
                </span>
              </div>
            )}

            {loanPayoff > 0 && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="font-normal text-[#292823]">
                  {t.tools.tool2.loanDeductionLabel}
                </span>
                <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(Math.min(loanPayoff, expectedPrice))}
                </span>
              </div>
            )}
          </div>

          <div className="bg-[#DCE2CF] border-t-2 border-[#5D726A] p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-[20px] sm:text-2xl font-medium text-[#000000]">
              {t.tools.tool2.netResultTitle}
            </span>
            <span className="text-[32px] sm:text-5xl font-medium text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(netCashInPocket)}
            </span>
          </div>
        </div>

        <Link
          href={`/koble-til-megler?source=net-cash&price=${expectedPrice}&net=${netCashInPocket}`}
          onClick={() => trackClick("net-cash")}
          className="kr-btn-primary w-full min-h-[72px] sm:min-h-[84px] px-5 sm:px-7 py-4 sm:py-5 border-2 border-[#5D726A] text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool2.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
