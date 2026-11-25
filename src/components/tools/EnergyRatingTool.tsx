"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNok } from "@/data/norwayData";
import { CheckMarkIcon } from "@/components/Icons";
import { ToolShell } from "@/components/ToolShell";

type BuildEra = "pre1970" | "1970-1989" | "1990-2009" | "2010-2019" | "2020plus";
type HeatingKind = "direct" | "wood-electric" | "air-pump" | "water-geo" | "district";

// Indicative baseline heating/energy demand (kWh/m²/yr) by Norwegian TEK build era
const ERA_BASE_KWH_M2: Record<BuildEra, number> = {
  pre1970: 275,
  "1970-1989": 200,
  "1990-2009": 150,
  "2010-2019": 120,
  "2020plus": 105,
};

// Under Norway's NEW energy labeling regulation from Jan 1, 2026 (NS 3031:2025):
// - The old red-green heating grade was REMOVED (single unified A–G grade).
// - Weighted delivered energy: electricity = 1.0, district heating & bio = 0.45, exported solar = 0.
const HEATING_CONFIG: Record<
  HeatingKind,
  {
    deliveredFactor: number; // affects actual energy bill
    weightedFactor: number; // affects 2026 A–G energy grade (NS 3031:2025)
    weightNoteNo: string;
    weightNoteEn: string;
  }
> = {
  direct: {
    deliveredFactor: 1.0,
    weightedFactor: 1.0,
    weightNoteNo: "Strøm (vekting 1,0)",
    weightNoteEn: "Electricity (weight 1.0)",
  },
  "wood-electric": {
    deliveredFactor: 0.92,
    weightedFactor: 0.8,
    weightNoteNo: "Strøm 1,0 + ved/bio 0,45",
    weightNoteEn: "Electric 1.0 + bio 0.45",
  },
  "air-pump": {
    deliveredFactor: 0.76,
    weightedFactor: 0.76,
    weightNoteNo: "Strøm (lavere forbruk via COP)",
    weightNoteEn: "Electric (lower demand via COP)",
  },
  "water-geo": {
    deliveredFactor: 0.56,
    weightedFactor: 0.56,
    weightNoteNo: "Bergvarme (høy COP · lavt strømforbruk)",
    weightNoteEn: "Geothermal (high COP · low demand)",
  },
  district: {
    deliveredFactor: 0.95,
    weightedFactor: 0.55,
    weightNoteNo: "Fjernvarme (vekting 0,45 i 2026)",
    weightNoteEn: "District heating (0.45 weight in 2026)",
  },
};

const GRADE_COLORS: Record<string, string> = {
  A: "#147A53",
  B: "#2E9660",
  C: "#68AB5E",
  D: "#C9A832",
  E: "#D6822E",
  F: "#C95B34",
  G: "#A8362B",
};

