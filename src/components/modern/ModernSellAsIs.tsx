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
  ShieldCheckIcon,
} from "@/components/Icons";

type ScopeLevel = "low" | "standard" | "high";

type RepairItemWithRange = (typeof REPAIR_ITEMS)[number] & {
  minCostNok?: number;
  maxCostNok?: number;
};

const FALLBACK_COST_RANGES: Record<string, { min: number; max: number }> = {
  paint: { min: 40000, max: 90000 },
  kitchen: { min: 150000, max: 260000 },
  roof: { min: 220000, max: 350000 },
  bathroom: { min: 220000, max: 340000 },
  windows: { min: 120000, max: 210000 },
};

function getRepairRange(item: RepairItemWithRange) {
  const fallback = FALLBACK_COST_RANGES[item.id];
  const minCost =
    item.minCostNok ??
    (fallback ? fallback.min : Math.round((item.contractorCostNok * 0.75) / 5000) * 5000);
  const maxCost =
    item.maxCostNok ??
    (fallback ? fallback.max : Math.round((item.contractorCostNok * 1.3) / 5000) * 5000);
  return { minCost, stdCost: item.contractorCostNok, maxCost };
}

function getScopedMetrics(item: RepairItemWithRange, scope: ScopeLevel) {
  const { minCost, stdCost, maxCost } = getRepairRange(item);
  const cost = scope === "low" ? minCost : scope === "high" ? maxCost : stdCost;
  const ratio = stdCost > 0 ? cost / stdCost : 1;
  const lift =
    scope === "standard"
      ? item.resaleValueAddedNok
      : Math.round((item.resaleValueAddedNok * ratio) / 1000) * 1000;
  const netImpact = lift - cost;
  return { cost, lift, netImpact, minCost, maxCost };
}

