"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type BuildEra = "pre1970" | "1970-1989" | "1990-2009" | "2010-2019" | "2020plus";
type HeatingKind = "direct" | "air-pump" | "water-geo" | "wood-electric";

const ERA_BASE_KWH_M2: Record<BuildEra, number> = {
  pre1970: 235,
  "1970-1989": 185,
  "1990-2009": 145,
  "2010-2019": 105,
  "2020plus": 82,
};

const HEATING_FACTOR: Record<HeatingKind, { factor: number; heatGradeNo: string; heatGradeEn: string }> = {
  direct: { factor: 1.0, heatGradeNo: "Rød (direkte strøm)", heatGradeEn: "Red (direct electric)" },
  "wood-electric": { factor: 0.88, heatGradeNo: "Oransje (strøm + ved)", heatGradeEn: "Orange (electric + wood)" },
  "air-pump": { factor: 0.78, heatGradeNo: "Lysegrønn (varmepumpe)", heatGradeEn: "Light Green (heat pump)" },
  "water-geo": { factor: 0.62, heatGradeNo: "Mørkegrønn (bergvarme/vannbåren)", heatGradeEn: "Dark Green (geothermal/hydronic)" },
};

const GRADES = [
  { grade: "A", maxKwhM2: 85, color: "#147A53" },
  { grade: "B", maxKwhM2: 110, color: "#2E9660" },
  { grade: "C", maxKwhM2: 140, color: "#68AB5E" },
  { grade: "D", maxKwhM2: 175, color: "#C9A832" },
  { grade: "E", maxKwhM2: 215, color: "#D6822E" },
  { grade: "F", maxKwhM2: 265, color: "#C95B34" },
  { grade: "G", maxKwhM2: 9999, color: "#A8362B" },
] as const;