const ALL_IN_KWH_PRICE_NOK = 1.25; // 2025/2026 indicative avg incl. nettleie & avgifter (Norgespris 0.50 kr + nettleie)

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

  const pre1997Eligible = era === "pre1970" || era === "1970-1989";

  // Area-adjusted TEK17 reference for small houses: ~100 + 1600 / BRA (NS 3031:2025 principle)
  // From Jan 1, 2026: Grade B = TEK17, Grade A = 15% below TEK17, C–F evenly spaced
  const tek17Ref = Math.round(100 + 1600 / Math.max(50, sqm));
  const grades = [
    { grade: "A", maxKwhM2: Math.round(tek17Ref * 0.85), color: GRADE_COLORS.A },
    { grade: "B", maxKwhM2: tek17Ref, color: GRADE_COLORS.B },
    { grade: "C", maxKwhM2: tek17Ref + 35, color: GRADE_COLORS.C },
    { grade: "D", maxKwhM2: tek17Ref + 75, color: GRADE_COLORS.D },
    { grade: "E", maxKwhM2: tek17Ref + 115, color: GRADE_COLORS.E },
    { grade: "F", maxKwhM2: tek17Ref + 160, color: GRADE_COLORS.F },
    { grade: "G", maxKwhM2: 9999, color: GRADE_COLORS.G },
  ];

  const heatCfg = HEATING_CONFIG[heating];
  let upgradeMultiplier = 1.0;
  if (upgrades.includes("windows")) upgradeMultiplier *= 0.91;
  if (upgrades.includes("insulation")) upgradeMultiplier *= 0.86;
  if (upgrades.includes("solar")) upgradeMultiplier *= 0.83;

  const weightedKwhPerM2 = Math.round(
    ERA_BASE_KWH_M2[era] * heatCfg.weightedFactor * upgradeMultiplier
  );
  const deliveredKwhPerM2 = Math.round(
    ERA_BASE_KWH_M2[era] * heatCfg.deliveredFactor * upgradeMultiplier
  );

  const matchedGrade =
    grades.find((g) => weightedKwhPerM2 <= g.maxKwhM2) || grades[grades.length - 1];
  const annualDeliveredKwh = Math.round(deliveredKwhPerM2 * sqm);
  const annualEnergyCostNok = Math.round(annualDeliveredKwh * ALL_IN_KWH_PRICE_NOK);
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
    { id: "wood-electric", no: "Strøm + vedovn / bio", en: "Electric + Wood / Bio" },
    { id: "air-pump", no: "Luft-til-luft varmepumpe", en: "Air-to-Air Heat Pump" },
    { id: "water-geo", no: "Bergvarme / vannbåren", en: "Geothermal / Hydronic" },
    { id: "district", no: "Fjernvarme / nærvarme", en: "District Heating" },
  ];

  const upgradeOptions: {
    id: string;
    no: string;
    en: string;
    effect: string;
  }[] = [
    { id: "windows", no: "3-lags vinduer byttet", en: "3-Layer Insulated Windows", effect: "−9 % kWh" },
    { id: "insulation", no: "Etterisolert tak / vegg", en: "Upgraded Roof / Wall Insulation", effect: "−14 % kWh" },
    { id: "solar", no: "Solceller på taket", en: "Rooftop Solar Panels", effect: "−17 % kWh" },
  ];

  const enovaBenchmarks = [
    {
      nameNo: "Luft-til-luft varmepumpe",
      nameEn: "Air-to-air heat pump",
      costNo: "22 000 – 35 000 kr",
      costEn: "22k – 35k kr",
      enovaNo: "0 kr (ikke støtteberettiget)",
      enovaEn: "0 kr (not subsidized)",
      tipNo: "Ofte raskest effekt før salg",
      tipEn: "Often fastest pre-sale payback",
    },
    {
      nameNo: "3-lags vinduer / dører",
      nameEn: "3-layer windows / doors",
      costNo: "80 000 – 180 000 kr",
      costEn: "80k – 180k kr",
      enovaNo: "400 kr/m², maks 20 000 kr (før 1997)",
      enovaEn: "400 kr/m², max 20k kr (pre-1997)",
      tipNo: "Lønner seg mest ved lengre botid",
      tipEn: "Best if staying long-term",
    },
    {
      nameNo: "Etterisolering loft / yttervegg",
      nameEn: "Loft / exterior wall insulation",
      costNo: "Loft 40–90k · Vegg 150–350k",
      costEn: "Loft 40–90k · Wall 150–350k",
      enovaNo: "150 kr/m² · maks 22 500 / 37 500 kr",
      enovaEn: "150 kr/m² · max 22.5k / 37.5k kr",
      tipNo: "Loft rimelig; full vegg sjelden lønnsomt før salg",
      tipEn: "Loft affordable; full wall rarely pays pre-sale",
    },
    {
      nameNo: "Solcelleanlegg (8–12 kWp)",
      nameEn: "Rooftop solar (8–12 kWp)",
      costNo: "110 000 – 185 000 kr",
      costEn: "110k – 185k kr",
      enovaNo: "2 500 kr/kW, maks 37 500 kr (≤15 kW)",
      enovaEn: "2,500 kr/kW, max 37.5k kr (≤15 kW)",
      tipNo: "Kan hjelpe karakter mot A/B",
      tipEn: "Can help reach A/B grade",
    },
    {
      nameNo: "Bergvarme / luft-til-vann",
      nameEn: "Geothermal / air-to-water pump",
      costNo: "140 000 – 450 000 kr",
      costEn: "140k – 450k kr",
      enovaNo: "Inntil 40 000 kr (berg) / 20 000 kr (L/V)",
      enovaEn: "Up to 40k kr (geo) / 20k kr (A/W)",
      tipNo: "Krever vannbåren varme; lang horisont",
      tipEn: "Needs hydronic system; long payback",
    },
  ];

  return (
    <ToolShell
      slug="energy-rating"
      iconKey="energy-rating"
      title={
        lang === "no"
          ? "Estimer boligens energikarakter (2026-ordning) og strømforbruk"
          : "Energy Rating Estimator (2026 A–G Scale) & Enova Support"
      }
      subtitle={
        lang === "no"
          ? "Estimer energikarakter (A–G) etter Enovas nye 2026-ordning (NS 3031:2025), årlig strømkostnad og gjeldende Enova-støtte."
          : "Estimate your home's unified A–G energy label under Norway's 2026 Enova rules (NS 3031:2025), annual power bill, and current Enova grants."
      }
      ctaSource="energy-rating"
      ctaHref={`/koble-til-megler?source=energy-rating&type=house&size=${sqm}&energyGrade=${matchedGrade.grade}`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  } min-h-[60px] px-4 py-3 border-2 text-left text-[15px] sm:text-[16px] font-semibold flex items-center justify-between gap-2 ${
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
            {lang === "no"
              ? "3. Utførte energitiltak (valgfritt — trykk flere)"
              : "3. Completed Upgrades (optional — select multiple)"}
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

      {/* Visual A–G Energy Scale (2026 Unified Regulation) */}
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
              {lang === "no"
                ? "Estimert energikarakter (ny 2026-ordning · én A–G-skala)"
                : "Estimated Energy Label (2026 Unified A–G Scale)"}
            </span>
            <p className="text-[28px] sm:text-4xl font-semibold text-[#000000] mt-1">
              {lang === "no" ? `Karakter ${matchedGrade.grade}` : `Grade ${matchedGrade.grade}`}{" "}
              <span className="text-[17px] sm:text-xl font-normal text-[#3B4D44] tabular-nums">
                ({weightedKwhPerM2} {lang === "no" ? "vektet kWh/m²" : "weighted kWh/m²"})
              </span>
            </p>
            <p className="text-[13px] text-[#3B4D44] mt-1">
              {lang === "no"
                ? `Fra 1. jan. 2026 er fargeskalaen (oppvarmingskarakter) fjernet. Karakter B ≈ TEK17 (${tek17Ref} kWh/m² ved ${sqm} m²).`
                : `Since Jan 1, 2026, the red–green heating scale is removed. Grade B ≈ TEK17 (${tek17Ref} kWh/m² at ${sqm} m²).`}
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
          {grades.map((g) => {
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
              {lang === "no" ? "Estimert levert energi / år" : "Est. Annual Delivered Energy"}
            </dt>
            <dd className="text-[22px] font-semibold text-[#000000] tabular-nums mt-0.5">
              {annualDeliveredKwh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} kWh
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-[#3B4D44]">
              {lang === "no" ? "Estimert strøm + nettleie (~1,25 kr/kWh)" : "Est. Energy + Grid (~1.25 kr/kWh)"}
            </dt>
            <dd className="text-[22px] font-semibold text-[#000000] tabular-nums mt-0.5">
              {formatNok(annualEnergyCostNok)}
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-[#3B4D44]">
              {lang === "no" ? "Vekting i 2026-ordningen" : "2026 Weighting Rule"}
            </dt>
            <dd className="text-[16px] font-semibold text-[#000000] mt-1">
              {lang === "no" ? heatCfg.weightNoteNo : heatCfg.weightNoteEn}
            </dd>
          </div>
        </dl>

        <div
          className={`p-4 text-[15px] leading-relaxed ${
            isModern
              ? "bg-[#E6F2EC] rounded-xl text-[#0F3D2E]"
              : "bg-[#EDF0E7] rounded-none text-[#292823] border border-[#DCE2CF]"
          }`}
        >
          {qualifiesGreenMortgage
            ? lang === "no"
              ? "Sterkt salgsargument: Energimerke A og B kvalifiserer normalt kjøpere til «Grønt boliglån» med lavere rente. Har du gammel attest fra før 2026, bør du oppdatere gratis på energimerking.no."
              : "Strong selling point: Grade A & B homes typically qualify buyers for discounted Norwegian 'Green Mortgage' rates. If your certificate predates 2026, you can regenerate it free at energimerking.no."
            : lang === "no"
            ? "Tips før salg: Større ombygginger (ny fasade/bergvarme) betaler seg sjelden rett før salg. En moderne luft-til-luft varmepumpe, tetting eller å oppdatere en eldre energiattest gratis på energimerking.no (særlig ved fjernvarme/ved) gir ofte best uttelling."
            : "Pre-sale tip: Heavy retrofits rarely pay back immediately before selling. A modern air-to-air heat pump, basic sealing, or regenerating an older certificate free on energimerking.no (especially with wood or district heating) gives the best return."}
        </div>
      </div>

      {/* 2025/2026 Enova Grants & Realistic Upgrade Costs */}
      <div
        className={`p-5 sm:p-7 space-y-4 border ${
          isModern
            ? "bg-[#FFFFFF] border-[#DCE5DF] rounded-2xl"
            : "bg-[#FFFFFF] border-[#BFBFBD] rounded-none"
        }`}
      >
        <div className="space-y-1">
          <h2 className={`text-[19px] sm:text-xl font-semibold ${isModern ? "text-[#121C17]" : "text-[#000000]"}`}>
            {lang === "no"
              ? "Enova-støtte og veiledende tiltakskostnader (2025/2026)"
              : "Enova Subsidies & Realistic Upgrade Benchmarks (2025/2026)"}
          </h2>
          <p className={`text-[14px] ${isModern ? "text-[#3B4D44]" : "text-[#292823]"}`}>
            {lang === "no"
              ? pre1997Eligible
                ? "Boligen er valgt som eldre enn 1997 — etterisolering og 3-lags vinduer kan kvalifisere for Enova-støtte (opptil 25 % av kostnad)."
                : "Merk: Enova-støtte til etterisolering og vinduer/dører gjelder kun helårsboliger godkjent før 1. juli 1997. Solceller, vannbåren varmepumpe og energirådgivning (inntil 5 000 kr) har ikke dette årstallskravet."
              : pre1997Eligible
              ? "Your selected build era is pre-1997 — insulation and 3-layer windows may qualify for Enova grants (up to 25% of cost)."
              : "Note: Enova grants for windows and insulation apply only to year-round homes approved before July 1, 1997. Solar, hydronic heat pumps, and energy audits (up to 5,000 kr) remain eligible."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className={`border-b ${isModern ? "border-[#DCE5DF] text-[#0F3D2E]" : "border-[#5D726A] text-[#000000]"}`}>
                <th className="py-2.5 pr-3 font-semibold">{lang === "no" ? "Tiltak" : "Upgrade"}</th>
                <th className="py-2.5 px-3 font-semibold">{lang === "no" ? "Veiledende pris" : "Typical Cost"}</th>
                <th className="py-2.5 px-3 font-semibold">{lang === "no" ? "Enova-støtte (2026)" : "Enova Grant (2026)"}</th>
                <th className="py-2.5 pl-3 font-semibold">{lang === "no" ? "Salgsvurdering" : "Pre-Sale Note"}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isModern ? "divide-[#EDF2EF]" : "divide-[#DFDFDF]"}`}>
              {enovaBenchmarks.map((row) => (
                <tr key={row.nameNo} className={isModern ? "text-[#3B4D44]" : "text-[#292823]"}>
                  <td className="py-2.5 pr-3 font-medium text-[#000000]">
                    {lang === "no" ? row.nameNo : row.nameEn}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums whitespace-nowrap">
                    {lang === "no" ? row.costNo : row.costEn}
                  </td>
                  <td className="py-2.5 px-3 font-medium">
                    {lang === "no" ? row.enovaNo : row.enovaEn}
                  </td>
                  <td className="py-2.5 pl-3">
                    {lang === "no" ? row.tipNo : row.tipEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          className={`text-[13px] p-3 border leading-relaxed ${
            isModern
              ? "bg-[#FFF7ED] border-[#E7B59B] rounded-xl text-[#3B4D44]"
              : "bg-[#FFF7ED] border-[#BA5B3E] rounded-none text-[#292823]"
          }`}
        >
          <strong>{lang === "no" ? "Viktig Enova-krav (2025/2026):" : "Mandatory Enova Rule (2025/2026):"}</strong>{" "}
          {lang === "no"
            ? "Du må søke og få godkjent støtte FØR du bestiller varer eller starter arbeidet. Arbeidet må utføres av fagfolk, støtten begrenses til 25 % per tiltak og maksimalt 100 000 kr samlet per helårsbolig (gjelder normalt ikke hytter). Energirådgivning støttes med inntil 5 000 kr."
            : "You MUST apply and receive approval BEFORE ordering materials or starting work. Work must be done by registered contractors, capped at 25% per measure and 100,000 kr total per year-round residence (cabins generally excluded). Energy advisory grants up to 5,000 kr."}
        </p>
      </div>

      {/* Sources & Assumptions */}
      <div
        className={`p-4 sm:p-5 text-[14px] leading-relaxed space-y-1.5 border ${
          isModern
            ? "bg-[#F8FAF9] border-[#DCE5DF] rounded-xl text-[#3B4D44]"
            : "bg-[#EDF0E7] border-[#DCE2CF] rounded-none text-[#292823]"
        }`}
      >
        <p className={`font-semibold ${isModern ? "text-[#0F3D2E]" : "text-[#000000]"}`}>
          {lang === "no" ? "Kilder og forutsetninger (2026)" : "Sources & Assumptions (2026)"}
        </p>
        <p>
          {lang === "no"
            ? "Estimatet er veiledende. Offisiell energiattest utstedes gratis på energimerking.no etter ny forskrift gjeldende fra 1. januar 2026 (NS 3031:2025), der energikarakteren beregnes fra vektet levert energi (strøm 1,0; fjernvarme/bio 0,45; solceller eksport 0). Strømkostnaden er regnet med ca. 1,25 kr/kWh inkl. nettleie og avgifter (med Norgespris 50 øre/kWh inkl. mva eller strømstøtte ligger effektiv snittpris typisk rundt 1,00–1,45 kr/kWh etter prisområde)."
            : "This estimate is indicative. Official energy certificates are issued free at energimerking.no under the Jan 1, 2026 regulation (NS 3031:2025), using weighted delivered energy (electricity 1.0; district heating/bio 0.45; exported solar 0). Power cost assumes ~1.25 kr/kWh all-in incl. grid fees (with Norgespris 50 øre/kWh incl. VAT or electricity support, typical all-in rates run ~1.00–1.45 kr/kWh by price zone)."}
        </p>
        <p className="text-[13px] opacity-85">
          {lang === "no"
            ? "Kilder: Enova (enova.no / energimerking.no 2026), NVE / NS 3031:2025, DiBK (TEK17), Elhub (Norgespris 2025/2026) og Byggstart / Mittanbud."
            : "Sources: Enova (enova.no / energimerking.no 2026), NVE / NS 3031:2025, DiBK (TEK17), Elhub (Norgespris 2025/2026), and Byggstart / Mittanbud."}
        </p>
      </div>
    </ToolShell>
  );
}
