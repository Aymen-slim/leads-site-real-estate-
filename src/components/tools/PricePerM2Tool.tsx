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
      aria-label={lang === "no" ? "Lokale boligpriser per by og bydel" : "Local Prices by City & Neighborhood"}
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
            ? "Utforsk oppdaterte m²-priser per norsk by og bydel"
            : "Explore Local Price per m² Pages Across Norway"}
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
          <div className="bg-[#DCE2CF] border-2 border-[#5D726A] rounded-none p-5 sm:p-8">
            <div className="flex items-center gap-3 text-[#000000] font-medium text-[18px] sm:text-xl">
              <HouseIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#5D726A] shrink-0" />
              <h2>{t.tools.tool1.houseCardTitle}</h2>
            </div>
            <div className="text-[30px] sm:text-[42px] font-medium text-[#000000] tabular-nums mt-3 sm:mt-4 whitespace-nowrap">
              {formatNok(currentArea.housePriceM2)}
              <span className="text-[18px] sm:text-2xl font-normal text-[#292823]"> / m²</span>
            </div>
            <p className="text-base font-normal text-[#292823] mt-2 sm:mt-3">
              {t.tools.tool1.houseCardNote}
            </p>
          </div>

          <div className="bg-[#EDF0E7] border-2 border-[#BFBFBD] rounded-none p-5 sm:p-8">
            <div className="flex items-center gap-3 text-[#000000] font-medium text-[18px] sm:text-xl">
              <LandPlotIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#5D726A] shrink-0" />
              <h2>{t.tools.tool1.landCardTitle}</h2>
            </div>
            <div className="text-[30px] sm:text-[42px] font-medium text-[#000000] tabular-nums mt-3 sm:mt-4 whitespace-nowrap">
              {formatNok(currentArea.landPriceM2)}
              <span className="text-[18px] sm:text-2xl font-normal text-[#292823]"> / m²</span>
            </div>
            <p className="text-base font-normal text-[#292823] mt-2 sm:mt-3">
              {t.tools.tool1.landCardNote}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F7F7F7] border border-[#DFDFDF] rounded-none p-4 sm:p-5 mb-6 sm:mb-8">
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
              +{currentArea.yoyGrowthPct}%
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

        <Link
          href={`/connect-agency?source=price-m2&city=${currentCity.id}&area=${currentArea.id}`}
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
