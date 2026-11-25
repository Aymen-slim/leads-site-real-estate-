"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import {
  ArrowRightIcon,
  CheckMarkIcon,
  HouseIcon,
  CabinMountainIcon,
  ApartmentIcon,
  TrendingUpIcon,
  ScaleMeasureIcon,
} from "@/components/Icons";

type PropertyKind = "house" | "cabin" | "apartment";
type ViewMode = "chart" | "table";

const PROPERTY_PRESETS: Record<
  PropertyKind,
  { defaultRate: number; noLabel: string; enLabel: string; noteNo: string; noteEn: string }
> = {
  house: {
    defaultRate: 5.5,
    noLabel: "Enebolig",
    enLabel: "House",
    noteNo: "Historisk snitt i Norge: 4,9 % – 6,5 %.",
    noteEn: "Historical average for this region: 4.9% – 6.5%.",
  },
  cabin: {
    defaultRate: 4.5,
    noLabel: "Hytte",
    enLabel: "Cabin",
    noteNo: "Historisk snitt for hytte og fritidsbolig: 3,5 % – 5,0 %.",
    noteEn: "Historical average for cabins & holiday homes: 3.5% – 5.0%.",
  },
  apartment: {
    defaultRate: 4.5,
    noLabel: "Leilighet",
    enLabel: "Apartment",
    noteNo: "Historisk snitt for selveierleilighet: 4,0 % – 5,5 %.",
    noteEn: "Historical average for apartments: 4.0% – 5.5%.",
  },
};

function formatCompactMillions(value: number, lang: "no" | "en"): string {
  if (value === 0) return "0";
  if (value >= 1_000_000) {
    const mill = value / 1_000_000;
    const rounded = Number.isInteger(mill) ? mill.toFixed(0) : mill.toFixed(1).replace(".", ",");
    return lang === "no" ? `${rounded}M` : `${rounded}M`;
  }
  return `${Math.round(value / 1000)}k`;
}

