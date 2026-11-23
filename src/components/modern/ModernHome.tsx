"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { NORWAY_CITIES, formatNok } from "@/data/norwayData";
import {
  HouseIcon,
  LandPlotIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  ScaleMeasureIcon,
  CheckMarkIcon,
  ShieldCheckIcon,
  LocationCrosshairIcon,
} from "@/components/Icons";
import { ModernHousePriceGrowthCalculator } from "@/components/modern/ModernHousePriceGrowthCalculator";

// Modern NordHjem Landing Page (Home A layout only — Modern Home B is intentionally omitted).
export function ModernHome() {
  const { lang, trackClick, t } = useApp();

  const [selectedCityId, setSelectedCityId] = useState<string>(NORWAY_CITIES[0].id);
  const currentCity =
    NORWAY_CITIES.find((c) => c.id === selectedCityId) || NORWAY_CITIES[0];
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    currentCity.neighborhoods[0].id
  );

  const currentArea =
    currentCity.neighborhoods.find((n) => n.id === selectedAreaId) ||
    currentCity.neighborhoods[0];

  const handleCityChange = (newCityId: string) => {
    setSelectedCityId(newCityId);
    const found = NORWAY_CITIES.find((c) => c.id === newCityId);
    if (found && found.neighborhoods.length > 0) {
      setSelectedAreaId(found.neighborhoods[0].id);
    }
  };

  const sampleAdShowcases = [
    {
      id: "ad-villa",
      image: "/images/ad-villa-oslo.jpg",
      alt:
        lang === "no"
          ? "Eksempelannonse: Moderne enebolig i Oslo og Bærum med hage"
          : "Sample Ad: Modern Scandinavian detached villa in Oslo and Bærum with garden",
      title:
        lang === "no"
          ? "Enebolig med hjørnetomt"
          : "Detached Family Villa with Corner Plot",
      specs:
        lang === "no"
          ? "Oslo / Bærum · ca. 210 m² · Garasje"
          : "Oslo / Bærum · Approx. 210 m² · Garage",
      metricValue: "108 200 kr / m²",
      href: "/koble-til-megler?source=ad-villa&type=house",
    },
    {
      id: "ad-land",
      image: "/images/ad-land-plot.jpg",
      alt:
        lang === "no"
          ? "Eksempelannonse: Solrik byggeklar tomt med fjordutsikt i Norge"
          : "Sample Ad: Sunlit constructible plot of land overlooking Norwegian fjord",
      title:
        lang === "no"
          ? "Utbyggbar boligtomt (R+2)"
          : "Subdividable Residential Plot (R+2)",
      specs:
        lang === "no"
          ? "Stavanger / Bergen · 1 450 m² · Byggeklar"
          : "Stavanger / Bergen · 1,450 m² · Buildable",
      metricValue: "+38 % mot snitt",
      href: "/koble-til-megler?source=ad-land&type=land",
    },
    {
      id: "ad-family",
      image: "/images/ad-family-home.jpg",
      alt:
        lang === "no"
          ? "Eksempelannonse: Eldre norsk familiebolig i rolig boliggate"
          : "Sample Ad: Classic Norwegian timber family house on quiet residential street",
      title:
        lang === "no"
          ? "Eldre enebolig — selg som den er"
          : "Older Family House — Sold As-Is",
      specs:
        lang === "no"
          ? "Trondheim / Drammen · Uten oppussing"
          : "Trondheim / Drammen · No renovation",
      metricValue: "390 000 – 830 000 kr",
      href: "/koble-til-megler?source=ad-family&type=house",
    },
  ];

  const recipeHighlights =
    lang === "no"
      ? ["Nøyaktige lokale tall", "Rådgivning uten forpliktelser", "Treff seriøse kjøpere"]
      : ["Accurate local data", "Expert support", "Reach serious buyers"];

  return (
    <main className="bg-[#F4F5F0]">
      {/* 1. ARCHITECTURAL MODERN HERO */}
      <section className="relative overflow-hidden bg-[#F4F5F0] border-b border-[#DCE2D4]">
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[62%]">
          <Image
            src="/images/ad-villa-oslo.jpg"
            alt={
              lang === "no"
                ? "Moderne norsk enebolig i dagslys"
                : "Modern Norwegian detached villa in daylight"
            }
            fill
            priority
            sizes="65vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#F4F5F0] via-[#F4F5F0]/65 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#F4F5F0]/40 via-transparent to-[#F4F5F0]/35"
            aria-hidden="true"
          />
        </div>

        <svg
          viewBox="0 0 1440 460"
          fill="none"
          className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full opacity-55"
          aria-hidden="true"
        >
          <path d="M 520 -40 Q 740 220 500 500" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M 610 -40 Q 830 230 590 500"
            stroke="#FFFFFF"
            strokeWidth="1.25"
            opacity="0.65"
          />
        </svg>

        <div className="nm-container relative z-10 py-10 sm:py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7ECE0] border border-[#D4DCCB] text-[#243323] text-[14px] font-medium">
                <TrendingUpIcon className="w-4 h-4 text-[#243323]" />
                <span>{lang === "no" ? "Eiendomsverdi & Salg" : "Property Valuation"}</span>
              </div>

              <h1 className="nm-display text-[#1D281C] text-[40px] sm:text-[52px] lg:text-[62px]">
                {t.landing.variantA.title}
              </h1>

              <p className="text-[17px] sm:text-[19px] leading-relaxed text-[#495647] max-w-lg">
                {t.landing.variantA.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  href={`/koble-til-megler?source=hero-a&city=${currentCity.id}&area=${currentArea.id}`}
                  onClick={() => trackClick("hero-a")}
                  className="nm-btn-primary w-full sm:w-auto"
                >
                  <span>{t.landing.variantA.primaryCta}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link href="#neighborhood-lookup" className="nm-btn-secondary w-full sm:w-auto">
                  <span>{lang === "no" ? "Sjekk lokale priser" : "Check Local Prices"}</span>
                </Link>
              </div>
            </div>

            <div className="lg:hidden relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#DCE2D4] shadow-sm">
              <Image
                src="/images/ad-villa-oslo.jpg"
                alt={
                  lang === "no"
                    ? "Moderne norsk enebolig i dagslys"
                    : "Modern Norwegian detached villa in daylight"
                }
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOUSE PRICE GROWTH CALCULATOR */}
      <ModernHousePriceGrowthCalculator />

      {/* 3. EDITORIAL FJORD RECIPE BANNER */}
      <section className="py-6 sm:py-8">
        <div className="nm-container">
          <div className="relative bg-[#FFFFFF] border border-[#DCE2D4] rounded-2xl overflow-hidden shadow-sm">
            <div className="hidden lg:block absolute inset-y-0 right-0 w-[64%]">
              <Image
                src="/images/ad-land-plot.jpg"
                alt={
                  lang === "no"
                    ? "Solrik norsk eiendom og tomt med fjordutsikt"
                    : "Sunlit Norwegian property and plot overlooking fjord"
                }
                fill
                sizes="64vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <h2 className="nm-h2 text-[32px] sm:text-[40px] leading-[1.12] text-[#1D281C]">
                  {t.landing.ergonomicsTitle}
                </h2>
                <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#495647] max-w-md">
                  {t.landing.ergonomicsDesc}
                </p>
                <div className="pt-2">
                  <Link
                    href="/koble-til-megler?source=recipe-banner"
                    onClick={() => trackClick("recipe-banner")}
                    className="nm-btn-secondary w-full sm:w-auto"
                  >
                    <span>{lang === "no" ? "Les mer" : "Learn more"}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 flex lg:justify-end">
                <div className="w-full max-w-sm rounded-2xl bg-[#1D281C]/80 backdrop-blur-md text-[#FFFFFF] border border-[#FFFFFF]/15 p-5 sm:p-6 space-y-3.5 shadow-lg">
                  {recipeHighlights.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FFFFFF] text-[#1D281C] flex items-center justify-center shrink-0">
                        <CheckMarkIcon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[16px] font-medium text-[#FFFFFF]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SAGE PROPERTY VALUE LOOKUP BAND */}
      <section id="neighborhood-lookup" className="py-6 sm:py-8">
        <div className="nm-container">
          <div className="relative bg-[#E5EBE0] border border-[#D4DCCB] rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
            <div
              className="hidden lg:flex pointer-events-none absolute inset-y-0 right-0 w-[260px] items-center justify-center opacity-45"
              aria-hidden="true"
            >
              <svg viewBox="0 0 260 280" fill="none" className="w-full h-full">
                <path
                  d="M 10 40 L 250 110 M 20 120 L 240 60 M 30 200 L 250 170 M 80 10 L 60 270 M 165 10 L 145 270"
                  stroke="#BCC7B3"
                  strokeWidth="1.5"
                />
                <path
                  d="M 0 240 Q 130 200 260 250"
                  stroke="#BCC7B3"
                  strokeWidth="6"
                  opacity="0.5"
                />
              </svg>
              <span className="absolute w-11 h-11 rounded-full bg-[#FFFFFF]/80 border border-[#C4CEBA] flex items-center justify-center shadow-sm">
                <LocationCrosshairIcon className="w-5 h-5 text-[#243323]" />
              </span>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              <div className="lg:col-span-4 flex items-start gap-4">
                <span className="w-12 h-12 rounded-xl bg-[#D9E1D2] border border-[#C4CEBA] text-[#243323] flex items-center justify-center shrink-0">
                  <ScaleMeasureIcon className="w-6 h-6" />
                </span>
                <div className="space-y-2">
                  <h2 className="nm-h2 text-[28px] sm:text-[32px] leading-[1.15] text-[#1D281C]">
                    {t.landing.variantA.quickLookupTitle}
                  </h2>
                  <p className="text-[15px] text-[#495647] leading-relaxed">
                    {lang === "no"
                      ? "Velg kommune og bydel nedenfor for å se snittpris per kvadratmeter for enebolig og byggeklar tomt."
                      : "Choose your city and neighbourhood below to immediately see current average m² prices for houses and constructible land."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="band-city-select"
                      className="block text-[14px] font-semibold text-[#1D281C] mb-1.5"
                    >
                      {t.landing.variantA.cityLabel}
                    </label>
                    <select
                      id="band-city-select"
                      value={selectedCityId}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full min-h-[50px] px-4 py-2.5 text-[16px] font-semibold bg-[#FFFFFF] border border-[#C4CEBA] rounded-xl text-[#1D281C] cursor-pointer"
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
                      htmlFor="band-area-select"
                      className="block text-[14px] font-semibold text-[#1D281C] mb-1.5"
                    >
                      {t.landing.variantA.areaLabel}
                    </label>
                    <select
                      id="band-area-select"
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="w-full min-h-[50px] px-4 py-2.5 text-[16px] font-semibold bg-[#FFFFFF] border border-[#C4CEBA] rounded-xl text-[#1D281C] cursor-pointer"
                    >
                      {currentCity.neighborhoods.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-[#FFFFFF] border border-[#D4DCCB] rounded-xl p-4 flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-lg bg-[#F4F5F0] border border-[#DCE2D4] text-[#243323] flex items-center justify-center shrink-0">
                      <HouseIcon className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="block text-[13px] text-[#495647]">
                        {t.landing.variantA.houseM2Label}
                      </span>
                      <span className="block text-[21px] font-semibold text-[#1D281C] tabular-nums">
                        {formatNok(currentArea.housePriceM2)} / m²
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#D4DCCB] rounded-xl p-4 flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-lg bg-[#F4F5F0] border border-[#DCE2D4] text-[#243323] flex items-center justify-center shrink-0">
                      <LandPlotIcon className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="block text-[13px] text-[#495647]">
                        {t.landing.variantA.landM2Label}
                      </span>
                      <span className="block text-[21px] font-semibold text-[#1D281C] tabular-nums">
                        {formatNok(currentArea.landPriceM2)} / m²
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/koble-til-megler?source=price-m2&city=${currentCity.id}&area=${currentArea.id}`}
                  onClick={() => trackClick("price-m2")}
                  className="w-full min-h-[54px] px-5 py-3.5 rounded-xl bg-[#243323] hover:bg-[#172216] text-[#FFFFFF] text-[15px] sm:text-[16px] font-medium flex items-center justify-between gap-4 transition-colors shadow-xs"
                >
                  <span>{t.landing.variantA.pushCta}</span>
                  <ArrowRightIcon className="w-5 h-5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SAMPLE PROPERTY ADS */}
      <section className="py-6 sm:py-10">
        <div className="nm-container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <h2 className="nm-h2 text-[28px] sm:text-[34px] leading-[1.15] text-[#1D281C]">
              {lang === "no"
                ? "Eksempelannonser & aktiv etterspørsel"
                : "Sample property ads & active buyer demand"}
            </h2>
            <Link
              href="/koble-til-megler?source=sample-ads"
              onClick={() => trackClick("sample-ads")}
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1D281C] hover:text-[#495647] transition-colors"
            >
              <span>
                {lang === "no" ? "Be om verdivurdering" : "Get free valuation"}
              </span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sampleAdShowcases.map((ad) => (
              <Link
                key={ad.id}
                href={ad.href}
                onClick={() => trackClick(ad.id)}
                className="group bg-[#FFFFFF] border border-[#DCE2D4] rounded-2xl p-3 flex items-center gap-4 shadow-xs hover:shadow-md hover:border-[#B8C2AE] transition-all"
              >
                <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-[#E7ECE0] shrink-0">
                  <Image
                    src={ad.image}
                    alt={ad.alt}
                    fill
                    sizes="140px"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <h3 className="text-[16px] font-semibold text-[#1D281C] leading-snug">
                    {ad.title}
                  </h3>
                  <p className="text-[13px] text-[#495647] leading-snug">{ad.specs}</p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[15px] font-semibold text-[#243323] tabular-nums">
                      {ad.metricValue}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#F4F5F0] border border-[#DCE2D4] group-hover:bg-[#243323] group-hover:text-[#FFFFFF] text-[#243323] flex items-center justify-center transition-colors shrink-0">
                      <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DARK FOREST BOTTOM CALLOUT */}
      <section className="pt-2 pb-12 sm:pb-14">
        <div className="nm-container">
          <div className="relative bg-[#1E2A1E] text-[#FFFFFF] rounded-2xl overflow-hidden shadow-md">
            <div className="hidden md:block absolute inset-y-0 right-0 w-[52%]">
              <Image
                src="/images/ad-family-home.jpg"
                alt={
                  lang === "no"
                    ? "Eldre norsk familiebolig klar for salg"
                    : "Traditional Norwegian family home ready to sell as-is"
                }
                fill
                sizes="52vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#1E2A1E] via-[#1E2A1E]/80 to-[#1E2A1E]/35"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 p-6 sm:p-8 lg:px-10 lg:py-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 max-w-xl">
                <span className="w-12 h-12 rounded-xl bg-[#2E3F2E] border border-[#445944] text-[#D8E2D4] flex items-center justify-center shrink-0">
                  <ShieldCheckIcon className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="nm-h2 text-[26px] sm:text-[30px] leading-tight text-[#FFFFFF]">
                    {lang === "no"
                      ? "Selg boligen slik den står — uten oppussing"
                      : "Sell as-is without the stress of renovating"}
                  </h2>
                  <p className="text-[15px] sm:text-[16px] text-[#C8D3C4] mt-1">
                    {lang === "no"
                      ? "Få en rettferdig verdivurdering og uforpliktende tilbud fra lokale norske meglere."
                      : "Get a fair valuation and simple offers from local Norwegian agencies."}
                  </p>
                </div>
              </div>

              <Link
                href="/koble-til-megler?source=sell-as-is&type=house"
                onClick={() => trackClick("sell-as-is")}
                className="min-h-[50px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F4F5F0] hover:bg-[#FFFFFF] text-[#1D281C] text-[15px] font-semibold transition-colors shrink-0 shadow-sm"
              >
                <span>{lang === "no" ? "Få gratis vurdering" : "Get Free Valuation"}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
