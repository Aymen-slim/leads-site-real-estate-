"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon, ShieldCheckIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type SalePropType = "house" | "selveier" | "borettslag";
type MarketingTier = "basic" | "plus" | "premium";

interface InsuranceBenchmark {
  defaultPromille: number;
  minPromille: number;
  maxPromille: number;
  minKr: number;
  maxKr: number;
}

const INSURANCE_BENCHMARK: Record<SalePropType, InsuranceBenchmark> = {
  house: {
    defaultPromille: 5.5,
    minPromille: 4.5,
    maxPromille: 6.4,
    minKr: 10_000,
    maxKr: 65_000,
  },
  selveier: {
    defaultPromille: 4.3,
    minPromille: 3.5,
    maxPromille: 5.1,
    minKr: 6_500,
    maxKr: 40_000,
  },
  borettslag: {
    defaultPromille: 2.5,
    minPromille: 2.0,
    maxPromille: 3.2,
    minKr: 4_200,
    maxKr: 33_000,
  },
};

const TILSTANDSRAPPORT_COST: Record<SalePropType, number> = {
  house: 14_500,
  selveier: 11_000,
  borettslag: 9_500,
};

const MARKETING_TIERS: Record<
  MarketingTier,
  { cost: number; labelNo: string; labelEn: string; descNo: string; descEn: string }
> = {
  basic: {
    cost: 14_900,
    labelNo: "Standard markedspakke",
    labelEn: "Standard Marketing",
    descNo: "FINN-annonse, fotograf & digitalt prospekt",
    descEn: "FINN listing, photographer & digital brochure",
  },
  plus: {
    cost: 22_900,
    labelNo: "Utvidet markedspakke",
    labelEn: "Extended Marketing",
    descNo: "FINN Pluss, sosiale medier & drone/ekstra foto",
    descEn: "FINN Plus, social ads & drone/extra photos",
  },
  premium: {
    cost: 34_900,
    labelNo: "Premium + boligstyling",
    labelEn: "Premium + Home Staging",
    descNo: "Utvidet markedsføring inkl. enkel boligstyling",
    descEn: "Extended marketing incl. light home staging",
  },
};

// Realistic 2025/2026 Norwegian benchmarks:
// - Min commission: 39 000 kr (typical range 35 000–50 000 kr)
// - Onboarding & settlement: 19 900 kr (typically 15 000–25 000 kr depending on office)
// - DIY full digital package (Propr Pluss 2025/2026 benchmark: 35 950 kr incl. FINN, photo, docs, contract & settlement)
const MIN_COMMISSION_NOK = 39_000;
const ONBOARDING_AND_SETTLEMENT_NOK = 19_900;
const DIY_FULL_PACKAGE_NOK = 35_950;

