"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import {
  HouseIcon,
  ArrowRightIcon,
  CheckMarkIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

type SaleMethod = "broker" | "diy";
type InsuranceTier = "borettslag" | "selveier" | "house";

const INSURANCE_TIERS: Record<
  InsuranceTier,
  { promille: number; minKr: number; maxKr: number; labelNo: string; labelEn: string }
> = {
  borettslag: {
    promille: 2.5,
    minKr: 4_200,
    maxKr: 33_000,
    labelNo: "Borettslag (~2,5 ‰)",
    labelEn: "Co-op (~2.5‰)",
  },
  selveier: {
    promille: 4.3,
    minKr: 6_500,
    maxKr: 40_000,
    labelNo: "Selveierleil. (~4,3 ‰)",
    labelEn: "Freehold apt. (~4.3‰)",
  },
  house: {
    promille: 5.5,
    minKr: 10_000,
    maxKr: 65_000,
    labelNo: "Enebolig (~5,5 ‰)",
    labelEn: "House (~5.5‰)",
  },
};

const MIN_COMMISSION_NOK = 39_000;
const BROKER_PACKAGE_NOK = 34_800; // 19 900 onboarding/settlement + 14 900 standard marketing
const DIY_FULL_PACKAGE_NOK = 35_950; // Propr Pluss 2025/2026 benchmark
const INSPECTION_AND_PUBLIC_NOK = 14_500; // Tilstandsrapport + public/deed fees

