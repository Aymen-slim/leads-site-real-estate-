"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type SalePropType = "house" | "selveier" | "borettslag";

const INSURANCE_PROMILLE: Record<SalePropType, number> = {
  house: 5.5,
  selveier: 3.9,
  borettslag: 3.1,
};

const TILSTANDSRAPPORT_COST: Record<SalePropType, number> = {
  house: 17_500,
  selveier: 12_500,
  borettslag: 11_500,
};

export function BrokerFeeTool() {
  const { lang, isModern } = useApp();

  const [propType, setPropType] = useState<SalePropType>("house");
  const [salePrice, setSalePrice] = useState<number>(6_200_000);
  const [commissionPct, setCommissionPct] = useState<number>(1.6);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [includeStyling, setIncludeStyling] = useState<boolean>(false);

  const commissionFee = Math.max(45_000, Math.round((salePrice * commissionPct) / 100));
  const onboardingAndSettlement = 24_900;
  const marketingAndPhoto = 19_500 + (includeStyling ? 18_000 : 0);
  const tilstandsrapport = TILSTANDSRAPPORT_COST[propType];
  const sellerInsurance = includeInsurance
    ? Math.round((salePrice * INSURANCE_PROMILLE[propType]) / 1000)
    : 0;

  const totalBrokerCost =
    commissionFee +
    onboardingAndSettlement +
    marketingAndPhoto +
    tilstandsrapport +
    sellerInsurance;

  const diyBaseCost = 29_500 + tilstandsrapport + sellerInsurance;
  const brokerExtraCost = Math.max(0, totalBrokerCost - diyBaseCost);
  const breakEvenLiftPct = ((brokerExtraCost / salePrice) * 100).toFixed(2);
  const estimatedBrokerPriceLift = Math.round(salePrice * 0.035); // Conservative 3.5% bidding lift
  const netAdvantageWithTopBroker = estimatedBrokerPriceLift - brokerExtraCost;

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  const typeCards: { id: SalePropType; labelNo: string; labelEn: string; subNo: string; subEn: string }[] = [
    {
      id: "house",
      labelNo: "Enebolig / Rekkehus",
      labelEn: "Detached / Townhouse",
      subNo: "Forsikring ca. 5,5 promille",
      subEn: "Insurance ~5.5‰",
    },
    {
      id: "selveier",
      labelNo: "Selveierleilighet",
      labelEn: "Freehold Apartment",
      subNo: "Forsikring ca. 3,9 promille",
      subEn: "Insurance ~3.9‰",
    },
    {
      id: "borettslag",
      labelNo: "Borettslag",
      labelEn: "Co-op (Borettslag)",
      subNo: "Forsikring ca. 3,1 promille",
      subEn: "Insurance ~3.1‰",
    },
  ];

  const maxBar = Math.max(totalBrokerCost, diyBaseCost, 1);

  return (
    <ToolShell
      slug="broker-fee"
      iconKey="broker-fee"
      title={
        lang === "no"
          ? "Meglerkostnad & «Selge selv vs. Megler» Kalkulator"
          : "Broker Commission & DIY vs. Agency Calculator"
      }
      subtitle={
        lang === "no"
          ? "Se komplett prisoversikt for provisjon, tilrettelegging, tilstandsrapport og boligselgerforsikring — og sammenlign direkte med å selge boligen selv."
          : "See an itemized breakdown of Norwegian commission, mandatory inspection, and seller insurance — and compare against selling DIY."
      }
      ctaSource="broker-fee"
      ctaHref={`/connect-agency?source=broker-fee&type=${
        propType === "house" ? "house" : "apartment"
      }&price=${salePrice}&brokerCost=${totalBrokerCost}&net=${salePrice - totalBrokerCost}`}
      ctaLabel={
        lang === "no"
          ? "Sammenlign uforpliktende tilbud fra 2–3 lokale meglere og spar opptil 35 000 kr"
          : "Compare non-binding offers from top local agencies and negotiate the best commission"
      }
    >
      {/* Property Type */}
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
                onClick={() => setPropType(c.id)}
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
                  <span className={`block text-[13px] mt-0.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
                    {lang === "no" ? c.subNo : c.subEn}
                  </span>
                </div>
                {active && (
                  <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders + Toggles */}
      <div className={panelClass}>
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

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="broker-commission"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "3. Meglerprovisjon (vanlig: 1,2 % – 2,2 %)" : "3. Broker Commission Rate (typical: 1.2%–2.2%)"}
            </label>
            <output
              htmlFor="broker-commission"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {commissionPct.toFixed(1).replace(".", ",")} %
            </output>
          </div>
          <input
            id="broker-commission"
            type="range"
            min={1.0}
            max={3.0}
            step={0.1}
            value={commissionPct}
            onChange={(e) => setCommissionPct(Number(e.target.value))}
            style={
              {
                "--attr-min": 1.0,
                "--attr-max": 3.0,
                "--control-value": commissionPct,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIncludeInsurance((v) => !v)}
            aria-pressed={includeInsurance}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[16px] font-semibold flex items-center justify-between gap-2 ${
              includeInsurance
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <span>
              {lang === "no" ? "Inkluder boligselgerforsikring" : "Include Seller Liability Insurance"}
            </span>
            {includeInsurance && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIncludeStyling((v) => !v)}
            aria-pressed={includeStyling}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[16px] font-semibold flex items-center justify-between gap-2 ${
              includeStyling
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <span>
              {lang === "no" ? "Inkluder boligstyling (+18 000 kr)" : "Include Home Staging (+18 000 kr)"}
            </span>
            {includeStyling && (
              <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Modern Visual Cost Comparison */}
      {isModern && (
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-[17px] font-semibold text-[#121C17]">
            {lang === "no"
              ? "Kostnadssammenligning: Eiendomsmegler vs. Selge selv"
              : "Cost Comparison: Full-Service Agency vs. DIY"}
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[15px] mb-1">
                <span className="font-medium text-[#121C17]">
                  {lang === "no" ? "Komplett salg med lokal megler" : "Full-service local agency"}
                </span>
                <span className="font-semibold tabular-nums text-[#0F3D2E]">{formatNok(totalBrokerCost)}</span>
              </div>
              <div className="h-3.5 w-full bg-[#F1F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#147A53] rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((totalBrokerCost / maxBar) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[15px] mb-1">
                <span className="font-medium text-[#3B4D44]">
                  {lang === "no" ? "Selge bolig selv (digital pakke + takst/forsikring)" : "Sell DIY (digital platform + report/insurance)"}
                </span>
                <span className="font-semibold tabular-nums text-[#3B4D44]">{formatNok(diyBaseCost)}</span>
              </div>
              <div className="h-3.5 w-full bg-[#F1F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#647B6F] rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((diyBaseCost / maxBar) * 100)}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-[14px] text-[#3B4D44] bg-[#E6F2EC] rounded-xl px-4 py-3 border border-[#C3DEC9]">
            {lang === "no"
              ? `Megleren trenger kun å oppnå ${breakEvenLiftPct.replace(".", ",")} % høyere salgspris for å betale seg selv. Med konservativt +3,5 % i budrunde gir megler ${formatNok(
                  Math.max(0, netAdvantageWithTopBroker)
                )} ekstra netto på konto.`
              : `A broker only needs a ${breakEvenLiftPct}% higher bid to break even. A conservative +3.5% bidding lift adds +${formatNok(
                  Math.max(0, netAdvantageWithTopBroker)
                )} net after fees.`}
          </p>
        </div>
      )}

      {/* Itemized Ledger */}
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
                ? `Meglerprovisjon (${commissionPct.toFixed(1).replace(".", ",")} %, min. 45 000 kr)`
                : `Broker Commission (${commissionPct.toFixed(1)}%, min. 45 000 kr)`}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(commissionFee)}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Tilrettelegging, oppgjør & innhenting av opplysninger" : "Onboarding, Settlement & Municipal Info"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(onboardingAndSettlement)}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Markedspakke (FINN.no, foto, prospekt)" : "Marketing Package (FINN.no, Photo, Brochure)"}
              {includeStyling ? (lang === "no" ? " + styling" : " + staging") : ""}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(marketingAndPhoto)}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Tilstandsrapport (takstmann)" : "Technical Inspection Report (Tilstandsrapport)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(tilstandsrapport)}
            </span>
          </div>
          {includeInsurance && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? `Boligselgerforsikring (${INSURANCE_PROMILLE[propType].toFixed(1).replace(".", ",")} promille)`
                  : `Seller Insurance (${INSURANCE_PROMILLE[propType]}‰)`}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(sellerInsurance)}
              </span>
            </div>
          )}
          {!isModern && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="text-[#292823] font-medium">
                {lang === "no"
                  ? `Selge selv (digital pakke + takst/forsikring) — krever kun +${breakEvenLiftPct.replace(".", ",")} % høyere bud for megler`
                  : `DIY package (+ report/insurance) — broker breaks even at +${breakEvenLiftPct}% bid`}
              </span>
              <span className="font-semibold text-[#5D726A] tabular-nums whitespace-nowrap">
                {formatNok(diyBaseCost)}
              </span>
            </div>
          )}
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
            {lang === "no" ? "Estimert total megler- og salgskostnad" : "Estimated Total Agency & Sale Cost"}
          </span>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(totalBrokerCost)}
          </span>
        </div>
      </div>
    </ToolShell>
  );
}
