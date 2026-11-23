"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { openConsentSettings } from "@/lib/consent";
import { ShieldCheckIcon, ArrowRightIcon } from "@/components/Icons";
import { ModernFooter } from "@/components/modern/ModernFooter";

export function Footer() {
  const pathname = usePathname();
  const { lang, isModern, trackClick, t } = useApp();

  if (pathname.startsWith("/admin")) return null;
  if (isModern) return <ModernFooter />;

  return (
    <footer className="bg-[#EDF0E7] text-[#292823] border-t border-[#DCE2CF]">
      <div className="kr-container py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Column 1: Brand & Neutral Valuation Notice */}
          <div className="md:col-span-5 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px]"
            >
              <Image
                src="/images/vurderboligen-logo.png"
                alt="VurderBoligen"
                width={205}
                height={35}
                className="h-8 sm:h-9 w-auto"
              />
            </Link>

            <p className="text-[16px] text-[#292823] leading-relaxed max-w-md">
              {t.landing.ergonomicsDesc}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-none bg-[#FFFFFF] border border-[#DCE2CF] text-[14px] font-medium text-[#000000]">
              <ShieldCheckIcon className="w-4 h-4 text-[#5D726A] shrink-0" />
              <span>
                {lang === "no"
                  ? "Uforpliktende & GDPR-trygg tjeneste i Norge"
                  : "Free, neutral & Norwegian GDPR compliant"}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3.5">
            <h2 className="text-[14px] font-semibold uppercase tracking-wider text-[#000000]">
              {lang === "no" ? "Snarveier" : "Navigation"}
            </h2>
            <ul className="space-y-1 text-[16px]">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center min-h-[40px] text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] underline-offset-4"
                >
                  {lang === "no" ? "Hjem" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="/verktoy"
                  className="inline-flex items-center min-h-[40px] text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] underline-offset-4"
                >
                  {lang === "no" ? "Gratis verktøy" : "Free Tools"}
                </Link>
              </li>
              <li>
                <Link
                  href="/koble-til-megler?source=nav"
                  onClick={() => trackClick("nav")}
                  className="inline-flex items-center min-h-[40px] text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] underline-offset-4"
                >
                  {lang === "no" ? "Koble til megler" : "Connect Agency"}
                </Link>
              </li>
              <li>
                <Link
                  href="/personvern"
                  className="inline-flex items-center min-h-[40px] text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] underline-offset-4"
                >
                  {lang === "no" ? "Personvernerklæring" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Privacy & Data Protection */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-[14px] font-semibold uppercase tracking-wider text-[#000000]">
              {lang === "no" ? "Personvern & Trygghet" : "Privacy & Data Care"}
            </h2>
            <p className="text-[15px] text-[#292823] leading-relaxed">
              {lang === "no"
                ? "Opplysninger du sender inn brukes kun til å gi deg verdivurdering fra lokale meglere. Vi selger aldri kontaktdata til tredjeparter."
                : "Details you submit are used solely to connect you with matched local real-estate agencies for a valuation. We never sell your contact details."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/personvern"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-none bg-[#FFFFFF] border border-[#5D726A] text-[#000000] hover:bg-[#DCE2CF] text-[15px] font-medium transition-colors"
              >
                <span>
                  {lang === "no" ? "Les personvern" : "Privacy Policy"}
                </span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={openConsentSettings}
                className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-none bg-[#FFFFFF] border border-[#DCE2CF] text-[15px] font-medium text-[#000000] hover:bg-[#DCE2CF] transition-colors cursor-pointer"
              >
                {lang === "no" ? "Informasjonskapsler" : "Cookie Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* SEO Links Strip: Top Calculators & Local Prices */}
        <div className="mt-10 pt-6 border-t border-[#DCE2CF] grid grid-cols-1 md:grid-cols-2 gap-6 text-[14px]">
          <div className="space-y-2">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#000000]">
              {lang === "no" ? "Populære boligkalkulatorer" : "Popular Free Calculators"}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <Link href="/verktoy/meglerkostnad" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Meglerkostnad" : "Broker Fee"}
              </Link>
              <Link href="/verktoy/gevinstskatt" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Gevinstskatt & botid" : "Capital Gains Tax"}
              </Link>
              <Link href="/verktoy/kjope-ut-samboer" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Kjøpe ut samboer" : "Partner Buyout"}
              </Link>
              <Link href="/verktoy/mellomfinansiering" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Mellomfinansiering" : "Bridge Loan"}
              </Link>
              <Link href="/verktoy/leie-ut-eller-selge" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Leie ut eller selge" : "Rent vs. Sell"}
              </Link>
              <Link href="/verktoy/eiendomsskatt" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Eiendomsskatt" : "Property Tax"}
              </Link>
              <Link href="/verktoy/dokumentavgift" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Dokumentavgift" : "Stamp Duty"}
              </Link>
              <Link href="/verktoy/solforhold" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">
                {lang === "no" ? "Solforhold" : "Sun Conditions"}
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#000000]">
              {lang === "no" ? "Boligpris per m² i Norge" : "Local Prices per m²"}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <Link href="/boligpris/oslo" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Oslo</Link>
              <Link href="/boligpris/baerum" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Bærum</Link>
              <Link href="/boligpris/bergen" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Bergen</Link>
              <Link href="/boligpris/stavanger" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Stavanger</Link>
              <Link href="/boligpris/trondheim" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Trondheim</Link>
              <Link href="/boligpris/drammen" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Drammen</Link>
              <Link href="/boligpris/kristiansand" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Kristiansand</Link>
              <Link href="/boligpris/tromso" className="hover:text-[#000000] underline decoration-[#5D726A]/60 underline-offset-4">Tromsø</Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-8 pt-6 border-t border-[#DCE2CF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[14px] text-[#292823]">
          <p>
            © {new Date().getFullYear()} VurderBoligen —{" "}
            {lang === "no"
              ? "Norsk selgerportal for bolig og tomt."
              : "Norwegian Home & Land Seller Portal."}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/personvern"
              className="hover:text-[#000000] underline underline-offset-4"
            >
              {lang === "no" ? "Personvern & GDPR" : "Privacy Policy & GDPR"}
            </Link>
            <button
              type="button"
              onClick={openConsentSettings}
              className="hover:text-[#000000] underline underline-offset-4 cursor-pointer"
            >
              {lang === "no" ? "Cookie-innstillinger" : "Cookie Settings"}
            </button>
            <Link
              href="/koble-til-megler?source=nav"
              onClick={() => trackClick("nav")}
              className="hover:text-[#000000] underline underline-offset-4"
            >
              {lang === "no" ? "Start vurdering" : "Request Valuation"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
