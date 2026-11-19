"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { UsersFamilyIcon, ArrowRightIcon } from "@/components/Icons";

export function ModernInheritedProperty() {
  const { lang, trackClick, t } = useApp();

  const [estateValue, setEstateValue] = useState<number>(7500000);
  const [heirsCount, setHeirsCount] = useState<number>(3);

  const minVal = 1500000;
  const maxVal = 25000000;

  const legalAndSettlementFees = Math.round(estateValue * 0.0155 + 34000);
  const netDistributableEstate = Math.max(
    0,
    estateValue - legalAndSettlementFees
  );
  const payoutPerHeir = Math.round(netDistributableEstate / heirsCount);

  const feeSharePct = Math.max(
    2,
    Math.round((legalAndSettlementFees / estateValue) * 100)
  );
  const netSharePct = 100 - feeSharePct;
  const perHeirVisualPct = netSharePct / heirsCount;

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
            <p className="nm-body-lg mt-2">{t.tools.tool4.subtitle}</p>
          </div>
        </div>

        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-8">
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
              step={100000}
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
        </div>

        {/* Visual Segmented Estate Split Bar */}
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[16px] font-semibold text-[#121C17]">
              {lang === "no"
                ? `Fordeling mellom ${heirsCount} arvinger`
                : `Equal Estate Split Across ${heirsCount} Heirs`}
            </span>
            <span className="text-[15px] font-semibold text-[#147A53] tabular-nums">
              {formatNok(payoutPerHeir)} / {lang === "no" ? "person" : "heir"}
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
              style={{ width: `${feeSharePct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#3B4D44]">
            <span>
              {lang === "no"
                ? "Grønne felt = Netto per søsken / arving"
                : "Green segments = Equal net payout per heir"}
            </span>
            <span className="text-[#B8422C] font-medium">
              {lang === "no"
                ? `Rødt felt = Skifte & omkostninger (${feeSharePct}%)`
                : `Terracotta = Legal & settlement (${feeSharePct}%)`}
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
                {t.tools.tool4.legalSettlementLabel}
              </span>
              <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(legalAndSettlementFees)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-medium text-[#3B4D44]">
                {t.tools.tool4.netEstateLabel} ({heirsCount}{" "}
                {t.tools.tool4.heirsUnit})
              </span>
              <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(netDistributableEstate)}
              </span>
            </div>
          </div>

          <div className="bg-[#E6F2EC] border-t border-[#9EB6AA] p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-[20px] sm:text-2xl font-semibold text-[#0F3D2E]">
              {t.tools.tool4.perHeirTitle}
            </span>
            <span className="text-[32px] sm:text-5xl font-semibold text-[#121C17] tabular-nums whitespace-nowrap">
              {formatNok(payoutPerHeir)}
            </span>
          </div>
        </div>

        <Link
          href={`/connect-agency?source=inheritance&price=${estateValue}&net=${payoutPerHeir}&heirs=${heirsCount}`}
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
