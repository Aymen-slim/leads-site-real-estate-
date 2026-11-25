"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  LAND_SIZE_OPTIONS,
  LAND_ZONE_OPTIONS,
  NORWAY_CITIES,
  formatNok,
} from "@/data/norwayData";
import { LandPlotIcon, ArrowRightIcon, CheckMarkIcon } from "@/components/Icons";

interface NorwegianZoneProfile {
  badgeNo: string;
  badgeEn: string;
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
  byaLabelNo: string;
  byaLabelEn: string;
  braFactor: number;
  byaPct: number;
  multLow: number;
  multHigh: number;
  upliftNo: string;
  upliftEn: string;
}

const ZONE_PROFILES: Record<string, NorwegianZoneProfile> = {
  villa: {
    badgeNo: "Småhusplan · 1–2 etasjer",
    badgeEn: "Small-House · 1–2 Floors",
    titleNo: "Enebolig / Småhus (typisk 18–25 % BYA)",
    titleEn: "Detached / Small-House Zone (~18–25% BYA)",
    descNo: "Standard boligtomt for enebolig eller tomannsbolig etter lokal småhusplan",
    descEn: "Standard residential plot for detached house or duplex under local small-house zoning",
    byaLabelNo: "ca. 18–24 % BYA",
    byaLabelEn: "~18–24% BYA",
    braFactor: 0.32,
    byaPct: 20,
    multLow: 0.9,
    multHigh: 1.1,
    upliftNo: "Referansenivå for vanlig boligtomt (etterspurt av privatkjøpere og småhusbyggere)",
    upliftEn: "Baseline residential plot value (strong private & small-builder demand)",
  },
  r2: {
    badgeNo: "Tett småhus · 2–3 etasjer",
    badgeEn: "Townhouses · 2–3 Floors (R+2)",
    titleNo: "Rekkehus / Flermannsbolig (2–3 etasjer · tilsv. R+2)",
    titleEn: "Townhouses / Small Multi-Unit (2–3 floors · R+2)",
    descNo: "Fortetting med rekkehus eller 3–6 boenheter der kommune-/reguleringsplan tillater det",
    descEn: "Infill townhouses or 3–6 units where municipal zoning allows denser housing",
    byaLabelNo: "ca. 28–38 % BYA",
    byaLabelEn: "~28–38% BYA",
    braFactor: 0.6,
    byaPct: 33,
    multLow: 1.15,
    multHigh: 1.35,
    upliftNo: "Høy utbyggerinteresse (indikativt +15–35 % høyere tomteverdi ved godkjent regulering)",
    upliftEn: "High developer interest (indicatively +15–35% land uplift when zoned)",
  },
  r3: {
    badgeNo: "Lavblokk · 3–4 etasjer",
    badgeEn: "Low-Rise Apts · 3–4 Floors (R+3)",
    titleNo: "Lavblokk / Leilighetsbygg (3–4 etasjer · tilsv. R+3)",
    titleEn: "Low-Rise Apartment Block (3–4 floors · R+3)",
    descNo: "Konsentrert leilighetsbygg nær kollektivknutepunkt med felles parkering og uteareal",
    descEn: "Concentrated apartment block near transit corridors with shared parking & green space",
    byaLabelNo: "ca. 35–45 % BYA",
    byaLabelEn: "~35–45% BYA",
    braFactor: 1.05,
    byaPct: 40,
    multLow: 1.35,
    multHigh: 1.6,
    upliftNo: "Sterk interesse fra boligutbyggere (indikativt +35–60 % ved ferdig regulering)",
    upliftEn: "Strong institutional builder interest (indicatively +35–60% when zoned)",
  },
  commercial: {
    badgeNo: "Kombinert · Sentrumssone",
    badgeEn: "Mixed-Use · Central Zone",
    titleNo: "Kombinert bolig og næring (sentrumsnært)",
    titleEn: "Mixed-Use Residential & Commercial",
    descNo: "Næring eller service på gateplan kombinert med leiligheter eller kontor over",
    descEn: "Ground-floor retail/service combined with upper-floor apartments or offices",
    byaLabelNo: "ca. 45–60 % BYA",
    byaLabelEn: "~45–60% BYA",
    braFactor: 1.15,
    byaPct: 50,
    multLow: 1.25,
    multHigh: 1.55,
    upliftNo: "Attraktivt for eiendomsutviklere i sentrumsnære knutepunkt (indikativt +25–55 %)",
    upliftEn: "Attractive to mixed-use developers near central hubs (indicatively +25–55%)",
  },
};

