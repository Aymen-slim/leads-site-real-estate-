"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type AssetKind = "primary" | "cabin" | "secondary" | "land";

const CAPITAL_GAINS_TAX_RATE = 0.22; // Skatteetaten 2026 alminnelig inntekt

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
  const capitalGainsTax = Math.round(taxableGain * CAPITAL_GAINS_TAX_RATE);
  const taxLossDeduction =
    !isTaxFree && grossGain < 0 ? Math.round(Math.abs(grossGain) * CAPITAL_GAINS_TAX_RATE) : 0;
  const netGainKept = Math.max(0, grossGain - capitalGainsTax);
  const salePriceAdjustedForTax = Math.max(0, salePrice - capitalGainsTax + taxLossDeduction);

  // Accurate non-overlapping breakdown of sale price (cost basis + net gain kept + tax = 100%)
  const taxPct = salePrice > 0 ? Math.round((capitalGainsTax / salePrice) * 100) : 0;
  const gainPct =
    salePrice > 0
      ? Math.max(0, Math.min(100 - taxPct, Math.round((netGainKept / salePrice) * 100)))
      : 0;
  const basisPct = Math.max(0, 100 - taxPct - gainPct);

  const assetCards: {
    id: AssetKind;
    titleNo: string;
    titleEn: string;
    ruleNo: string;
    ruleEn: string;
  }[] = [
    {
      id: "primary",
      titleNo: "Primærbolig (egen bolig)",
      titleEn: "Primary Residence",
      ruleNo: "Skattefri etter >12 mnd. eie og 12/24 mnd. botid",
      ruleEn: "Tax-free after >12 mo owned & 12/24 mo lived in",
    },
    {
      id: "cabin",
      titleNo: "Fritidsbolig / Hytte",
      titleEn: "Cabin / Leisure Home",
      ruleNo: "Skattefri etter >5 år eie og 5 av siste 8 år bruk",
      ruleEn: "Tax-free after >5 yrs owned & 5 of last 8 yrs used",
    },
    {
      id: "secondary",
      titleNo: "Sekundærbolig / Utleie",
      titleEn: "Secondary / Rental Home",
      ruleNo: "Alltid 22 % skatt på gevinst / fradrag ved tap",
      ruleEn: "Always 22% tax on gain / deduction on loss",
    },
    {
      id: "land",
      titleNo: "Ubebygd byggetomt",
      titleEn: "Constructible Land Plot",
      ruleNo: "Alltid 22 % skatt på gevinst / fradrag ved tap",
      ruleEn: "Always 22% tax on gain / deduction on loss",
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
      ? "Sjekk reglene i Skatteloven § 9-3 (bo-, bruks- og eiertid) og beregn eksakt 22 % gevinstskatt eller tapsfradrag."
      : "Verify Norway's Tax Act § 9-3 residency/ownership rules (12/24-month home or 5/8-year cabin rule) and calculate exact 22% capital gains tax or loss relief.";

  return (
    <ToolShell
      slug="capital-gains-tax"
      iconKey="tax-calc"
      title={title}
      subtitle={subtitle}
      ctaSource="tax-calc"
      ctaHref={`/koble-til-megler?source=tax-calc&type=${
        assetKind === "land" ? "land" : "house"
      }&price=${salePrice}&net=${salePriceAdjustedForTax}&tax=${capitalGainsTax}`}
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
          {lang === "no"
            ? "1. Hva slags eiendom skal du selge?"
            : "1. What type of property are you selling?"}
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

      {/* Step 2: Ownership & Residency Check (Primary or Cabin) */}
      {(assetKind === "primary" || assetKind === "cabin") && (
        <div className={panelClass}>
          <div>
            <h2
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {assetKind === "primary"
                ? lang === "no"
                  ? "2. Har du eid boligen i over 12 måneder OG bodd der i minst 12 av de siste 24 månedene?"
                  : "2. Have you owned the home >12 months AND lived in it at least 12 of the last 24 months?"
                : lang === "no"
                ? "2. Har du eid hytta i over 5 år OG brukt den som egen fritidsbolig i minst 5 av de siste 8 årene?"
                : "2. Have you owned the cabin >5 years AND used it personally in at least 5 of the last 8 years?"}
            </h2>
            <p className={`text-[14px] mt-1 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no"
                ? "Begge kravene (eiertid og bo-/brukstid) måles bakover fra datoen du aksepterer budet (realisasjonstidspunktet) — ikke overtakelsesdatoen."
                : "Both ownership and residency/use are measured backward from the date you accept the buyer's bid (realization date), not the handover date."}
            </p>
          </div>
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
                  ? "Ja — oppfyller begge kravene (Skattefritt)"
                  : "Yes — meets both rules (Tax-free)"}
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
                  ? "Nei — kortere eier- eller botid (22 % skatt)"
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
              {lang === "no"
                ? "Forventet salgspris (utgangsverdi)"
                : "Expected Sale Price (Gross Proceeds)"}
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
              {lang === "no"
                ? "Opprinnelig kjøpesum (inngangsverdi)"
                : "Original Purchase Price (Cost Basis)"}
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
                ? "Fradragsberettigede kostnader (kjøps-/salgsutgifter & påkostninger)"
                : "Deductible Costs (Purchase/Sale Fees & Capital Upgrades)"}
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
          <p className={`text-[13px] mt-1.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
            {lang === "no"
              ? "Inkluderer dokumentavgift/tinglysing fra kjøpet, megler/tilstandsrapport ved salg og dokumenterte påkostninger (standardheving, tilbygg). Vanlig vedlikehold (maling, slitasje) gir ikke fradrag ved salg av egen bolig."
              : "Includes original stamp duty/deed fees, selling broker/inspection costs, and documented capital upgrades (påkostninger). Routine maintenance is not deductible when selling a personal residence."}
          </p>
        </div>
      </div>

      {/* Symmetry Warning for Tax-Free Loss */}
      {isTaxFree && grossGain < 0 && (
        <div
          className={`p-4 sm:p-5 border-2 ${
            isModern
              ? "bg-[#FEF6E2] border-[#E5C169] rounded-2xl text-[#1D281C]"
              : "bg-[#FFF7D4] border-[#BA5B3E] rounded-none text-[#000000]"
          }`}
        >
          <p className="text-[16px] sm:text-[17px] font-semibold">
            {lang === "no"
              ? "Symmetriprinsippet: Ingen skattefradrag ved tap på skattefritt salg"
              : "Symmetry Rule: No 22% Tax Deduction on a Tax-Free Loss"}
          </p>
          <p className={`text-[14px] mt-1 ${isModern ? "text-[#495647]" : "text-[#292823]"}`}>
            {lang === "no"
              ? "Når boligen eller hytta oppfyller kravene til skattefritt salg (Skatteloven §§ 9-3 / 9-4), er et eventuelt tap heller ikke fradragsberettiget."
              : "Under Norwegian tax law (§§ 9-3 / 9-4), because any gain would be tax-free, a net loss on the same sale is not tax-deductible."}
          </p>
        </div>
      )}

      {/* Modern Visual Breakdown Bar */}
      {isModern && grossGain >= 0 && (
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[16px] font-semibold text-[#121C17]">
              {lang === "no"
                ? "Skattemessig fordeling av salgssummen"
                : "Tax Breakdown of Sale Price"}
            </span>
            <span className="text-[15px] font-semibold text-[#147A53] tabular-nums">
              {isTaxFree
                ? lang === "no"
                  ? "100 % skattefritt salg"
                  : "100% tax-free sale"
                : `${taxPct}% ${lang === "no" ? "av salgspris til skatt" : "of sale price to tax"}`}
            </span>
          </div>
          <div className="h-5 w-full rounded-full overflow-hidden flex bg-[#F1F5F3]">
            <div
              className="h-full bg-[#0F3D2E] transition-all duration-300"
              style={{ width: `${basisPct}%` }}
            />
            <div
              className="h-full bg-[#147A53] transition-all duration-300"
              style={{ width: `${gainPct}%` }}
            />
            {taxPct > 0 && (
              <div
                className="h-full bg-[#B8422C] transition-all duration-300"
                style={{ width: `${taxPct}%` }}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-[13px] text-[#3B4D44]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0F3D2E]" />
              {lang === "no"
                ? `Inngangsverdi + fradrag (${basisPct}%)`
                : `Cost basis + deductions (${basisPct}%)`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#147A53]" />
              {lang === "no"
                ? `Netto gevinst beholdt (${gainPct}%)`
                : `Net gain kept (${gainPct}%)`}
            </span>
            {taxPct > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#B8422C]" />
                {lang === "no"
                  ? `22 % gevinstskatt (${taxPct}%)`
                  : `22% capital gains tax (${taxPct}%)`}
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
              {lang === "no"
                ? "Utgangsverdi − inngangsverdi − fradrag"
                : "Sale price − cost basis − deductions"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {grossGain >= 0
                ? `+${formatNok(grossGain)}`
                : `− ${formatNok(Math.abs(grossGain))}`}
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

          {!isTaxFree && grossGain > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? "Netto gevinst du beholder etter skatt"
                  : "Net Gain Kept After Tax"}
              </span>
              <span
                className={`font-semibold tabular-nums whitespace-nowrap ${
                  isModern ? "text-[#147A53]" : "text-[#000000]"
                }`}
              >
                +{formatNok(netGainKept)}
              </span>
            </div>
          )}

          {taxLossDeduction > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? "Beregnet skattefradrag ved tap (22 % av tapet)"
                  : "Estimated Tax Relief on Loss (22% of Loss)"}
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
              <span className="block">
                {lang === "no"
                  ? "Salgspris etter gevinstskatt / tapsfradrag"
                  : "Sale Price Adjusted for Tax / Loss Relief"}
              </span>
              <span className="block text-[13px] opacity-80">
                {lang === "no"
                  ? "Før innfrielse av boliglån og faktiske salgsutgifter"
                  : "Before paying off any mortgage and actual selling costs"}
              </span>
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(salePriceAdjustedForTax)}
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
              {taxLossDeduction > 0
                ? lang === "no"
                  ? "Estimert skattefordel (fradrag ved tap)"
                  : "Estimated Tax Refund (Loss Deduction)"
                : lang === "no"
                ? "Beregnet gevinstskatt til staten"
                : "Estimated Capital Gains Tax"}
            </span>
            <span
              className={`block text-[14px] mt-0.5 ${
                isModern ? "text-[#3B4D44]" : "text-[#292823]"
              }`}
            >
              {isTaxFree
                ? lang === "no"
                  ? "0 kr i skatt — oppfyller eier- og bo-/brukstidskravene."
                  : "0 kr tax — meets ownership and residency/use requirements."
                : taxLossDeduction > 0
                ? lang === "no"
                  ? "22 % av fradragsberettiget tap trekkes fra i alminnelig inntekt."
                  : "22% of deductible loss reduces ordinary taxable income."
                : lang === "no"
                ? "22 % av skattepliktig gevinst etter dokumenterte fradrag."
                : "22% applied to net taxable gain after documented deductions."}
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
            {taxLossDeduction > 0 ? `+${formatNok(taxLossDeduction)}` : formatNok(capitalGainsTax)}
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
              ? "Skatteloven §§ 9-3 og 9-4 & Skatteetaten (2026): Skattepliktig gevinst beskattes som alminnelig inntekt med 22 %. Realisasjonstidspunktet er datoen budet aksepteres."
              : "Norwegian Tax Act §§ 9-3 & 9-4 and Skatteetaten (2026): Taxable gains are taxed at 22% ordinary income rate. Realization occurs on the date the buyer's bid is accepted."}
          </li>
          <li>
            {lang === "no"
              ? "Unntak ved brukshindring (arbeid, utdanning eller helse du ikke kjente til ved innflytting) kan telle som opparbeidet botid på primærbolig."
              : "Exceptions for involuntary non-occupancy (brukshindring due to work, study, or health unknown at purchase) may count toward primary-home residency."}
          </li>
          <li>
            {lang === "no"
              ? "Særregler gjelder dersom mer enn 50 % av boligen (målt etter utleieverdi) har vært utleid, ved salg av flermannsbolig, eller ved arvet eiendom (kontinuitet vs. markedsverdi). Sjekk skatteetaten.no eller rådgiver ved tvilstilfeller."
              : "Special rules apply if >50% of the home (by rental value) was rented out, for multi-unit buildings, or inherited homes. Confirm complex cases with Skatteetaten or a tax advisor."}
          </li>
        </ul>
      </div>
    </ToolShell>
  );
}
