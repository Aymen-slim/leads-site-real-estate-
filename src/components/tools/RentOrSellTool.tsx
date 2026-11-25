"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

// Verified 2026 Norwegian tax & market benchmarks
const WEALTH_TAX_THRESHOLD_2026 = 1_900_000; // Single filer 2026 (3 800 000 kr for married couples)
const WEALTH_TAX_RATE = 0.01; // 1.0% up to 21.5M kr net wealth
const SAVINGS_RATE_PRE_TAX = 0.045; // Typical 2026 Norwegian high-yield savings (~4.5%–4.8%)
const ESTIMATED_SELLING_COST_PCT = 0.02; // ~2.0% realistic Norwegian brokerage/marketing/report (~116k on 5.8M)

export function RentOrSellTool() {
  const { lang, isModern } = useApp();

  const [propertyValue, setPropertyValue] = useState<number>(5_800_000);
  const [mortgageRemaining, setMortgageRemaining] = useState<number>(2_500_000);
  const [mortgageRatePct, setMortgageRatePct] = useState<number>(5.3);
  const [monthlyRent, setMonthlyRent] = useState<number>(21_000);
  const [monthlyOperatingCosts, setMonthlyOperatingCosts] = useState<number>(5_200);
  const [insideTaxFreeWindow, setInsideTaxFreeWindow] = useState<boolean>(true);

  const clampedLoan = Math.min(mortgageRemaining, propertyValue);
  const netEquity = Math.max(0, propertyValue - clampedLoan);

  // Option A: Full-home rental (22% tax on net rental profit when > 20 000 kr/yr)
  const annualGrossRent = Math.round(monthlyRent * 11.4); // 5% vacancy allowance (~11.4 mo/yr)
  const monthlyAdjustedRent = Math.round(annualGrossRent / 12);
  const annualOperating = monthlyOperatingCosts * 12;
  const taxableRentalProfit = Math.max(0, annualGrossRent - annualOperating);
  const annualRentalTax = Math.round(taxableRentalProfit * 0.22);

  const annualMortgageInterest = Math.round((clampedLoan * mortgageRatePct) / 100);
  const annualMortgageInterestNet = Math.round(annualMortgageInterest * 0.78); // 22% rentefradrag

  // 2026 Wealth tax (100% secondary home valuation minus debt, above 1.9M kr single threshold)
  const annualWealthTaxRent = Math.round(
    Math.max(0, netEquity - WEALTH_TAX_THRESHOLD_2026) * WEALTH_TAX_RATE
  );

  const netAnnualRentalCashflow =
    annualGrossRent -
    annualOperating -
    annualRentalTax -
    annualMortgageInterestNet -
    annualWealthTaxRent;
  const netMonthlyCashflow = Math.round(netAnnualRentalCashflow / 12);

  const grossYieldPct = propertyValue > 0 ? (annualGrossRent / propertyValue) * 100 : 0;
  const netYieldPct =
    propertyValue > 0
      ? ((annualGrossRent - annualOperating - annualRentalTax) / propertyValue) * 100
      : 0;

  // Option B: Sell now — apples-to-apples comparison (savings account ALSO carries 100% wealth-tax valuation!)
  const estimatedSaleCosts = Math.round(propertyValue * ESTIMATED_SELLING_COST_PCT);
  const netSaleCash = Math.max(0, propertyValue - estimatedSaleCosts - clampedLoan);
  const annualSavingsAfterIncomeTax = Math.round(netSaleCash * SAVINGS_RATE_PRE_TAX * 0.78); // 3.51% net
  const annualWealthTaxSavings = Math.round(
    Math.max(0, netSaleCash - WEALTH_TAX_THRESHOLD_2026) * WEALTH_TAX_RATE
  );
  const alternativeMonthlySavingsNet = Math.round(
    (annualSavingsAfterIncomeTax - annualWealthTaxSavings) / 12
  );
  // Alternative B2: Using unlocked cash to pay down own mortgage (avoids wealth tax & saves mortgage rate after 22% tax)
  const debtPaydownMonthlyNet = Math.round(
    (netSaleCash * (mortgageRatePct / 100) * 0.78) / 12
  );

  // Botid warning: illustrative example assuming 30% historical appreciation
  const atRiskTaxIfRentOver12Mo = insideTaxFreeWindow
    ? Math.round(propertyValue * 0.3 * 0.22)
    : 0;

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  return (
    <ToolShell
      slug="rent-or-sell"
      iconKey="rent-or-sell"
      title={
        lang === "no"
          ? "Leie ut eller selge boligen?"
          : "“Rent Out vs. Sell” Property Calculator"
      }
      subtitle={
        lang === "no"
          ? "Sammenlign reell månedlig utleieøkonomi (etter tomgang, drift, 22 % skatt, renter og formuesskatt) mot å selge og frigjøre egenkapitalen i dag."
          : "Compare real monthly rental cashflow (after vacancy, upkeep, 22% tax, mortgage interest & wealth tax) against selling and unlocking your equity today."
      }
      ctaSource="rent-or-sell"
      ctaHref={`/koble-til-megler?source=rent-or-sell&type=house&price=${propertyValue}&net=${netSaleCash}&rentYield=${netYieldPct.toFixed(
        1
      )}`}
      ctaLabel={
        lang === "no"
          ? "Usikker på om du bør leie ut eller selge før botiden utløper? Få gratis rådgivning og prisvurdering"
          : "Deciding whether to rent or sell before your tax-free window closes? Request a free valuation"
      }
    >
      <div className={panelClass}>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="rent-prop-val"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "1. Boligens markedsverdi i dag" : "1. Current Property Value"}
            </label>
            <output
              htmlFor="rent-prop-val"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(propertyValue)}
            </output>
          </div>
          <input
            id="rent-prop-val"
            type="range"
            min={1_500_000}
            max={18_000_000}
            step={100_000}
            value={propertyValue}
            onChange={(e) => setPropertyValue(Number(e.target.value))}
            style={
              {
                "--attr-min": 1_500_000,
                "--attr-max": 18_000_000,
                "--control-value": propertyValue,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="rent-monthly"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "2. Forventet månedlig leieinntekt (hele boligen)"
                : "2. Expected Monthly Rent (Entire Property)"}
            </label>
            <output
              htmlFor="rent-monthly"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#147A53]" : "text-[#000000]"
              }`}
            >
              {formatNok(monthlyRent)} / {lang === "no" ? "mnd" : "mo"}
            </output>
          </div>
          <input
            id="rent-monthly"
            type="range"
            min={8_000}
            max={50_000}
            step={500}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            style={
              {
                "--attr-min": 8_000,
                "--attr-max": 50_000,
                "--control-value": monthlyRent,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="rent-costs"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "3. Felleskostnader, kommunale avgifter, forsikring & vedlikehold"
                : "3. Monthly HOA, Municipal Fees, Insurance & Maintenance"}
            </label>
            <output
              htmlFor="rent-costs"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {formatNok(monthlyOperatingCosts)} / {lang === "no" ? "mnd" : "mo"}
            </output>
          </div>
          <input
            id="rent-costs"
            type="range"
            min={1_000}
            max={18_000}
            step={200}
            value={monthlyOperatingCosts}
            onChange={(e) => setMonthlyOperatingCosts(Number(e.target.value))}
            style={
              {
                "--attr-min": 1_000,
                "--attr-max": 18_000,
                "--control-value": monthlyOperatingCosts,
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
                htmlFor="rent-loan"
                className={`text-[16px] sm:text-[17px] ${
                  isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
                }`}
              >
                {lang === "no" ? "4. Boliglån på boligen" : "4. Mortgage Remaining"}
              </label>
              <output
                htmlFor="rent-loan"
                className={`text-[20px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                  isModern ? "text-[#121C17]" : "text-[#000000]"
                }`}
              >
                {formatNok(clampedLoan)}
              </output>
            </div>
            <input
              id="rent-loan"
              type="range"
              min={0}
              max={propertyValue}
              step={100_000}
              value={clampedLoan}
              onChange={(e) => setMortgageRemaining(Number(e.target.value))}
              style={
                {
                  "--attr-min": 0,
                  "--attr-max": propertyValue,
                  "--control-value": clampedLoan,
                } as React.CSSProperties
              }
              className={sliderClass}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <label
                htmlFor="rent-mortgage-rate"
                className={`text-[16px] sm:text-[17px] ${
                  isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
                }`}
              >
                {lang === "no"
                  ? "5. Boliglånsrente (SSB-snitt ca. 5,3 %)"
                  : "5. Mortgage Rate (SSB avg ~5.3%)"}
              </label>
              <output
                htmlFor="rent-mortgage-rate"
                className={`text-[20px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                  isModern ? "text-[#121C17]" : "text-[#000000]"
                }`}
              >
                {mortgageRatePct.toFixed(1).replace(".", lang === "no" ? "," : ".")} %
              </output>
            </div>
            <input
              id="rent-mortgage-rate"
              type="range"
              min={4.0}
              max={7.5}
              step={0.1}
              value={mortgageRatePct}
              onChange={(e) => setMortgageRatePct(Number(e.target.value))}
              style={
                {
                  "--attr-min": 4.0,
                  "--attr-max": 7.5,
                  "--control-value": mortgageRatePct,
                } as React.CSSProperties
              }
              className={sliderClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setInsideTaxFreeWindow(true)}
            aria-pressed={insideTaxFreeWindow}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              insideTaxFreeWindow
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
                ? "Jeg har bodd her selv (kan selge skattefritt nå)"
                : "Lived here myself (can sell tax-free right now)"}
            </span>
            {insideTaxFreeWindow && (
              <CheckMarkIcon
                className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setInsideTaxFreeWindow(false)}
            aria-pressed={!insideTaxFreeWindow}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
              !insideTaxFreeWindow
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
                ? "Allerede sekundærbolig / ren utleiebolig"
                : "Already a secondary / rental property"}
            </span>
            {!insideTaxFreeWindow && (
              <CheckMarkIcon
                className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Botid Tax Trap Alert */}
      {insideTaxFreeWindow && (
        <div
          className={`p-5 sm:p-6 border-2 ${
            isModern
              ? "bg-[#FEF6E2] border-[#E5C169] rounded-2xl text-[#1D281C]"
              : "bg-[#FFF7D4] border-[#BA5B3E] rounded-none text-[#000000]"
          }`}
        >
          <p className="text-[17px] sm:text-[19px] font-semibold">
            {lang === "no"
              ? `Obs på 12-måneders botidsfellen: Eksempelvis ${formatNok(
                  atRiskTaxIfRentOver12Mo
                )} i gevinstskatt (ved 30 % verdistigning)`
              : `12-Month Residency Trap: e.g. ${formatNok(
                  atRiskTaxIfRentOver12Mo
                )} in Capital Gains Tax (assuming 30% appreciation)`}
          </p>
          <p className={`text-[15px] mt-1 ${isModern ? "text-[#495647]" : "text-[#292823]"}`}>
            {lang === "no"
              ? "Leier du ut din tidligere primærbolig i mer enn 12 måneder, mister du skattefriheten (Skatteloven § 9-3) og må skatte 22 % av hele den historiske gevinsten når du senere selger."
              : "Renting out your former primary residence for over 12 months voids Norway's tax-free exemption (Tax Act § 9-3) and triggers 22% tax on the entire historical appreciation."}
          </p>
        </div>
      )}

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div
          className={`p-5 sm:p-6 space-y-4 flex flex-col justify-between ${
            isModern
              ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl"
              : "bg-[#F7F7F7] border-2 border-[#BFBFBD] rounded-none"
          }`}
        >
          <div className="space-y-4">
            <h3 className="text-[20px] sm:text-2xl font-semibold text-[#000000]">
              {lang === "no" ? "Alternativ A: Leie ut hele boligen" : "Option A: Rent Out Entire Home"}
            </h3>
            <div className="space-y-2 text-[15px] sm:text-[16px]">
              <div className="flex justify-between gap-3">
                <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  {lang === "no"
                    ? "Leieinntekt (etter 5 % tomgang)"
                    : "Rental income (after 5% vacancy)"}
                </span>
                <span className="font-semibold tabular-nums">
                  +{formatNok(monthlyAdjustedRent)} / {lang === "no" ? "mnd" : "mo"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  {lang === "no" ? "Drift, felleskostn. & vedlikehold" : "Operating & upkeep"}
                </span>
                <span className="font-semibold tabular-nums">
                  − {formatNok(monthlyOperatingCosts)} / {lang === "no" ? "mnd" : "mo"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  {lang === "no" ? "Utleieskatt (22 % av overskudd)" : "Rental tax (22% of profit)"}
                </span>
                <span
                  className={`font-semibold tabular-nums ${
                    isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"
                  }`}
                >
                  − {formatNok(Math.round(annualRentalTax / 12))} / {lang === "no" ? "mnd" : "mo"}
                </span>
              </div>
              {clampedLoan > 0 && (
                <div className="flex justify-between gap-3">
                  <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                    {lang === "no"
                      ? `Renter etter 22 % fradrag (${mortgageRatePct.toFixed(1).replace(".", ",")} %)`
                      : `Mortgage interest after 22% relief (${mortgageRatePct.toFixed(1)}%)`}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"
                    }`}
                  >
                    − {formatNok(Math.round(annualMortgageInterestNet / 12))} /{" "}
                    {lang === "no" ? "mnd" : "mo"}
                  </span>
                </div>
              )}
              {annualWealthTaxRent > 0 && (
                <div className="flex justify-between gap-3">
                  <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                    {lang === "no"
                      ? "Formuesskatt (1 %, over 1,9 mill. kr)"
                      : "Wealth tax (1%, above 1.9M kr)"}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"
                    }`}
                  >
                    − {formatNok(Math.round(annualWealthTaxRent / 12))} /{" "}
                    {lang === "no" ? "mnd" : "mo"}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3 pt-1.5 border-t border-dashed border-[#CBD5CF] text-[14px]">
                <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  {lang === "no" ? "Brutto / netto yield (før lån)" : "Gross / net yield (pre-loan)"}
                </span>
                <span className="font-semibold tabular-nums">
                  {grossYieldPct.toFixed(1).replace(".", lang === "no" ? "," : ".")} % /{" "}
                  {netYieldPct.toFixed(1).replace(".", lang === "no" ? "," : ".")} %
                </span>
              </div>
            </div>
          </div>

          <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#DFDFDF]"}`}>
            <span className="block text-[14px] text-[#3B4D44]">
              {lang === "no"
                ? "Estimert netto kontantstrøm per måned (ekskl. avdrag & prisvekst)"
                : "Estimated Net Monthly Cashflow (excl. principal & appreciation)"}
            </span>
            <span
              className={`block text-[28px] sm:text-3xl font-semibold tabular-nums mt-1 ${
                netMonthlyCashflow >= 0
                  ? isModern
                    ? "text-[#147A53]"
                    : "text-[#000000]"
                  : isModern
                  ? "text-[#B8422C]"
                  : "text-[#BA5B3E]"
              }`}
            >
              {netMonthlyCashflow >= 0 ? "+" : "− "}
              {formatNok(Math.abs(netMonthlyCashflow))} / {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>
        </div>

        <div
          className={`p-5 sm:p-6 space-y-4 flex flex-col justify-between ${
            isModern
              ? "bg-[#E6F2EC] border-2 border-[#147A53] rounded-2xl"
              : "bg-[#DCE2CF] border-2 border-[#5D726A] rounded-none"
          }`}
        >
          <div className="space-y-4">
            <h3
              className={`text-[20px] sm:text-2xl font-semibold ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {lang === "no" ? "Alternativ B: Selge boligen nå" : "Option B: Sell Today"}
            </h3>
            <div className="space-y-2 text-[15px] sm:text-[16px]">
              <div className="flex justify-between gap-3">
                <span className={isModern ? "text-[#121C17]" : "text-[#292823]"}>
                  {lang === "no"
                    ? "Frigjort egenkapital (etter lån & ca. 2 % salgskostnad)"
                    : "Net Cash Unlocked (after loan & ~2% sale costs)"}
                </span>
                <span className="font-semibold tabular-nums whitespace-nowrap">
                  {formatNok(netSaleCash)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className={isModern ? "text-[#121C17]" : "text-[#292823]"}>
                  {lang === "no"
                    ? "Høyrentekonto (4,5 % før skatt = 3,51 % netto)"
                    : "High-yield savings (4.5% pre-tax = 3.51% net)"}
                </span>
                <span className="font-semibold tabular-nums whitespace-nowrap">
                  +{formatNok(Math.round(annualSavingsAfterIncomeTax / 12))} /{" "}
                  {lang === "no" ? "mnd" : "mo"}
                </span>
              </div>
              {annualWealthTaxSavings > 0 && (
                <div className="flex justify-between gap-3">
                  <span className={isModern ? "text-[#121C17]" : "text-[#292823]"}>
                    {lang === "no"
                      ? "Formuesskatt bankinnskudd (1 %, lik beregning)"
                      : "Wealth tax on cash deposit (1%, same basis)"}
                  </span>
                  <span className="font-semibold tabular-nums whitespace-nowrap">
                    − {formatNok(Math.round(annualWealthTaxSavings / 12))} /{" "}
                    {lang === "no" ? "mnd" : "mo"}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3 pt-1.5 border-t border-dashed border-[#9EB6AA] text-[14px]">
                <span className={isModern ? "text-[#121C17]" : "text-[#292823]"}>
                  {lang === "no"
                    ? `Eller nedbetale eget lån (${mortgageRatePct.toFixed(1).replace(".", ",")} % etter skatt)`
                    : `Or pay down own mortgage (${mortgageRatePct.toFixed(1)}% after tax)`}
                </span>
                <span
                  className={`font-semibold tabular-nums whitespace-nowrap ${
                    isModern ? "text-[#0F3D2E]" : "text-[#000000]"
                  }`}
                >
                  +{formatNok(debtPaydownMonthlyNet)} / {lang === "no" ? "mnd" : "mo"}
                </span>
              </div>
            </div>
          </div>

          <div className={`pt-4 border-t ${isModern ? "border-[#9EB6AA]" : "border-[#949391]"}`}>
            <span className="block text-[14px] text-[#3B4D44]">
              {lang === "no"
                ? "Netto passiv avkastning på høyrentekonto (etter inntekts- og formuesskatt)"
                : "Net Passive Savings Return (after income & wealth tax)"}
            </span>
            <span className="block text-[28px] sm:text-3xl font-semibold text-[#000000] tabular-nums mt-1">
              +{formatNok(Math.max(0, alternativeMonthlySavingsNet))} /{" "}
              {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>
        </div>
      </div>

      {/* Tax-free partial rental callout */}
      <div
        className={`p-4 sm:p-5 border ${
          isModern
            ? "bg-[#FFFFFF] border-[#DCE5DF] rounded-2xl text-[#3B4D44]"
            : "bg-[#EDF0E7] border-[#BFBFBD] rounded-none text-[#292823]"
        } text-[14px] leading-relaxed`}
      >
        <p className={`font-semibold text-[15px] mb-1 ${isModern ? "text-[#121C17]" : "text-[#000000]"}`}>
          {lang === "no"
            ? "Merk: Skattefri utleie av del av egen bolig (Skatteloven § 7-2)"
            : "Note: Tax-Free Partial Rental of Your Own Home (Tax Act § 7-2)"}
        </p>
        <p>
          {lang === "no"
            ? "Tallene over gjelder utleie av hele boligen (skattepliktig med 22 % når leieinntekten overstiger 20 000 kr/år). Bor du selv i minst 50 % av boligen regnet etter utleieverdi, er langtidsutleie av hybel eller sokkelleilighet normalt 100 % skattefri."
            : "The numbers above apply to renting out the entire property (22% tax once annual rent exceeds 20,000 kr). If you live in at least 50% of the home measured by rental value, long-term rental of a basement unit or flatlet is normally 100% tax-free."}
        </p>
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
              ? "Skatteetaten (2026): Netto utleieoverskudd skattlegges med 22 %, og gjeldsrenter gir 22 % fradrag. Sekundærbolig og bankinnskudd verdsettes begge til 100 % i formuesskatten (1,0 % over 1,9 mill. kr bunnfradrag for enslig / 3,8 mill. kr for ektepar i 2026)."
              : "Skatteetaten (2026): Net rental profit is taxed at 22%, and mortgage interest earns 22% relief. Both secondary homes and cash deposits are valued at 100% for wealth tax (1.0% above 1.9M kr single / 3.8M kr couple threshold in 2026)."}
          </li>
          <li>
            {lang === "no"
              ? "Markedsforutsetninger: 5 % tomgang (11,4 betalte måneder/år), SSB boliglånsrente (snitt ca. 5,3 % i 2026), høyrentekonto ca. 4,5 % (Finansportalen 2026) og estimert salgskostnad på ca. 2,0 % ("
              : "Market benchmarks: 5% vacancy (11.4 paid months/yr), SSB average floating mortgage rate (~5.3% in 2026), high-yield savings ~4.5% (Finansportalen 2026), and estimated ~2.0% selling cost ("}
            {formatNok(estimatedSaleCosts)}
            {lang === "no"
              ? " — meglerhonorar og valgfri forsikring varierer mellom kontorer)."
              : " — brokerage fees and optional insurance vary by agency)."}
          </li>
          <li>
            {lang === "no"
              ? "Avdrag på lån (sparing i egen bolig) og eventuell fremtidig boligprisvekst eller prisfall er ikke inkludert i den månedlige kontantstrømmen."
              : "Mortgage principal repayments (forced savings) and future property price appreciation or declines are excluded from monthly cashflow."}
          </li>
        </ul>
      </div>
    </ToolShell>
  );
}