export function ModernSellAsIs() {
  const { lang, trackClick, t } = useApp();

  const [baseHouseValue, setBaseHouseValue] = useState<number>(5800000);
  const [scopeLevel, setScopeLevel] = useState<ScopeLevel>("standard");
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>([
    "paint",
    "kitchen",
  ]);

  const toggleRepair = (id: string) => {
    setSelectedRepairs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const repairItems = REPAIR_ITEMS as RepairItemWithRange[];
  const activeItems = repairItems.filter((item) =>
    selectedRepairs.includes(item.id)
  );

  const totalContractorOutlay = activeItems.reduce(
    (sum, item) => sum + getScopedMetrics(item, scopeLevel).cost,
    0
  );
  const totalMinOutlay = activeItems.reduce(
    (sum, item) => sum + getRepairRange(item).minCost,
    0
  );
  const totalMaxOutlay = activeItems.reduce(
    (sum, item) => sum + getRepairRange(item).maxCost,
    0
  );
  const totalResaleBump = activeItems.reduce(
    (sum, item) => sum + getScopedMetrics(item, scopeLevel).lift,
    0
  );
  const totalWeeksDelay = activeItems.reduce(
    (sum, item) => sum + item.weeksOfWork,
    0
  );

  const expectedPriceAfterRenovating = baseHouseValue + totalResaleBump;
  const netAfterRenovating = expectedPriceAfterRenovating - totalContractorOutlay;
  const netSellingAsIs = baseHouseValue;
  const netDifference = netAfterRenovating - netSellingAsIs;
  const renovateWins = activeItems.length > 0 && netDifference > 0;
  const asIsWins = activeItems.length > 0 && netDifference <= 0;

  const maxCompare = Math.max(netSellingAsIs, netAfterRenovating, 1);
  const fixNetPct = Math.min(
    100,
    Math.round((netAfterRenovating / maxCompare) * 100)
  );
  const asIsNetPct = Math.min(
    100,
    Math.round((netSellingAsIs / maxCompare) * 100)
  );

  const scopeOptions: {
    id: ScopeLevel;
    labelNo: string;
    labelEn: string;
    subNo: string;
    subEn: string;
  }[] = [
    {
      id: "low",
      labelNo: "Enklere / mindre omfang",
      labelEn: "Lighter / Budget Scope",
      subNo: "Nedre del av prisintervallet",
      subEn: "Lower end of market range",
    },
    {
      id: "standard",
      labelNo: "Normal standard (snitt)",
      labelEn: "Standard Spec (Avg.)",
      subNo: "Typisk norsk håndverkerpris",
      subEn: "Typical Norwegian contractor avg.",
    },
    {
      id: "high",
      labelNo: "Høy standard / større bolig",
      labelEn: "Higher Spec / Larger Home",
      subNo: "Øvre del av prisintervallet",
      subEn: "Upper end of market range",
    },
  ];

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
    <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto nm-card p-4 sm:p-10 space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center shrink-0">
            <PaintRollerIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="nm-h1">{t.tools.tool5.title}</h1>
            <p className="nm-body-lg mt-2">{t.tools.tool5.subtitle}</p>
          </div>
        </div>

        {/* Step 1: Current value + Scope level */}
        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-5">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="as-is-base-slider"
                className="text-[18px] sm:text-xl font-semibold text-[#121C17]"
              >
                {t.tools.tool5.baseValueSlider}
              </label>
              <output
                htmlFor="as-is-base-slider"
                className="text-[28px] sm:text-3xl font-semibold text-[#0F3D2E] tabular-nums whitespace-nowrap"
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
              className="nm-slider"
            />
          </div>

          <div className="pt-4 border-t border-[#DCE5DF]">
            <p className="text-[15px] sm:text-[16px] font-semibold text-[#121C17] mb-2.5">
              {lang === "no"
                ? "Velg kostnadsnivå for håndverkere (tilpass størrelse og standard):"
                : "Choose contractor cost level (adjust for home size & finish):"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {scopeOptions.map((opt) => {
                const active = scopeLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScopeLevel(opt.id)}
                    aria-pressed={active}
                    className={`nm-tap-card p-3.5 border-2 text-left flex items-center justify-between gap-2 ${
                      active
                        ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                        : "bg-[#FFFFFF] hover:bg-[#E6F2EC]/50 border-[#DCE5DF] text-[#121C17]"
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="block text-[15px] font-semibold">
                        {lang === "no" ? opt.labelNo : opt.labelEn}
                      </span>
                      <span className="block text-[12px] text-[#3B4D44] mt-0.5">
                        {lang === "no" ? opt.subNo : opt.subEn}
                      </span>
                    </div>
                    {active && <CheckMarkIcon className="w-5 h-5 text-[#147A53] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 2: Repair Cards */}
        <div>
          <h2 className="text-[18px] sm:text-xl font-semibold text-[#121C17] mb-1.5">
            {t.tools.tool5.tapRepairsHeading}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#3B4D44] mb-4">
            {lang === "no"
              ? "Hver boks viser hva arbeidet normalt omfatter, typisk norsk prisintervall (inkl. mva.), forventet prisøkning ved salg og netto effekt."
              : "Each box shows what the work covers, typical Norwegian price range (incl. VAT), expected resale price lift, and estimated net impact."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {repairItems.map((item) => {
              const checked = selectedRepairs.includes(item.id);
              const { cost, lift, netImpact, minCost, maxCost } = getScopedMetrics(
                item,
                scopeLevel
              );
              const isPositive = netImpact >= 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleRepair(item.id)}
                  aria-pressed={checked}
                  className={`nm-tap-card p-4 sm:p-5 border-2 text-left flex flex-col justify-between gap-3 ${
                    checked
                      ? "bg-[#E6F2EC] border-[#147A53]"
                      : "bg-[#F8FAF9] hover:bg-[#E6F2EC]/60 border-[#DCE5DF]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          checked
                            ? "bg-[#147A53] text-[#FFFFFF]"
                            : "bg-[#FFFFFF] text-[#0F3D2E] border border-[#DCE5DF]"
                        }`}
                      >
                        {getRepairIcon(item.id)}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[18px] sm:text-[19px] font-semibold text-[#121C17]">
                          {lang === "no" ? item.labelNo : item.labelEn}
                        </span>
                        <span className="block text-[14px] text-[#3B4D44] mt-0.5 leading-snug">
                          {lang === "no" ? item.descNo : item.descEn}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 ${
                        checked
                          ? "bg-[#147A53] border-[#147A53] text-[#FFFFFF]"
                          : "bg-[#FFFFFF] border-[#9EB6AA]"
                      }`}
                    >
                      {checked && <CheckMarkIcon className="w-5 h-5" />}
                    </span>
                  </div>

                  {/* Clear Cost vs. Expected Lift Breakdown */}
                  <div
                    className={`w-full pt-3 border-t grid grid-cols-3 gap-2 text-[13px] sm:text-[14px] ${
                      checked ? "border-[#B8D7C6]" : "border-[#DCE5DF]"
                    }`}
                  >
                    <div>
                      <span className="block text-[12px] text-[#3B4D44]">
                        {lang === "no" ? "Estimert kostnad" : "Est. cost"}
                      </span>
                      <span className="block font-semibold text-[#121C17] tabular-nums whitespace-nowrap">
                        {formatNok(cost)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#3B4D44]">
                        {lang === "no" ? "Forventet prisøkn." : "Est. price lift"}
                      </span>
                      <span className="block font-semibold text-[#147A53] tabular-nums whitespace-nowrap">
                        +{formatNok(lift)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#3B4D44]">
                        {lang === "no" ? "Netto effekt" : "Net effect"}
                      </span>
                      <span
                        className={`block font-semibold tabular-nums whitespace-nowrap ${
                          isPositive ? "text-[#147A53]" : "text-[#B8422C]"
                        }`}
                      >
                        {isPositive ? "+" : "−"}
                        {formatNok(Math.abs(netImpact))}
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#3B4D44]">
                    <span className="tabular-nums">
                      {lang === "no" ? "Typisk intervall:" : "Typical range:"}{" "}
                      {formatNok(minCost)} – {formatNok(maxCost)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        isPositive
                          ? "bg-[#D2EBD9] text-[#0F3D2E]"
                          : "bg-[#FBEAE6] text-[#9A3422]"
                      }`}
                    >
                      {isPositive
                        ? lang === "no"
                          ? "Lønner seg ofte"
                          : "Often pays off"
                        : lang === "no"
                        ? "Sjelden 100 % inntjent"
                        : "Rarely 100% recouped"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Visual Comparison Bar Chart */}
        <div className="bg-[#FFFFFF] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[17px] font-semibold text-[#121C17]">
              {lang === "no"
                ? "Netto resultat: Oppussing vs. Selge som den er"
                : "Visual Net Comparison: Renovate vs. Sell As-Is"}
            </h3>
            {activeItems.length > 0 && (
              <span
                className={`text-[14px] font-semibold tabular-nums ${
                  renovateWins ? "text-[#147A53]" : "text-[#0F3D2E]"
                }`}
              >
                {renovateWins
                  ? `${lang === "no" ? "Oppussing" : "Renovating"} +${formatNok(netDifference)}`
                  : `${lang === "no" ? "Selge som den er" : "Sell as-is"} +${formatNok(
                      Math.abs(netDifference)
                    )}`}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[15px] font-medium text-[#3B4D44] mb-1">
                <span>{t.tools.tool5.colFixTitle}</span>
                <span className="tabular-nums font-semibold text-[#121C17]">
                  {formatNok(netAfterRenovating)}
                </span>
              </div>
              <div className="h-3.5 w-full bg-[#F1F5F3] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    renovateWins ? "bg-[#147A53]" : "bg-[#647B6F]"
                  }`}
                  style={{ width: `${fixNetPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[15px] font-medium text-[#0F3D2E] mb-1">
                <span>{t.tools.tool5.colAsIsTitle}</span>
                <span className="tabular-nums font-semibold text-[#147A53]">
                  {formatNok(netSellingAsIs)}
                </span>
              </div>
              <div className="h-3.5 w-full bg-[#F1F5F3] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    !renovateWins ? "bg-[#147A53]" : "bg-[#647B6F]"
                  }`}
                  style={{ width: `${asIsNetPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Side-by-Side Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div
            className={`rounded-2xl p-5 sm:p-6 space-y-4 ${
              renovateWins
                ? "bg-[#E6F2EC] border-2 border-[#147A53]"
                : "bg-[#F8FAF9] border border-[#DCE5DF]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[20px] sm:text-2xl font-semibold text-[#121C17]">
                {t.tools.tool5.colFixTitle}
              </h3>
              {renovateWins && (
                <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#147A53] text-[#FFFFFF]">
                  {lang === "no" ? "Høyest netto" : "Higher net"}
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-[15px] sm:text-[17px]">
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-[#3B4D44]">
                  {lang === "no" ? "Verdi i nåværende stand" : "Current as-is value"}
                </span>
                <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0">
                  {formatNok(baseHouseValue)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-[#3B4D44]">
                  {lang === "no"
                    ? "Forventet prisøkning ved salg"
                    : "Expected resale price lift"}
                </span>
                <span className="font-semibold text-[#147A53] tabular-nums whitespace-nowrap shrink-0">
                  + {formatNok(totalResaleBump)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-[#3B4D44]">{t.tools.tool5.colFixOutlay}</span>
                <span className="font-semibold text-[#B8422C] tabular-nums whitespace-nowrap shrink-0">
                  − {formatNok(totalContractorOutlay)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-[#3B4D44]">{t.tools.tool5.colFixTime}</span>
                <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0">
                  {totalWeeksDelay} {t.tools.tool5.colFixWeeks}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C3DEC9]">
              <span className="block text-[15px] font-medium text-[#3B4D44]">
                {t.tools.tool5.colFixNet}
              </span>
              <span className="block text-[28px] sm:text-3xl font-semibold text-[#121C17] tabular-nums mt-1 whitespace-nowrap">
                {formatNok(netAfterRenovating)}
              </span>
              {activeItems.length > 0 && (
                <span className="block text-[13px] text-[#3B4D44] mt-1 tabular-nums">
                  {lang === "no"
                    ? `Forventet salgspris ${formatNok(expectedPriceAfterRenovating)} minus ${formatNok(totalContractorOutlay)} i utlegg (intervall ${formatNok(totalMinOutlay)}–${formatNok(totalMaxOutlay)})`
                    : `Expected sale price ${formatNok(expectedPriceAfterRenovating)} minus ${formatNok(totalContractorOutlay)} outlay (range ${formatNok(totalMinOutlay)}–${formatNok(totalMaxOutlay)})`}
                </span>
              )}
            </div>
          </div>

          <div
            className={`rounded-2xl p-5 sm:p-6 space-y-4 ${
              asIsWins
                ? "bg-[#E6F2EC] border-2 border-[#147A53]"
                : "bg-[#F8FAF9] border border-[#DCE5DF]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[20px] sm:text-2xl font-semibold text-[#0F3D2E]">
                {t.tools.tool5.colAsIsTitle}
              </h3>
              {asIsWins && (
                <span className="px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#147A53] text-[#FFFFFF]">
                  {lang === "no" ? "Høyest netto" : "Higher net"}
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-[15px] sm:text-[17px]">
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-[#3B4D44]">
                  {lang === "no" ? "Forventet salgspris nå" : "Expected sale price now"}
                </span>
                <span className="font-semibold text-[#121C17] tabular-nums whitespace-nowrap shrink-0">
                  {formatNok(baseHouseValue)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-medium text-[#121C17]">
                  {t.tools.tool5.colAsIsOutlay}
                </span>
                <span className="font-semibold text-[#147A53] tabular-nums whitespace-nowrap shrink-0">
                  0 kr
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-medium text-[#121C17]">
                  {t.tools.tool5.colAsIsTime}
                </span>
                <span className="font-semibold text-[#147A53] tabular-nums whitespace-nowrap shrink-0">
                  0 {t.tools.tool5.colFixWeeks}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#9EB6AA]">
              <span className="block text-[15px] font-medium text-[#0F3D2E]">
                {t.tools.tool5.colAsIsNet}
              </span>
              <span className="block text-[30px] sm:text-4xl font-semibold text-[#121C17] tabular-nums mt-1 whitespace-nowrap">
                {formatNok(netSellingAsIs)}
              </span>
              <span className="block text-[13px] text-[#3B4D44] mt-1">
                {lang === "no"
                  ? "Alle tekniske avvik dokumenteres ryddig i tilstandsrapporten."
                  : "All technical wear is disclosed transparently in the inspection report."}
              </span>
            </div>
          </div>
        </div>

        {/* Verdict + Why Cost Differs From Resale Lift */}
        <div className="bg-[#E6F2EC] border border-[#C3DEC9] rounded-2xl p-4 sm:p-5 space-y-2">
          <p className="text-[16px] sm:text-[17px] font-semibold text-[#0F3D2E]">
            {activeItems.length === 0
              ? lang === "no"
                ? "Velg ett eller flere tiltak over for å se forskjellen mellom oppussing og salg i nåværende stand."
                : "Select one or more items above to compare renovating versus selling as-is."
              : renovateWins
              ? lang === "no"
                ? `Konklusjon: Valgt oppussing gir estimert +${formatNok(netDifference)} mer netto enn å selge som den er.`
                : `Takeaway: Selected refresh adds an estimated +${formatNok(netDifference)} net compared to selling as-is.`
              : lang === "no"
              ? `Konklusjon: Å selge i nåværende stand gir trolig ${formatNok(Math.abs(netDifference))} mer netto — og du slipper ${totalWeeksDelay} uker med arbeid og ${formatNok(totalContractorOutlay)} i utlegg.`
              : `Takeaway: Selling as-is likely leaves you ${formatNok(Math.abs(netDifference))} better off — while avoiding ${totalWeeksDelay} weeks of work and ${formatNok(totalContractorOutlay)} in upfront outlay.`}
          </p>
          <p className="text-[14px] sm:text-[15px] text-[#3B4D44] leading-relaxed">
            {lang === "no"
              ? "Hvorfor er netto effekt ofte lavere enn kostnaden? Enkel overflateoppfriskning (maling, rydding) løfter førsteinntrykket og gir ofte over 100 % tilbake i budrunden. Større fagprosjekter (bad, kjøkken, tak) gir derimot typisk bare 65–80 % tilbake i salgspris, fordi kjøpere foretrekker å velge egen stil og materialer selv."
              : "Why does net gain often differ from renovation cost? Light cosmetic touch-ups (painting, decluttering) improve first impressions and frequently recoup over 100% in bidding. Major trade projects (bathroom, kitchen, roof) typically recoup only 65–80% because buyers prefer choosing their own design and finishes."}
          </p>
        </div>

        {/* Sources & Assumptions */}
        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-[#147A53] shrink-0 mt-0.5" />
            <div className="space-y-1 text-[13px] sm:text-[14px] text-[#3B4D44] leading-relaxed">
              <p className="font-semibold text-[#121C17]">
                {lang === "no" ? "Kilder og forutsetninger (2025/2026)" : "Sources & Assumptions (2025/2026)"}
              </p>
              <p>
                {lang === "no"
                  ? "Kostnadsestimatene bygger på norske gjennomsnittspriser fra Byggstart og Mittanbud (inkl. mva. og normal standard for en gjennomsnittsbolig). Forventet verdieffekt ved salg bygger på Prognosesenteret og norsk meglererfaring. Prisene varierer betydelig med boligstørrelse, landsdel, teknisk tilstand og materialvalg — innhent alltid 2–3 skriftlige anbud før oppstart."
                  : "Cost estimates are based on 2025/2026 Norwegian market averages from Byggstart and Mittanbud (incl. VAT, standard finish for an average home). Expected resale lift reflects Prognosesenteret and Norwegian brokerage experience. Actual contractor quotes vary by region, size, and scope — always obtain 2–3 written bids before renovating."}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/koble-til-megler?source=as-is&type=house&repairs=${selectedRepairs.join(
            ","
          )}&price=${baseHouseValue}`}
          onClick={() => trackClick("as-is")}
          className="nm-btn-primary w-full min-h-[72px] sm:min-h-[82px] px-5 sm:px-7 py-4 sm:py-5 text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool5.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
