"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { NORWAY_CITIES, formatNok } from "@/data/norwayData";
import {
  HouseIcon,
  LandPlotIcon,
  ApartmentIcon,
  ArrowRightIcon,
} from "@/components/Icons";
import { HousePriceGrowthCalculator } from "@/components/HousePriceGrowthCalculator";

export default function HomePage() {
  const router = useRouter();
  const { lang, landingVariant, recordConversion, t } = useApp();

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

  const handleVariantBCardTap = (propertyType: "house" | "land" | "apartment") => {
    recordConversion(`landing-b-${propertyType}`);
    router.push(`/sell?source=landing-b&type=${propertyType}`);
  };

  const sampleAdShowcases = [
    {
      id: "ad-villa",
      image: "/images/ad-villa-oslo.jpg",
      alt:
        lang === "no"
          ? "Eksempelannonse: Moderne enebolig i Oslo og Bærum med hage"
          : "Sample Ad: Modern Scandinavian detached villa in Oslo and Bærum with garden",
      location: "Oslo / Bærum",
      title:
        lang === "no"
          ? "Enebolig med hjørnetomt og god solgang"
          : "Detached Family Villa with Corner Plot",
      specs:
        lang === "no"
          ? "Ca. 210 m² · Oppgradert fasade · +15–25 % høyere m²-pris"
          : "Approx. 210 m² · Strong frontage · +15–25% m² premium",
      metricValue: "108 200 kr / m²",
      href: "/connect-agency?source=ad-villa&type=house",
      cta:
        lang === "no"
          ? "Få lokal verdivurdering for din bolig"
          : "Get a valuation for your home",
    },
    {
      id: "ad-land",
      image: "/images/ad-land-plot.jpg",
      alt:
        lang === "no"
          ? "Eksempelannonse: Solrik byggeklar tomt med fjordutsikt i Norge"
          : "Sample Ad: Sunlit constructible plot of land overlooking Norwegian fjord",
      location: "Stavanger / Bergen",
      title:
        lang === "no"
          ? "Stor boligtomt klar for deling eller R+2 utbygging"
          : "Subdividable Residential Plot (R+2 Potential)",
      specs:
        lang === "no"
          ? "1 450 m² · Plass til 2–3 enheter · Aktiv utbyggerinteresse"
          : "1,450 m² · Room for 2–3 units · Active builder demand",
      metricValue: "+38% tomteverdi",
      href: "/connect-agency?source=ad-land&type=land",
      cta:
        lang === "no"
          ? "Få tilbud på tomt og utbygging"
          : "Request land & builder offers",
    },
    {
      id: "ad-family",
      image: "/images/ad-family-home.jpg",
      alt:
        lang === "no"
          ? "Eksempelannonse: Eldre norsk familiebolig i rolig boliggate"
          : "Sample Ad: Classic Norwegian timber family house on quiet residential street",
      location: "Trondheim / Drammen",
      title:
        lang === "no"
          ? "Eldre familiebolig — selges «som den er» uten oppussing"
          : "Older Family House — Sold As-Is Without Renovating",
      specs:
        lang === "no"
          ? "Slipp 400 000+ kr i håndverkere · Raskt oppgjør for arvinger"
          : "Skip 400,000+ kr contractor work · Clean payout for heirs",
      metricValue: "390 000 – 830 000 kr",
      href: "/connect-agency?source=ad-family&type=house",
      cta:
        lang === "no"
          ? "Selg slik boligen står — få tilbud"
          : "Sell as-is — request local offers",
    },
  ];

  return (
    <main className="bg-[#FFFFFF]">
      {/* 1. KROGSVEEN ASYMMETRIC SPLIT HERO (A/B TESTED) */}
      {landingVariant === "A" ? (
        <section className="bg-[#FFFFFF] pt-2 pb-12 lg:pb-16">
          <div className="kr-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Left Wide Hero Split (9 cols) */}
              <div className="lg:col-span-9 relative min-h-[380px] sm:min-h-[500px] lg:min-h-[540px] bg-[#DCE2CF] rounded-[2px] overflow-hidden flex items-end">
                <Image
                  src="/images/ad-villa-oslo.jpg"
                  alt={
                    lang === "no"
                      ? "Norsk enebolig med hage i dagslys"
                      : "Norwegian detached family home in natural daylight"
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#000000]/85 via-[#000000]/45 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10 p-5 sm:p-10 lg:p-12 max-w-3xl w-full">
                  <h1 className="font-serif text-[34px] sm:text-[52px] lg:text-[64px] leading-[1.08] font-normal text-[#FFFFFF] tracking-[-0.015em]">
                    {t.landing.variantA.title}
                  </h1>
                  <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                    <Link
                      href={`/connect-agency?source=hero-a&city=${currentCity.id}&area=${currentArea.id}`}
                      onClick={() => recordConversion("hero-a-primary")}
                      className="min-h-[54px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[2px] bg-[#B8C49E] hover:bg-[#C5D0AF] active:scale-[0.985] text-[#000000] text-[18px] font-medium transition-all"
                    >
                      <span>{t.landing.variantA.primaryCta}</span>
                    </Link>
                    <Link
                      href="#neighborhood-lookup"
                      className="min-h-[54px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[2px] bg-[#FFFFFF] hover:bg-[#EDF0E7] active:scale-[0.985] text-[#000000] text-[18px] font-medium transition-all"
                    >
                      <span>
                        {lang === "no"
                          ? "Sjekk m²-pris i nabolaget"
                          : "Check Local m² Prices"}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Tall Split Photo (3 cols) — exact Krogsveen right-side panel */}
              <div className="hidden lg:block lg:col-span-3 relative min-h-[540px] bg-[#DCE2CF] rounded-[2px] overflow-hidden">
                <Image
                  src="/images/ad-family-home.jpg"
                  alt={
                    lang === "no"
                      ? "Tradisjonell norsk familiebolig"
                      : "Classic Norwegian family home"
                  }
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* VARIANT B: Krogsveen Split Hero + Direct Step-1 Giant Cards */
        <section className="bg-[#EDF0E7] border-b border-[#DCE2CF] py-10 lg:py-14">
          <div className="kr-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h1 className="kr-display-serif">
                  {t.landing.variantB.title}
                </h1>
                <p className="kr-body-lg max-w-2xl">
                  {t.landing.variantB.subtitle}
                </p>
              </div>
              <div className="lg:col-span-5 relative aspect-[16/10] w-full bg-[#DCE2CF] rounded-[2px] overflow-hidden">
                <Image
                  src="/images/ad-villa-oslo.jpg"
                  alt={
                    lang === "no"
                      ? "Norsk enebolig med hage"
                      : "Norwegian detached family home"
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-8 bg-[#FFFFFF] rounded-[2px] border border-[#5D726A] p-4 sm:p-8">
              <h2 className="kr-h3 mb-5">
                {t.landing.variantB.step1Prompt}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleVariantBCardTap("house")}
                  className="kr-tap-card text-left min-h-[104px] p-5 sm:p-6 bg-[#EDF0E7] hover:bg-[#DCE2CF] border-2 border-[#5D726A] flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-[2px] bg-[#B8C49E] text-[#000000] flex items-center justify-center">
                      <HouseIcon className="w-7 h-7" />
                    </span>
                    <ArrowRightIcon className="w-6 h-6 text-[#5D726A] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-4">
                    <span className="block text-[20px] font-medium text-[#000000]">
                      {t.landing.variantB.cardHouse}
                    </span>
                    <span className="block text-[16px] text-[#292823] mt-1">
                      {t.landing.variantB.cardHouseSub}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleVariantBCardTap("land")}
                  className="kr-tap-card text-left min-h-[104px] p-5 sm:p-6 bg-[#EDF0E7] hover:bg-[#DCE2CF] border-2 border-[#5D726A] flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-[2px] bg-[#B8C49E] text-[#000000] flex items-center justify-center">
                      <LandPlotIcon className="w-7 h-7" />
                    </span>
                    <ArrowRightIcon className="w-6 h-6 text-[#5D726A] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-4">
                    <span className="block text-[20px] font-medium text-[#000000]">
                      {t.landing.variantB.cardLand}
                    </span>
                    <span className="block text-[16px] text-[#292823] mt-1">
                      {t.landing.variantB.cardLandSub}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleVariantBCardTap("apartment")}
                  className="kr-tap-card text-left min-h-[104px] p-5 sm:p-6 bg-[#EDF0E7] hover:bg-[#DCE2CF] border-2 border-[#5D726A] flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-[2px] bg-[#B8C49E] text-[#000000] flex items-center justify-center">
                      <ApartmentIcon className="w-7 h-7" />
                    </span>
                    <ArrowRightIcon className="w-6 h-6 text-[#5D726A] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="mt-4">
                    <span className="block text-[20px] font-medium text-[#000000]">
                      {t.landing.variantB.cardApt}
                    </span>
                    <span className="block text-[16px] text-[#292823] mt-1">
                      {t.landing.variantB.cardAptSub}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HOUSE PRICE GROWTH CALCULATOR (HOME PAGE A) */}
      {landingVariant === "A" && <HousePriceGrowthCalculator />}

      {/* 2. EDITORIAL 2-COLUMN SPLIT INTRO (Matches Krogsveen "Oppskriften på et godt boligsalg") */}
      <section className="py-12 lg:py-16 bg-[#FFFFFF]">
        <div className="kr-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <h2 className="kr-h2-serif">{t.landing.ergonomicsTitle}</h2>
            </div>
            <div className="lg:col-span-6">
              <p className="kr-body-lg max-w-xl">{t.landing.ergonomicsDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL TEXT-LEFT / PHOTO-RIGHT SPLIT (Matches Krogsveen "Din egen rådgiver") */}
      <section className="py-10 lg:py-14 bg-[#FFFFFF]">
        <div className="kr-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="kr-h2-serif">
                {lang === "no"
                  ? "Vit hva eiendommen eller tomten din er verdt"
                  : "Know what your house or land is worth"}
              </h2>
              <p className="text-[18px] leading-[1.5] text-[#292823]">
                {lang === "no"
                  ? "Mange tomter og eldre familieboliger har langt høyere verdi enn eieren tror — spesielt ved utbygging, fradeling eller riktig kjøpergruppe."
                  : "Many plots and older family homes hold more value than owners expect—especially when accounting for neighborhood m² rates, subdivision, or selling as-is."}
              </p>
              <div className="pt-2">
                <Link
                  href="/connect-agency?source=land-value&type=land"
                  className="inline-flex items-center gap-2 text-[18px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 hover:text-[#5D726A]"
                >
                  <span>
                    {lang === "no"
                      ? "Få verdivurdering av bolig eller tomt"
                      : "Request house or land valuation"}
                  </span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-[#DCE2CF] rounded-[2px] overflow-hidden">
              <Image
                src="/images/ad-land-plot.jpg"
                alt={
                  lang === "no"
                    ? "Byggeklar boligtomt i Norge"
                    : "Constructible Norwegian residential plot"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CENTERED SAGE #DCE2CF VALUE CHECK BAND (Matches Krogsveen "Sjekk din boligverdi!") */}
      <section id="neighborhood-lookup" className="py-10 lg:py-14 bg-[#FFFFFF]">
        <div className="kr-container">
          <div className="bg-[#DCE2CF] rounded-[2px] p-5 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-3">
                <h2 className="kr-h2-serif">
                  {t.landing.variantA.quickLookupTitle}
                </h2>
                <p className="text-[18px] leading-[1.5] text-[#292823]">
                  {lang === "no"
                    ? "Velg kommune og bydel nedenfor for å se gjennomsnittlig kvadratmeterpris for enebolig og tomt."
                    : "Choose your city and neighborhood below to immediately see current average m² prices for houses and constructible land."}
                </p>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="band-city-select"
                      className="block text-[16px] font-medium text-[#000000] mb-2"
                    >
                      {t.landing.variantA.cityLabel}
                    </label>
                    <select
                      id="band-city-select"
                      value={selectedCityId}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full min-h-[58px] px-4 py-3 text-[18px] font-medium bg-[#FFFFFF] border border-[#5D726A] rounded-[2px] text-[#000000] cursor-pointer"
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
                      className="block text-[16px] font-medium text-[#000000] mb-2"
                    >
                      {t.landing.variantA.areaLabel}
                    </label>
                    <select
                      id="band-area-select"
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="w-full min-h-[58px] px-4 py-3 text-[18px] font-medium bg-[#FFFFFF] border border-[#5D726A] rounded-[2px] text-[#000000] cursor-pointer"
                    >
                      {currentCity.neighborhoods.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FFFFFF] rounded-[2px] p-4 border border-[#BFBFBD]">
                    <span className="block text-[15px] font-semibold text-[#292823]">
                      {t.landing.variantA.houseM2Label}
                    </span>
                    <span className="block text-[28px] font-medium text-[#000000] tabular-nums mt-1">
                      {formatNok(currentArea.housePriceM2)} / m²
                    </span>
                  </div>
                  <div className="bg-[#FFFFFF] rounded-[2px] p-4 border border-[#BFBFBD]">
                    <span className="block text-[15px] font-semibold text-[#292823]">
                      {t.landing.variantA.landM2Label}
                    </span>
                    <span className="block text-[28px] font-medium text-[#000000] tabular-nums mt-1">
                      {formatNok(currentArea.landPriceM2)} / m²
                    </span>
                  </div>
                </div>

                <Link
                  href={`/connect-agency?source=price-m2&city=${currentCity.id}&area=${currentArea.id}`}
                  onClick={() => recordConversion("band-m2-push")}
                  className="kr-btn-primary w-full justify-between text-left border border-[#5D726A]"
                >
                  <span>{t.landing.variantA.pushCta}</span>
                  <ArrowRightIcon className="w-6 h-6 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CENTERED BUTTERCREAM #FFF7D4 FEATURE BOX (Matches Krogsveen "Vi fikser flyttingen for deg") */}
      <section className="py-10 lg:py-14 bg-[#FFFFFF]">
        <div className="kr-container">
          <div className="bg-[#FFF7D4] rounded-[2px] p-5 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="kr-h2-serif">
                  {lang === "no"
                    ? "Selg boligen slik den står — uten oppussing"
                    : "Sell as-is without the stress of renovating"}
                </h2>
                <p className="text-[18px] leading-[1.5] text-[#292823]">
                  {lang === "no"
                    ? "Usikker på om det lønner seg å male, bytte kjøkken eller legge nytt tak før salg? Sammenlign kostnaden på sekunder."
                    : "Not sure if painting, replacing a kitchen, or fixing an old roof actually pays off? Compare renovation costs against selling as-is."}
                </p>
                <div className="pt-2">
                  <Link
                    href="/connect-agency?source=sell-as-is&type=house"
                    className="inline-flex items-center gap-2 text-[18px] font-medium text-[#000000] underline decoration-[#292823] underline-offset-4 hover:text-[#5D726A]"
                  >
                    <span>
                      {lang === "no"
                        ? "Få tilbud på salg «som den er»"
                        : "Get as-is valuation & local offers"}
                    </span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-[#FFFFFF] rounded-[2px] overflow-hidden">
                <Image
                  src="/images/ad-family-home.jpg"
                  alt={
                    lang === "no"
                      ? "Eldre norsk familiebolig klar for salg"
                      : "Traditional Norwegian family home ready to sell as-is"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIGHT SAGE #EDF0E7 LOWER BAND: SAMPLE PROPERTY AD CARDS */}
      <section
        id="sample-ads"
        className="bg-[#EDF0E7] border-t border-[#DCE2CF] py-14 lg:py-20"
      >
        <div className="kr-container space-y-16">
          {/* Sample Property Ad Cards */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="kr-h2-serif">
                  {lang === "no"
                    ? "Eksempelannonser fra det norske markedet"
                    : "Sample property ads & active buyer demand"}
                </h2>
              </div>
              <Link
                href="/connect-agency"
                className="inline-flex items-center gap-1.5 text-[18px] font-medium text-[#000000] underline underline-offset-4"
              >
                <span>{t.landing.variantA.primaryCta}</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleAdShowcases.map((ad) => (
                <article
                  key={ad.id}
                  className="bg-[#FFFFFF] rounded-[2px] border border-[#DFDFDF] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full bg-[#DCE2CF]">
                      <Image
                        src={ad.image}
                        alt={ad.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <span className="block text-[14px] font-semibold text-[#5D726A] mb-2">
                        {ad.location}
                      </span>
                      <h3 className="text-[22px] font-medium text-[#000000] leading-snug">
                        {ad.title}
                      </h3>
                      <p className="text-[16px] text-[#292823] mt-2 leading-relaxed">
                        {ad.specs}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-[#EDF0E7] space-y-3">
                    <div className="text-[20px] font-medium text-[#000000] tabular-nums">
                      {ad.metricValue}
                    </div>
                    <Link
                      href={ad.href}
                      className="inline-flex items-center gap-2 text-[17px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 hover:text-[#5D726A]"
                    >
                      <span>{ad.cta}</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
