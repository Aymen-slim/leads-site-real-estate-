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
import { ModernNetCash } from "@/components/modern/ModernNetCash";
import { ToolSeoGuide } from "@/components/ToolSeoGuide";

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

        <div className="bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6 sm:space-y-7 mb-6 sm:mb-8">
          {/* Expected Price */}
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

          {/* Loan Payoff */}
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
              className="kr-slider"
            />
          </div>

          {/* Sale Method & Adjustable Commission */}
          <div className="pt-4 border-t border-[#BFBFBD] space-y-4">
            <p className="text-[17px] font-medium text-[#000000]">
              {lang === "no"
                ? "Salgsform og meglerkostnad (juster etter eget tilbud)"
                : "Sale Method & Brokerage Cost (adjust to your quote)"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSaleMethod("broker")}
                aria-pressed={saleMethod === "broker"}
                className={`kr-tap-card min-h-[64px] px-4 py-3.5 border-2 text-left flex items-center justify-between gap-3 ${
                  saleMethod === "broker"
                    ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                    : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                }`}
              >
                <div>
                  <span className="block text-[16px] font-semibold">
                    {lang === "no" ? "Selge med eiendomsmegler" : "Sell with a Broker"}
                  </span>
                  <span className="block text-[13px] text-[#292823]">
                    {lang === "no"
                      ? `Provisjon ${commissionPct.toFixed(2).replace(".", ",")} % + grunnpakke`
                      : `Commission ${commissionPct.toFixed(2)}% + base package`}
                  </span>
                </div>
                {saleMethod === "broker" && (
                  <CheckMarkIcon className="w-5 h-5 text-[#5D726A] shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setSaleMethod("diy")}
                aria-pressed={saleMethod === "diy"}
                className={`kr-tap-card min-h-[64px] px-4 py-3.5 border-2 text-left flex items-center justify-between gap-3 ${
                  saleMethod === "diy"
                    ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                    : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                }`}
              >
                <div>
                  <span className="block text-[16px] font-semibold">
                    {lang === "no" ? "Selge selv (digital pakke)" : "Sell Yourself (DIY Platform)"}
                  </span>
                  <span className="block text-[13px] text-[#292823]">
                    {lang === "no"
                      ? `Fastpakke ca. ${formatNok(DIY_FULL_PACKAGE_NOK)} (f.eks. Propr)`
                      : `Flat package ~${formatNok(DIY_FULL_PACKAGE_NOK)} (e.g. Propr)`}
                  </span>
                </div>
                {saleMethod === "diy" && (
                  <CheckMarkIcon className="w-5 h-5 text-[#5D726A] shrink-0" />
                )}
              </button>
            </div>

            {saleMethod === "broker" && (
              <div className="bg-[#FFFFFF] border border-[#BFBFBD] p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <label
                    htmlFor="net-cash-commission"
                    className="text-[15px] font-medium text-[#000000]"
                  >
                    {lang === "no"
                      ? "Meglerprovisjon (varierer per kontor: 0,8 % – 2,5 %)"
                      : "Broker commission (varies by office: 0.8%–2.5%)"}
                  </label>
                  <output
                    htmlFor="net-cash-commission"
                    className="text-[18px] font-semibold tabular-nums text-[#000000]"
                  >
                    {commissionPct.toFixed(2).replace(".", lang === "no" ? "," : ".")} % (
                    {formatNok(commissionFee)})
                  </output>
                </div>
                <input
                  id="net-cash-commission"
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
                  className="kr-slider"
                />
                <p className="text-[12px] text-[#292823]">
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
                className={`kr-tap-card w-full px-4 py-3 border-2 text-left flex items-center justify-between gap-3 ${
                  includeInsurance
                    ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                    : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                }`}
              >
                <div>
                  <span className="block text-[15px] font-semibold">
                    {lang === "no"
                      ? "Legg til valgfri boligselgerforsikring"
                      : "Add optional seller liability insurance"}
                  </span>
                  <span className="block text-[12px] text-[#292823]">
                    {lang === "no"
                      ? "Valgfritt — satsen varierer etter boligtype og forsikringsselskap (Fremtind, Gjensidige, Anticimex m.fl.)"
                      : "Optional — rate varies by property type and insurer (Fremtind, Gjensidige, Anticimex, etc.)"}
                  </span>
                </div>
                <span
                  className={`w-6 h-6 flex items-center justify-center shrink-0 border-2 ${
                    includeInsurance
                      ? "bg-[#5D726A] border-[#5D726A] text-[#FFFFFF]"
                      : "bg-[#FFFFFF] border-[#949391]"
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
                        className={`px-3 py-2 text-[13px] font-semibold border-2 text-left ${
                          active
                            ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                            : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[#BFBFBD]">
            <button
              type="button"
              onClick={() => setIsTaxFreePrimary(true)}
              aria-pressed={isTaxFreePrimary}
              className={`kr-tap-card min-h-[68px] px-4 sm:px-5 py-4 border-2 text-left font-medium text-[16px] sm:text-lg flex items-center justify-between gap-3 ${
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
              className={`kr-tap-card min-h-[68px] px-4 sm:px-5 py-4 border-2 text-left font-medium text-[16px] sm:text-lg flex items-center justify-between gap-3 ${
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

        {/* Itemized Financial Ledger */}
        <div className="bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none overflow-hidden mb-5">
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
                {saleMethod === "broker"
                  ? lang === "no"
                    ? `Meglerprovisjon (${commissionPct.toFixed(2).replace(".", ",")} %) + tilrettelegging, markedsføring & oppgjør`
                    : `Broker commission (${commissionPct.toFixed(2)}%) + onboarding, marketing & settlement`
                  : lang === "no"
                  ? "Digital selvsalgspakke (FINN, foto, dokumenter, kontrakt & oppgjør)"
                  : "Digital DIY platform package (FINN, photo, docs, contract & settlement)"}
              </span>
              <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(brokerOrDiyFee)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-normal text-[#292823]">
                {lang === "no"
                  ? "Tilstandsrapport (takstmann) og offentlige gebyrer"
                  : "Technical inspection report & public/deed fees"}
              </span>
              <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(INSPECTION_AND_PUBLIC_NOK)}
              </span>
            </div>

            {includeInsurance && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="font-normal text-[#292823]">
                  {lang === "no"
                    ? `Valgfri boligselgerforsikring (veiledende ${tierCfg.promille.toFixed(1).replace(".", ",")} ‰)`
                    : `Optional seller liability insurance (indicative ${tierCfg.promille.toFixed(1)}‰)`}
                </span>
                <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(sellerInsurance)}
                </span>
              </div>
            )}

            {!isTaxFreePrimary && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <div className="min-w-0">
                  <span className="block font-normal text-[#292823]">
                    {t.tools.tool2.taxFeeLabel}
                  </span>
                  <span className="block text-[13px] text-[#5D726A] mt-0.5">
                    {lang === "no"
                      ? "Sjablong: 22 % skatt av antatt 25 % gevinst. "
                      : "Estimate: 22% tax on assumed 25% gain. "}
                    <Link href="/verktoy/gevinstskatt" className="underline font-medium">
                      {lang === "no" ? "Beregn eksakt gevinstskatt →" : "Calculate exact tax →"}
                    </Link>
                  </span>
                </div>
                <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(estimatedTax)}
                </span>
              </div>
            )}

            {clampedLoan > 0 && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="font-normal text-[#292823]">
                  {t.tools.tool2.loanDeductionLabel}
                </span>
                <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(clampedLoan)}
                </span>
              </div>
            )}
          </div>

          <div className="bg-[#DCE2CF] border-t-2 border-[#5D726A] p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-[20px] sm:text-2xl font-medium text-[#000000]">
              {lang === "no"
                ? "Estimert netto utbetalt på din konto"
                : "Estimated Net Take-Home Cash in Pocket"}
            </span>
            <span className="text-[32px] sm:text-5xl font-medium text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(netCashInPocket)}
            </span>
          </div>
        </div>

        {/* Cross-link + Sources & Assumptions */}
        <div className="bg-[#F7F7F7] border border-[#BFBFBD] rounded-none p-4 sm:p-5 mb-6 sm:mb-8 space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-[#5D726A] shrink-0 mt-0.5" />
            <div className="space-y-1 text-[13px] sm:text-[14px] text-[#292823] leading-relaxed">
              <p className="font-semibold text-[#000000]">
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
                  className="font-semibold text-[#000000] underline decoration-[#5D726A] underline-offset-4"
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
          className="kr-btn-primary w-full min-h-[72px] sm:min-h-[84px] px-5 sm:px-7 py-4 sm:py-5 border-2 border-[#5D726A] text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool2.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
