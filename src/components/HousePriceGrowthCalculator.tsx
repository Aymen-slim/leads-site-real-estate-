"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { ArrowRightIcon, CheckMarkIcon } from "@/components/Icons";

type PropertyKind = "house" | "land" | "apartment";
type CalcMode = "growth" | "bestPriceNow";
type ViewMode = "chart" | "table";

const PROPERTY_PRESETS: Record<
  PropertyKind,
  { defaultRate: number; noLabel: string; enLabel: string; noteNo: string; noteEn: string }
> = {
  house: {
    defaultRate: 5.5,
    noLabel: "Enebolig",
    enLabel: "House",
    noteNo: "Historisk snitt for enebolig i Norge: 5,5 %.",
    noteEn: "Norwegian historical average for houses: 5.5%.",
  },
  land: {
    defaultRate: 6.5,
    noLabel: "Byggetomt",
    enLabel: "Land Plot",
    noteNo: "Historisk snitt for regulert byggetomt: 6,5 %.",
    noteEn: "Norwegian average for constructible land: 6.5%.",
  },
  apartment: {
    defaultRate: 4.5,
    noLabel: "Leilighet",
    enLabel: "Apartment",
    noteNo: "Historisk snitt for selveierleilighet: 4,5 %.",
    noteEn: "Norwegian historical average for apartments: 4.5%.",
  },
};

function formatCompactMillions(value: number, lang: "no" | "en"): string {
  if (value === 0) return "0";
  if (value >= 1_000_000) {
    const mill = value / 1_000_000;
    const rounded = Number.isInteger(mill) ? mill.toFixed(0) : mill.toFixed(1).replace(".", ",");
    return lang === "no" ? `${rounded} mill.` : `${rounded}M`;
  }
  return `${Math.round(value / 1000)}k`;
}

