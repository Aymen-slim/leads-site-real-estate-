"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

export function RentOrSellTool() {
  const { lang, isModern } = useApp();

  const [propertyValue, setPropertyValue] = useState<number>(5_800_000);
  const [mortgageRemaining, setMortgageRemaining] = useState<number>(2_500_000);
  const [monthlyRent, setMonthlyRent] = useState<number>(21_000);
  const [monthlyOperatingCosts, setMonthlyOperatingCosts] = useState<number>(5_200);
  const [insideTaxFreeWindow, setInsideTaxFreeWindow] = useState<boolean>(true);

  const clampedLoan = Math.min(mortgageRemaining, propertyValue);
  const annualGrossRent = monthlyRent * 11.4; // 5% vacancy allowance
  const annualOperating = monthlyOperatingCosts * 12;
  const annualMortgageInterest = Math.round(clampedLoan * 0.056);
  const taxableRentalProfit = Math.max(0, annualGrossRent - annualOperating);
  const annualRentalTax = Math.round(taxableRentalProfit * 0.22);
  const annualInterestTaxRelief = Math.round(annualMortgageInterest * 0.22);

  // Secondary home wealth tax impact: valued at 100% vs 25% primary (~1% wealth tax on net equity above threshold)
  const netEquity = Math.max(0, propertyValue - clampedLoan);
  const annualExtraWealthTax = Math.round(Math.max(0, netEquity - 1_760_000) * 0.01);

  const netAnnualRentalCashflow = Math.round(
    annualGrossRent -
      annualOperating -
      annualRentalTax -
      annualMortgageInterest +
      annualInterestTaxRelief -
      annualExtraWealthTax
  );
  const netMonthlyCashflow = Math.round(netAnnualRentalCashflow / 12);
  const netYieldPct = propertyValue > 0 ? ((annualGrossRent - annualOperating - annualRentalTax) / propertyValue) * 100 : 0;

  // Alternative: Sell now (after ~2.2% broker/settlement), earn 4.5% safe deposit/index after 22% tax (~3.51% net)
  const netSaleCash = Math.max(0, propertyValue - Math.round(propertyValue * 0.022) - clampedLoan);
  const alternativeMonthlyReturn = Math.round((netSaleCash * 0.0351) / 12);

  // Botid warning: losing tax-free status on an assumed 30% historical appreciation
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
          ? "Se hva du faktisk sitter igjen med i måneden ved utleie – etter skatt, vedlikehold og formuesskatt – sammenlignet med å selge skattefritt i dag."
          : "Compare real monthly rental profit (after 22% tax, costs, mortgage & 100% secondary-home wealth tax) against selling tax-free today."
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
              {lang === "no" ? "2. Forventet månedlig leieinntekt" : "2. Expected Monthly Rent"}
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
                : "3. Monthly HOA, Municipal Fees, Insurance & Upkeep"}
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

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="rent-loan"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "4. Boliglån knyttet til boligen" : "4. Mortgage Remaining on Property"}
            </label>
            <output
              htmlFor="rent-loan"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
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
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
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
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
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
              ? `Obs på 12-måneders botidsfellen: Risiko for ca. ${formatNok(atRiskTaxIfRentOver12Mo)} i gevinstskatt`
              : `12-Month Residency Trap Warning: Risk of ~${formatNok(atRiskTaxIfRentOver12Mo)} in Capital Gains Tax`}
          </p>
          <p className={`text-[15px] mt-1 ${isModern ? "text-[#495647]" : "text-[#292823]"}`}>
            {lang === "no"
              ? "Leier du ut din tidligere primærbolig i mer enn 12 måneder, mister du skattefriheten og må skatte 22 % av hele den historiske gevinsten når du senere selger."
              : "Renting out your former primary residence for over 12 months voids Norway's tax-free exemption and triggers 22% tax on the entire historical appreciation."}
          </p>
        </div>
      )}

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div
          className={`p-5 sm:p-6 space-y-4 ${
            isModern
              ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl"
              : "bg-[#F7F7F7] border-2 border-[#BFBFBD] rounded-none"
          }`}
        >
          <h3 className="text-[20px] sm:text-2xl font-semibold text-[#000000]">
            {lang === "no" ? "Alternativ A: Leie ut boligen" : "Option A: Rent It Out"}
          </h3>
          <div className="space-y-2.5 text-[16px]">
            <div className="flex justify-between gap-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no" ? "Netto direkteavkastning (yield)" : "Net Rental Yield"}
              </span>
              <span className="font-semibold tabular-nums">{netYieldPct.toFixed(1).replace(".", ",")} %</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no" ? "Utleieskatt (22 % av overskudd)" : "Rental Tax (22%)"}
              </span>
              <span className={`font-semibold tabular-nums ${isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"}`}>
                − {formatNok(Math.round(annualRentalTax / 12))} / {lang === "no" ? "mnd" : "mo"}
              </span>
            </div>
            {annualExtraWealthTax > 0 && (
              <div className="flex justify-between gap-3">
                <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  {lang === "no" ? "Formuesskatt (100 % sekundærbolig)" : "Extra Wealth Tax (100% valuation)"}
                </span>
                <span className={`font-semibold tabular-nums ${isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"}`}>
                  − {formatNok(Math.round(annualExtraWealthTax / 12))} / {lang === "no" ? "mnd" : "mo"}
                </span>
              </div>
            )}
          </div>
          <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#DFDFDF]"}`}>
            <span className="block text-[14px] text-[#3B4D44]">
              {lang === "no" ? "Estimert netto kontantstrøm per måned" : "Estimated Net Monthly Cashflow"}
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
          className={`p-5 sm:p-6 space-y-4 ${
            isModern
              ? "bg-[#E6F2EC] border-2 border-[#147A53] rounded-2xl"
              : "bg-[#DCE2CF] border-2 border-[#5D726A] rounded-none"
          }`}
        >
          <h3 className={`text-[20px] sm:text-2xl font-semibold ${isModern ? "text-[#0F3D2E]" : "text-[#000000]"}`}>
            {lang === "no" ? "Alternativ B: Selge nå" : "Option B: Sell Today"}
          </h3>
          <div className="space-y-2.5 text-[16px]">
            <div className="flex justify-between gap-3">
              <span className={isModern ? "text-[#121C17]" : "text-[#292823]"}>
                {lang === "no" ? "Frigjort egenkapital etter lån & megler" : "Net Cash Unlocked After Loan & Fees"}
              </span>
              <span className="font-semibold tabular-nums">{formatNok(netSaleCash)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className={isModern ? "text-[#121C17]" : "text-[#292823]"}>
                {lang === "no" ? "Tid på leietakere, vedlikehold & tomgang" : "Landlord Stress & Vacancy Risk"}
              </span>
              <span className={`font-semibold ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`}>
                {lang === "no" ? "0 timer" : "0 hours"}
              </span>
            </div>
          </div>
          <div className={`pt-4 border-t ${isModern ? "border-[#9EB6AA]" : "border-[#949391]"}`}>
            <span className="block text-[14px] text-[#3B4D44]">
              {lang === "no"
                ? "Passiv renteavkastning på frigjort kapital (ca. 4,5 % etter skatt)"
                : "Passive Return on Unlocked Cash (~4.5% pre-tax)"}
            </span>
            <span className="block text-[28px] sm:text-3xl font-semibold text-[#000000] tabular-nums mt-1">
              +{formatNok(alternativeMonthlyReturn)} / {lang === "no" ? "mnd" : "mo"}
            </span>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
