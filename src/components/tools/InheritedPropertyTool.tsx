"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { UsersFamilyIcon, ArrowRightIcon, CheckMarkIcon } from "@/components/Icons";
import { ModernInheritedProperty } from "@/components/modern/ModernInheritedProperty";
import { ToolSeoGuide } from "@/components/ToolSeoGuide";

// Realistic 2025/2026 Norwegian residential sale & probate benchmarks
// Aligned with BrokerFeeTool / NetCashTool (commission varies by brokerage office; insurance is optional)
const STANDARD_PACKAGE_AND_REPORT_NOK = 49_300; // tilrettelegging, oppgjør, foto/FINN, tilstandsrapport, offentlige gebyrer
const MIN_COMMISSION_NOK = 40_000;
const OPTIONAL_INSURANCE_RATE = 0.0045; // indicative ~0.45% (varies ~0.25–0.64% by insurer & property type)

export function InheritedPropertyTool() {
  const { isModern } = useApp();
  if (isModern) {
    return (
      <div className="bg-[#F8FAF9] pb-12">
        <ModernInheritedProperty />
        <div className="px-3 sm:px-6">
          <ToolSeoGuide slug="inherited-property" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#FFFFFF] pb-12">
      <ClassicInheritedProperty />
      <div className="px-4 sm:px-6">
        <ToolSeoGuide slug="inherited-property" />
      </div>
    </div>
  );
}

function ClassicInheritedProperty() {
  const { lang, trackClick, t } = useApp();

  const [estateValue, setEstateValue] = useState<number>(7_500_000);
  const [heirsCount, setHeirsCount] = useState<number>(3);
  const [commissionPct, setCommissionPct] = useState<number>(1.25);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);
  const [deceasedMetResidency, setDeceasedMetResidency] = useState<boolean>(true);

  const minVal = 1_500_000;
  const maxVal = 25_000_000;

  const commissionFee = Math.max(
    MIN_COMMISSION_NOK,
    Math.round((estateValue * commissionPct) / 100)
  );
  const insuranceFee = includeInsurance
    ? Math.round(estateValue * OPTIONAL_INSURANCE_RATE)
    : 0;
  const totalSellingAndSettlementFees =
    commissionFee + STANDARD_PACKAGE_AND_REPORT_NOK + insuranceFee;

  const netDistributableEstate = Math.max(
    0,
    estateValue - totalSellingAndSettlementFees
  );
  const payoutPerHeir = Math.round(netDistributableEstate / heirsCount);

  return (
    <main className="bg-[#FFFFFF] pt-10 px-4 sm:pt-14 sm:px-6 lg:pt-16">
      <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-12">
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
            <UsersFamilyIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="kr-h1">{t.tools.tool4.title}</h1>
            <p className="kr-body-lg mt-2">
              {lang === "no"
                ? "Beregn veiledende utbetaling per arving ved salg av arvet bolig under privat skifte (0 kr i arveavgift). Provisjon og valgfri forsikring kan justeres."
                : "Estimate each heir's share when selling an inherited home in Norway (0% inheritance tax, private probate). Adjust brokerage rate and optional insurance below."}
            </p>
          </div>
        </div>

        <div className="bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6 sm:space-y-7 mb-6 sm:mb-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="inheritance-value-slider"
                className="text-[18px] sm:text-xl font-medium text-[#000000]"
              >
                {t.tools.tool4.valueSliderLabel}
              </label>
              <output
                htmlFor="inheritance-value-slider"
                className="text-[28px] sm:text-4xl font-medium text-[#000000] tabular-nums whitespace-nowrap"
              >
                {formatNok(estateValue)}
              </output>
            </div>
            <input
              id="inheritance-value-slider"
              type="range"
              min={minVal}
              max={maxVal}
              step={100_000}
              value={estateValue}
              aria-valuetext={formatNok(estateValue)}
              onChange={(e) => setEstateValue(Number(e.target.value))}
              style={
                {
                  "--attr-min": minVal,
                  "--attr-max": maxVal,
                  "--control-value": estateValue,
                } as React.CSSProperties
              }
              className="kr-slider"
            />
          </div>

          <div className="pt-4 border-t border-[#BFBFBD]">
            <h2 className="text-[18px] sm:text-xl font-medium text-[#000000] mb-4">
              {t.tools.tool4.heirsHeading}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-3">
              {[2, 3, 4, 5, 6].map((count) => {
                const active = heirsCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setHeirsCount(count)}
                    aria-pressed={active}
                    className={`kr-tap-card min-h-[70px] sm:min-h-[76px] border-2 font-medium text-2xl sm:text-3xl tabular-nums flex flex-col items-center justify-center ${
                      active
                        ? "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                        : "bg-[#FFFFFF] hover:bg-[#DCE2CF] border-[#BFBFBD] text-[#000000]"
                    }`}
                  >
                    <span>{count}</span>
                    <span className="text-[13px] font-medium mt-0.5">
                      {t.tools.tool4.heirsUnit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#BFBFBD]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <label
                htmlFor="inheritance-commission-slider"
                className="text-[17px] sm:text-lg font-medium text-[#000000]"
              >
                {lang === "no"
                  ? "3. Meglerprovisjon (varierer per kontor — typisk 1,0–2,0 %)"
                  : "3. Broker Commission Rate (varies by office — typically 1.0–2.0%)"}
              </label>
              <output
                htmlFor="inheritance-commission-slider"
                className="text-[22px] font-medium text-[#000000] tabular-nums whitespace-nowrap"
              >
                {lang === "no"
                  ? `${commissionPct.toFixed(2).replace(".", ",")} %`
                  : `${commissionPct.toFixed(2)}%`}
              </output>
            </div>
            <input
              id="inheritance-commission-slider"
              type="range"
              min={0.8}
              max={2.2}
              step={0.05}
              value={commissionPct}
              onChange={(e) => setCommissionPct(Number(e.target.value))}
              style={
                {
                  "--attr-min": 0.8,
                  "--attr-max": 2.2,
                  "--control-value": commissionPct,
                } as React.CSSProperties
              }
              className="kr-slider"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIncludeInsurance((v) => !v)}
              aria-pressed={includeInsurance}
              className={`kr-tap-card min-h-[68px] px-4 py-3 border-2 text-left text-[15px] font-medium flex items-center justify-between gap-2 ${
                includeInsurance
                  ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
              }`}
            >
              <div>
                <span className="block font-semibold">
                  {lang === "no"
                    ? "Valgfri boligselgerforsikring (~0,45 %)"
                    : "Optional Seller Insurance (~0.45%)"}
                </span>
                <span className="block text-[13px] opacity-85">
                  {lang === "no"
                    ? "Varierer per forsikringsselskap og boligtype"
                    : "Varies by insurer & property type"}
                </span>
              </div>
              {includeInsurance && (
                <CheckMarkIcon className="w-5 h-5 text-[#5D726A] shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setDeceasedMetResidency((v) => !v)}
              aria-pressed={deceasedMetResidency}
              className={`kr-tap-card min-h-[68px] px-4 py-3 border-2 text-left text-[15px] font-medium flex items-center justify-between gap-2 ${
                deceasedMetResidency
                  ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : "bg-[#FFFFFF] border-[#BA5B3E] text-[#292823]"
              }`}
            >
              <div>
                <span className="block font-semibold">
                  {deceasedMetResidency
                    ? lang === "no"
                      ? "Avdøde oppfylte bo-/eiertid (0 kr skatt)"
                      : "Deceased met residency rule (0 kr tax)"
                    : lang === "no"
                    ? "Ikke oppfylt botid (kontinuitet · 22 %)"
                    : "Residency not met (continuity · 22%)"}
                </span>
                <span className="block text-[13px] opacity-85">
                  {deceasedMetResidency
                    ? lang === "no"
                      ? "Inngangsverdi = markedsverdi ved dødsfall"
                      : "Tax basis steps up to value at death"
                    : lang === "no"
                    ? "Arvinger overtar opprinnelig kjøpesum"
                    : "Heirs inherit original purchase basis"}
                </span>
              </div>
              {deceasedMetResidency && (
                <CheckMarkIcon className="w-5 h-5 text-[#5D726A] shrink-0" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none overflow-hidden mb-6">
          <div className="p-4 sm:p-6 divide-y divide-[#DFDFDF] space-y-3 text-[16px] sm:text-lg">
            <div className="flex justify-between items-baseline gap-4 pt-1">
              <span className="font-medium text-[#292823]">
                {t.tools.tool4.grossEstateLabel}
              </span>
              <span className="font-medium text-[#000000] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(estateValue)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-normal text-[#292823]">
                {lang === "no"
                  ? "Arveavgift (avviklet 2014) og privat skifteattest (tingretten)"
                  : "Inheritance Tax (abolished 2014) & Private Probate Fee"}
              </span>
              <span className="font-medium text-[#5D726A] tabular-nums whitespace-nowrap shrink-0">
                0 kr
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-normal text-[#292823]">
                {lang === "no"
                  ? `Meglerprovisjon (${commissionPct.toFixed(2).replace(".", ",")} %, min. 40 000 kr)`
                  : `Broker Commission (${commissionPct.toFixed(2)}%, min. 40 000 kr)`}
              </span>
              <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(commissionFee)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-normal text-[#292823]">
                {lang === "no"
                  ? "Tilrettelegging, oppgjør, foto/FINN, tilstandsrapport og gebyrer (ca.)"
                  : "Onboarding, Settlement, Photo/FINN, Inspection & Public Fees (est.)"}
              </span>
              <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(STANDARD_PACKAGE_AND_REPORT_NOK)}
              </span>
            </div>

            {includeInsurance && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="font-normal text-[#292823]">
                  {lang === "no"
                    ? "Valgfri boligselgerforsikring (ca. 0,45 % · varierer per selskap)"
                    : "Optional Seller's Insurance (~0.45% · varies by insurer)"}
                </span>
                <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(insuranceFee)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-medium text-[#292823]">
                {t.tools.tool4.netEstateLabel} ({heirsCount} {t.tools.tool4.heirsUnit})
              </span>
              <span className="font-medium text-[#000000] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(netDistributableEstate)}
              </span>
            </div>
          </div>

          <div className="bg-[#DCE2CF] border-t-2 border-[#5D726A] p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <span className="block text-[20px] sm:text-2xl font-medium text-[#000000]">
                {lang === "no"
                  ? "Estimert utbetaling per arving"
                  : "Estimated Payout Per Heir"}
              </span>
              <span className="block text-[14px] text-[#292823] mt-0.5">
                {lang === "no"
                  ? "Forutsetter gjeldfri eiendom (ev. restlån trekkes fra før fordeling)"
                  : "Assumes debt-free property (any existing mortgage is deducted first)"}
              </span>
            </div>
            <span className="text-[32px] sm:text-5xl font-medium text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(payoutPerHeir)}
            </span>
          </div>
        </div>

        {!deceasedMetResidency && (
          <div className="bg-[#FFF7ED] border border-[#BA5B3E] rounded-none p-4 sm:p-5 mb-6 text-[14px] text-[#292823] leading-relaxed">
            <strong className="text-[#BA5B3E]">
              {lang === "no"
                ? "Obs — Kontinuitetsprinsippet (Skatteloven § 9-7):"
                : "Note — Continuity Principle (Tax Act § 9-7):"}
            </strong>{" "}
            {lang === "no"
              ? "Dersom avdøde ikke oppfylte bo- og eiertid (f.eks. utleiebolig eller sekundærbolig), overtar arvingene avdødes opprinnelige kjøpesum og betaler 22 % gevinstskatt ved salg. Dokumenterte salgsomkostninger er fradragsberettiget."
              : "If the deceased did not meet the 12-of-24-month residency rule (e.g. secondary/rental home), heirs inherit the original purchase price and owe 22% tax on the historical net gain. Documented sale expenses are deductible."}
          </div>
        )}

        {/* Sources & Assumptions */}
        <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-4 sm:p-5 mb-6 sm:mb-8 text-[14px] text-[#292823] leading-relaxed space-y-1.5">
          <p className="font-semibold text-[#000000]">
            {lang === "no"
              ? "Kilder og forutsetninger (2025/2026)"
              : "Sources & Assumptions (2025/2026)"}
          </p>
          <p>
            {lang === "no"
              ? "Norge har 0 % arveavgift (avviklet 2014) og 0 kr gebyr for privat skifteattest hos tingretten. Ved tinglysing av hjemmelserklæring ved arv betales 545 kr til Kartverket (2025/2026) og ingen dokumentavgift for arvingenes lovbestemte del; ved direkte salg fra dødsboet slipper man ofte mellomtinglysing. Meglerprovisjon og markedspakke varierer fra kontor til kontor, og boligselgerforsikring er valgfritt (varierer mellom selskaper). Eventuell juridisk rådgivning ved uenighet kommer i tillegg."
              : "Norway levies 0% inheritance tax (abolished 2014) and 0 kr court fee for private probate (privat skifte). Registering an inheritance title deed costs 545 kr with Kartverket (2025/2026), with no stamp duty on statutory shares. Brokerage commissions and marketing packages vary from office to office, and seller's insurance is optional and varies by insurer. Optional legal fees apply only if hiring a lawyer."}
          </p>
          <p className="text-[13px] opacity-90">
            {lang === "no"
              ? "Kilder: Skatteetaten (Skatteloven §§ 9-3 og 9-7), Kartverket (gebyrsatser 2025/2026), Domstolene (privat skifte) og Forbrukerrådet / norske meglerprislister."
              : "Sources: Skatteetaten (Tax Act §§ 9-3 & 9-7), Kartverket (2025/2026 fees), Norwegian Courts (private probate), and Forbrukerrådet / Norwegian brokerage fee benchmarks."}
          </p>
        </div>

        <Link
          href={`/koble-til-megler?source=inheritance&price=${estateValue}&net=${payoutPerHeir}&heirs=${heirsCount}`}
          onClick={() => trackClick("inheritance")}
          className="kr-btn-primary w-full min-h-[72px] sm:min-h-[84px] px-5 sm:px-7 py-4 sm:py-5 border-2 border-[#5D726A] text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool4.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