function getSubdivisionDetails(sizeId: string, zoneId: string, lang: "no" | "en") {
  const isVilla = zoneId === "villa";
  if (sizeId === "under-500") {
    return {
      visualCount: 1,
      text: lang === "no" ? "1 samlet tomt (ikke delbar)" : "1 single plot (not subdividable)",
    };
  }
  if (sizeId === "500-1000") {
    return isVilla
      ? {
          visualCount: 1,
          text: lang === "no" ? "1 tomt (ev. tomannsbolig)" : "1 plot (or duplex)",
        }
      : {
          visualCount: 2,
          text: lang === "no" ? "1–2 parseller / 2–4 enheter" : "1–2 parcels / 2–4 units",
        };
  }
  if (sizeId === "1000-2500") {
    return isVilla
      ? {
          visualCount: 2,
          text: lang === "no" ? "1–2 eneboligtomter" : "1–2 detached plots",
        }
      : {
          visualCount: 3,
          text: lang === "no" ? "2–3 parseller / rekkehus" : "2–3 parcels / townhouses",
        };
  }
  return isVilla
    ? {
        visualCount: 4,
        text: lang === "no" ? "2–4 eneboligtomter" : "2–4 detached plots",
      }
    : {
        visualCount: 5,
        text: lang === "no" ? "3–5 parseller / prosjektfelt" : "3–5 parcels / project site",
      };
}

