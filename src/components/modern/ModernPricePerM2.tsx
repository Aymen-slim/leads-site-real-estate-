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

export function ModernPricePerM2({
  initialCityId,
  initialAreaId,
}: {
  initialCityId?: string;
  initialAreaId?: string;
} = {}) {
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

  const maxBenchmark = 130000;
  const housePct = Math.min(
    100,
    Math.round((currentArea.housePriceM2 / maxBenchmark) * 100)
  );
  const landPct = Math.min(
    100,
    Math.round((currentArea.landPriceM2 / maxBenchmark) * 100)
  );
  const houseVsLandRatio = (
    currentArea.housePriceM2 / currentArea.landPriceM2
  ).toFixed(1);

  return (
    <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto nm-card p-4 sm:p-10 space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center shrink-0">
            <ScaleMeasureIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="nm-h1">{t.tools.tool1.title}</h1>
            <p className="nm-body-lg mt-2">{t.tools.tool1.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-6">
          <div>
            <label
              htmlFor="calc1-city"
              className="block text-[17px] sm:text-lg font-semibold text-[#121C17] mb-2"
            >
              {t.tools.tool1.selectCity}
            </label>
            <select
              id="calc1-city"
              value={cityId}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[66px] px-4 py-3 text-[19px] sm:text-xl font-semibold bg-[#FFFFFF] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17] cursor-pointer"
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
              className="block text-[17px] sm:text-lg font-semibold text-[#121C17] mb-2"
            >
              {t.tools.tool1.selectNeighborhood}
            </label>
            <select
              id="calc1-area"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[66px] px-4 py-3 text-[19px] sm:text-xl font-semibold bg-[#FFFFFF] border-2 border-[#9EB6AA] focus:border-[#147A53] rounded-xl text-[#121C17] cursor-pointer"
            >
              {currentCity.neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Price Comparison Bars + Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#E6F2EC] border border-[#9EB6AA] rounded-2xl p-5 sm:p-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 text-[#0F3D2E] font-semibold text-[18px] sm:text-xl">
                <HouseIcon className="w-6 h-6 text-[#147A53] shrink-0" />
                <h2>{t.tools.tool1.houseCardTitle}</h2>
              </div>
              <div className="text-[32px] sm:text-[42px] font-semibold text-[#121C17] tabular-nums mt-3 whitespace-nowrap">
                {formatNok(currentArea.housePriceM2)}
                <span className="text-[18px] sm:text-xl font-normal text-[#3B4D44]"> / m²</span>
              </div>
              <p className="text-[15px] text-[#3B4D44] mt-2">
                {t.tools.tool1.houseCardNote}
              </p>
            </div>
            <div>
              <div className="h-3 w-full bg-[#FFFFFF] rounded-full overflow-hidden border border-[#C3DEC9]">
                <div
                  className="h-full bg-[#147A53] rounded-full transition-all duration-300"
                  style={{ width: `${housePct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-5 sm:p-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 text-[#0F3D2E] font-semibold text-[18px] sm:text-xl">
                <LandPlotIcon className="w-6 h-6 text-[#0F3D2E] shrink-0" />
                <h2>{t.tools.tool1.landCardTitle}</h2>
              </div>
              <div className="text-[32px] sm:text-[42px] font-semibold text-[#121C17] tabular-nums mt-3 whitespace-nowrap">
                {formatNok(currentArea.landPriceM2)}
                <span className="text-[18px] sm:text-xl font-normal text-[#3B4D44]"> / m²</span>
              </div>
              <p className="text-[15px] text-[#3B4D44] mt-2">
                {t.tools.tool1.landCardNote}
              </p>
            </div>
            <div>
              <div className="h-3 w-full bg-[#DCE5DF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F3D2E] rounded-full transition-all duration-300"
                  style={{ width: `${landPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Market Spread & Demand Visual Gauge */}
        <dl className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#F8FAF9] border border-[#DCE5DF] rounded-2xl p-4 sm:p-5">
          <div>
            <dt className="text-[14px] font-medium text-[#3B4D44]">
              {t.tools.tool1.daysLabel}
            </dt>
            <dd className="text-2xl font-semibold text-[#121C17] tabular-nums mt-1">
              {currentArea.avgDaysToSell} {t.tools.tool1.daysUnit}
            </dd>
          </div>
          <div>
            <dt className="text-[14px] font-medium text-[#3B4D44]">
              {t.tools.tool1.growthLabel}
            </dt>
            <dd className="text-2xl font-semibold text-[#147A53] tabular-nums mt-1">
              +{currentArea.yoyGrowthPct}%
            </dd>
          </div>
          <div>
            <dt className="text-[14px] font-medium text-[#3B4D44]">
              {lang === "no" ? "Bolig vs. Tomt forhold" : "House / Land Ratio"}
            </dt>
            <dd className="text-2xl font-semibold text-[#121C17] tabular-nums mt-1">
              {houseVsLandRatio}×
            </dd>
          </div>
          <div>
            <dt className="text-[14px] font-medium text-[#3B4D44]">
              {t.tools.tool1.demandLabel}
            </dt>
            <dd className="mt-1 space-y-1.5">
              <span className="block text-2xl font-semibold text-[#0F3D2E] tabular-nums">
                {currentArea.buyerDemandScore} / 100
              </span>
              <div className="h-2 w-full bg-[#DCE5DF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#147A53] rounded-full transition-all duration-300"
                  style={{ width: `${currentArea.buyerDemandScore}%` }}
                />
              </div>
            </dd>
          </div>
        </dl>

        <Link
          href={`/koble-til-megler?source=price-m2&city=${currentCity.id}&area=${currentArea.id}`}
          onClick={() => trackClick("price-m2")}
          className="nm-btn-primary w-full min-h-[72px] sm:min-h-[82px] px-5 sm:px-7 py-4 sm:py-5 text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{t.tools.tool1.ctaButton}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
