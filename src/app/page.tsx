"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { ArrowRightIcon } from "@/components/Icons";
import { HousePriceGrowthCalculator } from "@/components/HousePriceGrowthCalculator";
import { ModernHome } from "@/components/modern/ModernHome";

export default function HomePage() {
  const { lang, landingVariant, isModern, trackClick, t } = useApp();

  if (isModern) {
    return <ModernHome />;
  }

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
      href: "/koble-til-megler?source=ad-villa&type=house",
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
          ? "Stor boligtomt klar for deling eller utbygging"
          : "Subdividable Residential Plot",
      specs:
        lang === "no"
          ? "1 450 m² · Plass til 2–3 enheter · Aktiv utbyggerinteresse"
          : "1,450 m² · Room for 2–3 units · Active builder demand",
      metricValue: "+38% tomteverdi",
      href: "/koble-til-megler?source=ad-land&type=land",
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
      href: "/koble-til-megler?source=ad-family&type=house",
      cta:
        lang === "no"
          ? "Selg slik boligen står — få tilbud"
          : "Sell as-is — request local offers",
    },
  ];

  return (
    <main className="bg-[#FFFFFF]">
      {/* 1. KROGSVEEN TWO-IMAGE SPLIT HERO (A/B TESTED) */}
      {landingVariant === "A" ? (
        <section className="bg-[#FFFFFF] pt-6 sm:pt-8 pb-12 lg:pb-16">
          <div className="kr-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
              {/* Left Wide Hero Split (8 cols) */}
              <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[490px] bg-[#DCE2CF] rounded-none overflow-clip flex items-end">
                <Image
                  src="/images/ad-villa-oslo.jpg"
                  alt={
                    lang === "no"
                      ? "Norsk enebolig med hage i dagslys"
                      : "Norwegian detached family home in natural daylight"
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/40 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl w-full">
                  <h1 className="font-serif text-[34px] sm:text-[50px] lg:text-[60px] leading-[1.08] font-normal text-[#FFFFFF] tracking-[-0.015em]">
                    {t.landing.variantA.title}
                  </h1>
                  <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5">
                    <Link
                      href="/koble-til-megler?source=hero-a"
                      onClick={() => trackClick("hero-a")}
                      className="min-h-[52px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-none bg-[#B8C49E] hover:bg-[#C5D0AF] active:scale-[0.985] text-[#000000] text-[17px] font-medium transition-all"
                    >
                      <span>{t.landing.variantA.primaryCta}</span>
                    </Link>
                    <Link
                      href="/verktoy/pris-per-m2"
                      className="min-h-[52px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-none bg-[#FFFFFF] hover:bg-[#EDF0E7] active:scale-[0.985] text-[#000000] text-[17px] font-medium transition-all"
                    >
                      <span>
                        {lang === "no"
                          ? "Sjekk lokale priser"
                          : "Check Local Prices"}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Tall Split Photo (4 cols) */}
              <div className="hidden lg:block lg:col-span-4 relative min-h-[490px] bg-[#DCE2CF] rounded-none overflow-clip">
                <Image
                  src="/images/ad-family-home.jpg"
                  alt={
                    lang === "no"
                      ? "Tradisjonell norsk familiebolig"
                      : "Classic Norwegian family home"
                  }
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* VARIANT B: Full-Bleed Botanical Sage Hero with Blended Villa Photo */
        <section className="relative overflow-clip bg-[#EDF0E7] border-b border-[#DCE2CF]">
          {/* Right Architectural Villa Backdrop smoothly faded into left sage canvas */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-[60%]">
            <Image
              src="/images/ad-villa-oslo.jpg"
              alt={
                lang === "no"
                  ? "Norsk enebolig med hage"
                  : "Norwegian detached family home"
              }
              fill
              priority
              sizes="60vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#EDF0E7] via-[#EDF0E7]/75 via-30% to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#EDF0E7] to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#EDF0E7]/25 via-transparent to-[#EDF0E7]/20"
              aria-hidden="true"
            />
          </div>

          {/* Subtle Organic Sage Wave Accents on Left */}
          <svg
            viewBox="0 0 1440 520"
            fill="none"
            preserveAspectRatio="none"
            className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            <path
              d="M-40 80 C 180 -20, 410 130, 680 20 L 680 -40 L -40 -40 Z"
              fill="#FFFFFF"
              fillOpacity="0.34"
            />
            <path
              d="M-40 370 C 170 465, 400 395, 640 520 L -40 520 Z"
              fill="#DCE2CF"
              fillOpacity="0.45"
            />
            <path
              d="M-20 45 C 195 135, 315 265, 130 520"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="1.5"
            />
          </svg>

          <div className="kr-container relative z-10 py-14 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-7">
                <h1 className="font-serif text-[42px] sm:text-[56px] lg:text-[64px] leading-[1.06] font-semibold text-[#1E221D] tracking-[-0.02em] max-w-lg">
                  {t.landing.variantB.title}
                </h1>
                <div>
                  <Link
                    href="/koble-til-megler?source=landing-b"
                    onClick={() => trackClick("landing-b")}
                    className="min-h-[52px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-none bg-[#C4CBB3] hover:bg-[#B8C49E] active:scale-[0.985] border border-[#B2BA9E] text-[#1D201B] text-[15px] sm:text-[16px] font-medium transition-colors w-full sm:w-auto"
                  >
                    <span>{t.landing.variantB.cta}</span>
                    <ArrowRightIcon className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>

              {/* Mobile / Tablet House Photo */}
              <div className="lg:hidden relative aspect-[16/10] w-full bg-[#DCE2CF] rounded-none overflow-clip">
                <Image
                  src="/images/ad-villa-oslo.jpg"
                  alt={
                    lang === "no"
                      ? "Norsk enebolig med hage"
                      : "Norwegian detached family home"
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
      )}

      {/* 2. HOUSE VALUE CALCULATOR (HOME PAGE A) */}
      {landingVariant === "A" && <HousePriceGrowthCalculator />}

      {/* 3. EDITORIAL 2-COLUMN SPLIT INTRO ("The recipe for a great home sale") */}
      <section className="py-14 sm:py-16 lg:py-20 bg-[#FFFFFF]">
        <div className="kr-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-6">
              <h2 className="kr-h2-serif">{t.landing.ergonomicsTitle}</h2>
            </div>
            <div className="lg:col-span-6">
              <p className="kr-body-lg max-w-xl">{t.landing.ergonomicsDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EDITORIAL TEXT-LEFT / PHOTO-RIGHT SPLIT ("Know what your house or land is worth") */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#FFFFFF]">
        <div className="kr-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 space-y-5">
              <h2 className="kr-h2-serif">
                {lang === "no"
                  ? "Vit hva eiendommen eller tomten din er verdt"
                  : "Know what your house or land is worth"}
              </h2>
              <p className="text-[18px] leading-[1.55] text-[#292823]">
                {lang === "no"
                  ? "Mange tomter og eldre familieboliger har langt høyere verdi enn eieren tror — spesielt ved utbygging, fradeling eller riktig kjøpergruppe."
                  : "Many plots and older family homes hold more value than owners expect—especially when accounting for neighborhood m² rates, subdivision, or selling as-is."}
              </p>
              <div className="pt-1">
                <Link
                  href="/koble-til-megler?source=land-value&type=land"
                  onClick={() => trackClick("land-value")}
                  className="inline-flex items-center gap-2 text-[17px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 hover:text-[#5D726A]"
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

            <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-[#DCE2CF] rounded-none overflow-clip">
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

      {/* 5. SAGE-GREEN #EDF0E7 SELL-AS-IS FEATURE BOX */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#FFFFFF]">
        <div className="kr-container">
          <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-5">
                <h2 className="kr-h2-serif">
                  {lang === "no"
                    ? "Selg boligen slik den står — uten oppussing"
                    : "Sell as-is without the stress of renovating"}
                </h2>
                <p className="text-[18px] leading-[1.55] text-[#292823]">
                  {lang === "no"
                    ? "Usikker på om det lønner seg å male, bytte kjøkken eller legge nytt tak før salg? Sammenlign kostnaden på sekunder."
                    : "Not sure if painting, replacing a kitchen, or fixing an old roof actually pays off? Compare renovation costs against selling as-is."}
                </p>
                <div className="pt-1">
                  <Link
                    href="/koble-til-megler?source=sell-as-is&type=house"
                    onClick={() => trackClick("sell-as-is")}
                    className="inline-flex items-center gap-2 text-[17px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 hover:text-[#5D726A]"
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

              <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-[#DCE2CF] rounded-none overflow-clip">
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

      {/* 6. WHITE SECTION: SAMPLE PROPERTY AD CARDS */}
      <section
        id="sample-ads"
        className="bg-[#FFFFFF] py-14 sm:py-16 lg:py-24"
      >
        <div className="kr-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
            <div>
              <h2 className="kr-h2-serif">
                {lang === "no"
                  ? "Eksempelannonser fra det norske markedet"
                  : "Sample property ads & active buyer demand"}
              </h2>
            </div>
            <Link
              href="/koble-til-megler?source=sample-ads"
              onClick={() => trackClick("sample-ads")}
              className="inline-flex items-center gap-1.5 text-[17px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 hover:text-[#5D726A]"
            >
              <span>{t.landing.variantA.primaryCta}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {sampleAdShowcases.map((ad) => (
              <article
                key={ad.id}
                className="bg-[#FFFFFF] rounded-none border border-[#DFDFDF] overflow-clip flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-[#DCE2CF] rounded-none">
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
                    <h3 className="text-[21px] font-medium text-[#000000] leading-snug">
                      {ad.title}
                    </h3>
                    <p className="text-[16px] text-[#292823] mt-2 leading-relaxed">
                      {ad.specs}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-[#EDF0E7] space-y-3">
                  <div className="text-[20px] font-semibold text-[#000000] tabular-nums">
                    {ad.metricValue}
                  </div>
                  <Link
                    href={ad.href}
                    onClick={() => trackClick(ad.id)}
                    className="inline-flex items-center gap-2 text-[16px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 hover:text-[#5D726A]"
                  >
                    <span>{ad.cta}</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
