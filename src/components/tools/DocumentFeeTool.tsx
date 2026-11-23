"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type OwnershipKind = "selveier" | "borettslag" | "nybygg";

export function DocumentFeeTool() {
  const { lang, isModern } = useApp();

  const [ownership, setOwnership] = useState<OwnershipKind>("selveier");
  const [purchasePrice, setPurchasePrice] = useState<number>(6_000_000);
  const [landValueNewBuild, setLandValueNewBuild] = useState<number>(1_400_000);
  const [includeBuyerInsurance, setIncludeBuyerInsurance] = useState<boolean>(false);

  const stampDuty =
    ownership === "selveier"
      ? Math.round(purchasePrice * 0.025)
      : ownership === "nybygg"
      ? Math.round(Math.min(landValueNewBuild, purchasePrice) * 0.025)
      : 0;

  const deedRegFee = 500;
  const mortgageRegFee = 500;
  const hoaTransferFee = ownership === "borettslag" ? 6_500 : 0;
  const buyerInsurance = includeBuyerInsurance
    ? ownership === "borettslag"
      ? 9_900
      : 14_900
    : 0;

  const totalFees = stampDuty + deedRegFee + mortgageRegFee + hoaTransferFee + buyerInsurance;
  const totalCashNeeded = purchasePrice + totalFees;
  const selveierEquivalent = Math.round(purchasePrice * 0.025) + 1_000;
  const savingsVsSelveier = Math.max(0, selveierEquivalent - (stampDuty + deedRegFee + mortgageRegFee + hoaTransferFee));

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
      en: "New-Build Property",
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
          ? "Beregn nøyaktig dokumentavgift, tinglysingsgebyrer og totale omkostninger ved kjøp — sammenlign selveier mot borettslag og nybygg."
          : "Compute exact 2.5% Norwegian stamp duty (dokumentavgift), Kartverket deed fees, and compare freehold vs. borettslag and new-builds."
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
                  <span className={`block text-[13px] mt-0.5 ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
                    {lang === "no" ? k.subNo : k.subEn}
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
                {lang === "no" ? "Andel tomteverdi (grunnlag for 2,5 %)" : "Underlying Land Share (2.5% Base)"}
              </label>
              <output
                htmlFor="docfee-land"
                className="text-[22px] font-semibold tabular-nums whitespace-nowrap"
              >
                {formatNok(Math.min(landValueNewBuild, purchasePrice))}
              </output>
            </div>
            <input
              id="docfee-land"
              type="range"
              min={300_000}
              max={Math.min(8_000_000, purchasePrice)}
              step={50_000}
              value={Math.min(landValueNewBuild, purchasePrice)}
              onChange={(e) => setLandValueNewBuild(Number(e.target.value))}
              style={
                {
                  "--attr-min": 300_000,
                  "--attr-max": Math.min(8_000_000, purchasePrice),
                  "--control-value": Math.min(landValueNewBuild, purchasePrice),
                } as React.CSSProperties
              }
              className={sliderClass}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setIncludeBuyerInsurance((v) => !v)}
          aria-pressed={includeBuyerInsurance}
          className={`${
            isModern ? "nm-tap-card" : "kr-tap-card"
          } w-full min-h-[60px] px-4 py-3.5 border-2 text-left text-[16px] font-semibold flex items-center justify-between gap-3 ${
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
            {lang === "no"
              ? "Legg til valgfri boligkjøperforsikring"
              : "Include Optional Buyer Legal Insurance (Boligkjøperforsikring)"}
          </span>
          {includeBuyerInsurance && (
            <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
          )}
        </button>
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
              ? `Du sparer ${formatNok(savingsVsSelveier)} sammenlignet med brukt selveier til samme pris.`
              : `You save ${formatNok(savingsVsSelveier)} compared to a resale freehold property at the same price.`}
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
              {lang === "no" ? "Dokumentavgift til staten (2,5 %)" : "State Stamp Duty (2.5%)"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(stampDuty)}
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
              {lang === "no" ? "Tinglysing av skjøte + pantedokument (Kartverket)" : "Kartverket Deed + Mortgage Registration"}
            </span>
            <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(deedRegFee + mortgageRegFee)}
            </span>
          </div>
          {hoaTransferFee > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no" ? "Eierskiftegebyr / forkjøpsrett borettslag (ca.)" : "Borettslag Transfer Fee (est.)"}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(hoaTransferFee)}
              </span>
            </div>
          )}
          {buyerInsurance > 0 && (
            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                {lang === "no" ? "Boligkjøperforsikring" : "Buyer Legal Insurance"}
              </span>
              <span className="font-semibold text-[#000000] tabular-nums whitespace-nowrap">
                {formatNok(buyerInsurance)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-baseline gap-4 pt-3">
            <span className="font-medium text-[#000000]">
              {lang === "no" ? "Total kjøpesum inkl. alle omkostninger" : "Total Price Including All Fees"}
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
    </ToolShell>
  );
}
