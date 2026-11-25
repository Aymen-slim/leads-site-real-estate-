"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type DutyStatus = "exempt" | "borettslag" | "taxable";

// Verified 2026 Kartverket fee: 545 kr per document (skjøte/hjemmel + new pantedokument)
const KARTVERKET_BUYOUT_FEES = 545 * 2;
const MAX_LTV_PCT = 90; // Utlånsforskriften 2025/2026: 10% egenkapitalkrav -> max 90% LTV

export function PartnerBuyoutTool() {
  const { lang, isModern } = useApp();

  const [marketValue, setMarketValue] = useState<number>(6_400_000);
  const [sharedLoan, setSharedLoan] = useState<number>(3_200_000);
  const [stayingSharePct, setStayingSharePct] = useState<number>(50);
  const [extraEquityStaying, setExtraEquityStaying] = useState<number>(0);
  const [dutyStatus, setDutyStatus] = useState<DutyStatus>("exempt");

  const clampedLoan = Math.min(sharedLoan, marketValue);
  const totalNetEquity = Math.max(0, marketValue - clampedLoan);
  const clampedExtra = Math.min(extraEquityStaying, totalNetEquity);
  const sharedNetPool = Math.max(0, totalNetEquity - clampedExtra);

  const leavingShareRatio = (100 - stayingSharePct) / 100;
  const buyoutAmount = Math.round(sharedNetPool * leavingShareRatio);
  const stayingEquity = totalNetEquity - buyoutAmount;

  const stampDutyCost =
    dutyStatus === "taxable" ? Math.round(marketValue * leavingShareRatio * 0.025) : 0;
  const publicTransferCosts = stampDutyCost + KARTVERKET_BUYOUT_FEES;

  const newTotalMortgageNeeded = clampedLoan + buyoutAmount + publicTransferCosts;
  const newLtvPct =
    marketValue > 0 ? Math.round((newTotalMortgageNeeded / marketValue) * 1000) / 10 : 0;
  const exceedsLtvCap = newLtvPct > MAX_LTV_PCT;
  const extraCashNeededForLtv = exceedsLtvCap
    ? Math.max(0, newTotalMortgageNeeded - Math.round(marketValue * (MAX_LTV_PCT / 100)))
    : 0;
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

  const dutyOptions: {
    id: DutyStatus;
    titleNo: string;
    titleEn: string;
    subNo: string;
    subEn: string;
  }[] = [
    {
      id: "exempt",
      titleNo: "Gift / samboer 2+ år / felles barn",
      titleEn: "Married / 2+ yrs / shared child",
      subNo: "0 kr dokumentavgift (felles bolig, § 8)",
      subEn: "0 kr stamp duty (shared home, § 8)",
    },
    {
      id: "borettslag",
      titleNo: "Borettslag (alle samboere)",
      titleEn: "Co-op / Borettslag (any couple)",
      subNo: "Alltid 0 kr dokumentavgift",
      subEn: "Always 0 kr state stamp duty",
    },
    {
      id: "taxable",
      titleNo: "Selveier: samboer < 2 år u/barn",
      titleEn: "Freehold: < 2 yrs, no child",
      subNo: "2,5 % avgift på overtatt andel",
      subEn: "2.5% duty on transferred share",
    },
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
          ? "Finn ut hva det koster å kjøpe ut partneren. Regn ut utkjøpssum, nytt boliglån, belåningsgrad (maks 90 %), dokumentavgift og 5× inntektskrav."
          : "Calculate exact buyout payout, required new mortgage, LTV ratio (90% cap), stamp duty rules, and Norway's 5× income cap if one partner keeps the home."
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
              {lang === "no"
                ? "1. Boligens antatte markedsverdi (E-takst)"
                : "1. Estimated Market Value (E-takst)"}
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
                ? "3. Eventuell avtalt særskilt egenkapital (den som overtar)"
                : "3. Agreed Separate Equity Deduction (Staying Partner)"}
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
          <p className={`text-[13px] mt-1.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
            {lang === "no"
              ? "Trekkes ut som avtalt kronebeløp før gjenværende netto egenkapital fordeles etter eierbrøken (f.eks. skjevdeling eller dokumentert innskudd i samboeravtale)."
              : "Subtracted as an agreed NOK amount before splitting remaining net equity by ownership share (e.g., documented separate down-payment in a cohabitation agreement)."}
          </p>
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

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <p
            className={`text-[17px] sm:text-lg mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no"
              ? "5. Dokumentavgift ved overføring (Dokumentavgiftsloven § 8)"
              : "5. Stamp Duty Exemption Status (Document Duty Act § 8)"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dutyOptions.map((opt) => {
              const active = dutyStatus === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDutyStatus(opt.id)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[72px] px-4 py-3 border-2 text-left flex items-center justify-between gap-2 ${
                    active
                      ? isModern
                        ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                        : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                  }`}
                >
                  <div>
                    <span className="block text-[15px] font-semibold">
                      {lang === "no" ? opt.titleNo : opt.titleEn}
                    </span>
                    <span className="block text-[13px] opacity-85 mt-0.5">
                      {lang === "no" ? opt.subNo : opt.subEn}
                    </span>
                  </div>
                  {active && (
                    <CheckMarkIcon
                      className={`w-5 h-5 shrink-0 ${
                        isModern ? "text-[#147A53]" : "text-[#5D726A]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* LTV Warning if exceeding 90% cap */}
      {exceedsLtvCap && (
        <div
          className={`p-4 sm:p-5 border-2 ${
            isModern
              ? "bg-[#FEF2F0] border-[#B8422C] rounded-2xl text-[#121C17]"
              : "bg-[#FFF7D4] border-[#BA5B3E] rounded-none text-[#000000]"
          }`}
        >
          <p className="text-[16px] sm:text-[17px] font-semibold">
            {lang === "no"
              ? `Obs: Ny belåningsgrad (${newLtvPct.toFixed(1).replace(".", ",")} %) overstiger hovedregelen på 90 %`
              : `Heads up: New LTV (${newLtvPct.toFixed(1)}%) exceeds Norway's 90% lending cap`}
          </p>
          <p className={`text-[14px] mt-1 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
            {lang === "no"
              ? `Utlånsforskriften krever normalt minst 10 % egenkapital (maks 90 % belåningsgrad). Den som overtar trenger ca. ${formatNok(
                  extraCashNeededForLtv
                )} i ekstra egenkapital/tilleggssikkerhet, avvikskvote i banken — eller felles salg i markedet.`
              : `Norwegian lending rules require at least 10% equity (90% max LTV). The staying partner would need ~${formatNok(
                  extraCashNeededForLtv
                )} in extra cash/collateral, a bank flexibility exception, or a joint market sale.`}
          </p>
        </div>
      )}

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
              {lang === "no" ? "Den som overtar" : "Staying partner"}:{" "}
              <strong>{formatNok(stayingEquity)}</strong> ({stayingPctBar}%)
            </span>
            <span>
              {lang === "no" ? "Utkjøpssum til utflytter" : "Buyout payout"}:{" "}
              <strong>{formatNok(buyoutAmount)}</strong> ({leavingPctBar}%)
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
              {lang === "no"
                ? "Samlet netto egenkapital (verdi − felles lån)"
                : "Total Net Home Equity (value − shared loan)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(totalNetEquity)}
            </span>
          </div>

          {clampedExtra > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? "Felles egenkapital til fordeling etter særskilt innskudd"
                  : "Shared Equity Pool After Separate Deduction"}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(sharedNetPool)}
              </span>
            </div>
          )}

          {stampDutyCost > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? `Dokumentavgift (2,5 % av overtatt ${100 - stayingSharePct} %-andel)`
                  : `Stamp Duty (2.5% on Transferred ${100 - stayingSharePct}% Share)`}
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
                ? "Tinglysing skjøte/hjemmel + nytt pant (Kartverket 2026)"
                : "Kartverket Deed + New Mortgage Filing (2026)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(KARTVERKET_BUYOUT_FEES)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              <span className="block">
                {lang === "no"
                  ? "Nytt totalt boliglån for den som overtar alene"
                  : "New Total Mortgage Needed Alone"}
              </span>
              <span className="block text-[13px] opacity-80">
                {lang === "no"
                  ? `Overtatt lån + utkjøpssum + gebyrer · Belåningsgrad: ${newLtvPct
                      .toFixed(1)
                      .replace(".", ",")} %`
                  : `Assumed loan + buyout + fees · Loan-to-value (LTV): ${newLtvPct.toFixed(1)}%`}
              </span>
            </span>
            <span
              className={`font-semibold tabular-nums whitespace-nowrap ${
                exceedsLtvCap
                  ? isModern
                    ? "text-[#B8422C]"
                    : "text-[#BA5B3E]"
                  : "text-[#000000]"
              }`}
            >
              {formatNok(newTotalMortgageNeeded)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              <span className="block">
                {lang === "no"
                  ? "Veiledende minste brutto årsinntekt (5× regel)"
                  : "Estimated Minimum Gross Income (5× Rule)"}
              </span>
              <span className="block text-[13px] opacity-80">
                {lang === "no"
                  ? "Forutsetter 0 kr i annen gjeld (studielån/billån); banken stresstester +3 %-poeng rente"
                  : "Assumes 0 kr other debt (student/car loans); banks also stress-test +3% rate rise"}
              </span>
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
              ? "Dokumentavgiftsloven § 8 & Kartverket (2026): Ektefeller har fritak ved skilsmisse/oppgjør. Samboere har fritak for felles bolig ved minst 2 års felles folkeregistrert adresse eller felles barn (gjelder ikke hytte/sekundærbolig). Borettslag har alltid 0 kr dokumentavgift. Tinglysing koster 545 kr per dokument."
              : "Document Duty Act § 8 & Kartverket (2026): Spouses are exempt on separation. Cohabitants are exempt on their shared home with 2+ years registered cohabitation or shared children (not cabins/secondary homes). Borettslag always has 0 kr stamp duty. Kartverket filing is 545 kr per document."}
          </li>
          <li>
            {lang === "no"
              ? "Utlånsforskriften (gjeldende 2025/2026): Maksimal samlet gjeld er 5× brutto årsinntekt, egenkapitalkravet er 10 % (maks 90 % belåningsgrad), og økonomien må tåle +3 prosentpoeng renteøkning (minimum 7 %)."
              : "Norwegian Lending Regulations (2025/2026): Total debt capped at 5× gross income, 10% minimum equity (90% max LTV), and +3 percentage points interest stress test (minimum 7%)."}
          </li>
          <li>
            {lang === "no"
              ? "Beregningsforutsetning: Felles boliglån antas fordelt i samme forhold som eierbrøken, og det trekkes ikke fiktive meglerkostnader. Ved avvikende gjeldsansvar eller verdistigning på skjevdelt egenkapital anbefales juridisk bistand."
              : "Formula note: Shared mortgage is assumed split proportionally to ownership share, and hypothetical broker fees are not deducted. Consult a lawyer if debt responsibility differs from ownership share."}
          </li>
        </ul>
      </div>
    </ToolShell>
  );
}
