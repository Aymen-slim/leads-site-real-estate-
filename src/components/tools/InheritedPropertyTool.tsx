"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { UsersFamilyIcon, ArrowRightIcon } from "@/components/Icons";
import { ModernInheritedProperty } from "@/components/modern/ModernInheritedProperty";
import { ToolSeoGuide } from "@/components/ToolSeoGuide";

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
  const { trackClick, t } = useApp();

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

  return (
    <main className="bg-[#FFFFFF] pt-10 px-4 sm:pt-14 sm:px-6 lg:pt-16">
      <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-12">
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
            <UsersFamilyIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="kr-h1">{t.tools.tool4.title}</h1>
            <p className="kr-body-lg mt-2">{t.tools.tool4.subtitle}</p>
          </div>
        </div>

        <div className="bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6 sm:space-y-8 mb-6 sm:mb-8">
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
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none overflow-hidden mb-6 sm:mb-8">
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
                {t.tools.tool4.legalSettlementLabel}
              </span>
              <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                − {formatNok(legalAndSettlementFees)}
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-4 pt-3">
              <span className="font-medium text-[#292823]">
                {t.tools.tool4.netEstateLabel} ({heirsCount}{" "}
                {t.tools.tool4.heirsUnit})
              </span>
              <span className="font-medium text-[#000000] tabular-nums whitespace-nowrap shrink-0 text-[18px] sm:text-xl">
                {formatNok(netDistributableEstate)}
              </span>
            </div>
          </div>

          <div className="bg-[#DCE2CF] border-t-2 border-[#5D726A] p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <span className="text-[20px] sm:text-2xl font-medium text-[#000000]">
              {t.tools.tool4.perHeirTitle}
            </span>
            <span className="text-[32px] sm:text-5xl font-medium text-[#000000] tabular-nums whitespace-nowrap">
              {formatNok(payoutPerHeir)}
            </span>
          </div>
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
