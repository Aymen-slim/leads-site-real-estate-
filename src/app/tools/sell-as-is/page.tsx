"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { REPAIR_ITEMS, formatNok } from "@/data/norwayData";
import {
  PaintRollerIcon,
  KitchenCabinetIcon,
  RoofTrussIcon,
  BathroomWaterIcon,
  WindowFrameIcon,
  ArrowRightIcon,
  CheckMarkIcon,
} from "@/components/Icons";
import { ModernSellAsIs } from "@/components/modern/ModernSellAsIs";

export default function SellAsIsCalculatorPage() {
  const { isModern } = useApp();
  if (isModern) return <ModernSellAsIs />;
  return <ClassicSellAsIs />;
}

function ClassicSellAsIs() {
  const { lang, trackClick, t } = useApp();

  const [baseHouseValue, setBaseHouseValue] = useState<number>(5800000);
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>([
    "paint",
    "kitchen",
  ]);

  const toggleRepair = (id: string) => {
    setSelectedRepairs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeItems = REPAIR_ITEMS.filter((item) =>
    selectedRepairs.includes(item.id)
  );

  const totalContractorOutlay = activeItems.reduce(
    (sum, item) => sum + item.contractorCostNok,
    0
  );
  const totalResaleBump = activeItems.reduce(
    (sum, item) => sum + item.resaleValueAddedNok,
    0
  );
  const totalWeeksDelay = activeItems.reduce(
    (sum, item) => sum + item.weeksOfWork,
    0
  );

  const netAfterRenovating =
    baseHouseValue + totalResaleBump - totalContractorOutlay;
  const netSellingAsIs = baseHouseValue;

  const getRepairIcon = (id: string) => {
    switch (id) {
      case "paint":
        return <PaintRollerIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      case "kitchen":
        return <KitchenCabinetIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      case "roof":
        return <RoofTrussIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      case "bathroom":
        return <BathroomWaterIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      default:
        return <WindowFrameIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
    }
  };

  return (
    <main className="bg-[#FFFFFF] min-h-[calc(100vh-140px)] py-10 px-4 sm:py-14 sm:px-6 lg:py-16">
      <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-12">
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
            <PaintRollerIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="kr-h1">{t.tools.tool5.title}</h1>
            <p className="kr-body-lg mt-2">{t.tools.tool5.subtitle}</p>
          </div>
        </div>

        <div className="bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <label
              htmlFor="as-is-base-slider"
              className="text-[18px] sm:text-xl font-medium text-[#000000]"
            >
              {t.tools.tool5.baseValueSlider}
            </label>
            <output
              htmlFor="as-is-base-slider"
              className="text-[28px] sm:text-3xl font-medium text-[#000000] tabular-nums whitespace-nowrap"
            >
              {formatNok(baseHouseValue)}
            </output>
          </div>
          <input
            id="as-is-base-slider"
            type="range"
            min={2000000}
            max={20000000}
            step={100000}
            value={baseHouseValue}
            aria-valuetext={formatNok(baseHouseValue)}
            onChange={(e) => setBaseHouseValue(Number(e.target.value))}
            style={
              {
                "--attr-min": 2000000,
                "--attr-max": 20000000,
                "--control-value": baseHouseValue,
              } as React.CSSProperties
            }
            className="kr-slider"
          />
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-[18px] sm:text-xl font-medium text-[#000000] mb-4">
            {t.tools.tool5.tapRepairsHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {REPAIR_ITEMS.map((item) => {
              const checked = selectedRepairs.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleRepair(item.id)}
                  aria-pressed={checked}
                  className={`kr-tap-card min-h-[88px] p-4 sm:p-5 border-2 text-left flex items-center justify-between gap-3 sm:gap-4 ${
                    checked
                      ? "bg-[#DCE2CF] border-[#5D726A]"
                      : "bg-[#EDF0E7] hover:bg-[#DCE2CF] border-[#BFBFBD]"
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <span
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-none flex items-center justify-center shrink-0 ${
                        checked
                          ? "bg-[#B8C49E] text-[#000000]"
                          : "bg-[#FFFFFF] text-[#5D726A] border border-[#BFBFBD]"
                      }`}
                    >
                      {getRepairIcon(item.id)}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[18px] sm:text-xl font-medium text-[#000000]">
                        {lang === "no" ? item.labelNo : item.labelEn}
                      </span>
                      <span className="block text-[15px] sm:text-base text-[#292823] mt-0.5">
                        {lang === "no" ? item.descNo : item.descEn}
                      </span>
                      <span className="inline-block text-sm font-medium text-[#5D726A] tabular-nums mt-1 whitespace-nowrap">
                        {lang === "no" ? "Håndverkerkostnad:" : "Contractor cost:"}{" "}
                        {formatNok(item.contractorCostNok)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border-2 ${
                      checked
                        ? "bg-[#5D726A] border-[#5D726A] text-[#FFFFFF]"
                        : "bg-[#FFFFFF] border-[#949391]"
                    }`}
                  >
                    {checked && <CheckMarkIcon className="w-5 h-5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-[#F7F7F7] border-2 border-[#BFBFBD] rounded-none p-5 sm:p-6 space-y-4">
            <h3 className="text-[20px] sm:text-2xl font-medium text-[#000000]">
              {t.tools.tool5.colFixTitle}
            </h3>
            <div className="space-y-2.5 text-[16px] sm:text-lg">
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-normal text-[#292823]">
                  {t.tools.tool5.colFixOutlay}
                </span>
                <span className="font-medium text-[#BA5B3E] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(totalContractorOutlay)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-normal text-[#292823]">
                  {t.tools.tool5.colFixTime}
                </span>
                <span className="font-medium text-[#000000] tabular-nums whitespace-nowrap shrink-0">
                  {totalWeeksDelay} {t.tools.tool5.colFixWeeks}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-[#DFDFDF]">
              <span className="block text-base font-medium text-[#292823]">
                {t.tools.tool5.colFixNet}
              </span>
              <span className="block text-[28px] sm:text-3xl font-medium text-[#000000] tabular-nums mt-1 whitespace-nowrap">
                {formatNok(netAfterRenovating)}
              </span>
            </div>
          </div>

          <div className="bg-[#DCE2CF] border-2 border-[#5D726A] rounded-none p-5 sm:p-6 space-y-4">
            <h3 className="text-[20px] sm:text-2xl font-medium text-[#000000]">
              {t.tools.tool5.colAsIsTitle}
            </h3>
            <div className="space-y-2.5 text-[16px] sm:text-lg">
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-medium text-[#000000]">
                  {t.tools.tool5.colAsIsOutlay}
                </span>
                <span className="font-medium text-[#5D726A] tabular-nums whitespace-nowrap shrink-0">
                  0 kr
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-medium text-[#000000]">
                  {t.tools.tool5.colAsIsTime}
                </span>
                <span className="font-medium text-[#5D726A] tabular-nums whitespace-nowrap shrink-0">
                  0 {t.tools.tool5.colFixWeeks}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-[#949391]">
              <span className="block text-base font-medium text-[#292823]">
                {t.tools.tool5.colAsIsNet}
              </span>
              <span className="block text-[30px] sm:text-4xl font-medium text-[#000000] tabular-nums mt-1 whitespace-nowrap">
                {formatNok(netSellingAsIs)}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/connect-agency?source=as-is&type=house&repairs=${selectedRepairs.join(
            ","
          )}&price=${baseHouseValue}`}
          onClick={() => trackClick("as-is")}
          className="kr-btn-primary w-full min-h-[72px] sm:min-h-[84px] px-5 sm:px-7 py-4 sm:py-5 border-2 border-[#5D726A] text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool5.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