export function HousePriceGrowthCalculator() {
  const { lang, trackClick } = useApp();

  const [calcMode, setCalcMode] = useState<CalcMode>("growth");
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
  const bestAgencyLiftPct = calcMode === "bestPriceNow" ? 0.14 : 0.1;

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
  const bestPriceNowTotal = currentValue + bestAgencyPremiumToday;
  const outperformanceVsMarket = finalPoint.projectedValue - finalPoint.baselineValue;

  const svgW = 680;
  const svgH = 290;
  const padL = 62;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rawMax = Math.max(
    finalPoint.projectedValue,
    finalPoint.baselineValue,
    currentValue * 1.15
  );
  const maxStep = rawMax > 15_000_000 ? 5_000_000 : rawMax > 8_000_000 ? 3_000_000 : 2_000_000;
  const chartMaxY = Math.ceil(rawMax / maxStep) * maxStep;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(chartMaxY * r));

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

  const principalAreaPath =
    timeline
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx).toFixed(1)} ${getY(p.principalValue).toFixed(1)}`)
      .join(" ") +
    ` L ${getX(years).toFixed(1)} ${(padT + plotH).toFixed(1)} L ${getX(0).toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const xTickIndices = Array.from(
    new Set([0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years])
  );

  const activePoint =
    hoveredIdx !== null && timeline[hoveredIdx] ? timeline[hoveredIdx] : finalPoint;

  const preset = PROPERTY_PRESETS[propertyKind];

  return (
    <section
      id="house-growth-calculator"
      className="bg-[#FFFFFF] text-[#292823] py-10 sm:py-14 lg:py-16"
    >
      <div className="kr-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* LEFT LIGHT CONTROL PANEL */}
          <div className="lg:col-span-5 bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <div>
                <p className="text-[14px] font-medium text-[#292823] mb-2.5">
                  {lang === "no" ? "Hva vil du regne ut?" : "What do you want to calculate?"}
                </p>
                <div className="grid grid-cols-2 p-1 rounded-none bg-[#DCE2CF] border border-[#BFBFBD]">
                  <button
                    type="button"
                    onClick={() => setCalcMode("growth")}
                    className={`min-h-[42px] px-3 py-1.5 rounded-none text-[14px] font-medium transition-colors cursor-pointer ${
                      calcMode === "growth"
                        ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                        : "text-[#292823] hover:text-[#000000]"
                    }`}
                  >
                    {lang === "no" ? "Prisvekst over tid" : "Future House Growth"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcMode("bestPriceNow")}
                    className={`min-h-[42px] px-3 py-1.5 rounded-none text-[14px] font-medium transition-colors cursor-pointer ${
                      calcMode === "bestPriceNow"
                        ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                        : "text-[#292823] hover:text-[#000000]"
                    }`}
                  >
                    {lang === "no" ? "Beste pris med megler" : "Best Agency Price"}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <label
                      htmlFor="growth-current-value-kr"
                      className="block text-[15px] font-medium text-[#000000]"
                    >
                      {lang === "no" ? "Boligens verdi i dag" : "Current house value"}
                    </label>
                    <span className="text-[13px] text-[#5D726A]">
                      {lang === "no" ? "1 mill. – 25 mill. kr" : "1M – 25M kr"}
                    </span>
                  </div>
                  <div className="px-3.5 py-2 rounded-none bg-[#FFFFFF] border border-[#BFBFBD] text-[15px] font-medium text-[#000000] tabular-nums whitespace-nowrap">
                    {formatNok(currentValue)}
                  </div>
                </div>
                <input
                  id="growth-current-value-kr"
                  type="range"
                  min={1_000_000}
                  max={25_000_000}
                  step={250_000}
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="kr-slider"
                  style={
                    {
                      "--attr-min": 1_000_000,
                      "--attr-max": 25_000_000,
                      "--control-value": currentValue,
                    } as React.CSSProperties
                  }
                />
              </div>

              <div>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <label
                      htmlFor="growth-years-kr"
                      className="block text-[15px] font-medium text-[#000000]"
                    >
                      {lang === "no" ? "Tidshorisont" : "Projection period"}
                    </label>
                    <span className="text-[13px] text-[#5D726A]">
                      {lang === "no" ? "1 – 25 år" : "1 – 25 years"}
                    </span>
                  </div>
                  <div className="px-3.5 py-2 rounded-none bg-[#FFFFFF] border border-[#BFBFBD] text-[15px] font-medium text-[#000000] tabular-nums whitespace-nowrap">
                    {years} {lang === "no" ? "år" : years === 1 ? "year" : "years"}
                  </div>
                </div>
                <input
                  id="growth-years-kr"
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="kr-slider"
                  style={
                    {
                      "--attr-min": 1,
                      "--attr-max": 25,
                      "--control-value": years,
                    } as React.CSSProperties
                  }
                />
              </div>

              <div>
                <p className="text-[15px] font-medium text-[#000000] mb-2.5">
                  {lang === "no" ? "Type eiendom" : "Property type"}
                </p>
                <div className="grid grid-cols-3 p-1 rounded-none bg-[#DCE2CF] border border-[#BFBFBD]">
                  {(["house", "land", "apartment"] as PropertyKind[]).map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => handlePropertySwitch(kind)}
                      className={`min-h-[40px] px-2 py-1.5 rounded-none text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer ${
                        propertyKind === kind
                          ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                          : "text-[#292823] hover:text-[#000000]"
                      }`}
                    >
                      {lang === "no"
                        ? PROPERTY_PRESETS[kind].noLabel
                        : PROPERTY_PRESETS[kind].enLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <label
                    htmlFor="growth-annual-rate-kr"
                    className="text-[15px] font-medium text-[#000000]"
                  >
                    {lang === "no"
                      ? "Forventet årlig prisvekst"
                      : "Expected annual house growth"}
                  </label>
                  <div className="px-3.5 py-2 rounded-none bg-[#FFFFFF] border border-[#BFBFBD] text-[15px] font-medium text-[#000000] tabular-nums whitespace-nowrap">
                    {annualRate.toFixed(1).replace(".", ",")} %
                  </div>
                </div>
                <input
                  id="growth-annual-rate-kr"
                  type="range"
                  min={1.5}
                  max={10.0}
                  step={0.5}
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="kr-slider"
                  style={
                    {
                      "--attr-min": 1.5,
                      "--attr-max": 10.0,
                      "--control-value": annualRate,
                    } as React.CSSProperties
                  }
                />
                <p className="text-[13px] text-[#5D726A] mt-1">
                  {lang === "no" ? preset.noteNo : preset.noteEn}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCE2CF] space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[14px] font-medium text-[#000000]">
                    {lang === "no"
                      ? "Ta med oppgradering i verdi"
                      : "Include property upgrades"}
                  </span>
                  <span className="block text-[13px] text-[#5D726A]">
                    {lang === "no" ? "+0,8 % ekstra årlig vekst" : "+0.8% extra annual appreciation"}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeUpgrades}
                  onClick={() => setIncludeUpgrades((v) => !v)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    includeUpgrades ? "bg-[#5D726A]" : "bg-[#C7CEBE]"
                  }`}
                >
                  <span
                    className={`block w-6 h-6 rounded-full bg-[#FFFFFF] shadow-sm transition-transform ${
                      includeUpgrades ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[14px] font-medium text-[#000000]">
                    {lang === "no" ? "Vis i dagens kroner" : "Show in today's kr"}
                  </span>
                  <span className="block text-[13px] text-[#5D726A]">
                    {lang === "no"
                      ? "Justerer for 2,5 % prisvekst i året"
                      : "Adjusts for 2.5% annual inflation"}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={adjustInflation}
                  onClick={() => setAdjustInflation((v) => !v)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    adjustInflation ? "bg-[#5D726A]" : "bg-[#C7CEBE]"
                  }`}
                >
                  <span
                    className={`block w-6 h-6 rounded-full bg-[#FFFFFF] shadow-sm transition-transform ${
                      adjustInflation ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[14px] font-medium text-[#000000]">
                    {lang === "no"
                      ? "Sammenlign med vanlig markedssalg"
                      : "Compare vs. normal market"}
                  </span>
                  <span className="block text-[13px] text-[#5D726A]">
                    {lang === "no" ? "3,5 % snittvekst i året" : "3.5% baseline per year"}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={compareNormalSale}
                  onClick={() => setCompareNormalSale((v) => !v)}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    compareNormalSale ? "bg-[#5D726A]" : "bg-[#C7CEBE]"
                  }`}
                >
                  <span
                    className={`block w-6 h-6 rounded-full bg-[#FFFFFF] shadow-sm transition-transform ${
                      compareNormalSale ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT LIGHT RESULT & CHART PANEL */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6 py-1">
            <div className="space-y-4">
              <p className="text-[16px] sm:text-[17px] text-[#292823]">
                {calcMode === "growth"
                  ? lang === "no"
                    ? `Med en boligverdi på ${formatNok(currentValue)} i dag kan boligen i ${endYear} være verdt:`
                    : `With a property worth ${formatNok(currentValue)} today, estimated value in ${endYear} (${years} years):`
                  : lang === "no"
                    ? `Med riktig lokal meglerstrategi kan estimert salgspris i dag nå opptil:`
                    : `With a top-ranked local agency today, your estimated achievable sale price is:`}
              </p>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-sans text-[40px] sm:text-[48px] lg:text-[54px] leading-none font-semibold text-[#000000] tabular-nums tracking-[-0.02em]">
                  {calcMode === "growth"
                    ? formatNok(finalPoint.projectedValue)
                    : formatNok(bestPriceNowTotal)}
                </span>
                <span className="text-[17px] sm:text-[19px] text-[#5D726A] font-medium">
                  {calcMode === "growth"
                    ? lang === "no"
                      ? `om ${years} år`
                      : `in ${years} years`
                    : lang === "no"
                      ? `(+${Math.round(bestAgencyLiftPct * 100)} % salgsoptimering)`
                      : `(+${Math.round(bestAgencyLiftPct * 100)}% agency pricing lift)`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-4">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#292823]">
                    <span className="inline-block w-3 h-0.5 bg-[#5D726A]" />
                    <span>{lang === "no" ? "Verdi i dag" : "Current value"}</span>
                  </div>
                  <div className="text-[19px] sm:text-[20px] font-semibold text-[#000000] tabular-nums mt-1.5">
                    {formatNok(currentValue)}
                  </div>
                </div>

                <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-4">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#292823]">
                    <span className="inline-block w-2.5 h-2.5 rounded-none bg-[#5D726A]" />
                    <span>
                      {lang === "no" ? "Estimert prisvekst" : "Projected value gain"}
                    </span>
                  </div>
                  <div className="text-[19px] sm:text-[20px] font-semibold text-[#000000] tabular-nums mt-1.5">
                    +{formatNok(Math.max(0, totalGrowthKr))}
                  </div>
                </div>

                <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-4">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#292823]">
                    <span className="inline-block w-2.5 h-2.5 rounded-none bg-[#B85A3F]" />
                    <span>
                      {compareNormalSale
                        ? lang === "no"
                          ? "Merverdi vs. snittsalg"
                          : "Ahead of market avg"
                        : lang === "no"
                          ? "Med beste megler nå"
                          : "Top agency boost today"}
                    </span>
                  </div>
                  <div className="text-[19px] sm:text-[20px] font-semibold text-[#000000] tabular-nums mt-1.5">
                    +{formatNok(compareNormalSale ? outperformanceVsMarket : bestAgencyPremiumToday)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-sans text-[19px] sm:text-[20px] font-semibold text-[#000000]">
                  {lang === "no" ? "Verdiutvikling over tid" : "House value growth over time"}
                </h2>
                <div className="inline-flex p-1 rounded-none bg-[#EDF0E7] border border-[#DCE2CF]">
                  <button
                    type="button"
                    onClick={() => setViewMode("chart")}
                    className={`min-h-[36px] px-4 py-1 rounded-none text-[14px] font-medium transition-colors cursor-pointer ${
                      viewMode === "chart"
                        ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                        : "text-[#292823] hover:text-[#000000]"
                    }`}
                  >
                    {lang === "no" ? "Graf" : "Chart"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`min-h-[36px] px-4 py-1 rounded-none text-[14px] font-medium transition-colors cursor-pointer ${
                      viewMode === "table"
                        ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                        : "text-[#292823] hover:text-[#000000]"
                    }`}
                  >
                    {lang === "no" ? "År for år" : "Year by year"}
                  </button>
                </div>
              </div>

              {viewMode === "chart" ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-none bg-[#EDF0E7] border border-[#DCE2CF] text-[13px] sm:text-[14px]">
                    <span className="font-medium text-[#5D726A] tabular-nums">
                      {activePoint.year} ({lang === "no" ? `År ${activePoint.yearIndex}` : `Year ${activePoint.yearIndex}`})
                    </span>
                    <span className="font-semibold text-[#000000] tabular-nums">
                      {formatNok(activePoint.projectedValue)}
                    </span>
                    <span className="text-[#292823] tabular-nums">
                      {lang === "no" ? "Vekst:" : "Gain:"} +{formatNok(Math.max(0, activePoint.growthEarned))}
                    </span>
                  </div>

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
                        <linearGradient id="growthAreaGradKrLight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5D726A" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#EDF0E7" stopOpacity="0.06" />
                        </linearGradient>
                        <linearGradient id="principalAreaGradKrLight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B8C49E" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
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
                              stroke="#E6EBE0"
                              strokeWidth={1}
                            />
                            <text
                              x={padL - 10}
                              y={yPos + 4}
                              textAnchor="end"
                              fill="#5D726A"
                              fontSize="12"
                              className="tabular-nums"
                            >
                              {formatCompactMillions(tick, lang)}
                            </text>
                          </g>
                        );
                      })}

                      <path d={areaFillPath} fill="url(#growthAreaGradKrLight)" />
                      <path d={principalAreaPath} fill="url(#principalAreaGradKrLight)" />

                      {compareNormalSale && (
                        <path
                          d={baselinePath}
                          fill="none"
                          stroke="#B85A3F"
                          strokeWidth={2}
                          strokeDasharray="6 5"
                        />
                      )}

                      <path
                        d={projectedPath}
                        fill="none"
                        stroke="#486056"
                        strokeWidth={2.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {timeline.map((p, idx) => {
                        const xPos = getX(idx);
                        const sliceW = years > 0 ? plotW / years : plotW;
                        const isSelected = hoveredIdx === idx || (hoveredIdx === null && idx === years);
                        return (
                          <g key={p.year}>
                            {isSelected && (
                              <>
                                <line
                                  x1={xPos}
                                  x2={xPos}
                                  y1={padT}
                                  y2={padT + plotH}
                                  stroke="#949391"
                                  strokeWidth={1}
                                  strokeDasharray="3 3"
                                />
                                <circle
                                  cx={xPos}
                                  cy={getY(p.projectedValue)}
                                  r={5.5}
                                  fill="#486056"
                                  stroke="#FFFFFF"
                                  strokeWidth={2}
                                />
                              </>
                            )}
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
                          y={svgH - 8}
                          textAnchor={idx === 0 ? "start" : idx === years ? "end" : "middle"}
                          fill="#5D726A"
                          fontSize="12"
                          className="tabular-nums"
                        >
                          {startYear + idx}
                        </text>
                      ))}
                    </svg>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#292823]">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3.5 h-0.5 bg-[#486056]" />
                      <span>
                        {lang === "no" ? "Forventet boligverdi" : "Projected house value"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-none bg-[#5D726A]" />
                      <span>{lang === "no" ? "Verdi i dag" : "Value today"}</span>
                    </div>
                    {compareNormalSale && (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 border-t-2 border-dashed border-[#B85A3F]" />
                        <span>
                          {lang === "no" ? "Snittmarked (3,5 %)" : "Market avg (3.5%)"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-h-[290px] overflow-y-auto rounded-none border border-[#DCE2CF] bg-[#FFFFFF]">
                  <table className="w-full text-left text-[14px] tabular-nums">
                    <thead className="sticky top-0 bg-[#EDF0E7] text-[#000000] border-b border-[#DCE2CF]">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">
                          {lang === "no" ? "År" : "Year"}
                        </th>
                        <th className="py-2.5 px-4 font-medium">
                          {lang === "no" ? "Forventet verdi" : "Projected value"}
                        </th>
                        <th className="py-2.5 px-4 font-medium">
                          {lang === "no" ? "Prisvekst" : "Total gain"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDF0E7]">
                      {timeline.map((row) => (
                        <tr key={row.year} className="hover:bg-[#EDF0E7]/50">
                          <td className="py-2.5 px-4 font-medium text-[#000000]">{row.year}</td>
                          <td className="py-2.5 px-4 font-semibold text-[#000000]">
                            {formatNok(row.projectedValue)}
                          </td>
                          <td className="py-2.5 px-4 text-[#5D726A]">
                            +{formatNok(Math.max(0, row.growthEarned))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href={`/koble-til-megler?source=growth-calc&type=${propertyKind}&value=${currentValue}&years=${years}`}
                onClick={() => trackClick("growth-calc")}
                className="sm:flex-1 min-h-[54px] inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-none bg-[#B8C49E] hover:bg-[#C5D0AF] border border-[#5D726A] active:scale-[0.985] text-[#000000] text-[15px] font-medium transition-all"
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
                className="shrink-0 min-h-[54px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-none bg-[#FFFFFF] border border-[#BFBFBD] hover:border-[#5D726A] hover:bg-[#EDF0E7] text-[#000000] text-[15px] font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckMarkIcon className="w-4 h-4 text-[#5D726A]" />
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
