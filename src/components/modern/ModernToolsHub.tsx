"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  HouseIcon,
  UsersFamilyIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BoltFastIcon,
  HeartFreeIcon,
  StarBadgeIcon,
  TrendingUpIcon,
  WalletCashIcon,
  RefreshCycleIcon,
  LightBulbIcon,
  LocationCrosshairIcon,
} from "@/components/Icons";

export function ModernToolsHub() {
  const { lang, trackClick } = useApp();

  const cards = [
    {
      href: "/tools/net-cash",
      title:
        lang === "no"
          ? "Kalkulator for «Netto penger på konto»"
          : "“Net Cash in Pocket” Calculator",
      desc:
        lang === "no"
          ? "Se nøyaktig hvor mye penger som faktisk blir igjen etter meglergebyr, skatt og innfrielse av banklån."
          : "See how much money you actually keep after fees, taxes and other costs.",
      image: "/images/tool-net-cash.jpg",
      imageAlt:
        lang === "no"
          ? "Arkitekturmodell av hus og myntstabler"
          : "Minimalist model house beside coin stacks",
      icon: <WalletCashIcon className="w-6 h-6" />,
    },
    {
      href: "/tools/land-buildability",
      title:
        lang === "no"
          ? "Tomtedeling og utbyggingspotensial"
          : "Land Buildability & Division Estimator",
      desc:
        lang === "no"
          ? "Finn ut om tomten din kan deles i flere parseller eller bygges ut med R+2 / R+3."
          : "Find out how your land can be divided and what you can build.",
      image: "/images/tool-land-plot.jpg",
      imageAlt:
        lang === "no"
          ? "3D-illustrasjon av fradelt byggetomt med trær"
          : "Isometric grassy land plot divided into buildable parcels",
      icon: <LocationCrosshairIcon className="w-6 h-6" />,
    },
    {
      href: "/tools/inherited-property",
      title:
        lang === "no"
          ? "Kalkulator for arvet bolig og søskenoppgjør"
          : "Inherited / Family Property Share Calculator",
      desc:
        lang === "no"
          ? "Beregn forventet salgsverdi og eksakt netto utbetaling per arving eller søsken."
          : "Calculate the estimated value and share per heir for inherited property.",
      image: "/images/tool-inherited.jpg",
      imageAlt:
        lang === "no"
          ? "Familie som går sammen i sollys på eng"
          : "Sunlit family walking across meadow",
      icon: <UsersFamilyIcon className="w-6 h-6" />,
    },
    {
      href: "/tools/sell-as-is",
      title:
        lang === "no"
          ? "Selge «som den er» vs. pusse opp først"
          : "“Sell As-Is vs. Fix It Up” Calculator",
      desc:
        lang === "no"
          ? "Sammenlign oppussingskostnader og se hvilken strategi som gir best gevinst."
          : "Compare renovation costs and see which option gets you the best return.",
      image: "/images/tool-sell-asis.jpg",
      imageAlt:
        lang === "no"
          ? "Hvit malerrull og malingsspann mot lys vegg"
          : "Minimal paint roller resting on brushed paint tin",
      icon: <RefreshCycleIcon className="w-6 h-6" />,
    },
  ];

  const statsTiles = [
    {
      value: "10K+",
      label: lang === "no" ? "Boliger vurdert" : "Properties valued",
      icon: <HouseIcon className="w-5 h-5" />,
    },
    {
      value: "500+",
      label: lang === "no" ? "Lokale meglere" : "Local agents",
      icon: <UsersFamilyIcon className="w-5 h-5" />,
    },
    {
      value: "100%",
      label: lang === "no" ? "Trygg & gratis" : "Trusted & free",
      icon: <ShieldCheckIcon className="w-5 h-5" />,
    },
  ];

  return (
    <main className="bg-[#F4F5F0] text-[#1D281C]">
      {/* 1. ARCHITECTURAL TOOLS HERO MATCHING HOME PAGE & MOCKUP */}
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
            sizes="62vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#F4F5F0] via-[#F4F5F0]/75 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#F4F5F0]/35 via-transparent to-[#F4F5F0]/45"
            aria-hidden="true"
          />
        </div>

        {/* Organic decorative sweep arc */}
        <svg
          viewBox="0 0 1440 420"
          fill="none"
          className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full opacity-60"
          aria-hidden="true"
        >
          <path d="M 540 -30 Q 750 200 520 460" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 630 -30 Q 840 210 610 460" stroke="#FFFFFF" strokeWidth="1.25" opacity="0.65" />
        </svg>

        <div className="nm-container relative z-10 py-10 sm:py-14 lg:py-16">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7ECE0] border border-[#D4DCCB] text-[#243323] text-[14px] font-medium">
              <BoltFastIcon className="w-4 h-4 text-[#243323]" />
              <span>{lang === "no" ? "Smarte verktøy" : "Smart Tools"}</span>
            </div>

            <h1 className="font-serif text-[40px] sm:text-[52px] lg:text-[60px] leading-[1.06] font-normal text-[#1D281C] tracking-[-0.02em] text-balance">
              {lang === "no"
                ? "Gratis verktøy for deg som skal selge bolig eller tomt"
                : "Free Tools for Home and Land Sellers"}
            </h1>

            <p className="text-[17px] sm:text-[19px] leading-relaxed text-[#495647] max-w-lg">
              {lang === "no"
                ? "Få umiddelbare tall, beregn salgspriser og utforsk dine muligheter på sekunder — alt samlet på ett sted."
                : "Get instant insights, calculate prices and explore your options with our easy-to-use tools — all in one place."}
            </p>

            {/* 3 Trust Highlights Row */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[14px] sm:text-[15px] font-medium text-[#243323]">
              <span className="inline-flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-[#243323]" />
                <span>{lang === "no" ? "Brukt av tusenvis" : "Trusted by thousands"}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <BoltFastIcon className="w-4 h-4 text-[#243323]" />
                <span>{lang === "no" ? "Raskt & nøyaktig" : "Fast & accurate"}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <HeartFreeIcon className="w-4 h-4 text-[#243323]" />
                <span>{lang === "no" ? "100 % gratis" : "100% free"}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 6-CARD BENTO TOOLS GRID (1 FEATURED + 4 VISUAL TOOL CARDS + 1 HELP CARD) */}
      <section className="py-8 sm:py-12">
        <div className="nm-container space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* CARD 1: FEATURED DARK OLIVE CARD — Price per m2 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F2D1E] via-[#2B3D29] to-[#566A53] text-[#FFFFFF] p-6 sm:p-8 min-h-[260px] flex flex-col justify-between shadow-md border border-[#344732]">
              {/* Subtle Map Lines + Pin Overlay on Right */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-[55%] opacity-45"
                aria-hidden="true"
              >
                <svg viewBox="0 0 320 260" fill="none" className="w-full h-full">
                  <path d="M 30 30 L 310 110 M 10 95 L 300 45 M 40 165 L 310 220 M 115 0 L 85 260 M 210 0 L 175 260" stroke="#A8B8A2" strokeWidth="1.25" />
                  <circle cx="215" cy="145" r="55" stroke="#D8E2D4" strokeWidth="1" strokeDasharray="3 4" />
                </svg>
              </div>

              {/* Floating Live m2 Pill Badge on Right */}
              <div className="hidden sm:flex flex-col items-center gap-2.5 absolute right-7 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="px-4 py-2 rounded-xl bg-[#FFFFFF] text-[#1D281C] text-[16px] font-semibold tabular-nums shadow-lg inline-flex items-center gap-2">
                  <span>108 200 kr / m²</span>
                  <TrendingUpIcon className="w-4 h-4 text-[#243323]" />
                </div>
                <span className="w-7 h-7 rounded-full bg-[#1D281C] border-2 border-[#FFFFFF] flex items-center justify-center shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#B5C9B4]" />
                </span>
              </div>

              <div className="relative z-10 max-w-xs sm:max-w-[290px] space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A4D38]/90 border border-[#5B7259] text-[#E9EDE3] text-[12px] font-semibold">
                  <StarBadgeIcon className="w-3.5 h-3.5 text-[#D8C16E]" />
                  <span>{lang === "no" ? "Mest populær" : "Most Popular"}</span>
                </div>

                <h2 className="font-serif text-[26px] sm:text-[30px] leading-[1.15] font-normal text-[#FFFFFF]">
                  {lang === "no"
                    ? "Oppslag på «Pris per m²» i ditt nabolag"
                    : "Instant Neighborhood “Price per m²” Lookup"}
                </h2>

                <p className="text-[15px] text-[#D4DFD0] leading-relaxed">
                  {lang === "no"
                    ? "Sammenlign enebolig og byggeklar tomt i ditt område og se dagens gjennomsnittlige m²-pris."
                    : "Compare prices in your area and discover the current average selling price per m²."}
                </p>
              </div>

              <div className="relative z-10 pt-5">
                <Link
                  href="/tools/price-per-m2"
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full bg-[#FFFFFF] hover:bg-[#E7ECE0] text-[#1D281C] text-[15px] font-semibold transition-colors shadow-sm"
                >
                  <span>
                    {lang === "no" ? "Åpne kalkulator" : "Open Calculator"}
                  </span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* CARDS 2–5: CLEAN WHITE BENTO CARDS WITH STUDIO RIGHT IMAGES */}
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#DCE2D4] hover:border-[#B8C2AE] p-6 sm:p-8 min-h-[260px] flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                {/* Right-Aligned Blended Visual */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-[56%] sm:w-[52%]">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 60vw, 28vw"
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="relative z-10 max-w-[280px] sm:max-w-[300px] space-y-3">
                  <span className="w-11 h-11 rounded-xl bg-[#EAEFE4] border border-[#D4DCCB] text-[#243323] flex items-center justify-center">
                    {card.icon}
                  </span>

                  <h2 className="font-serif text-[25px] sm:text-[28px] leading-[1.16] font-normal text-[#1D281C]">
                    {card.title}
                  </h2>

                  <p className="text-[14px] sm:text-[15px] text-[#495647] leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-5">
                  <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1D281C] underline decoration-[#9EB09A] underline-offset-4 group-hover:text-[#243323]">
                    <span>
                      {lang === "no" ? "Åpne kalkulator" : "Open Calculator"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}

            {/* CARD 6: SAGE HELP CARD — Need More Help? -> Connect Agency */}
            <div className="relative overflow-hidden rounded-2xl bg-[#E7ECE0] border border-[#D4DCCB] p-6 sm:p-8 min-h-[260px] flex flex-col justify-between shadow-xs">
              {/* Right Bottom Fjord Accent & Subtle Sweep */}
              <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-[48%] opacity-75">
                <Image
                  src="/images/ad-land-plot.jpg"
                  alt={
                    lang === "no"
                      ? "Norsk fjordutsikt"
                      : "Norwegian scenic coastline"
                  }
                  fill
                  sizes="25vw"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#E7ECE0] via-[#E7ECE0]/85 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-[#E7ECE0]/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>

              <div className="relative z-10 max-w-xs space-y-3">
                <span className="w-11 h-11 rounded-xl bg-[#FFFFFF] border border-[#D4DCCB] text-[#243323] flex items-center justify-center">
                  <LightBulbIcon className="w-6 h-6" />
                </span>

                <h2 className="font-serif text-[26px] sm:text-[30px] leading-[1.15] font-normal text-[#1D281C]">
                  {lang === "no" ? "Trenger du mer hjelp?" : "Need more help?"}
                </h2>

                <p className="text-[15px] text-[#495647] leading-relaxed">
                  {lang === "no"
                    ? "Koble deg direkte med en lokal megler og få nøytral verdivurdering fra erfarne rådgivere."
                    : "Connect with a local agency and get expert advice from our trusted partners."}
                </p>
              </div>

              <div className="relative z-10 pt-5 flex items-center justify-between gap-4">
                <Link
                  href="/connect-agency?source=tools-hub"
                  onClick={() => trackClick("tools-hub")}
                  className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-full bg-[#243323] hover:bg-[#172216] text-[#FFFFFF] text-[15px] font-semibold transition-colors shadow-sm"
                >
                  <span>
                    {lang === "no" ? "Koble til megler" : "Connect Agency"}
                  </span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 3. DARK FOREST FULL-WIDTH BOTTOM BANNER WITH 3 FROSTED STAT TILES */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1E2A1E] text-[#FFFFFF] shadow-md border border-[#2E3E2D]">
            <div className="hidden md:block absolute inset-y-0 right-0 w-[62%]">
              <Image
                src="/images/ad-land-plot.jpg"
                alt={
                  lang === "no"
                    ? "Norsk fjordlandskap"
                    : "Norwegian fjord landscape"
                }
                fill
                sizes="62vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#1E2A1E] via-[#1E2A1E]/75 to-[#1E2A1E]/25"
                aria-hidden="true"
              />
            </div>

            <svg
              viewBox="0 0 1200 260"
              fill="none"
              className="hidden md:block pointer-events-none absolute inset-0 w-full h-full opacity-25"
              aria-hidden="true"
            >
              <path d="M 480 -20 Q 610 130 450 280" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>

            <div className="relative z-10 p-6 sm:p-9 lg:p-11 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <h2 className="font-serif text-[30px] sm:text-[36px] leading-[1.12] font-normal text-[#FFFFFF]">
                  {lang === "no"
                    ? "Klar til å kontakte en lokal megler?"
                    : "Ready to connect with a local agency?"}
                </h2>
                <p className="text-[16px] text-[#D4DFD0] max-w-md leading-relaxed">
                  {lang === "no"
                    ? "Få en uforpliktende verdivurdering og sammenlign tilbud fra lokale norske meglere."
                    : "Get a free valuation and compare offers from local Norwegian agencies."}
                </p>
                <div className="pt-1">
                  <Link
                    href="/connect-agency?source=tools-hub"
                    onClick={() => trackClick("tools-hub")}
                    className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3 rounded-full bg-[#F4F5F0] hover:bg-[#FFFFFF] text-[#1D281C] text-[15px] font-semibold transition-colors shadow-sm"
                  >
                    <span>
                      {lang === "no" ? "Koble til megler" : "Connect Agency"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 3 Frosted Glass Stat Tiles */}
              <div className="lg:col-span-6 grid grid-cols-3 gap-3 sm:gap-4">
                {statsTiles.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-xl bg-[#FFFFFF]/12 backdrop-blur-md border border-[#FFFFFF]/20 p-4 text-center flex flex-col items-center justify-center gap-1.5"
                  >
                    <span className="text-[#D4DFD0]">{stat.icon}</span>
                    <span className="font-display text-[22px] sm:text-[26px] font-semibold text-[#FFFFFF] tabular-nums leading-none mt-1">
                      {stat.value}
                    </span>
                    <span className="text-[12px] sm:text-[13px] text-[#D4DFD0] leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