export function EnergyRatingTool() {
  const { lang, isModern } = useApp();

  const [era, setEra] = useState<BuildEra>("1970-1989");
  const [heating, setHeating] = useState<HeatingKind>("air-pump");
  const [sqm, setSqm] = useState<number>(160);
  const [upgrades, setUpgrades] = useState<string[]>(["windows"]);

  const toggleUpgrade = (id: string) => {
    setUpgrades((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  let kwhPerM2 = ERA_BASE_KWH_M2[era] * HEATING_FACTOR[heating].factor;
  if (upgrades.includes("windows")) kwhPerM2 *= 0.9;
  if (upgrades.includes("insulation")) kwhPerM2 *= 0.86;
  if (upgrades.includes("solar")) kwhPerM2 *= 0.82;
  kwhPerM2 = Math.round(kwhPerM2);

  const matchedGrade =
    GRADES.find((g) => kwhPerM2 <= g.maxKwhM2) || GRADES[GRADES.length - 1];
  const annualKwh = Math.round(kwhPerM2 * sqm);
  const annualPowerCostNok = Math.round(annualKwh * 1.45); // ~1.45 kr/kWh incl. grid fee
  const qualifiesGreenMortgage = matchedGrade.grade === "A" || matchedGrade.grade === "B";

  const sliderClass = isModern ? "nm-slider" : "kr-slider";
  const panelClass = isModern
    ? "bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-8 space-y-6"
    : "bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-8 space-y-6";

  const eraOptions: { id: BuildEra; label: string }[] = [
    { id: "pre1970", label: lang === "no" ? "Før 1970" : "Pre-1970" },
    { id: "1970-1989", label: "1970–1989" },
    { id: "1990-2009", label: "1990–2009" },
    { id: "2010-2019", label: "2010–2019" },
    { id: "2020plus", label: "2020+" },
  ];

  const heatOptions: { id: HeatingKind; no: string; en: string }[] = [
    { id: "direct", no: "Panelovner / kun strøm", en: "Direct Electric Heaters" },
    { id: "wood-electric", no: "Strøm + vedovn / peis", en: "Electric + Wood Stove" },
    { id: "air-pump", no: "Luft-til-luft varmepumpe", en: "Air-to-Air Heat Pump" },
    { id: "water-geo", no: "Bergvarme / vannbåren", en: "Geothermal / Hydronic" },
  ];

  const upgradeOptions: { id: string; no: string; en: string; effect: string }[] = [
    { id: "windows", no: "3-lags vinduer byttet", en: "3-Layer Insulated Windows", effect: "−10 % kWh" },
    { id: "insulation", no: "Etterisolert tak / vegg", en: "Upgraded Roof / Wall Insulation", effect: "−14 % kWh" },
    { id: "solar", no: "Solceller på taket", en: "Rooftop Solar Panels", effect: "−18 % kWh" },
  ];

  return (
    <ToolShell
      slug="energy-rating"
      iconKey="energy-rating"
      title={
        lang === "no"
          ? "Energimerking Estimat (A–G) & Salgsverdi"
          : "Energy Rating Estimator (A–G) & Pre-Sale Value"
      }
      subtitle={
        lang === "no"
          ? "Energiattest er lovpålagt ved boligsalg i Norge. Trykk på byggeår, oppvarming og oppgraderinger for å se estimert karakter (A–G) og strømkostnad."
          : "An official energy label is mandatory when selling in Norway. Tap build era, heating, and upgrades to estimate your A–G grade and power cost."
      }
      ctaSource="energy-rating"
      ctaHref={`/connect-agency?source=energy-rating&type=house&size=${sqm}&energyGrade=${matchedGrade.grade}`}
      ctaLabel={
        lang === "no"
          ? `Boligen din anslås til energimerke ${matchedGrade.grade} — få lokal meglervurdering og tips før energiattest`
          : `Estimated Energy Grade ${matchedGrade.grade} — get a local agency valuation and pre-sale advice`
      }
    >
      <div className={panelClass}>
        {/* Era */}
        <div>
          <p
            className={`text-[18px] sm:text-xl mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no" ? "1. Når ble boligen bygget?" : "1. When Was the Property Built?"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {eraOptions.map((o) => {
              const active = era === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setEra(o.id)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[58px] px-3 py-2.5 border-2 text-[16px] font-semibold tabular-nums ${
                    active
                      ? isModern
                        ? "bg-[#147A53] border-[#0F3D2E] text-[#FFFFFF]"
                        : "bg-[#B8C49E] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#121C17]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#000000]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Heating */}
        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <p
            className={`text-[18px] sm:text-xl mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no" ? "2. Hovedoppvarming i boligen" : "2. Primary Heating Source"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {heatOptions.map((o) => {
              const active = heating === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setHeating(o.id)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[62px] px-4 py-3 border-2 text-left text-[16px] sm:text-[17px] font-semibold flex items-center justify-between gap-2 ${
                    active
                      ? isModern
                        ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                        : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                  }`}
                >
                  <span>{lang === "no" ? o.no : o.en}</span>
                  {active && (
                    <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upgrades */}
        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <p
            className={`text-[17px] sm:text-lg mb-3 ${
              isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
            }`}
          >
            {lang === "no" ? "3. Utførte energitiltak (valgfritt — trykk flere)" : "3. Completed Upgrades (optional)"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {upgradeOptions.map((u) => {
              const active = upgrades.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleUpgrade(u.id)}
                  aria-pressed={active}
                  className={`${
                    isModern ? "nm-tap-card" : "kr-tap-card"
                  } min-h-[64px] px-4 py-3 border-2 text-left flex items-center justify-between gap-2 ${
                    active
                      ? isModern
                        ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                        : "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                      : isModern
                      ? "bg-[#FFFFFF] border-[#DCE5DF] text-[#3B4D44]"
                      : "bg-[#FFFFFF] border-[#BFBFBD] text-[#292823]"
                  }`}
                >
                  <div>
                    <span className="block text-[15px] font-semibold">
                      {lang === "no" ? u.no : u.en}
                    </span>
                    <span className="block text-[13px] opacity-80">{u.effect}</span>
                  </div>
                  {active && (
                    <CheckMarkIcon className={`w-5 h-5 shrink-0 ${isModern ? "text-[#147A53]" : "text-[#5D726A]"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Slider */}
        <div className={`pt-4 border-t ${isModern ? "border-[#DCE5DF]" : "border-[#BFBFBD]"}`}>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="energy-sqm"
              className={`text-[17px] sm:text-lg ${
                isModern ? "font-semibold text-[#121C17]" : "font-medium text-[#000000]"
              }`}
            >
              {lang === "no" ? "4. Oppvarmet bruksareal (BRA)" : "4. Heated Floor Area (BRA)"}
            </label>
            <output
              htmlFor="energy-sqm"
              className="text-[22px] font-semibold tabular-nums whitespace-nowrap"
            >
              {sqm} m²
            </output>
          </div>
          <input
            id="energy-sqm"
            type="range"
            min={35}
            max={400}
            step={5}
            value={sqm}
            onChange={(e) => setSqm(Number(e.target.value))}
            style={
              {
                "--attr-min": 35,
                "--attr-max": 400,
                "--control-value": sqm,
              } as React.CSSProperties
            }
            className={sliderClass}
          />
        </div>
      </div>

      {/* Visual A–G Energy Scale */}
      <div
        className={`p-5 sm:p-8 space-y-5 ${
          isModern
            ? "bg-[#FFFFFF] border-2 border-[#147A53] rounded-2xl"
            : "bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className={`block text-[14px] font-medium ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
              {lang === "no" ? "Estimert energikarakter (Enova-skala)" : "Estimated Energy Label (Enova Scale)"}
            </span>
            <p className="text-[28px] sm:text-4xl font-semibold text-[#000000] mt-1">
              {lang === "no" ? `Karakter ${matchedGrade.grade}` : `Grade ${matchedGrade.grade}`}{" "}
              <span className="text-[18px] sm:text-xl font-normal text-[#3B4D44] tabular-nums">
                ({kwhPerM2} kWh/m²)
              </span>
            </p>
          </div>
          <span
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-[36px] sm:text-[44px] font-bold text-[#FFFFFF] ${
              isModern ? "rounded-2xl" : "rounded-none"
            }`}
            style={{ backgroundColor: matchedGrade.color }}
          >
            {matchedGrade.grade}
          </span>
        </div>

        {/* 7-Step Visual Grade Bar */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {GRADES.map((g) => {
            const isCurrent = g.grade === matchedGrade.grade;
            return (
              <div
                key={g.grade}
                className={`py-2.5 text-center font-bold text-[16px] sm:text-[18px] transition-all ${
                  isModern ? "rounded-lg" : "rounded-none"
                } ${isCurrent ? "ring-4 ring-[#000000] scale-[1.06] text-[#FFFFFF]" : "opacity-55 text-[#FFFFFF]"}`}
                style={{ backgroundColor: g.color }}
              >
                {g.grade}
              </div>
            );
          })}
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#DCE5DF]">
          <div>
            <dt className="text-[14px] text-[#3B4D44]">
              {lang === "no" ? "Estimert årlig forbruk" : "Estimated Annual Usage"}
            </dt>
            <dd className="text-[22px] font-semibold text-[#000000] tabular-nums mt-0.5">
              {annualKwh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} kWh
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-[#3B4D44]">
              {lang === "no" ? "Estimert strøm + nettleie / år" : "Est. Annual Electricity Bill"}
            </dt>
            <dd className="text-[22px] font-semibold text-[#000000] tabular-nums mt-0.5">
              {formatNok(annualPowerCostNok)}
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-[#3B4D44]">
              {lang === "no" ? "Oppvarmingskarakter" : "Heating Grade"}
            </dt>
            <dd className="text-[17px] font-semibold text-[#000000] mt-1">
              {lang === "no" ? HEATING_FACTOR[heating].heatGradeNo : HEATING_FACTOR[heating].heatGradeEn}
            </dd>
          </div>
        </dl>

        <div
          className={`p-4 text-[15px] ${
            isModern
              ? "bg-[#E6F2EC] rounded-xl text-[#0F3D2E]"
              : "bg-[#EDF0E7] rounded-none text-[#292823] border border-[#DCE2CF]"
          }`}
        >
          {qualifiesGreenMortgage
            ? lang === "no"
              ? "Sterkt salgsargument: Energimerke A og B kvalifiserer normalt til «Grønt boliglån» med lavere rente for kjøper."
              : "Strong selling point: Grade A & B homes typically qualify buyers for discounted Norwegian 'Green Mortgage' rates."
            : lang === "no"
            ? "Tips før salg: Dyre totaltiltak lønner seg sjelden rett før salg, men en varmepumpe eller god dokumentasjon i tilstandsrapporten trygger kjøpere."
            : "Pre-sale tip: Expensive retrofits rarely pay back immediately before selling, while a heat pump and transparent inspection documentation reassure buyers."}
        </div>
      </div>
    </ToolShell>
  );
}