export function ModernLandBuildability() {
  const { lang, trackClick, t } = useApp();

  const [sizeId, setSizeId] = useState<string>(LAND_SIZE_OPTIONS[1].id);
  const [zoneId, setZoneId] = useState<string>(LAND_ZONE_OPTIONS[0].id);
  const [cityId, setCityId] = useState<string>(NORWAY_CITIES[0].id);
  const [areaId, setAreaId] = useState<string>("city-avg");

  const selectedSize =
    LAND_SIZE_OPTIONS.find((s) => s.id === sizeId) || LAND_SIZE_OPTIONS[1];
  const selectedZone =
    LAND_ZONE_OPTIONS.find((z) => z.id === zoneId) || LAND_ZONE_OPTIONS[0];
  const selectedCity =
    NORWAY_CITIES.find((c) => c.id === cityId) || NORWAY_CITIES[0];

  const zoneMeta = ZONE_PROFILES[selectedZone.id] || ZONE_PROFILES.villa;

  const cityAvgLandM2 = Math.round(
    selectedCity.neighborhoods.reduce((sum, n) => sum + n.landPriceM2, 0) /
      selectedCity.neighborhoods.length
  );
  const chosenArea = selectedCity.neighborhoods.find((n) => n.id === areaId);
  const baseLandM2 = chosenArea ? chosenArea.landPriceM2 : cityAvgLandM2;

  const maxFootprintBya = Math.round((selectedSize.avgSqm * zoneMeta.byaPct) / 100);
  const maxConstructibleBra = Math.round(selectedSize.avgSqm * zoneMeta.braFactor);
  const estLow = Math.round((selectedSize.avgSqm * baseLandM2 * zoneMeta.multLow) / 50_000) * 50_000;
  const estHigh = Math.round((selectedSize.avgSqm * baseLandM2 * zoneMeta.multHigh) / 50_000) * 50_000;
  const braRatioPct = Math.min(100, Math.round((zoneMeta.braFactor / 1.25) * 100));
  const subdivision = getSubdivisionDetails(selectedSize.id, selectedZone.id, lang);

  const handleCityChange = (nextCityId: string) => {
    setCityId(nextCityId);
    setAreaId("city-avg");
  };

  return (
    <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto nm-card p-4 sm:p-10 space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center shrink-0">
            <LandPlotIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="nm-h1">{t.tools.tool3.title}</h1>
            <p className="nm-body-lg mt-2">
              {lang === "no"
                ? "Beregn veiledende delingspotensial, bebygd areal (%-BYA), utbyggbar flate (BRA) og indikativ tomteverdi etter norsk reguleringspraksis."
                : "Estimate subdivision potential, site footprint (%-BYA), buildable floor area (BRA), and indicative plot value under Norwegian municipal zoning."}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-[19px] sm:text-xl font-semibold text-[#121C17] mb-3">
            {t.tools.tool3.sizeHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LAND_SIZE_OPTIONS.map((opt) => {
              const active = opt.id === sizeId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSizeId(opt.id)}
                  aria-pressed={active}
                  className={`nm-tap-card min-h-[68px] sm:min-h-[76px] px-4 sm:px-5 py-3.5 sm:py-4 border-2 text-left font-semibold text-[18px] sm:text-xl tabular-nums flex items-center justify-between gap-2 ${
                    active
                      ? "bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                      : "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF] text-[#121C17]"
                  }`}
                >
                  <span>{lang === "no" ? opt.labelNo : opt.labelEn}</span>
                  {active && (
                    <CheckMarkIcon className="w-5 h-5 text-[#147A53] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-[19px] sm:text-xl font-semibold text-[#121C17] mb-3">
            {t.tools.tool3.zoneHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {LAND_ZONE_OPTIONS.map((zone) => {
              const active = zone.id === zoneId;
              const meta = ZONE_PROFILES[zone.id] || ZONE_PROFILES.villa;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setZoneId(zone.id)}
                  aria-pressed={active}
                  className={`nm-tap-card min-h-[96px] p-4 sm:p-5 border-2 text-left flex flex-col justify-between ${
                    active
                      ? "bg-[#E6F2EC] border-[#147A53]"
                      : "bg-[#F8FAF9] hover:bg-[#E6F2EC] border-[#DCE5DF]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#0F3D2E] text-[#FFFFFF] text-[12px] sm:text-[13px] font-semibold">
                      {lang === "no" ? meta.badgeNo : meta.badgeEn}
                    </span>
                    {active && (
                      <CheckMarkIcon className="w-5 h-5 text-[#147A53]" />
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="block text-[18px] sm:text-[19px] font-semibold text-[#121C17]">
                      {lang === "no" ? meta.titleNo : meta.titleEn}
                    </span>
                    <span className="block text-[14px] sm:text-[15px] text-[#3B4D44] mt-1">
                      {lang === "no" ? meta.descNo : meta.descEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="land-city-select"
              className="block text-[17px] sm:text-lg font-semibold text-[#121C17] mb-2"
            >
              {t.tools.tool3.cityHeading}
            </label>
            <select
              id="land-city-select"
              value={cityId}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[64px] px-4 py-3 text-[18px] sm:text-xl font-semibold bg-[#FFFFFF] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17] cursor-pointer"
            >
              {NORWAY_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="land-area-select"
              className="block text-[17px] sm:text-lg font-semibold text-[#121C17] mb-2"
            >
              {lang === "no" ? "4. Bydel / prisnivå (valgfritt)" : "4. District Price Level (Optional)"}
            </label>
            <select
              id="land-area-select"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[64px] px-4 py-3 text-[18px] sm:text-xl font-semibold bg-[#FFFFFF] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17] cursor-pointer"
            >
              <option value="city-avg">
                {lang === "no"
                  ? `Hele ${selectedCity.name} (snitt · ${formatNok(cityAvgLandM2)}/m²)`
                  : `All of ${selectedCity.name} (avg. · ${formatNok(cityAvgLandM2)}/m²)`}
              </option>
              {selectedCity.neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} ({formatNok(n.landPriceM2)}/m²)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Subdivision Parcel Blocks + BYA/BRA Output */}
        <div className="bg-[#E6F2EC] border border-[#9EB6AA] rounded-2xl p-4 sm:p-8 space-y-6">
          <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px] font-semibold text-[#0F3D2E]">
                {lang === "no"
                  ? "Illustrativ tomteinndeling og utnyttelsesgrad"
                  : "Illustrative Plot Subdivision & Density Meter"}
              </span>
              <span className="text-[14px] font-semibold text-[#147A53] tabular-nums">
                {subdivision.text}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
              {Array.from({ length: subdivision.visualCount }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-[#E6F2EC] border-2 border-dashed border-[#147A53] flex items-center justify-center text-[14px] font-semibold text-[#0F3D2E]"
                >
                  {lang === "no" ? `Parsell ${i + 1}` : `Plot ${i + 1}`}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap justify-between gap-2 text-[13px] font-medium text-[#3B4D44] mb-1">
                <span>
                  {lang === "no"
                    ? `Fotavtrykk (${zoneMeta.byaLabelNo}): ~${maxFootprintBya} m² BYA`
                    : `Footprint (${zoneMeta.byaLabelEn}): ~${maxFootprintBya} m² BYA`}
                </span>
                <span className="tabular-nums font-semibold text-[#0F3D2E]">
                  {lang === "no" ? "Samlet utbygging:" : "Total BRA:"} ~{maxConstructibleBra} m² BRA
                </span>
              </div>
              <div className="h-2.5 w-full bg-[#F1F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#147A53] rounded-full transition-all duration-300"
                  style={{ width: `${braRatioPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF]">
              <span className="block text-[14px] font-medium text-[#3B4D44]">
                {t.tools.tool3.plotsResultLabel}
              </span>
              <span className="block text-[21px] sm:text-[24px] font-semibold text-[#121C17] tabular-nums mt-2 leading-snug">
                {subdivision.text}
              </span>
              <span className="block text-[13px] text-[#3B4D44] mt-1">
                {lang === "no"
                  ? `Beregnet på ca. ${selectedSize.avgSqm} m² tomt`
                  : `Based on ~${selectedSize.avgSqm} m² plot`}
              </span>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF]">
              <span className="block text-[14px] font-medium text-[#3B4D44]">
                {lang === "no" ? "Veiledende utbygging (BRA)" : "Indicative Floor Area (BRA)"}
              </span>
              <span className="block text-[24px] sm:text-3xl font-semibold text-[#121C17] tabular-nums mt-2">
                ~{maxConstructibleBra} m² BRA
              </span>
              <span className="block text-[13px] text-[#3B4D44] mt-1 tabular-nums">
                {lang === "no"
                  ? `ca. ${maxFootprintBya} m² bebygd areal (BYA)`
                  : `~${maxFootprintBya} m² footprint (BYA)`}
              </span>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl p-4 sm:p-5 border border-[#DCE5DF]">
              <span className="block text-[14px] font-medium text-[#3B4D44]">
                {lang === "no" ? "Indikativt tomteverdi-spenn" : "Indicative Plot Value Range"}
              </span>
              <span className="block text-[19px] sm:text-[22px] font-semibold text-[#147A53] tabular-nums mt-2 leading-snug">
                {formatNok(estLow)} – {formatNok(estHigh)}
              </span>
              <span className="block text-[13px] text-[#3B4D44] mt-1">
                {lang === "no"
                  ? "Før infrastruktur, riving og 22 % tomteskatt"
                  : "Before utilities, demolition & 22% land tax"}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#C3DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[15px] font-medium text-[#3B4D44]">
              {t.tools.tool3.demandBannerLabel}:
            </span>
            <span className="text-[16px] sm:text-[18px] font-semibold text-[#0F3D2E]">
              {lang === "no" ? zoneMeta.upliftNo : zoneMeta.upliftEn}
            </span>
          </div>
        </div>

        {/* Norwegian Zoning & Tax Explainer + Sources */}
        <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-xl p-4 sm:p-5 text-[14px] text-[#3B4D44] leading-relaxed space-y-2">
          <p className="font-semibold text-[#0F3D2E]">
            {lang === "no"
              ? "Norske reguleringsbegreper, skatt og kilder (2025/2026)"
              : "Norwegian Zoning Terms, Tax & Sources (2025/2026)"}
          </p>
          <p>
            {lang === "no"
              ? "%-BYA er bebygd fotavtrykk på terreng (inkl. biloppstilling på mark), mens BRA er samlet bruksareal over alle etasjer. Mange kommuner krever 600–800 m² per fradelt eneboligtomt (og Oslos reviderte småhusplan legger opp til 18 % BYA og min. 60 % grøntareal, samt egne naturfare-soner). Salg av ubebygd fradelt tomt utløser som hovedregel 22 % gevinstskatt — sammenlign alltid mot skattefritt salg av hele boligeiendommen."
              : "%-BYA measures ground footprint (including surface parking), while BRA is total usable floor area across all floors. Most municipalities require 600–800 m² per detached plot (Oslo's revised Småhusplan targets 18% BYA and 60% green space). Selling an unbuilt subdivided plot normally triggers 22% capital gains tax — always compare against selling the entire home tax-free."}
          </p>
          <p className="text-[13px] opacity-85">
            {lang === "no"
              ? "Kilder: Plan- og bygningsloven (PBL), kommunale småhusplaner / reguleringsplaner (bl.a. Oslo PBE 2025/2026), Skatteloven § 9-3 og veiledende tomteprisestimater."
              : "Sources: Norwegian Planning & Building Act (PBL), municipal small-house zoning plans (incl. Oslo PBE 2025/2026), Tax Act § 9-3, and indicative land benchmarks."}
          </p>
        </div>

        <Link
          href={`/koble-til-megler?source=land&type=land&size=${
            selectedSize.avgSqm > 500 ? "over-500" : "300-500"
          }&zone=${selectedZone.id}&city=${selectedCity.id}`}
          onClick={() => trackClick("land")}
          className="nm-btn-primary w-full min-h-[72px] sm:min-h-[82px] px-5 sm:px-7 py-4 sm:py-5 text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool3.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
