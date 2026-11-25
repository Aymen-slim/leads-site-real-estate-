"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { NORWAY_CITIES, formatNok } from "@/data/norwayData";
import {
  HouseIcon,
  LandPlotIcon,
  ArrowRightIcon,
  ScaleMeasureIcon,
} from "@/components/Icons";
import { ModernPricePerM2 } from "@/components/modern/ModernPricePerM2";
import { ToolSeoGuide } from "@/components/ToolSeoGuide";

export function PricePerM2Tool({
  initialCityId,
  initialAreaId,
}: {
  initialCityId?: string;
  initialAreaId?: string;
} = {}) {
  const { lang, isModern } = useApp();

  const activeCity =
    NORWAY_CITIES.find((c) => c.id === initialCityId) || NORWAY_CITIES[0];

  const localDirectory = (
    <section
      aria-label={
        lang === "no"
          ? "Lokale boligpriser per by og bydel"
          : "Local Prices by City & Neighborhood"
      }
      className="max-w-5xl mx-auto mt-6"
    >
      <div
        className={`p-5 sm:p-7 space-y-4 ${
          isModern
            ? "nm-card"
            : "bg-[#EDF0E7] border border-[#DCE2CF] rounded-none"
        }`}
      >
        <h2 className={isModern ? "nm-h3" : "kr-h3"}>
          {lang === "no"
            ? "Utforsk veiledende m²-priser per norsk by og bydel"
            : "Explore Indicative Price per m² Pages Across Norway"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {NORWAY_CITIES.map((c) => (
            <Link
              key={c.id}
              href={`/boligpris/${c.id}`}
              className={`px-3.5 py-1.5 text-[14px] font-semibold border transition-colors ${
                c.id === activeCity.id && initialCityId
                  ? isModern
                    ? "rounded-full bg-[#147A53] border-[#147A53] text-[#FFFFFF]"
                    : "rounded-none bg-[#5D726A] border-[#5D726A] text-[#FFFFFF]"
                  : isModern
                  ? "rounded-full bg-[#F8FAF9] border-[#DCE5DF] hover:border-[#147A53] text-[#121C17]"
                  : "rounded-none bg-[#FFFFFF] border-[#BFBFBD] hover:border-[#5D726A] text-[#000000]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {activeCity.neighborhoods.map((n) => (
            <Link
              key={n.id}
              href={`/boligpris/${activeCity.id}/${n.id}`}
              className={`px-3 py-1 text-[13px] font-medium border transition-colors ${
                n.id === initialAreaId
                  ? isModern
                    ? "rounded-full bg-[#E6F2EC] border-[#147A53] text-[#0F3D2E]"
                    : "rounded-none bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                  : isModern
                  ? "rounded-full bg-[#FFFFFF] border-[#DCE5DF] hover:bg-[#E6F2EC] text-[#3B4D44]"
                  : "rounded-none bg-[#FFFFFF] border-[#DFDFDF] hover:border-[#5D726A] text-[#292823]"
              }`}
            >
              {n.name} ({formatNok(n.housePriceM2)}/m²)
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  if (isModern) {
    return (
      <div className="bg-[#F8FAF9] pb-12">
        <ModernPricePerM2
          initialCityId={initialCityId}
          initialAreaId={initialAreaId}
        />
        <div className="px-3 sm:px-6">
          {localDirectory}
          <ToolSeoGuide slug="price-per-m2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] pb-12">
      <ClassicPricePerM2
        initialCityId={initialCityId}
        initialAreaId={initialAreaId}
      />
      <div className="px-4 sm:px-6">
        {localDirectory}
        <ToolSeoGuide slug="price-per-m2" />
      </div>
    </div>
  );
}

function ClassicPricePerM2({
  initialCityId,
  initialAreaId,
}: {
  initialCityId?: string;
  initialAreaId?: string;
}) {
  const { lang, trackClick, t } = useApp();

  const defaultCity =
    NORWAY_CITIES.find((c) => c.id === initialCityId) || NORWAY_CITIES[0];
  const defaultArea =
    defaultCity.neighborhoods.find((n) => n.id === initialAreaId) ||
    defaultCity.neighborhoods[0];

  const [cityId, setCityId] = useState<string>(defaultCity.id);
  const currentCity =
    NORWAY_CITIES.find((c) => c.id === cityId) || NORWAY_CITIES[0];

  const [areaId, setAreaId] = useState<string>(defaultArea.id);
  const currentArea =
    currentCity.neighborhoods.find((n) => n.id === areaId) ||
    currentCity.neighborhoods[0];

  const handleCityChange = (nextCityId: string) => {
    setCityId(nextCityId);
    const found = NORWAY_CITIES.find((c) => c.id === nextCityId);
    if (found && found.neighborhoods.length > 0) {
      setAreaId(found.neighborhoods[0].id);
    }
  };

  const heading = initialAreaId
    ? lang === "no"
      ? `Boligpris i ${currentArea.name} (${currentCity.name}) — Pris per m²`
      : `Price per m² in ${currentArea.name} (${currentCity.name})`
    : initialCityId
    ? lang === "no"
      ? `Boligpris i ${currentCity.name} — Pris per m² etter bydel`
      : `Price per m² in ${currentCity.name} by Neighborhood`
    : t.tools.tool1.title;

  const houseRangeLow = Math.round((currentArea.housePriceM2 * 0.85) / 500) * 500;
  const houseRangeHigh = Math.round((currentArea.housePriceM2 * 1.15) / 500) * 500;
  const growthPrefix = currentArea.yoyGrowthPct >= 0 ? "+" : "";
  const formattedGrowth =
    lang === "no"
      ? `${growthPrefix}${currentArea.yoyGrowthPct.toFixed(1).replace(".", ",")} %`
      : `${growthPrefix}${currentArea.yoyGrowthPct.toFixed(1)}%`;

  return (
    <main className="bg-[#FFFFFF] pt-10 px-4 sm:pt-14 sm:px-6 lg:pt-16">
      <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-12">
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
            <ScaleMeasureIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="kr-h1">{heading}</h1>
            <p className="kr-body-lg mt-2">{t.tools.tool1.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-[#EDF0E7] border border-[#BFBFBD] rounded-none p-4 sm:p-6 mb-6 sm:mb-8">
          <div>
            <label
              htmlFor="calc1-city"
              className="block text-[18px] sm:text-xl font-medium text-[#000000] mb-2"
            >
              {t.tools.tool1.selectCity}
            </label>
            <select
              id="calc1-city"
              value={cityId}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[68px] px-4 py-3 text-[19px] sm:text-2xl font-medium bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none text-[#000000] cursor-pointer"
            >
              {NORWAY_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="calc1-area"
              className="block text-[18px] sm:text-xl font-medium text-[#000000] mb-2"
            >
              {t.tools.tool1.selectNeighborhood}
            </label>
            <select
              id="calc1-area"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[68px] px-4 py-3 text-[19px] sm:text-2xl font-medium bg-[#FFFFFF] border-2 border-[#5D726A] rounded-none text-[#000000] cursor-pointer"
            >
              {currentCity.neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-[#DCE2CF] border-2 border-[#5D726A] rounded-none p-5 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-[#000000] font-medium text-[18px] sm:text-xl">
                <HouseIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#5D726A] shrink-0" />
                <h2>{t.tools.tool1.houseCardTitle}</h2>
              </div>
              <div className="text-[30px] sm:text-[42px] font-medium text-[#000000] tabular-nums mt-3 sm:mt-4 whitespace-nowrap">
                {formatNok(currentArea.housePriceM2)}
                <span className="text-[17px] sm:text-xl font-normal text-[#292823]">
                  {" "}
                  / m² BRA-i
                </span>
              </div>
              <p className="text-[14px] font-medium text-[#292823] mt-1">
                {lang === "no"
                  ? `Typisk bydelsspenn (±15 %): ${formatNok(houseRangeLow)} – ${formatNok(houseRangeHigh)} / m²`
                  : `Typical district spread (±15%): ${formatNok(houseRangeLow)} – ${formatNok(houseRangeHigh)} / m²`}
              </p>
            </div>
            <p className="text-[15px] font-normal text-[#292823] mt-3 pt-3 border-t border-[#949391]/50 leading-relaxed">
              {lang === "no"
                ? "Gjelder per m² innvendig bruksareal (BRA-i) inkl. bygning og tomt. Merk at leiligheter ofte har høyere m²-pris enn store eneboliger i samme bydel."
                : "Measured per m² interior living area (BRA-i), including building and land. Note that apartments typically trade at a higher kr/m² than large detached houses in the same district."}
            </p>
          </div>

          <div className="bg-[#EDF0E7] border-2 border-[#BFBFBD] rounded-none p-5 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-[#000000] font-medium text-[18px] sm:text-xl">
                <LandPlotIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#5D726A] shrink-0" />
                <h2>{t.tools.tool1.landCardTitle}</h2>
              </div>
              <div className="text-[30px] sm:text-[42px] font-medium text-[#000000] tabular-nums mt-3 sm:mt-4 whitespace-nowrap">
                {formatNok(currentArea.landPriceM2)}
                <span className="text-[17px] sm:text-xl font-normal text-[#292823]">
                  {" "}
                  / {lang === "no" ? "m² tomt" : "m² plot"}
                </span>
              </div>
              <p className="text-[14px] font-medium text-[#292823] mt-1">
                {lang === "no"
                  ? "Målt per m² grunnflate (tomteareal) — ikke boligareal"
                  : "Measured per m² plot ground area — not floor area"}
              </p>
            </div>
            <p className="text-[15px] font-normal text-[#292823] mt-3 pt-3 border-t border-[#BFBFBD] leading-relaxed">
              {lang === "no"
                ? "Veiledende estimat for regulert boligtomt. Faktisk tomtepris varierer sterkt med utnyttelsesgrad (%-BYA), grunnforhold og vei/vann/avløp."
                : "Indicative estimate for zoned residential land. Actual plot value depends heavily on permitted density (%-BYA), terrain, and road/water/sewer hookups."}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F7F7F7] border border-[#DFDFDF] rounded-none p-4 sm:p-5 mb-6">
          <div>
            <dt className="text-base font-medium text-[#292823]">
              {t.tools.tool1.daysLabel}
            </dt>
            <dd className="text-2xl font-medium text-[#000000] tabular-nums mt-1">
              {currentArea.avgDaysToSell} {t.tools.tool1.daysUnit}
            </dd>
          </div>
          <div>
            <dt className="text-base font-medium text-[#292823]">
              {t.tools.tool1.growthLabel}
            </dt>
            <dd className="text-2xl font-medium text-[#5D726A] tabular-nums mt-1">
              {formattedGrowth}
            </dd>
          </div>
          <div>
            <dt className="text-base font-medium text-[#292823]">
              {t.tools.tool1.demandLabel}
            </dt>
            <dd className="text-2xl font-medium text-[#000000] tabular-nums mt-1">
              {currentArea.buyerDemandScore} / 100
            </dd>
          </div>
        </dl>

        {/* Transparent Sources & Assumptions */}
        <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-4 sm:p-5 mb-6 sm:mb-8 text-[14px] text-[#292823] leading-relaxed space-y-1.5">
          <p className="font-semibold text-[#000000]">
            {lang === "no"
              ? "Kilder og forutsetninger (veiledende 2025/2026-referanse)"
              : "Sources & Assumptions (Indicative 2025/2026 Reference)"}
          </p>
          <p>
            {lang === "no"
              ? "Tallene er veiledende bydelsgjennomsnitt kalibrert mot SSB boligprisstatistikk (tabell 14310), Eiendom Norge og tinglyste salg hos Kartverket — ikke sanntidspriser for enkelteiendommer. Det finnes ingen offisiell m²-indeks kun for råtomter; tomtepris per m² er markedsestimater som varierer med regulering og infrastruktur. Enkeltboliger avviker normalt 15–25 % fra bydelssnittet basert på boligtype, solforhold, utsikt og teknisk tilstand."
              : "Figures are indicative district averages calibrated against SSB housing statistics (Table 14310), Eiendom Norge, and Kartverket registered sales — not live street-level quotes. Official land-only m² statistics do not exist; plot prices per m² are market benchmarks that vary with zoning and utility costs. Individual homes commonly sell 15–25% above or below the district average depending on home type, sun, views, and condition."}
          </p>
        </div>

        <Link
          href={`/koble-til-megler?source=price-m2&city=${currentCity.id}&area=${currentArea.id}`}
          onClick={() => trackClick("price-m2")}
          className="kr-btn-primary w-full min-h-[72px] sm:min-h-[84px] px-5 sm:px-7 py-4 sm:py-5 border-2 border-[#5D726A] text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool1.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
