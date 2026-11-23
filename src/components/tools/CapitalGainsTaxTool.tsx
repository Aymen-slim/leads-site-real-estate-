"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type AssetKind = "primary" | "cabin" | "secondary" | "land";

export function CapitalGainsTaxTool() {
  const { lang, isModern } = useApp();

  const [assetKind, setAssetKind] = useState<AssetKind>("primary");
  const [meetsResidencyRule, setMeetsResidencyRule] = useState<boolean>(true);
  const [salePrice, setSalePrice] = useState<number>(6_800_000);
  const [purchasePrice, setPurchasePrice] = useState<number>(4_400_000);
  const [deductions, setDeductions] = useState<number>(350_000);

  const isTaxFree =
    (assetKind === "primary" || assetKind === "cabin") && meetsResidencyRule;

  const grossGain = salePrice - purchasePrice - deductions;
  const taxableGain = isTaxFree ? 0 : Math.max(0, grossGain);
  const taxLossDeduction = !isTaxFree && grossGain < 0 ? Math.round(Math.abs(grossGain) * 0.22) : 0;
  const capitalGainsTax = Math.round(taxableGain * 0.22);
  const netAfterTax = Math.max(0, salePrice - capitalGainsTax);

  const taxPct = salePrice > 0 ? Math.round((capitalGainsTax / salePrice) * 100) : 0;
  const gainPct =
    salePrice > 0 ? Math.max(0, Math.min(100 - taxPct, Math.round((Math.max(0, grossGain) / salePrice) * 100))) : 0;
  const basisPct = Math.max(0, 100 - taxPct - gainPct);

  const assetCards: { id: AssetKind; titleNo: string; titleEn: string; ruleNo: string; ruleEn: string }[] = [
    {
      id: "primary",
      titleNo: "Primærbolig (egen bolig)",
      titleEn: "Primary Residence",
      ruleNo: "Skattefri etter 12 av siste 24 mnd.",
      ruleEn: "Tax-free after 12 of last 24 months",
    },
    {
      id: "cabin",
      titleNo: "Fritidsbolig / Hytte",
      titleEn: "Cabin / Leisure Home",
      ruleNo: "Skattefri etter 5 av siste 8 år",
      ruleEn: "Tax-free after 5 of last 8 years",
    },
    {
      id: "secondary",
      titleNo: "Sekundærbolig / Utleie",
      titleEn: "Secondary / Rental Home",
      ruleNo: "Alltid 22 % gevinstskatt",
      ruleEn: "Always 22% capital gains tax",
    },
    {
      id: "land",
      titleNo: "Ubebygd byggetomt",
      titleEn: "Constructible Land Plot",
      ruleNo: "Alltid 22 % gevinstskatt",
      ruleEn: "Always 22% capital gains tax",
    },
  ];

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  const title =
    lang === "no"
      ? "Skattefritt salg eller 22 % gevinstskatt på bolig og hytte?"
      : "Tax-Free Sale & Capital Gains Tax Calculator";
  const subtitle =
    lang === "no"
      ? "Sjekk om boligen eller hytta kan selges 100 % skattefritt og beregn eksakt gevinstskatt."
      : "Verify if your Norwegian sale qualifies as 100% tax-free (12/24-month home rule or 5/8-year cabin rule) or compute exact 22% capital gains tax after deductions.";

  return (
    <ToolShell
      slug="capital-gains-tax"
      iconKey="tax-calc"
      title={title}
      subtitle={subtitle}
      ctaSource="tax-calc"
      ctaHref={`/koble-til-megler?source=tax-calc&type=${
        assetKind === "land" ? "land" : "house"
      }&price=${salePrice}&net=${netAfterTax}&tax=${capitalGainsTax}`}
      ctaLabel={
        lang === "no"
          ? "Få en gratis verdivurdering fra lokal megler før du planlegger salgstidspunkt"
          : "Get a free local valuation to time your sale for maximum after-tax proceeds"
      }
    >
      {/* Step 1: Asset Type */}
      <div>
        <h2
          className={`text-[18px] sm:text-xl mb-3 ${
            isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
          }`}
        >
          {lang === "no" ? "1. Hva slags eiendom skal du selge?" : "1. What type of property are you selling?"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {assetCards.map((card) => {
            const active = assetKind === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setAssetKind(card.id)}
                aria-pressed={active}
                className={`${
                  isModern ? "nm-tap-card" : "kr-tap-card"
                } min-h-[76px] p-4 sm:p-5 border-2 text-left flex items-center justify-between gap-3 ${
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
                  <span className="block text-[17px] sm:text-[19px] font-semibold">
                    {lang === "no" ? card.titleNo : card.titleEn}
                  </span>
                  <span
                    className={`block text-[14px] mt-0.5 ${
                      isModern ? "text-[#3B4D44]" : "text-[#292823]"
                    }`}
                  >
                    {lang === "no" ? card.ruleNo : card.ruleEn}
                  </span>
                </div>
                {active && (
                  <CheckMarkIcon
                    className={`w-6 h-6 shrink-0 ${
                      isModern ? "text-[#147A53]" : "text-[#5D726A]"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Residency Check (only for Primary or Cabin) */}
      {(assetKind === "primary" || assetKind === "cabin") && (
        <div className={panelClass}>
          <h2
            className={`text-[18px] sm:text-xl ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {assetKind === "primary"
              ? lang === "no"
                ? "2. Har du eid og bodd i boligen i minst 12 av de siste 24 månedene?"
                : "2. Have you owned and lived in the home for at least 12 of the last 24 months?"
              : lang === "no"
              ? "2. Har du eid og brukt hytta i minst 5 av de siste 8 årene?"
              : "2. Have you owned and used the cabin for at least 5 of the last 8 years?"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMeetsResidencyRule(true)}
              aria-pressed={meetsResidencyRule}
              className={`${
                isModern ? "nm-tap-card" : "kr-tap-card"
              } min-h-[68px] px-5 py-4 border-2 text-left text-[17px] font-semibold flex items-center justify-between gap-3 ${
                meetsResidencyRule
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
                  ? "Ja — oppfyller kravet (Skattefritt)"
                  : "Yes — meets requirement (Tax-free)"}
              </span>
              {meetsResidencyRule && (
                <CheckMarkIcon
                  className={`w-6 h-6 shrink-0 ${
                    isModern ? "text-[#147A53]" : "text-[#5D726A]"
                  }`}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMeetsResidencyRule(false)}
              aria-pressed={!meetsResidencyRule}
              className={`${
                isModern ? "nm-tap-card" : "kr-tap-card"
              } min-h-[68px] px-5 py-4 border-2 text-left text-[17px] font-semibold flex items-center justify-between gap-3 ${
                !meetsResidencyRule
                  ? isModern
                    ? "bg-[#FEF2F0] border-[#B8422C] text-[#121C17]"
                    : "bg-[#FFF7D4] border-[#BA5B3E] text-[#000000]"
                  : isModern
                  ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                  : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
              }`}
            >
              <span>
                {lang === "no"
                  ? "Nei — kortere eier-/botid (22 % skatt)"
                  : "No — shorter duration (22% tax applies)"}
              </span>
              {!meetsResidencyRule && (
                <CheckMarkIcon
                  className={`w-6 h-6 shrink-0 ${
                    isModern ? "text-[#B8422C]" : "text-[#BA5B3E]"
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Sliders */}
      <div className={panelClass}>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="tax-sale-price"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "Forventet salgspris" : "Expected Sale Price"}
            </label>
            <output
              htmlFor="tax-sale-price"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(salePrice)}
            </output>
          </div>
          <input
            id="tax-sale-price"
            type="range"
            min={1_000_000}
            max={25_000_000}
            step={100_000}
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            style={
              {
                "--attr-min": 1_000_000,
                "--attr-max": 25_000_000,
                "--control-value": salePrice,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="tax-purchase-price"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "Opprinnelig kjøpesum (inngangsverdi)" : "Original Purchase Price"}
            </label>
            <output
              htmlFor="tax-purchase-price"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {formatNok(purchasePrice)}
            </output>
          </div>
          <input
            id="tax-purchase-price"
            type="range"
            min={500_000}
            max={20_000_000}
            step={100_000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            style={
              {
                "--attr-min": 500_000,
                "--attr-max": 20_000_000,
                "--control-value": purchasePrice,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="tax-deductions"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no"
                ? "Fradragsberettigede kostnader (dokumentavgift, megler, påkostninger)"
                : "Deductible Costs (stamp duty, broker fees, upgrades)"}
            </label>
            <output
              htmlFor="tax-deductions"
              className={`text-[22px] sm:text-2xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#121C17]" : "text-[#000000]"
              }`}
            >
              {formatNok(deductions)}
            </output>
          </div>
          <input
            id="tax-deductions"
            type="range"
            min={0}
            max={3_000_000}
            step={25_000}
            value={deductions}
            onChange={(e) => setDeductions(Number(e.target.value))}
            style={
              {
                "--attr-min": 0,
                "--attr-max": 3_000_000,
                "--control-value": deductions,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>
      </div>

      {/* Modern Visual Breakdown Bar */}
      {isModern && (
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[16px] font-semibold text-[#121C17]">
              {lang === "no" ? "Skattemessig fordeling av salgssummen" : "Tax Breakdown of Sale Price"}
            </span>
            <span className="text-[15px] font-semibold text-[#147A53] tabular-nums">
              {isTaxFree
                ? lang === "no"
                  ? "100 % skattefritt salg"
                  : "100% tax-free sale"
                : `${taxPct}% ${lang === "no" ? "til skatt" : "to tax"}`}
            </span>
          </div>
          <div className="h-5 w-full rounded-full overflow-hidden flex bg-[#F1F5F3]">
            <div className="h-full bg-[#0F3D2E] transition-all duration-300" style={{ width: `${basisPct}%` }} />
            <div className="h-full bg-[#147A53] transition-all duration-300" style={{ width: `${gainPct}%` }} />
            {taxPct > 0 && (
              <div className="h-full bg-[#B8422C] transition-all duration-300" style={{ width: `${taxPct}%` }} />
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-[13px] text-[#3B4D44]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0F3D2E]" />
              {lang === "no" ? "Inngangsverdi + fradrag" : "Cost basis + deductions"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#147A53]" />
              {lang === "no" ? "Netto gevinst" : "Net gain kept"}
            </span>
            {taxPct > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#B8422C]" />
                {lang === "no" ? "22 % gevinstskatt" : "22% capital gains tax"}
              </span>
            )}
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
              {lang === "no" ? "Beregnet gevinst / tap før skatt" : "Calculated Pre-Tax Gain / Loss"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {grossGain >= 0 ? `+${formatNok(grossGain)}` : `− ${formatNok(Math.abs(grossGain))}`}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Skattemessig status" : "Tax Status"}
            </span>
            <span
              className={`font-semibold whitespace-nowrap ${
                isTaxFree
                  ? isModern
                    ? "text-[#147A53]"
                    : "text-[#5D726A]"
                  : isModern
                  ? "text-[#B8422C]"
                  : "text-[#BA5B3E]"
              }`}
            >
              {isTaxFree
                ? lang === "no"
                  ? "Skattefritt (0 %)"
                  : "Tax-Free (0%)"
                : lang === "no"
                ? "Skattepliktig (22 %)"
                : "Taxable (22%)"}
            </span>
          </div>

          {taxLossDeduction > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no" ? "Beregnet skattefradrag ved tap (22 %)" : "Estimated Tax Refund on Loss (22%)"}
              </span>
              <span
                className={`font-semibold tabular-nums whitespace-nowrap ${
                  isModern ? "text-[#147A53]" : "text-[#5D726A]"
                }`}
              >
                +{formatNok(taxLossDeduction)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Salgspris etter gevinstskatt" : "Proceeds After Capital Gains Tax"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(netAfterTax)}
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
          <div>
            <span
              className={`block text-[20px] sm:text-2xl font-semibold ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {lang === "no" ? "Beregnet gevinstskatt til staten" : "Estimated Capital Gains Tax"}
            </span>
            <span className={`block text-[14px] mt-0.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {isTaxFree
                ? lang === "no"
                  ? "Du beholder 100 % av verdistigningen skattefritt."
                  : "You keep 100% of your appreciation tax-free."
                : lang === "no"
                ? "22 % av skattepliktig gevinst etter fradrag."
                : "22% applied to net taxable gain after deductions."}
            </span>
          </div>
          <span
            className={`text-[32px] sm:text-5xl font-semibold tabular-nums whitespace-nowrap ${
              capitalGainsTax > 0
                ? isModern
                  ? "text-[#B8422C]"
                  : "text-[#BA5B3E]"
                : isModern
                ? "text-[#147A53]"
                : "text-[#000000]"
            }`}
          >
            {formatNok(capitalGainsTax)}
          </span>
        </div>
      </div>
    </ToolShell>
  );
}