export function ModernNetCash() {
  const { lang, trackClick, t } = useApp();

  const [expectedPrice, setExpectedPrice] = useState<number>(5_500_000);
  const [loanPayoff, setLoanPayoff] = useState<number>(1_500_000);
  const [saleMethod, setSaleMethod] = useState<SaleMethod>("broker");
  const [commissionPct, setCommissionPct] = useState<number>(1.25);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);
  const [insuranceTier, setInsuranceTier] = useState<InsuranceTier>("house");
  const [isTaxFreePrimary, setIsTaxFreePrimary] = useState<boolean>(true);

  const minPrice = 1_500_000;
  const maxPrice = 25_000_000;
  const minLoan = 0;
  const maxLoan = 15_000_000;

  const clampedLoan = Math.min(loanPayoff, expectedPrice);
  const commissionFee = Math.max(
    MIN_COMMISSION_NOK,
    Math.round((expectedPrice * commissionPct) / 100)
  );
  const brokerOrDiyFee =
    saleMethod === "broker"
      ? commissionFee + BROKER_PACKAGE_NOK
      : DIY_FULL_PACKAGE_NOK;

  const tierCfg = INSURANCE_TIERS[insuranceTier];
  const sellerInsurance = includeInsurance
    ? Math.min(
        tierCfg.maxKr,
        Math.max(tierCfg.minKr, Math.round((expectedPrice * tierCfg.promille) / 1000))
      )
    : 0;

  const estimatedTax = isTaxFreePrimary
    ? 0
    : Math.round(expectedPrice * 0.25 * 0.22);

  const netCashInPocket = Math.max(
    0,
    expectedPrice -
      brokerOrDiyFee -
      INSPECTION_AND_PUBLIC_NOK -
      sellerInsurance -
      estimatedTax -
      clampedLoan
  );

  const totalFees = brokerOrDiyFee + INSPECTION_AND_PUBLIC_NOK + sellerInsurance;
  const totalTaxAndLoan = estimatedTax + clampedLoan;

  const feeSharePct =
    expectedPrice > 0
      ? Math.max(1, Math.min(100, Math.round((totalFees / expectedPrice) * 100)))
      : 0;
  const netSharePct =
    expectedPrice > 0
      ? Math.min(100 - feeSharePct, Math.round((netCashInPocket / expectedPrice) * 100))
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

        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-7">
          {/* Expected Price */}
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

          {/* Loan Payoff */}
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
                {formatNok(clampedLoan)}
              </output>
            </div>
            <input
              id="loan-payoff-slider"
              type="range"
              min={minLoan}
              max={Math.min(maxLoan, expectedPrice)}
              step={100000}
              value={clampedLoan}
              aria-valuetext={formatNok(clampedLoan)}
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

          {/* Sale Method & Adjustable Commission */}
          <div className="pt-4 border-t border-[#DCE5DF] space-y-4">
            <p className="text-[16px] sm:text-[17px] font-semibold text-[#121C17]">
              {lang === "no"
                ? "Salgsform og meglerkostnad (juster etter eget tilbud)"
                : "Sale Method & Brokerage Cost (adjust to your quote)"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSaleMethod("broker")}
                aria-pressed={saleMethod === "broker"}
                className={`nm-tap-card min-h-[64px] px-4 py-3.5 border-2 text-left flex items-center justify-between gap-3 ${
                  saleMethod === "broker"
                    ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                    : "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                }`}
              >
                <div>
                  <span className="block text-[16px] font-semibold">
                    {lang === "no" ? "Selge med eiendomsmegler" : "Sell with a Broker"}
                  </span>
                  <span className="block text-[13px] text-[#3B4D44]">
                    {lang === "no"
                      ? `Provisjon ${commissionPct.toFixed(2).replace(".", ",")} % + grunnpakke`
                      : `Commission ${commissionPct.toFixed(2)}% + base package`}
                  </span>
                </div>
                {saleMethod === "broker" && (
                  <CheckMarkIcon className="w-5 h-5 text-[#147A53] shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setSaleMethod("diy")}
                aria-pressed={saleMethod === "diy"}
                className={`nm-tap-card min-h-[64px] px-4 py-3.5 border-2 text-left flex items-center justify-between gap-3 ${
                  saleMethod === "diy"
                    ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                    : "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                }`}
              >
                <div>
                  <span className="block text-[16px] font-semibold">
                    {lang === "no" ? "Selge selv (digital pakke)" : "Sell Yourself (DIY Platform)"}
                  </span>
                  <span className="block text-[13px] text-[#3B4D44]">
                    {lang === "no"
                      ? `Fastpakke ca. ${formatNok(DIY_FULL_PACKAGE_NOK)} (f.eks. Propr)`
                      : `Flat package ~${formatNok(DIY_FULL_PACKAGE_NOK)} (e.g. Propr)`}
                  </span>
                </div>
                {saleMethod === "diy" && (
                  <CheckMarkIcon className="w-5 h-5 text-[#147A53] shrink-0" />
                )}
              </button>
            </div>

            {saleMethod === "broker" && (
              <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-xl p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <label
                    htmlFor="modern-net-cash-commission"
                    className="text-[15px] font-semibold text-[#121C17]"
                  >
                    {lang === "no"
                      ? "Meglerprovisjon (varierer per kontor: 0,8 % – 2,5 %)"
                      : "Broker commission (varies by office: 0.8%–2.5%)"}
                  </label>
                  <output
                    htmlFor="modern-net-cash-commission"
                    className="text-[17px] font-semibold tabular-nums text-[#0F3D2E]"
                  >
                    {commissionPct.toFixed(2).replace(".", lang === "no" ? "," : ".")} % (
                    {formatNok(commissionFee)})
                  </output>
                </div>
                <input
                  id="modern-net-cash-commission"
                  type="range"
                  min={0.8}
                  max={2.5}
                  step={0.05}
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(Number(e.target.value))}
                  style={
                    {
                      "--attr-min": 0.8,
                      "--attr-max": 2.5,
                      "--control-value": commissionPct,
                    } as React.CSSProperties
                  }
                  className="nm-slider"
                />
                <p className="text-[12px] text-[#3B4D44]">
                  {lang === "no"
                    ? "Inkl. standard tilrettelegging, markedspakke og oppgjør (34 800 kr snitt — varierer fra kontor til kontor). Minsteprovisjon 39 000 kr."
                    : "Incl. standard onboarding, marketing & settlement (34 800 kr avg. — varies by office). Minimum commission 39 000 kr."}
                </p>
              </div>
            )}

            {/* Optional Seller Insurance */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setIncludeInsurance((v) => !v)}
                aria-pressed={includeInsurance}
                className={`nm-tap-card w-full px-4 py-3 border-2 text-left flex items-center justify-between gap-3 ${
                  includeInsurance
                    ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                    : "bg-[#FFFFFF] border-[#DCE5DF] text-[#121C17]"
                }`}
              >
                <div>
                  <span className="block text-[15px] font-semibold">
                    {lang === "no"
                      ? "Legg til valgfri boligselgerforsikring"
                      : "Add optional seller liability insurance"}
                  </span>
                  <span className="block text-[12px] text-[#3B4D44]">
                    {lang === "no"
                      ? "Valgfritt — satsen varierer etter boligtype og forsikringsselskap (Fremtind, Gjensidige, Anticimex m.fl.)"
                      : "Optional — rate varies by property type and insurer (Fremtind, Gjensidige, Anticimex, etc.)"}
                  </span>
                </div>
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border-2 ${
                    includeInsurance
                      ? "bg-[#147A53] border-[#147A53] text-[#FFFFFF]"
                      : "bg-[#FFFFFF] border-[#9EB6AA]"
                  }`}
                >
                  {includeInsurance && <CheckMarkIcon className="w-4 h-4" />}
                </span>
              </button>

              {includeInsurance && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.keys(INSURANCE_TIERS) as InsuranceTier[]).map((k) => {
                    const active = insuranceTier === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setInsuranceTier(k)}
                        aria-pressed={active}
                        className={`px-3 py-2 rounded-xl text-[13px] font-semibold border-2 text-left ${
                          active
                            ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                            : "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                        }`}
                      >
                        {lang === "no"
                          ? INSURANCE_TIERS[k].labelNo
                          : INSURANCE_TIERS[k].labelEn}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tax Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[#DCE5DF]">
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
                {lang === "no" ? "Salgskostnader & takst" : "Sale & Report Fees"} (
                {feeSharePct}%)
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
              <span className="text-[#3B4D44]">
                {saleMethod === "broker"
                  ? lang === "no"
                    ? `Meglerprovisjon (${commissionPct.toFixed(2).replace(".", ",")} %) + tilrettelegging, markedsføring & oppgjør`
                    : `Broker commission (${commissionPct.toFixed(2)}%) + onboarding, marketing & settlement`
                  : lang === "no"
                  ? "Digital selvsalgspakke (FINN, foto, dokumenter, kontrakt & oppgjør)"
                  : "Digital DIY platform package (FINN, photo, docs, contract & settlement)"}
              </span>
              <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(brokerOrDiyFee)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="text-[#3B4D44]">
                {lang === "no"
                  ? "Tilstandsrapport (takstmann) og offentlige gebyrer"
                  : "Technical inspection report & public/deed fees"}
              </span>
              <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(INSPECTION_AND_PUBLIC_NOK)}
              </span>
            </div>

            {includeInsurance && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="text-[#3B4D44]">
                  {lang === "no"
                    ? `Valgfri boligselgerforsikring (veiledende ${tierCfg.promille.toFixed(1).replace(".", ",")} ‰)`
                    : `Optional seller liability insurance (indicative ${tierCfg.promille.toFixed(1)}‰)`}
                </span>
                <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(sellerInsurance)}
                </span>
              </div>
            )}

            {!isTaxFreePrimary && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <div className="min-w-0">
                  <span className="block text-[#3B4D44]">
                    {t.tools.tool2.taxFeeLabel}
                  </span>
                  <span className="block text-[13px] text-[#147A53] mt-0.5">
                    {lang === "no"
                      ? "Sjablong: 22 % skatt av antatt 25 % gevinst. "
                      : "Estimate: 22% tax on assumed 25% gain. "}
                    <Link href="/verktoy/gevinstskatt" className="underline font-semibold">
                      {lang === "no" ? "Beregn eksakt gevinstskatt →" : "Calculate exact tax →"}
                    </Link>
                  </span>
                </div>
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
              {lang === "no"
                ? "Estimert netto utbetalt på din konto"
                : "Estimated Net Take-Home Cash in Pocket"}
            </span>
            <span className="text-[32px] sm:text-5xl font-semibold text-[#121C17] tabular-nums whitespace-nowrap">
              {formatNok(netCashInPocket)}
            </span>
          </div>
        </div>

        {/* Cross-link + Sources & Assumptions */}
        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-[#147A53] shrink-0 mt-0.5" />
            <div className="space-y-1 text-[13px] sm:text-[14px] text-[#3B4D44] leading-relaxed">
              <p className="font-semibold text-[#121C17]">
                {lang === "no" ? "Kilder og forutsetninger (2025/2026)" : "Sources & Assumptions (2025/2026)"}
              </p>
              <p>
                {lang === "no"
                  ? "Basert på Forbrukerrådet, 2025/2026-prislister fra norske meglerkjeder, Propr.no (Plusspakke 35 950 kr), Kartverket (selger betaler ikke 2,5 % dokumentavgift), Skatteetaten (skattefritt salg ved 12 av 24 mnd. bo- og eiertid, ellers 22 % gevinstskatt) og veiledende satser fra Fremtind/Gjensidige. Provisjon, markedspakker og forsikring varierer mellom meglerkontorer og forsikringsselskaper."
                  : "Based on Forbrukerrådet, 2025/2026 Norwegian agency fee schedules, Propr.no (Plus package 35 950 kr), Kartverket (sellers do not pay 2.5% stamp duty), Skatteetaten (12-of-24-month tax exemption, otherwise 22% gains tax), and indicative Fremtind/Gjensidige insurance rates. Commission, marketing packages, and insurance vary across offices and insurers."}
              </p>
              <p className="pt-1">
                <Link
                  href="/verktoy/meglerkostnad"
                  className="font-semibold text-[#147A53] hover:text-[#0F3D2E] underline underline-offset-4"
                >
                  {lang === "no"
                    ? "Sammenlign megler vs. selge selv i detalj i meglerkalkulatoren →"
                    : "Compare Broker vs. DIY in full detail in the Broker Fee Calculator →"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/koble-til-megler?source=net-cash&price=${expectedPrice}&net=${netCashInPocket}`}
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