export function ModernHousePriceGrowthCalculator() {
  const { lang, trackClick } = useApp();

  const [propertyKind, setPropertyKind] = useState<PropertyKind>("house");
  const [currentValue, setCurrentValue] = useState<number>(6_500_000);
  const [years, setYears] = useState<number>(10);
  const [annualRate, setAnnualRate] = useState<number>(5.5);

  const [includeUpgrades, setIncludeUpgrades] = useState<boolean>(false);
  const [adjustInflation, setAdjustInflation] = useState<boolean>(false);
  const [compareNormalSale, setCompareNormalSale] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const startYear = 2026;
  const inflationRate = 0.025;
  const normalMarketRate = 0.035;
  const bestAgencyLiftPct = 0.1;

  const handlePropertySwitch = (kind: PropertyKind) => {
    setPropertyKind(kind);
    setAnnualRate(PROPERTY_PRESETS[kind].defaultRate);
  };

  const handleCopySummary = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if (url && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Clipboard may be unavailable in restricted contexts; still give feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const timeline = useMemo(() => {
    const effectiveRate = annualRate / 100 + (includeUpgrades ? 0.008 : 0);
    const rows: {
      year: number;
      yearIndex: number;
      projectedValue: number;
      baselineValue: number;
      principalValue: number;
      growthEarned: number;
    }[] = [];

    for (let i = 0; i <= years; i++) {
      const deflator = adjustInflation ? Math.pow(1 + inflationRate, i) : 1;
      const projected = Math.round((currentValue * Math.pow(1 + effectiveRate, i)) / deflator);
      const baseline = Math.round((currentValue * Math.pow(1 + normalMarketRate, i)) / deflator);
      const principal = Math.round(currentValue / deflator);

      rows.push({
        year: startYear + i,
        yearIndex: i,
        projectedValue: projected,
        baselineValue: baseline,
        principalValue: principal,
        growthEarned: projected - principal,
      });
    }
    return rows;
  }, [currentValue, years, annualRate, includeUpgrades, adjustInflation]);

  const finalPoint = timeline[timeline.length - 1];
  const endYear = startYear + years;
  const totalGrowthKr = finalPoint.projectedValue - currentValue;
  const bestAgencyPremiumToday = Math.round(currentValue * bestAgencyLiftPct);
  const outperformanceVsMarket = finalPoint.projectedValue - finalPoint.baselineValue;

  const svgW = 680;
  const svgH = 250;
  const padL = 52;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rawMax = Math.max(
    finalPoint.projectedValue,
    finalPoint.baselineValue,
    currentValue * 1.15
  );
  const maxStep = rawMax > 15_000_000 ? 5_000_000 : rawMax > 8_000_000 ? 3_000_000 : 2_000_000;
  const chartMaxY = Math.ceil(rawMax / maxStep) * maxStep;
  const yTicks = [0, 0.33, 0.66, 1].map((r) => Math.round((chartMaxY * r) / 500_000) * 500_000);

  const getX = (idx: number) =>
    years === 0 ? padL : padL + (idx / years) * plotW;
  const getY = (val: number) =>
    padT + plotH - Math.min(1, Math.max(0, val / chartMaxY)) * plotH;

  const projectedPath = timeline
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx).toFixed(1)} ${getY(p.projectedValue).toFixed(1)}`)
    .join(" ");

  const baselinePath = timeline
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx).toFixed(1)} ${getY(p.baselineValue).toFixed(1)}`)
    .join(" ");

  const areaFillPath = `${projectedPath} L ${getX(years).toFixed(1)} ${(padT + plotH).toFixed(1)} L ${getX(0).toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const xTickIndices =
    years <= 12
      ? timeline.map((_, i) => i)
      : Array.from(
          new Set([0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years])
        );

  const activePoint =
    hoveredIdx !== null && timeline[hoveredIdx] ? timeline[hoveredIdx] : finalPoint;

  const preset = PROPERTY_PRESETS[propertyKind];

  return (
    <section
      id="house-growth-calculator"
      className="bg-[#F4F5F0] text-[#1D281C] py-6 sm:py-10"
    >
      <div className="nm-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT CONTROL CARD */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#DCE2D4] rounded-2xl shadow-sm p-5 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-5">
              {/* Top Header Row */}
              <div className="flex items-start gap-3.5">
                <span className="w-11 h-11 rounded-xl bg-[#EAEFE4] border border-[#D4DCCB] text-[#243323] flex items-center justify-center shrink-0">
                  <HouseIcon className="w-5 h-5" />
                </span>
                <div className="flex-1 space-y-2.5">
                  <p className="text-[15px] font-semibold text-[#1D281C]">
                    {lang === "no" ? "Hva vil du regne ut?" : "What do you want to calculate?"}
                  </p>
                  <div className="inline-flex p-1 rounded-full bg-[#EEF1E9] border border-[#DCE2D4]">
                    <span className="inline-flex items-center justify-center min-h-[38px] px-5 py-1 rounded-full text-[13px] font-semibold bg-[#243323] text-[#FFFFFF] shadow-xs">
                      {lang === "no" ? "Boligverdi" : "House value"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider 1: Current House Value */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <label
                      htmlFor="growth-current-value"
                      className="block text-[15px] font-semibold text-[#1D281C]"
                    >
                      {lang === "no" ? "Boligens verdi i dag" : "Current house value"}
                    </label>
                    <span className="text-[13px] text-[#5B6759]">
                      {lang === "no" ? "Min: 1 mill. kr" : "Min: 1M kr"}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#CFD7C6] text-[15px] font-semibold text-[#1D281C] tabular-nums whitespace-nowrap shadow-2xs">
                    {formatNok(currentValue)}
                  </div>
                </div>
                <input
                  id="growth-current-value"
                  type="range"
                  min={1_000_000}
                  max={25_000_000}
                  step={250_000}
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="nm-slider"
                  style={
                    {
                      "--attr-min": 1_000_000,
                      "--attr-max": 25_000_000,
                      "--control-value": currentValue,
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Slider 2: Holding Years */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <label
                      htmlFor="growth-years"
                      className="block text-[15px] font-semibold text-[#1D281C]"
                    >
                      {lang === "no" ? "Tidshorisont" : "Projection period"}
                    </label>
                    <span className="text-[13px] text-[#5B6759]">
                      {lang === "no" ? "1–25 år" : "1–25 years"}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#CFD7C6] text-[15px] font-semibold text-[#1D281C] tabular-nums whitespace-nowrap shadow-2xs">
                    {years} {lang === "no" ? "år" : years === 1 ? "year" : "years"}
                  </div>
                </div>
                <input
                  id="growth-years"
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="nm-slider"
                  style={
                    {
                      "--attr-min": 1,
                      "--attr-max": 25,
                      "--control-value": years,
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Segmented Property Type Pills with Icons */}
              <div>
                <p className="text-[15px] font-semibold text-[#1D281C] mb-2">
                  {lang === "no" ? "Type eiendom" : "Property type"}
                </p>
                <div className="grid grid-cols-3 p-1 rounded-full bg-[#EEF1E9] border border-[#DCE2D4] gap-1">
                  <button
                    type="button"
                    onClick={() => handlePropertySwitch("house")}
                    className={`min-h-[38px] px-2 py-1 rounded-full text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      propertyKind === "house"
                        ? "bg-[#FFFFFF] text-[#1D281C] shadow-xs border border-[#CFD7C6]"
                        : "text-[#495647] hover:text-[#1D281C]"
                    }`}
                  >
                    <HouseIcon className="w-4 h-4 shrink-0" />
                    <span>{lang === "no" ? "Enebolig" : "House"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropertySwitch("cabin")}
                    className={`min-h-[38px] px-2 py-1 rounded-full text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      propertyKind === "cabin"
                        ? "bg-[#FFFFFF] text-[#1D281C] shadow-xs border border-[#CFD7C6]"
                        : "text-[#495647] hover:text-[#1D281C]"
                    }`}
                  >
                    <CabinMountainIcon className="w-4 h-4 shrink-0" />
                    <span>{lang === "no" ? "Hytte" : "Cabin"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropertySwitch("apartment")}
                    className={`min-h-[38px] px-2 py-1 rounded-full text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      propertyKind === "apartment"
                        ? "bg-[#FFFFFF] text-[#1D281C] shadow-xs border border-[#CFD7C6]"
                        : "text-[#495647] hover:text-[#1D281C]"
                    }`}
                  >
                    <ApartmentIcon className="w-4 h-4 shrink-0" />
                    <span>{lang === "no" ? "Leilighet" : "Apartment"}</span>
                  </button>
                </div>
              </div>

              {/* Slider 3: Annual Price Growth Rate */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <label
                    htmlFor="growth-annual-rate"
                    className="text-[15px] font-semibold text-[#1D281C]"
                  >
                    {lang === "no"
                      ? "Forventet årlig prisvekst"
                      : "Expected annual house growth"}
                  </label>
                  <div className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#CFD7C6] text-[15px] font-semibold text-[#1D281C] tabular-nums whitespace-nowrap shadow-2xs">
                    {annualRate.toFixed(1).replace(".", ",")} %
                  </div>
                </div>
                <input
                  id="growth-annual-rate"
                  type="range"
                  min={1.5}
                  max={10.0}
                  step={0.5}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="nm-slider"
                  style={
                    {
                      "--attr-min": 1.5,
                      "--attr-max": 10.0,
                      "--control-value": annualRate,
                    } as React.CSSProperties
                  }
                />
                <p className="text-[13px] text-[#5B6759] mt-0.5">
                  {lang === "no" ? preset.noteNo : preset.noteEn}
                </p>
              </div>
            </div>

            {/* Bottom 3 Switches inside subtle light rows */}
            <div className="pt-3 border-t border-[#E6EBE0] space-y-3">
              <div className="flex items-center justify-between gap-3 bg-[#F7F8F4] border border-[#E6EBE0] rounded-xl px-3.5 py-2.5">
                <div>
                  <span className="block text-[14px] font-semibold text-[#1D281C]">
                    {lang === "no"
                      ? "Inkluder oppgradering (+0,8 %/år)"
                      : "Include property upgrades"}
                  </span>
                  <span className="block text-[12px] text-[#5B6759]">
                    {lang === "no" ? "Kjøkken, bad eller etterisolering" : "e.g. kitchen, bathroom, renovation"}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeUpgrades}
                  onClick={() => setIncludeUpgrades((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    includeUpgrades ? "bg-[#243323]" : "bg-[#C7CEBF]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transition-transform ${
                      includeUpgrades ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 px-1">
                <span className="text-[13px] font-medium text-[#495647]">
                  {lang === "no" ? "Vis i dagens kroner (2,5 % inflasjon)" : "Adjust for 2.5% annual inflation"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={adjustInflation}
                  onClick={() => setAdjustInflation((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    adjustInflation ? "bg-[#243323]" : "bg-[#C7CEBF]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transition-transform ${
                      adjustInflation ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 px-1">
                <span className="text-[13px] font-medium text-[#495647]">
                  {lang === "no"
                    ? "Sammenlign med snittmarked (3,5 %)"
                    : "Compare vs. normal market (3.5%)"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={compareNormalSale}
                  onClick={() => setCompareNormalSale((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    compareNormalSale ? "bg-[#243323]" : "bg-[#C7CEBF]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transition-transform ${
                      compareNormalSale ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TOP SAGE SUMMARY CARD + CHART CARD + PILL CTAS */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            {/* Top Summary Banner Card */}
            <div className="bg-[#E9EDE3] border border-[#D4DCCB] rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#D4DCCB] text-[#243323] flex items-center justify-center shrink-0">
                  <TrendingUpIcon className="w-6 h-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] sm:text-[15px] text-[#495647]">
                    {lang === "no"
                      ? `Med en boligverdi på ${formatNok(currentValue)} i dag, estimert verdi i ${endYear} (${years} år):`
                      : `With a property worth ${formatNok(currentValue)} today, estimated value in ${endYear} (${years} years):`}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3">
                    <span className="font-serif text-[40px] sm:text-[52px] lg:text-[56px] leading-none font-normal text-[#1D281C] tabular-nums tracking-[-0.02em]">
                      {formatNok(finalPoint.projectedValue)}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#CFD7C6] text-[13px] font-semibold text-[#243323]">
                      {lang === "no" ? `+${years} år` : `+${years} years`}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Inset Summary Cards matching mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#FFFFFF]/80 border border-[#D4DCCB] rounded-xl p-3.5">
                  <span className="block text-[13px] text-[#495647] font-medium">
                    {lang === "no" ? "Verdi i dag" : "Current value"}
                  </span>
                  <span className="block text-[18px] sm:text-[20px] font-semibold text-[#1D281C] tabular-nums mt-0.5">
                    {formatNok(currentValue)}
                  </span>
                </div>

                <div className="bg-[#FFFFFF]/80 border border-[#D4DCCB] rounded-xl p-3.5">
                  <span className="block text-[13px] text-[#495647] font-medium">
                    {lang === "no" ? "Estimert prisvekst" : "Projected value gain"}
                  </span>
                  <span className="block text-[18px] sm:text-[20px] font-semibold text-[#243323] tabular-nums mt-0.5">
                    +{formatNok(Math.max(0, totalGrowthKr))}
                  </span>
                </div>

                <div className="bg-[#FFFFFF]/80 border border-[#D4DCCB] rounded-xl p-3.5">
                  <span className="block text-[13px] text-[#495647] font-medium">
                    {compareNormalSale
                      ? lang === "no"
                        ? "Merverdi vs. snittsalg"
                        : "Ahead of market avg"
                      : lang === "no"
                        ? "Beste megler i dag"
                        : "Top agency boost now"}
                  </span>
                  <span className="block text-[18px] sm:text-[20px] font-semibold text-[#1D281C] tabular-nums mt-0.5">
                    +{formatNok(compareNormalSale ? outperformanceVsMarket : bestAgencyPremiumToday)}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle White Chart Card */}
            <div className="bg-[#FFFFFF] border border-[#DCE2D4] rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ScaleMeasureIcon className="w-5 h-5 text-[#495647]" />
                  <h2 className="font-display text-[19px] sm:text-[21px] font-semibold text-[#1D281C]">
                    {lang === "no" ? "Verdiutvikling over tid" : "House value growth over time"}
                  </h2>
                </div>
                <div className="inline-flex p-1 rounded-full bg-[#EEF1E9] border border-[#DCE2D4]">
                  <button
                    type="button"
                    onClick={() => setViewMode("chart")}
                    className={`min-h-[34px] px-4 py-1 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                      viewMode === "chart"
                        ? "bg-[#243323] text-[#FFFFFF] shadow-2xs"
                        : "text-[#495647] hover:text-[#1D281C]"
                    }`}
                  >
                    {lang === "no" ? "Graf" : "Chart"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`min-h-[34px] px-4 py-1 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                      viewMode === "table"
                        ? "bg-[#243323] text-[#FFFFFF] shadow-2xs"
                        : "text-[#495647] hover:text-[#1D281C]"
                    }`}
                  >
                    {lang === "no" ? "År for år" : "Year by year"}
                  </button>
                </div>
              </div>

              {viewMode === "chart" ? (
                <div className="space-y-3">
                  {/* Hover/Active Year Readout Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#F4F6F0] border border-[#DCE2D4] text-[13px]">
                    <span className="font-semibold text-[#243323] tabular-nums">
                      {activePoint.year} ({lang === "no" ? `År ${activePoint.yearIndex}` : `Year ${activePoint.yearIndex}`})
                    </span>
                    <span className="font-semibold text-[#1D281C] tabular-nums">
                      {formatNok(activePoint.projectedValue)}
                    </span>
                    <span className="text-[#495647] font-medium tabular-nums">
                      {lang === "no" ? "Vekst:" : "Gain:"} +{formatNok(Math.max(0, activePoint.growthEarned))}
                    </span>
                  </div>

                  {/* SVG Graph with Dot Markers */}
                  <div className="relative w-full">
                    <svg
                      viewBox={`0 0 ${svgW} ${svgH}`}
                      className="w-full h-auto overflow-visible select-none"
                      role="img"
                      aria-label={
                        lang === "no"
                          ? "Graf over forventet boligprisvekst over tid"
                          : "House price growth chart over time"
                      }
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      <defs>
                        <linearGradient id="growthAreaSage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9DB58F" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#E9EDE3" stopOpacity="0.08" />
                        </linearGradient>
                      </defs>

                      {yTicks.map((tick) => {
                        const yPos = getY(tick);
                        return (
                          <g key={tick}>
                            <line
                              x1={padL}
                              x2={svgW - padR}
                              y1={yPos}
                              y2={yPos}
                              stroke="#E8ECE2"
                              strokeWidth={1}
                            />
                            <text
                              x={padL - 10}
                              y={yPos + 4}
                              textAnchor="end"
                              fill="#5B6759"
                              fontSize="12"
                              className="tabular-nums"
                            >
                              {formatCompactMillions(tick, lang)}
                            </text>
                          </g>
                        );
                      })}

                      <path d={areaFillPath} fill="url(#growthAreaSage)" />

                      {compareNormalSale && (
                        <path
                          d={baselinePath}
                          fill="none"
                          stroke="#B86B4B"
                          strokeWidth={1.75}
                          strokeDasharray="5 5"
                        />
                      )}

                      <path
                        d={projectedPath}
                        fill="none"
                        stroke="#243323"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Dot markers & interactive hover slices */}
                      {timeline.map((p, idx) => {
                        const xPos = getX(idx);
                        const yPos = getY(p.projectedValue);
                        const sliceW = years > 0 ? plotW / years : plotW;
                        const isSelected = hoveredIdx === idx || (hoveredIdx === null && idx === years);
                        return (
                          <g key={p.year}>
                            {isSelected && (
                              <line
                                x1={xPos}
                                x2={xPos}
                                y1={padT}
                                y2={padT + plotH}
                                stroke="#B8C2AE"
                                strokeWidth={1.25}
                                strokeDasharray="3 3"
                              />
                            )}
                            <circle
                              cx={xPos}
                              cy={yPos}
                              r={isSelected ? 5.5 : 3.2}
                              fill={isSelected ? "#243323" : "#435941"}
                              stroke="#FFFFFF"
                              strokeWidth={isSelected ? 2 : 1.25}
                            />
                            <rect
                              x={xPos - sliceW / 2}
                              y={padT}
                              width={sliceW}
                              height={plotH}
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredIdx(idx)}
                              onClick={() => setHoveredIdx(idx)}
                            />
                          </g>
                        );
                      })}

                      {xTickIndices.map((idx) => (
                        <text
                          key={idx}
                          x={getX(idx)}
                          y={svgH - 6}
                          textAnchor={idx === 0 ? "start" : idx === years ? "end" : "middle"}
                          fill="#5B6759"
                          fontSize="11.5"
                          className="tabular-nums"
                        >
                          {startYear + idx}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="max-h-[250px] overflow-y-auto rounded-xl border border-[#DCE2D4] bg-[#F7F8F4]">
                  <table className="w-full text-left text-[14px] tabular-nums">
                    <thead className="sticky top-0 bg-[#E9EDE3] text-[#1D281C] border-b border-[#D4DCCB]">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">
                          {lang === "no" ? "År" : "Year"}
                        </th>
                        <th className="py-2.5 px-4 font-semibold">
                          {lang === "no" ? "Forventet verdi" : "Projected value"}
                        </th>
                        <th className="py-2.5 px-4 font-semibold">
                          {lang === "no" ? "Prisvekst" : "Total gain"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6EBE0] bg-[#FFFFFF]">
                      {timeline.map((row) => (
                        <tr key={row.year} className="hover:bg-[#F4F5F0]">
                          <td className="py-2.5 px-4 font-medium text-[#1D281C]">{row.year}</td>
                          <td className="py-2.5 px-4 font-semibold text-[#243323]">
                            {formatNok(row.projectedValue)}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-[#495647]">
                            +{formatNok(Math.max(0, row.growthEarned))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <Link
                href={`/koble-til-megler?source=growth-calc&type=${propertyKind}&value=${currentValue}&years=${years}`}
                onClick={() => trackClick("growth-calc")}
                className="flex-1 min-h-[52px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#243323] hover:bg-[#192418] active:scale-[0.985] text-[#FFFFFF] text-[15px] sm:text-[16px] font-semibold transition-all shadow-sm"
              >
                <span>
                  {lang === "no"
                    ? "Koble meg til beste megler for å få best pris nå"
                    : "Connect with the Best Agency for the Best Price Now"}
                </span>
                <ArrowRightIcon className="w-4 h-4 shrink-0" />
              </Link>

              <button
                type="button"
                onClick={handleCopySummary}
                className="min-h-[52px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FFFFFF] border border-[#CFD7C6] hover:bg-[#E9EDE3] text-[#1D281C] text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckMarkIcon className="w-4 h-4 text-[#243323]" />
                    <span>{lang === "no" ? "Lenke kopiert" : "Link copied"}</span>
                  </>
                ) : (
                  <span>
                    {lang === "no"
                      ? "Kopier lenke til beregningen"
                      : "Copy calculation link"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
