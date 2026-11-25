"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type OwnershipKind = "selveier" | "borettslag" | "nybygg";

// Verified 2026 Kartverket statutory fees (equal for electronic & paper, freehold & borettslag)
const KARTVERKET_REG_FEE = 545;
const KARTVERKET_PANTATTEST_FEE = 260;
const PREEMPTION_FEE_ESTIMATE = 7_600; // Typical OBOS / boligbyggelag forkjøpsrettsgebyr if exercised by buyer

const BUYER_INSURANCE_ESTIMATE: Record<OwnershipKind, number> = {
  selveier: 11_500, // Typical detached/freehold range ~7 400–14 600 kr depending on type & insurer
  borettslag: 5_500, // Typical co-op range ~4 100–7 200 kr depending on insurer
  nybygg: 11_500, // Optional (new-builds also carry 5-yr bustadoppføringslova warranty)
};

export function DocumentFeeTool() {
  const { lang, isModern } = useApp();

  const [ownership, setOwnership] = useState<OwnershipKind>("selveier");
  const [purchasePrice, setPurchasePrice] = useState<number>(6_000_000);
  const [landValueNewBuild, setLandValueNewBuild] = useState<number>(1_400_000);
  const [withMortgage, setWithMortgage] = useState<boolean>(true);
  const [usePreemption, setUsePreemption] = useState<boolean>(false);
  const [includeBuyerInsurance, setIncludeBuyerInsurance] = useState<boolean>(false);

  const clampedLandValue = Math.min(landValueNewBuild, purchasePrice);
  const stampDutyBase =
    ownership === "selveier" ? purchasePrice : ownership === "nybygg" ? clampedLandValue : 0;
  const stampDuty = Math.round(stampDutyBase * 0.025);

  const deedRegFee = KARTVERKET_REG_FEE;
  const mortgageRegFee = withMortgage ? KARTVERKET_REG_FEE : 0;
  const pantattestFee = withMortgage ? KARTVERKET_PANTATTEST_FEE : 0;
  const preemptionFee = ownership === "borettslag" && usePreemption ? PREEMPTION_FEE_ESTIMATE : 0;
  const buyerInsurance = includeBuyerInsurance ? BUYER_INSURANCE_ESTIMATE[ownership] : 0;

  const mandatoryFees = stampDuty + deedRegFee + mortgageRegFee + pantattestFee + preemptionFee;
  const totalFees = mandatoryFees + buyerInsurance;
  const totalCashNeeded = purchasePrice + totalFees;

  // Apples-to-apples comparison against resale freehold with identical mortgage choice (excl. optional insurance)
  const selveierEquivalent =
    Math.round(purchasePrice * 0.025) + KARTVERKET_REG_FEE + mortgageRegFee + pantattestFee;
  const savingsVsSelveier = Math.max(0, selveierEquivalent - mandatoryFees);

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  const kinds: { id: OwnershipKind; no: string; en: string; subNo: string; subEn: string }[] = [
    {
      id: "selveier",
      no: "Selveier / Enebolig",
      en: "Freehold (Selveier)",
      subNo: "2,5 % dokumentavgift på hele kjøpesummen",
      subEn: "2.5% stamp duty on full purchase price",
    },
    {
      id: "borettslag",
      no: "Borettslag",
      en: "Co-op (Borettslag)",
      subNo: "0 kr i dokumentavgift til staten",
      subEn: "0 kr state document fee",
    },
    {
      id: "nybygg",
      no: "Nybygg under oppføring",
      en: "New-Build (Freehold)",
      subNo: "2,5 % kun på tomteverdien",
      subEn: "2.5% only on land share",
    },
  ];

  return (
    <ToolShell
      slug="document-fee"
      iconKey="document-fee"
      title={
        lang === "no"
          ? "Kalkulator: Dokumentavgift & Omkostninger"
          : "2.5% Stamp Duty & Buying Costs Calculator"
      }
      subtitle={
        lang === "no"
          ? "Beregn nøyaktig dokumentavgift, Kartverkets 2026-tinglysingsgebyrer (545 kr/dok) og totale kjøpsomkostninger — sammenlign selveier mot borettslag og nybygg."
          : "Compute exact 2.5% Norwegian stamp duty (dokumentavgift), Kartverket's 2026 registration fees (545 kr/filing), and compare freehold vs. borettslag and new-builds."
      }
      ctaSource="document-fee"
      ctaHref={`/koble-til-megler?source=document-fee&type=${
        ownership === "borettslag" ? "apartment" : "house"
      }&price=${purchasePrice}&docFee=${totalFees}`}
      ctaLabel={
        lang === "no"
          ? "Skal du selge nåværende bolig før du kjøper nytt? Få en gratis lokal verdivurdering nå"
          : "Selling your current home before buying your next? Request a free local valuation now"
      }
    >
      <div>
        <h2
          className={`text-[18px] sm:text-xl mb-3 ${
            isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
          }`}
        >
          {lang === "no" ? "1. Velg eierform" : "1. Select Ownership Form"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {kinds.map((k) => {
            const active = ownership === k.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => setOwnership(k.id)}
                aria-pressed={active}
                className={`${
                  isModern ? "nm-tap-card" : "kr-tap-card"
                } min-h-[78px] p-4 border-2 text-left flex items-center justify-between gap-2 ${
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
                    {lang === "no" ? k.no : k.en}
                  </span>
                  <span
                    className={`block text-[13px] mt-0.5 ${
                      isModern ? "text-[#3B4D44]" : "text-[#292823]"
                    }`}
                  >
                    {lang === "no" ? k.subNo : k.subEn}
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

      <div className={panelClass}>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="docfee-price"
              className={`text-[18px] sm:text-xl ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "2. Kjøpesum på boligen" : "2. Property Purchase Price"}
            </label>
            <output
              htmlFor="docfee-price"
              className={`text-[26px] sm:text-3xl font-semibold tabular-nums whitespace-nowrap ${
                isModern ? "text-[#0F3D2E]" : "text-[#000000]"
              }`}
            >
              {formatNok(purchasePrice)}
            </output>
          </div>
          <input
            id="docfee-price"
            type="range"
            min={1_000_000}
            max={25_000_000}
            step={100_000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            style={
              {
                "--attr-min": 1_000_000,
                "--attr-max": 25_000_000,
                "--control-value": purchasePrice,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>

        {ownership === "nybygg" && (
          <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <label
                htmlFor="docfee-land"
                className={`text-[17px] sm:text-lg ${
                  isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
                }`}
              >
                {lang === "no"
                  ? "Andel tomteverdi (grunnlag for 2,5 %)"
                  : "Underlying Land Share (2.5% Base)"}
              </label>
              <output
                htmlFor="docfee-land"
                className="text-[22px] font-semibold tabular-nums whitespace-nowrap"
              >
                {formatNok(clampedLandValue)}
              </output>
            </div>
            <input
              id="docfee-land"
              type="range"
              min={300_000}
              max={Math.min(8_000_000, purchasePrice)}
              step={50_000}
              value={clampedLandValue}
              onChange={(e) => setLandValueNewBuild(Number(e.target.value))}
              style={
                {
                  "--attr-min": 300_000,
                  "--attr-max": Math.min(8_000_000, purchasePrice),
                  "--control-value": clampedLandValue,
                } as React.CSSProperties
              }
              className={sliderClass}
            />
            <p className={`text-[13px] mt-1.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no"
                ? "Gjelder selveier-nybygg som ikke er tatt i bruk før overdragelse. Nybygg i borettslag har 0 kr i dokumentavgift."
                : "Applies to freehold new-builds transferred before occupancy. New-build borettslag units carry 0 kr stamp duty."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setWithMortgage((v) => !v)}
            aria-pressed={withMortgage}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-3 ${
              withMortgage
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <span>
              <span className="block">
                {lang === "no" ? "Kjøpes med boliglån" : "Financed with Mortgage"}
              </span>
              <span className="block text-[13px] font-normal opacity-85">
                {lang === "no"
                  ? "+545 kr pantedokument + 260 kr pantattest"
                  : "+545 kr mortgage filing + 260 kr extract"}
              </span>
            </span>
            {withMortgage && (
              <CheckMarkIcon
                className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIncludeBuyerInsurance((v) => !v)}
            aria-pressed={includeBuyerInsurance}
            className={`${
              isModern ? "nm-tap-card" : "kr-tap-card"
            } min-h-[64px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-3 ${
              includeBuyerInsurance
                ? isModern
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                : isModern
                ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
            }`}
          >
            <span>
              <span className="block">
                {lang === "no"
                  ? "Valgfri boligkjøperforsikring"
                  : "Optional Buyer Legal Insurance"}
              </span>
              <span className="block text-[13px] font-normal opacity-85">
                {ownership === "borettslag"
                  ? lang === "no"
                    ? `Ca. ${formatNok(BUYER_INSURANCE_ESTIMATE.borettslag)} (varierer 4 100–7 200 kr)`
                    : `Est. ${formatNok(BUYER_INSURANCE_ESTIMATE.borettslag)} (varies 4,100–7,200 kr)`
                  : lang === "no"
                  ? `Ca. ${formatNok(BUYER_INSURANCE_ESTIMATE.selveier)} (leil. ca. 7 400 / hus ca. 11 500–14 600 kr)`
                  : `Est. ${formatNok(BUYER_INSURANCE_ESTIMATE.selveier)} (apt ~7.4k / house ~11.5k–14.6k kr)`}
              </span>
            </span>
            {includeBuyerInsurance && (
              <CheckMarkIcon
                className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`}
              />
            )}
          </button>
        </div>

        {ownership === "borettslag" && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setUsePreemption((v) => !v)}
              aria-pressed={usePreemption}
              className={`${
                isModern ? "nm-tap-card" : "kr-tap-card"
              } w-full min-h-[60px] px-4 py-3.5 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-3 ${
                usePreemption
                  ? isModern
                    ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                    : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : isModern
                  ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                  : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
              }`}
            >
              <span>
                <span className="block">
                  {lang === "no"
                    ? "Benytter forkjøpsrett via boligbyggelag (f.eks. OBOS / Usbl)"
                    : "Exercising Co-op Preemption Right (Forkjøpsrett)"}
                </span>
                <span className="block text-[13px] font-normal opacity-85">
                  {lang === "no"
                    ? `Ca. ${formatNok(PREEMPTION_FEE_ESTIMATE)} — betales kun hvis du faktisk overtar på forkjøpsrett`
                    : `Est. ${formatNok(PREEMPTION_FEE_ESTIMATE)} — paid only if you acquire the home via preemption`}
                </span>
              </span>
              {usePreemption && (
                <CheckMarkIcon
                  className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`}
                />
              )}
            </button>
            <p className={`text-[13px] ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no"
                ? "Merk: Eierskiftegebyr til forretningsfører i borettslag (typisk 4 900–6 700 kr) betales etter burettslagslova § 4-6 av selger, ikke kjøper."
                : "Note: Under the Norwegian Co-op Act (burettslagslova § 4-6), the HOA transfer fee (~4,900–6,700 kr) is legally paid by the seller, not the buyer."}
            </p>
          </div>
        )}
      </div>

      {/* Savings Highlight for Borettslag / Nybygg */}
      {savingsVsSelveier > 0 && (
        <div
          className={`p-4 sm:p-5 border-2 ${
            isModern
              ? "bg-[#E6F2EC] border-[#147A53] rounded-2xl text-[#0F3D2E]"
              : "bg-[#DCE2CF] border-[#5D726A] rounded-none text-[#000000]"
          }`}
        >
          <p className="text-[17px] font-semibold">
            {lang === "no"
              ? `Du sparer ${formatNok(savingsVsSelveier)} i kjøpsomkostninger sammenlignet med brukt selveier til samme pris.`
              : `You save ${formatNok(savingsVsSelveier)} in buying fees compared to a resale freehold property at the same price.`}
          </p>
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
              {ownership === "borettslag"
                ? lang === "no"
                  ? "Dokumentavgift til staten (fritatt for borettslag)"
                  : "State Stamp Duty (exempt for borettslag)"
                : ownership === "nybygg"
                ? lang === "no"
                  ? `Dokumentavgift (2,5 % av tomteverdi ${formatNok(clampedLandValue)})`
                  : `State Stamp Duty (2.5% of ${formatNok(clampedLandValue)} land share)`
                : lang === "no"
                ? `Dokumentavgift (2,5 % av ${formatNok(purchasePrice)})`
                : `State Stamp Duty (2.5% of ${formatNok(purchasePrice)})`}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(stampDuty)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {ownership === "borettslag"
                ? lang === "no"
                  ? "Tinglysingsgebyr hjemmelsoverføring andel (Kartverket)"
                  : "Kartverket Co-op Share Registration Fee"
                : lang === "no"
                ? "Tinglysingsgebyr skjøte (Kartverket)"
                : "Kartverket Deed Registration Fee (Skjøte)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(deedRegFee)}
            </span>
          </div>

          {withMortgage && (
            <>
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  {lang === "no"
                    ? "Tinglysingsgebyr pantedokument (Kartverket)"
                    : "Kartverket Mortgage Registration Fee (Pantedokument)"}
                </span>
                <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                  {formatNok(mortgageRegFee)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  {lang === "no"
                    ? "Pantattest / bekreftet grunnboksutskrift (Kartverket)"
                    : "Certified Land Registry Extract / Pantattest"}
                </span>
                <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                  {formatNok(pantattestFee)}
                </span>
              </div>
            </>
          )}

          {preemptionFee > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? "Gebyr ved bruk av forkjøpsrett (boligbyggelag, ca.)"
                  : "Preemption Right Fee (Housing Co-op, est.)"}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(preemptionFee)}
              </span>
            </div>
          )}

          {buyerInsurance > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no"
                  ? "Boligkjøperforsikring (valgfri — varierer etter leverandør)"
                  : "Buyer Legal Insurance (optional — varies by insurer)"}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(buyerInsurance)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className="font-medium text-[#000000]">
              {lang === "no"
                ? "Total kjøpesum inkl. alle omkostninger"
                : "Total Purchase Price Including All Fees"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap text-[18px] sm:text-xl">
              {formatNok(totalCashNeeded)}
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
            {lang === "no" ? "Samlede kjøpsomkostninger" : "Total Buying Transaction Costs"}
          </span>
          <span className="text-[32px] sm:text-5xl font-semibold text-[#000000] tabular-nums whitespace-nowrap">
            {formatNok(totalFees)}
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
              ? "Kartverket (2026): Standard tinglysingsgebyr er 545 kr per dokument for både fast eiendom og borettslagsandeler, med lik sats for elektronisk og papirbasert tinglysing. Bekreftet grunnboksutskrift/pantattest koster 260 kr."
              : "Kartverket (2026): Standard registration fee is 545 kr per filing for both freehold and borettslag properties, identical for electronic and paper submission. Certified extract/pantattest is 260 kr."}
          </li>
          <li>
            {lang === "no"
              ? "Dokumentavgiftsloven: 2,5 % dokumentavgift beregnes kun på selveier (fast eiendom) — ikke på borettslag og ikke på eventuell andel fellesgjeld i sameie."
              : "Norwegian Document Duty Act: 2.5% stamp duty applies only to freehold real estate (not borettslag co-ops, and not shared HOA debt)."}
          </li>
          <li>
            {lang === "no"
              ? "Burettslagslova § 4-6: Eierskiftegebyr til forretningsfører betales av selger. Kjøper i borettslag betaler kun ev. innmelding i boligbyggelag (~500–800 kr) og forkjøpsrettsgebyr dersom forkjøpsrett benyttes. Bankens etableringsgebyr på nytt boliglån kommer i tillegg."
              : "Co-op Act § 4-6: The HOA transfer fee is legally paid by the seller. Co-op buyers only pay optional membership (~500–800 kr) and preemption fees if exercised. Any bank mortgage origination fee is separate."}
          </li>
          <li>
            {lang === "no"
              ? "Boligkjøperforsikring er valgfri; prisene varierer mellom leverandører (f.eks. HELP, Söderberg & Partners) og etter boligtype."
              : "Buyer legal insurance is optional; pricing varies significantly by insurer and property type."}
          </li>
        </ul>
      </div>
    </ToolShell>
  );
}
