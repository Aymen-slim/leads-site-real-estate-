"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { UsersFamilyIcon, ArrowRightIcon, CheckMarkIcon } from "@/components/Icons";

// Aligned with Classic InheritedPropertyTool & 2025/2026 Norwegian brokerage benchmarks
const STANDARD_PACKAGE_AND_REPORT_NOK = 49_300;
const MIN_COMMISSION_NOK = 40_000;
const OPTIONAL_INSURANCE_RATE = 0.0045;

export function ModernInheritedProperty() {
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

  const exactFeePct = (totalSellingAndSettlementFees / estateValue) * 100;
  const feeShareVisualPct = Math.max(2, Math.min(15, exactFeePct));
  const netShareVisualPct = 100 - feeShareVisualPct;
  const perHeirVisualPct = netShareVisualPct / heirsCount;

  const heirColors = [
    "#147A53",
    "#1D8E62",
    "#28A273",
    "#0F3D2E",
    "#37B584",
    "#0D5E3F",
  ];

  return (
    <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto nm-card p-4 sm:p-10 space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center shrink-0">
            <UsersFamilyIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="nm-h1">{t.tools.tool4.title}</h1>
            <p className="nm-body-lg mt-2">
              {lang === "no"
                ? "Beregn veiledende utbetaling per arving ved salg av arvet bolig under privat skifte (0 kr i arveavgift). Provisjon og valgfri forsikring kan justeres."
                : "Estimate each heir's share when selling an inherited home in Norway (0% inheritance tax, private probate). Adjust brokerage rate and optional insurance below."}
            </p>
          </div>
        </div>

        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-7">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="inheritance-value-slider"
                className="text-[18px] sm:text-xl font-semibold text-[#121C17]"
              >
                {t.tools.tool4.valueSliderLabel}
              </label>
              <output
                htmlFor="inheritance-value-slider"
                className="text-[28px] sm:text-4xl font-semibold text-[#0F3D2E] tabular-nums whitespace-nowrap"
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
              className="nm-slider"
            />
          </div>

          <div className="pt-4 border-t border-[#DCE5DF]">
            <h2 className="text-[18px] sm:text-xl font-semibold text-[#121C17] mb-4">
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
                    className={`nm-tap-card min-h-[70px] sm:min-h-[76px] border-2 font-semibold text-2xl sm:text-3xl tabular-nums flex flex-col items-center justify-center ${
                      active
                        ? "bg-[#147A53] border-[#0F3D2E] text-[#FFFFFF]"
                        : "bg-[#FFFFFF] hover:bg-[#E6F2EC] border-[#DCE5DF] text-[#121C17]"
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

          <div className="pt-4 border-t border-[#DCE5DF]">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <label
                htmlFor="inheritance-commission-slider"
                className="text-[17px] sm:text-lg font-semibold text-[#121C17]"
              >
                {lang === "no"
                  ? "3. Meglerprovisjon (varierer per kontor — typisk 1,0–2,0 %)"
                  : "3. Broker Commission Rate (varies by office — typically 1.0–2.0%)"}
              </label>
              <output
                htmlFor="inheritance-commission-slider"
                className="text-[22px] font-semibold text-[#0F3D2E] tabular-nums whitespace-nowrap"
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
              className="nm-slider"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIncludeInsurance((v) => !v)}
              aria-pressed={includeInsurance}
              className={`nm-tap-card min-h-[68px] px-4 py-3 border-2 text-left text-[15px] flex items-center justify-between gap-2 ${
                includeInsurance
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
              }`}
            >
              <div>
                <span className="block font-semibold">
                  {lang === "no"
                    ? "Valgfri boligselgerforsikring (~0,45 %)"
                    : "Optional Seller Insurance (~0.45%)"}
                </span>
                <span className="block text-[13px] opacity-80">
                  {lang === "no"
                    ? "Varierer per forsikringsselskap og boligtype"
                    : "Varies by insurer & property type"}
                </span>
              </div>
              {includeInsurance && (
                <CheckMarkIcon className="w-5 h-5 text-[#147A53] shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setDeceasedMetResidency((v) => !v)}
              aria-pressed={deceasedMetResidency}
              className={`nm-tap-card min-h-[68px] px-4 py-3 border-2 text-left text-[15px] flex items-center justify-between gap-2 ${
                deceasedMetResidency
                  ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                  : "bg-[#FFF7ED] border-[#B8422C] text-[#3B4D44]"
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
                <span className="block text-[13px] opacity-80">
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
                <CheckMarkIcon className="w-5 h-5 text-[#147A53] shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Visual Segmented Estate Split Bar */}
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[16px] font-semibold text-[#121C17]">
              {lang === "no"
                ? `Fordeling mellom ${heirsCount} arvinger (0 kr arveavgift)`
                : `Equal Estate Split Across ${heirsCount} Heirs (0% inheritance tax)`}
            </span>
            <span className="text-[15px] font-semibold text-[#147A53] tabular-nums">
              {formatNok(payoutPerHeir)} / {lang === "no" ? "arving" : "heir"}
            </span>
          </div>

          <div className="h-6 w-full rounded-full overflow-hidden flex gap-0.5 bg-[#F1F5F3]">
            {Array.from({ length: heirsCount }).map((_, idx) => (
              <div
                key={idx}
                className="h-full flex items-center justify-center text-[11px] font-semibold text-[#FFFFFF] transition-all duration-300"
                style={{
                  width: `${perHeirVisualPct}%`,
                  backgroundColor: heirColors[idx % heirColors.length],
                }}
              >
                {idx + 1}
              </div>
            ))}
            <div
              className="h-full bg-[#B8422C] transition-all duration-300"
              style={{ width: `${feeShareVisualPct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#3B4D44]">
            <span>
              {lang === "no"
                ? "Grønne felt = Netto per søsken / arving"
                : "Green segments = Equal net payout per heir"}
            </span>
            <span className="text-[#B8422C] font-medium tabular-nums">
              {lang === "no"
                ? `Rødt felt = Salgs- og oppgjørskostnader (${exactFeePct.toFixed(1).replace(".", ",")} %)`
                : `Terracotta = Sale & settlement costs (${exactFeePct.toFixed(1)}%)`}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#147A53] rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-6 divide-y divide-[#DCE5DF] space-y-3 text-[16px] sm:text-lg">
            <div className="flex justify-between items-baseline gap-4 pt-1">
              <span className="font-medium text-[#3B4D44]">
                {t.tools.tool4.grossEstateLabel}
              </span>
              <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(estateValue)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="text-[#3B4D44]">
                {lang === "no"
                  ? "Arveavgift (avviklet 2014) og privat skifteattest (tingretten)"
                  : "Inheritance Tax (abolished 2014) & Private Probate Fee"}
              </span>
              <span className="font-semibold text-[#147A53] tabular-nums whitespace-nowrap shrink-0">
                0 kr
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="text-[#3B4D44]">
                {lang === "no"
                  ? `Meglerprovisjon (${commissionPct.toFixed(2).replace(".", ",")} %, min. 40 000 kr)`
                  : `Broker Commission (${commissionPct.toFixed(2)}%, min. 40 000 kr)`}
              </span>
              <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(commissionFee)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="text-[#3B4D44]">
                {lang === "no"
                  ? "Tilrettelegging, oppgjør, foto/FINN, tilstandsrapport og gebyrer (ca.)"
                  : "Onboarding, Settlement, Photo/FINN, Inspection & Public Fees (est.)"}
              </span>
              <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(STANDARD_PACKAGE_AND_REPORT_NOK)}
              </span>
            </div>

            {includeInsurance && (
              <div className="flex justify-between items-baseline gap-4 pt-3">
                <span className="text-[#3B4D44]">
                  {lang === "no"
                    ? "Valgfri boligselgerforsikring (ca. 0,45 % · varierer per selskap)"
                    : "Optional Seller's Insurance (~0.45% · varies by insurer)"}
                </span>
                <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(insuranceFee)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-medium text-[#3B4D44]">
                {t.tools.tool4.netEstateLabel} ({heirsCount} {t.tools.tool4.heirsUnit})
              </span>
              <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(netDistributableEstate)}
              </span>
            </div>
          </div>

          <div className="bg-[#E6F2EC] border-t border-[#9EB6AA] p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <span className="block text-[20px] sm:text-2xl font-semibold text-[#0F3D2E]">
                {lang === "no"
                  ? "Estimert utbetaling per arving"
                  : "Estimated Payout Per Heir"}
              </span>
              <span className="block text-[14px] text-[#3B4D44] mt-0.5">
                {lang === "no"
                  ? "Forutsetter gjeldfri eiendom (ev. restlån trekkes fra først)"
                  : "Assumes debt-free property (any existing mortgage is deducted first)"}
              </span>
            </div>
            <span className="text-[32px] sm:text-5xl font-semibold text-[#121C17] tabular-nums whitespace-nowrap">
              {formatNok(payoutPerHeir)}
            </span>
          </div>
        </div>

        {!deceasedMetResidency && (
          <div className="bg-[#FFF7ED] border border-[#E7B59B] rounded-xl p-4 sm:p-5 text-[14px] text-[#3B4D44] leading-relaxed">
            <strong className="text-[#B8422C]">
              {lang === "no"
                ? "Obs — Kontinuitetsprinsippet (Skatteloven § 9-7):"
                : "Note — Continuity Principle (Tax Act § 9-7):"}
            </strong>{" "}
            {lang === "no"
              ? "Dersom avdøde ikke oppfylte bo- og eiertid (f.eks. sekundær- eller utleiebolig), overtar arvingene avdødes opprinnelige kjøpesum og betaler 22 % gevinstskatt ved salg. Dokumenterte salgsomkostninger er fradragsberettiget."
              : "If the deceased did not satisfy the 12-of-24-month residency rule (e.g. secondary/rental home), heirs inherit the original purchase price and owe 22% tax on the historical net gain. Documented selling costs are deductible."}
          </div>
        )}

        {/* Sources & Assumptions */}
        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-xl p-4 sm:p-5 text-[14px] text-[#3B4D44] leading-relaxed space-y-1.5">
          <p className="font-semibold text-[#0F3D2E]">
            {lang === "no"
              ? "Kilder og forutsetninger (2025/2026)"
              : "Sources & Assumptions (2025/2026)"}
          </p>
          <p>
            {lang === "no"
              ? "Norge har 0 % arveavgift (avviklet 2014) og 0 kr gebyr for privat skifteattest hos tingretten. Tinglysing av hjemmelserklæring ved arv koster 545 kr hos Kartverket (2025/2026), uten dokumentavgift for lovbestemt arvedel. Meglerprovisjon og markedspakke varierer fra kontor til kontor, og boligselgerforsikring er valgfritt (varierer mellom selskaper)."
              : "Norway has 0% inheritance tax (abolished 2014) and 0 kr court fee for private probate. Registering an inheritance title deed costs 545 kr with Kartverket (2025/2026), exempt from stamp duty on statutory shares. Brokerage commissions and marketing packages vary by office, and seller's insurance is optional and varies by insurer."}
          </p>
          <p className="text-[13px] opacity-85">
            {lang === "no"
              ? "Kilder: Skatteetaten (Skatteloven §§ 9-3 og 9-7), Kartverket (gebyrsatser 2025/2026), Domstolene og Forbrukerrådet / norske meglerprislister."
              : "Sources: Skatteetaten (Tax Act §§ 9-3 & 9-7), Kartverket (2025/2026 fees), Norwegian Courts, and Forbrukerrådet / Norwegian brokerage fee benchmarks."}
          </p>
        </div>

        <Link
          href={`/koble-til-megler?source=inheritance&price=${estateValue}&net=${payoutPerHeir}&heirs=${heirsCount}`}
          onClick={() => trackClick("inheritance")}
          className="nm-btn-primary w-full min-h-[72px] sm:min-h-[82px] px-5 sm:px-7 py-4 sm:py-5 text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool4.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