export function BrokerFeeTool() {
  const { lang, isModern } = useApp();

  const [propType, setPropType] = useState<SalePropType>("house");
  const [salePrice, setSalePrice] = useState<number>(5_000_000);
  const [commissionPct, setCommissionPct] = useState<number>(1.25);
  const [marketingTier, setMarketingTier] = useState<MarketingTier>("basic");
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);
  const [insurancePromille, setInsurancePromille] = useState<number>(
    INSURANCE_BENCHMARK.house.defaultPromille
  );

  const handlePropTypeChange = (nextType: SalePropType) => {
    setPropType(nextType);
    setInsurancePromille(INSURANCE_BENCHMARK[nextType].defaultPromille);
  };

  const insBench = INSURANCE_BENCHMARK[propType];
  const rawInsuranceEstimate = Math.round((salePrice * insurancePromille) / 1000);
  const estimatedInsuranceCost = Math.min(
    insBench.maxKr,
    Math.max(insBench.minKr, rawInsuranceEstimate)
  );
  const sellerInsurance = includeInsurance ? estimatedInsuranceCost : 0;

  const tilstandsrapport = TILSTANDSRAPPORT_COST[propType];
  const sharedFixedCosts = tilstandsrapport + sellerInsurance;

  const commissionFee = Math.max(
    MIN_COMMISSION_NOK,
    Math.round((salePrice * commissionPct) / 100)
  );
  const marketingCost = MARKETING_TIERS[marketingTier].cost;
  const brokerSpecificCosts =
    commissionFee + ONBOARDING_AND_SETTLEMENT_NOK + marketingCost;
  const totalBrokerCost = sharedFixedCosts + brokerSpecificCosts;

  const totalDiyCost = sharedFixedCosts + DIY_FULL_PACKAGE_NOK;
  const brokerExtraCost = Math.max(0, totalBrokerCost - totalDiyCost);
  const breakEvenLiftPct = salePrice > 0 ? (brokerExtraCost / salePrice) * 100 : 0;
  const breakEvenLiftFormatted = breakEvenLiftPct
    .toFixed(2)
    .replace(".", lang === "no" ? "," : ".");

  // Neutral scenario: +2.5% higher bid with broker
  const scenarioLiftPct = 2.5;
  const scenarioLiftKr = Math.round((salePrice * scenarioLiftPct) / 100);
  const scenarioNetDiffWithBroker = scenarioLiftKr - brokerExtraCost;

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  const typeCards: {
    id: SalePropType;
    labelNo: string;
    labelEn: string;
    subNo: string;
    subEn: string;
  }[] = [
    {
      id: "house",
      labelNo: "Enebolig / Rekkehus",
      labelEn: "Detached / Townhouse",
      subNo: "Takst ca. 14 500 kr · Forsikring 4,5–6,4 ‰",
      subEn: "Report ~14 500 kr · Insurance 4.5–6.4‰",
    },
    {
      id: "selveier",
      labelNo: "Selveierleilighet",
      labelEn: "Freehold Apartment",
      subNo: "Takst ca. 11 000 kr · Forsikring 3,5–5,1 ‰",
      subEn: "Report ~11 000 kr · Insurance 3.5–5.1‰",
    },
    {
      id: "borettslag",
      labelNo: "Borettslag",
      labelEn: "Co-op (Borettslag)",
      subNo: "Takst ca. 9 500 kr · Forsikring 2,0–3,2 ‰",
      subEn: "Report ~9 500 kr · Insurance 2.0–3.2‰",
    },
  ];

  const maxBar = Math.max(totalBrokerCost, totalDiyCost, 1);

  return (
    <ToolShell
      slug="broker-fee"
      iconKey="broker-fee"
      title={
        lang === "no"
          ? "Selge selv eller velge en megler?"
          : "Broker Commission & DIY vs. Agency Calculator"
      }
      subtitle={
        lang === "no"
          ? "Se realistisk totalkostnad for eiendomsmegler vs. å selge boligen selv — og tilpass provisjon, markedspakke og valgfri boligselgerforsikring."
          : "Compare realistic 2025/2026 Norwegian brokerage costs against selling DIY — with adjustable commission, marketing tier, and optional seller insurance."
      }
      ctaSource="broker-fee"
      ctaHref={`/koble-til-megler?source=broker-fee&type=${
        propType === "house" ? "house" : "apartment"
      }&price=${salePrice}&brokerCost=${totalBrokerCost}&net=${salePrice - totalBrokerCost}`}
      ctaLabel={
        lang === "no"
          ? "Sammenlign uforpliktende tilbud fra 2–3 lokale meglere"
          : "Compare non-binding offers from 2–3 local agencies"
      }
    >
      {/* 1. Property Type */}
      <div>
        <h2
          className={`text-[18px] sm:text-xl mb-3 ${
            isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
          }`}
        >
          {lang === "no" ? "1. Velg boligtype" : "1. Select Property Type"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {typeCards.map((c) => {
            const active = propType === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handlePropTypeChange(c.id)}
                aria-pressed={active}
                className={`${
                  isModern ? "nm-tap-card" : "kr-tap-card"
                } min-h-[76px] p-4 border-2 text-left flex items-center justify-between gap-2 ${
                  active
                    ? isModern
                      ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                      : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                    : isModern
                    ? "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF] text-[#121C17]"
                    : "bg-[#EDF0E7] hover:bg-[#DCE2CF] border-[#BFBFBD] text-[#000000]"
                }`}
              >
                <div>
                  <span className="block text-[17px] font-semibold">
                    {lang === "no" ? c.labelNo : c.labelEn}
                  </span>
                  <span
                    className={`block text-[13px] mt-0.5 ${
                      isModern ? "text-[#3B4D44]" : "text-[#292823]"
                    }`}
                  >
                    {lang === "no" ? c.subNo : c.subEn}
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

      {/* 2–5. Sliders, Marketing Tier & Optional Insurance */}
      <div className={panelClass}>
        {/* Sale Price */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="broker-sale-price"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "2. Forventet salgspris" : "2. Expected Sale Price"}
            </label>
            <output
              htmlFor="broker-sale-price"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(salePrice)}
            </output>
          </div>
          <input
            id="broker-sale-price"
            type="range"
            min={1_500_000}
            max={20_000_000}
            step={100_000}
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            style={
              {
                "--attr-min": 1_500_000,
                "--attr-max": 20_000_000,
                "--control-value": salePrice,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        {/* Adjustable Commission */}
        <div
          className={`pt-4 border-t ${
            isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="broker-commission"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "3. Meglerprovisjon (varierer per kontor: typisk 1,0 % – 2,0 %)"
                : "3. Broker Commission Rate (varies by office: typically 1.0%–2.0%)"}
            </label>
            <output
              htmlFor="broker-commission"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {commissionPct.toFixed(2).replace(".", lang === "no" ? "," : ".")} %
            </output>
          </div>
          <input
            id="broker-commission"
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
            className={sliderClass}
          />
          <p
            className={`text-[13px] mt-1.5 ${
              isModern ? "text-[#3B4D44]" : "text-[#292823]"
            }`}
          >
            {lang === "no"
              ? `Beregnet provisjon: ${formatNok(commissionFee)} (minsteprovisjon 39 000 kr). Provisjon og fastpris (ofte 45 000–65 000 kr) varierer betydelig fra kontor til kontor.`
              : `Calculated commission: ${formatNok(commissionFee)} (min. 39 000 kr). Commission rates and fixed-fee quotes (often 45 000–65 000 kr) vary significantly across offices.`}
          </p>
        </div>

        {/* Adjustable Marketing / Promotion Package */}
        <div
          className={`pt-4 border-t ${
            isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"
          }`}
        >
          <p
            className={`text-[17px] sm:text-lg mb-1 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no"
              ? "4. Markedspakke / promotering (varierer fra kontor til kontor)"
              : "4. Marketing & Promotion Package (varies by brokerage office)"}
          </p>
          <p
            className={`text-[13px] mb-3 ${
              isModern ? "text-[#3B4D44]" : "text-[#292823]"
            }`}
          >
            {lang === "no"
              ? "Pris på FINN-annonse, foto og markedsføring settes individuelt av hvert kontor — velg nivå som ligner ditt tilbud:"
              : "FINN listing, photography, and promotion packages are priced differently by each agency — select the closest tier:"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(Object.keys(MARKETING_TIERS) as MarketingTier[]).map((tierKey) => {
              const tier = MARKETING_TIERS[tierKey];
              const active = marketingTier === tierKey;
              return (
                <button
                  key={tierKey}
                  type="button"
                  onClick={() => setMarketingTier(tierKey)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } p-3.5 border-2 text-left flex flex-col justify-between gap-2 ${
                    active
                      ? isModern
                        ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                        : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] hover:bg-[#E6F2EC]/50 border-[#DCE5DF] text-[#121C17]"
                      : "bg-[#FFFFFF] hover:bg-[#DCE2CF]/50 border-[#BFBFBD] text-[#292823]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <span className="text-[15px] font-semibold leading-snug">
                      {lang === "no" ? tier.labelNo : tier.labelEn}
                    </span>
                    {active && (
                      <CheckMarkIcon
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isModern ? "text-[#147A53]" : "text-[#5D726A]"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[12px] leading-snug ${
                      isModern ? "text-[#3B4D44]" : "text-[#292823]"
                    }`}
                  >
                    {lang === "no" ? tier.descNo : tier.descEn}
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums">
                    {formatNok(tier.cost)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Seller Liability Insurance (explicitly optional & adjustable!) */}
        <div
          className={`pt-4 border-t space-y-3 ${
            isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"
          }`}
        >
          <button
            type="button"
            onClick={() => setIncludeInsurance((v) => !v)}
            aria-pressed={includeInsurance}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } w-full min-h-[64px] px-4 py-3.5 border-2 text-left flex items-center justify-between gap-3 ${
              includeInsurance
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#121C17]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <div>
              <span className="block text-[16px] font-semibold">
                {lang === "no"
                  ? "5. Legg til valgfri boligselgerforsikring (valgfritt tillegg)"
                  : "5. Include Optional Seller Liability Insurance (optional add-on)"}
              </span>
              <span
                className={`block text-[13px] mt-0.5 ${
                  isModern ? "text-[#3B4D44]" : "text-[#292823]"
                }`}
              >
                {lang === "no"
                  ? `Estimert ca. ${formatNok(estimatedInsuranceCost)} (${insurancePromille.toFixed(1).replace(".", ",")} ‰) — kan kjøpes både med megler og ved selvsalg, og satsen varierer per forsikringsselskap.`
                  : `Est. ~${formatNok(estimatedInsuranceCost)} (${insurancePromille.toFixed(1)}‰) — available for both broker & DIY sales; rates vary by insurer and office.`}
              </span>
            </div>
            <span
              className={`w-7 h-7 flex items-center justify-center shrink-0 border-2 ${
                isModern ? "rounded-lg" : "rounded-none"
              } ${
                includeInsurance
                  ? isModern
                    ? "bg-[#147A53] border-[#147A53] text-[#FFFFFF]"
                    : "bg-[#5D726A] border-[#5D726A] text-[#FFFFFF]"
                  : isModern
                  ? "bg-[#FFFFFF] border-[#9EB6AA]"
                  : "bg-[#FFFFFF] border-[#949391]"
              }`}
            >
              {includeInsurance && <CheckMarkIcon className="w-4 h-4" />}
            </span>
          </button>

          {includeInsurance && (
            <div
              className={`p-4 border space-y-2 ${
                isModern
                  ? "bg-[#FFFFFF] border-[#DCE5DF] rounded-xl"
                  : "bg-[#FFFFFF] border-[#BFBFBD] rounded-none"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <label
                  htmlFor="insurance-promille-slider"
                  className="text-[15px] font-semibold text-[#121C17]"
                >
                  {lang === "no"
                    ? `Juster forsikringssats (${insBench.minPromille.toFixed(1).replace(".", ",")} – ${insBench.maxPromille.toFixed(1).replace(".", ",")} ‰)`
                    : `Adjust insurance rate (${insBench.minPromille.toFixed(1)}–${insBench.maxPromille.toFixed(1)}‰)`}
                </label>
                <output
                  htmlFor="insurance-promille-slider"
                  className="text-[17px] font-semibold tabular-nums text-[#0F3D2E]"
                >
                  {insurancePromille.toFixed(1).replace(".", lang === "no" ? "," : ".")} ‰ ={" "}
                  {formatNok(sellerInsurance)}
                </output>
              </div>
              <input
                id="insurance-promille-slider"
                type="range"
                min={insBench.minPromille}
                max={insBench.maxPromille}
                step={0.1}
                value={insurancePromille}
                onChange={(e) => setInsurancePromille(Number(e.target.value))}
                style={
                  {
                    "--attr-min": insBench.minPromille,
                    "--attr-max": insBench.maxPromille,
                    "--control-value": insurancePromille,
                  } as React.CSSProperties
                }
                className={sliderClass}
              />
              <p
                className={`text-[12px] leading-relaxed ${
                  isModern ? "text-[#3B4D44]" : "text-[#292823]"
                }`}
              >
                {lang === "no"
                  ? `Merk: Boligselgerforsikring har ikke én fast pris i Norge. Satsen avhenger av forsikringsselskap (f.eks. Fremtind, Gjensidige, Anticimex), meglerkontorets avtale og har normalt minstepris (ca. ${formatNok(insBench.minKr)}) og makspris (ca. ${formatNok(insBench.maxKr)}).`
                  : `Note: Seller liability insurance has no single universal price in Norway. Rates vary by insurer (e.g. Fremtind, Gjensidige, Anticimex) and brokerage agreement, typically with a floor (~${formatNok(insBench.minKr)}) and cap (~${formatNok(insBench.maxKr)}).`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CLEAR SIDE-BY-SIDE COMPARISON: BROKER VS. SELL YOURSELF (BOTH THEMES) */}
      <div className="space-y-4">
        <div>
          <h2
            className={`text-[20px] sm:text-2xl ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no"
              ? "Sammenligning: Eiendomsmegler vs. Selge selv"
              : "Side-by-Side: Real Estate Broker vs. Sell Yourself (DIY)"}
          </h2>
          <p
            className={`text-[14px] sm:text-[15px] mt-1 ${
              isModern ? "text-[#3B4D44]" : "text-[#292823]"
            }`}
          >
            {lang === "no"
              ? "Vi skiller tydelig mellom kostnader du betaler uansett, og selve forskjellen mellom megler og digitalt selvsalg."
              : "Below we clearly separate shared costs you pay either way from the actual price difference between a broker and selling DIY."}
          </p>
        </div>

        {/* Visual Bar Comparison (both themes) */}
        <div
          className={`p-4 sm:p-6 space-y-3.5 ${
            isModern
              ? "bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl"
              : "bg-[#F7F7F7] border border-[#BFBFBD] rounded-none"
          }`}
        >
          <div>
            <div className="flex justify-between text-[15px] mb-1 gap-2">
              <span className="font-semibold text-[#121C17]">
                {lang === "no" ? "Selge med lokal eiendomsmegler" : "Sell with a local broker"}
              </span>
              <span className="font-semibold tabular-nums text-[#0F3D2E] whitespace-nowrap">
                {formatNok(totalBrokerCost)}
              </span>
            </div>
            <div
              className={`h-3.5 w-full overflow-hidden ${
                isModern ? "bg-[#F1F5F3] rounded-full" : "bg-[#DFDFDF] rounded-none"
              }`}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  isModern ? "bg-[#147A53] rounded-full" : "bg-[#5D726A]"
                }`}
                style={{ width: `${Math.round((totalBrokerCost / maxBar) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[15px] mb-1 gap-2">
              <span className="font-semibold text-[#3B4D44]">
                {lang === "no"
                  ? "Selge selv (komplett digital pakke, f.eks. Propr Pluss)"
                  : "Sell yourself (complete DIY platform, e.g. Propr Plus)"}
              </span>
              <span className="font-semibold tabular-nums text-[#3B4D44] whitespace-nowrap">
                {formatNok(totalDiyCost)}
              </span>
            </div>
            <div
              className={`h-3.5 w-full overflow-hidden ${
                isModern ? "bg-[#F1F5F3] rounded-full" : "bg-[#DFDFDF] rounded-none"
              }`}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  isModern ? "bg-[#647B6F] rounded-full" : "bg-[#949391]"
                }`}
                style={{ width: `${Math.round((totalDiyCost / maxBar) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Side-by-Side Itemized Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Option A: Broker */}
          <div
            className={`flex flex-col justify-between overflow-hidden border-2 ${
              isModern
                ? "bg-[#FFFFFF] border-[#147A53] rounded-2xl"
                : "bg-[#FFFFFF] border-[#5D726A] rounded-none"
            }`}
          >
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <span
                  className={`inline-block text-[12px] font-semibold uppercase tracking-wide px-2.5 py-0.5 mb-2 ${
                    isModern
                      ? "bg-[#E6F2EC] text-[#0F3D2E] rounded-full"
                      : "bg-[#DCE2CF] text-[#000000]"
                  }`}
                >
                  {lang === "no" ? "Alternativ A" : "Option A"}
                </span>
                <h3 className="text-[20px] sm:text-2xl font-semibold text-[#121C17]">
                  {lang === "no" ? "Selge med eiendomsmegler" : "Sell with a Broker"}
                </h3>
              </div>

              <div className="space-y-3 text-[14px] sm:text-[15px]">
                {/* Group 1: Shared */}
                <div className="space-y-1.5">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#5D726A]">
                    {lang === "no"
                      ? "1. Kostnader begge alternativer har"
                      : "1. Shared costs (both options)"}
                  </p>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no" ? "Tilstandsrapport (takstmann)" : "Technical inspection report"}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatNok(tilstandsrapport)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no"
                        ? "Boligselgerforsikring (valgfri)"
                        : "Seller insurance (optional)"}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {includeInsurance ? formatNok(sellerInsurance) : lang === "no" ? "Ikke valgt (0 kr)" : "Not added (0 kr)"}
                    </span>
                  </div>
                </div>

                {/* Group 2: Broker-specific */}
                <div
                  className={`pt-3 border-t space-y-1.5 ${
                    isModern ? "border-[#DCE5DF]" : "border-[#DFDFDF]"
                  }`}
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#5D726A]">
                    {lang === "no"
                      ? "2. Meglers honorar og markedsføring"
                      : "2. Broker fee & marketing"}
                  </p>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no"
                        ? `Provisjon (${commissionPct.toFixed(2).replace(".", ",")} %, min. 39 000 kr)`
                        : `Commission (${commissionPct.toFixed(2)}%, min. 39 000 kr)`}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatNok(commissionFee)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no"
                        ? "Tilrettelegging & oppgjør (snitt)"
                        : "Onboarding & settlement (avg.)"}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatNok(ONBOARDING_AND_SETTLEMENT_NOK)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no"
                        ? MARKETING_TIERS[marketingTier].labelNo
                        : MARKETING_TIERS[marketingTier].labelEn}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatNok(marketingCost)}
                    </span>
                  </div>
                </div>

                {/* What you get */}
                <div
                  className={`pt-3 border-t text-[13px] space-y-1 ${
                    isModern
                      ? "border-[#DCE5DF] text-[#3B4D44]"
                      : "border-[#DFDFDF] text-[#292823]"
                  }`}
                >
                  <p className="font-semibold text-[#121C17]">
                    {lang === "no" ? "Hva du får for merkostnaden:" : "What you get for the extra cost:"}
                  </p>
                  <p>
                    {lang === "no"
                      ? "• Megler tar prissetting, foto-koordinering, visninger, oppfølging av interessenter og aktiv budrundestyring."
                      : "• Broker handles pricing strategy, photo coordination, viewings, buyer follow-up, and live bidding negotiation."}
                  </p>
                  <p>
                    {lang === "no"
                      ? "• Minimalt med egen tidsbruk og en erfaren forhandler mellom deg og kjøper."
                      : "• Minimal personal time spent and a professional intermediary between you and buyers."}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 sm:p-5 flex items-baseline justify-between gap-2 border-t ${
                isModern
                  ? "bg-[#E6F2EC] border-[#9EB6AA]"
                  : "bg-[#DCE2CF] border-[#5D726A]"
              }`}
            >
              <span className="text-[16px] font-semibold text-[#0F3D2E]">
                {lang === "no" ? "Estimert totalt (megler)" : "Estimated total (broker)"}
              </span>
              <span className="text-[24px] sm:text-[28px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(totalBrokerCost)}
              </span>
            </div>
          </div>

          {/* Option B: DIY */}
          <div
            className={`flex flex-col justify-between overflow-hidden border-2 ${
              isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] rounded-2xl"
                : "bg-[#FFFFFF] border-[#BFBFBD] rounded-none"
            }`}
          >
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <span
                  className={`inline-block text-[12px] font-semibold uppercase tracking-wide px-2.5 py-0.5 mb-2 ${
                    isModern
                      ? "bg-[#F1F5F3] text-[#3B4D44] rounded-full"
                      : "bg-[#EDF0E7] text-[#292823]"
                  }`}
                >
                  {lang === "no" ? "Alternativ B" : "Option B"}
                </span>
                <h3 className="text-[20px] sm:text-2xl font-semibold text-[#121C17]">
                  {lang === "no" ? "Selge bolig selv (DIY)" : "Sell Yourself (DIY)"}
                </h3>
              </div>

              <div className="space-y-3 text-[14px] sm:text-[15px]">
                {/* Group 1: Shared */}
                <div className="space-y-1.5">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#5D726A]">
                    {lang === "no"
                      ? "1. Kostnader begge alternativer har"
                      : "1. Shared costs (both options)"}
                  </p>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no" ? "Tilstandsrapport (takstmann)" : "Technical inspection report"}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatNok(tilstandsrapport)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no"
                        ? "Boligselgerforsikring (valgfri)"
                        : "Seller insurance (optional)"}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {includeInsurance ? formatNok(sellerInsurance) : lang === "no" ? "Ikke valgt (0 kr)" : "Not added (0 kr)"}
                    </span>
                  </div>
                </div>

                {/* Group 2: DIY-specific */}
                <div
                  className={`pt-3 border-t space-y-1.5 ${
                    isModern ? "border-[#DCE5DF]" : "border-[#DFDFDF]"
                  }`}
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#5D726A]">
                    {lang === "no"
                      ? "2. Digital selvsalgsplattform (f.eks. Propr)"
                      : "2. Digital DIY platform (e.g. Propr)"}
                  </p>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#292823]">
                      {lang === "no"
                        ? "Komplett pakke (FINN, foto, dokumenter, budrunde & oppgjør)"
                        : "Full package (FINN, photo, docs, bidding & settlement)"}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap">
                      {formatNok(DIY_FULL_PACKAGE_NOK)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 text-[13px] text-[#5D726A]">
                    <span>
                      {lang === "no"
                        ? "Meglerprovisjon (0 %)"
                        : "Broker commission (0%)"}
                    </span>
                    <span className="font-semibold tabular-nums">0 kr</span>
                  </div>
                </div>

                {/* What you save & what you do */}
                <div
                  className={`pt-3 border-t text-[13px] space-y-1 ${
                    isModern
                      ? "border-[#DCE5DF] text-[#3B4D44]"
                      : "border-[#DFDFDF] text-[#292823]"
                  }`}
                >
                  <p className="font-semibold text-[#121C17]">
                    {lang === "no" ? "Hva du sparer — og hva du gjør selv:" : "What you save — and what you do:"}
                  </p>
                  <p>
                    {lang === "no"
                      ? `• Du sparer garantert ${formatNok(brokerExtraCost)} i direkte salgsutgifter (grunnpakke uten foto/dok. koster fra ca. 24 970 kr).`
                      : `• You save a guaranteed ${formatNok(brokerExtraCost)} upfront (basic package without photo/docs starts around 24 970 kr).`}
                  </p>
                  <p>
                    {lang === "no"
                      ? "• Du holder visninger, svarer interessenter og styrer dialogen selv — mens autorisert oppgjørsselskap tar kontrakt, penger og tinglysing."
                      : "• You host viewings and answer buyer questions yourself — while a licensed settlement firm still handles contract, funds, and deed transfer."}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 sm:p-5 flex items-baseline justify-between gap-2 border-t ${
                isModern
                  ? "bg-[#F8FAF9] border-[#DCE5DF]"
                  : "bg-[#EDF0E7] border-[#BFBFBD]"
              }`}
            >
              <span className="text-[16px] font-semibold text-[#121C17]">
                {lang === "no" ? "Estimert totalt (selge selv)" : "Estimated total (DIY)"}
              </span>
              <span className="text-[24px] sm:text-[28px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(totalDiyCost)}
              </span>
            </div>
          </div>
        </div>

        {/* CRYSTAL-CLEAR BREAK-EVEN & FAIR VALUE EXPLANATION */}
        <div
          className={`p-5 sm:p-6 space-y-4 border-2 ${
            isModern
              ? "bg-[#E6F2EC] border-[#147A53] rounded-2xl"
              : "bg-[#DCE2CF] border-[#5D726A] rounded-none"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#0F3D2E]">
                {lang === "no"
                  ? "Nøkkeltall: Når lønner megler seg?"
                  : "Key Break-Even Metric: When Does a Broker Pay Off?"}
              </p>
              <h3 className="text-[20px] sm:text-2xl font-semibold text-[#000000] mt-0.5">
                {lang === "no"
                  ? `Megler lønner seg hvis budrunden gir minst +${breakEvenLiftFormatted} % (${formatNok(brokerExtraCost)}) høyere salgspris`
                  : `A broker pays off if bidding achieves at least +${breakEvenLiftFormatted}% (${formatNok(brokerExtraCost)}) higher sale price`}
              </h3>
            </div>
            <div
              className={`px-4 py-2.5 text-center shrink-0 ${
                isModern
                  ? "bg-[#FFFFFF] border border-[#9EB6AA] rounded-xl"
                  : "bg-[#FFFFFF] border border-[#5D726A] rounded-none"
              }`}
            >
              <span className="block text-[12px] font-medium text-[#3B4D44]">
                {lang === "no" ? "Direkte merkostnad" : "Direct fee difference"}
              </span>
              <span className="block text-[22px] font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(brokerExtraCost)}
              </span>
            </div>
          </div>

          {/* 3 Transparent Scenarios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px]">
            <div
              className={`p-3.5 ${
                isModern
                  ? "bg-[#FFFFFF] border border-[#C3DEC9] rounded-xl"
                  : "bg-[#FFFFFF] border border-[#BFBFBD] rounded-none"
              }`}
            >
              <span className="block text-[12px] font-semibold text-[#5D726A]">
                {lang === "no" ? "Scenario 1: Lik salgspris (0 %)" : "Scenario 1: Same price (0%)"}
              </span>
              <span className="block text-[16px] font-semibold text-[#000000] mt-1 tabular-nums">
                {lang === "no"
                  ? `Selge selv vinner +${formatNok(brokerExtraCost)}`
                  : `DIY wins by +${formatNok(brokerExtraCost)}`}
              </span>
              <span className="block text-[12px] text-[#3B4D44] mt-0.5">
                {lang === "no"
                  ? "Hvis boligen selger til samme pris uten megler."
                  : "If the home sells for the same price DIY."}
              </span>
            </div>

            <div
              className={`p-3.5 ${
                isModern
                  ? "bg-[#FFFFFF] border border-[#C3DEC9] rounded-xl"
                  : "bg-[#FFFFFF] border border-[#BFBFBD] rounded-none"
              }`}
            >
              <span className="block text-[12px] font-semibold text-[#5D726A]">
                {lang === "no"
                  ? `Scenario 2: Nullpunkt (+${breakEvenLiftFormatted} %)`
                  : `Scenario 2: Break-even (+${breakEvenLiftFormatted}%)`}
              </span>
              <span className="block text-[16px] font-semibold text-[#000000] mt-1 tabular-nums">
                {lang === "no" ? "Lik netto (0 kr forskjell)" : "Same net (0 kr difference)"}
              </span>
              <span className="block text-[12px] text-[#3B4D44] mt-0.5">
                {lang === "no"
                  ? "Megler betaler for seg selv, og du sparer egeninnsats."
                  : "Broker covers their extra fee while saving your time."}
              </span>
            </div>

            <div
              className={`p-3.5 ${
                isModern
                  ? "bg-[#FFFFFF] border border-[#C3DEC9] rounded-xl"
                  : "bg-[#FFFFFF] border border-[#BFBFBD] rounded-none"
              }`}
            >
              <span className="block text-[12px] font-semibold text-[#5D726A]">
                {lang === "no"
                  ? `Scenario 3: +2,5 % høyere bud (+${formatNok(scenarioLiftKr)})`
                  : `Scenario 3: +2.5% higher bid (+${formatNok(scenarioLiftKr)})`}
              </span>
              <span
                className={`block text-[16px] font-semibold mt-1 tabular-nums ${
                  scenarioNetDiffWithBroker >= 0
                    ? isModern
                      ? "text-[#147A53]"
                      : "text-[#2E6248]"
                    : "text-[#000000]"
                }`}
              >
                {scenarioNetDiffWithBroker >= 0
                  ? lang === "no"
                    ? `Megler vinner +${formatNok(scenarioNetDiffWithBroker)}`
                    : `Broker wins by +${formatNok(scenarioNetDiffWithBroker)}`
                  : lang === "no"
                  ? `Selge selv vinner +${formatNok(Math.abs(scenarioNetDiffWithBroker))}`
                  : `DIY wins by +${formatNok(Math.abs(scenarioNetDiffWithBroker))}`}
              </span>
              <span className="block text-[12px] text-[#3B4D44] mt-0.5">
                {lang === "no"
                  ? "Eksempel — høyere pris er aldri garantert."
                  : "Illustrative — higher sale price is never guaranteed."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sources & Assumptions Card */}
      <div
        className={`p-4 sm:p-5 ${
          isModern
            ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl"
            : "bg-[#F7F7F7] border border-[#BFBFBD] rounded-none"
        }`}
      >
        <div className="flex items-start gap-2.5">
          <ShieldCheckIcon
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              isModern ? "text-[#147A53]" : "text-[#5D726A]"
            }`}
          />
          <div
            className={`space-y-1 text-[13px] sm:text-[14px] leading-relaxed ${
              isModern ? "text-[#3B4D44]" : "text-[#292823]"
            }`}
          >
            <p className="font-semibold text-[#121C17]">
              {lang === "no" ? "Kilder og forutsetninger (2025/2026)" : "Sources & Assumptions (2025/2026)"}
            </p>
            <p>
              {lang === "no"
                ? "Tallene bygger på Forbrukerrådets veiledning, 2025/2026-prislister fra norske meglerkjeder (bl.a. DNB Eiendom, EiendomsMegler 1, Krogsveen og EIE), Propr.no (Plusspakke 35 950 kr inkl. oppgjør via Norsk Eiendomsoppgjør; Grunnpakke 24 970 kr), samt veiledende satser for valgfri boligselgerforsikring fra bl.a. Fremtind, Gjensidige og Anticimex. Provisjon, markedspakke og forsikringspromille varierer fra kontor til kontor og mellom forsikringsselskaper — hent alltid 2–3 skriftlige tilbud."
                : "Benchmarks draw on Forbrukerrådet guidance, 2025/2026 Norwegian agency fee schedules (incl. DNB Eiendom, EiendomsMegler 1, Krogsveen & EIE), Propr.no (Plus package 35 950 kr incl. settlement via Norsk Eiendomsoppgjør; Basic 24 970 kr), and indicative optional seller-insurance rates from Fremtind, Gjensidige & Anticimex. Commission, promotion packages, and insurance rates vary across offices and insurers — always compare 2–3 written quotes."}
            </p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
