"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { openConsentSettings } from "@/lib/consent";
import { ShieldCheckIcon, ArrowRightIcon } from "@/components/Icons";

export function ModernFooter() {
  const { lang, trackClick, t } = useApp();

  return (
    <footer className="bg-[#EEF1E9] text-[#1D281C] border-t border-[#DCE2D4]">
      <div className="nm-container py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center w-fit min-h-[44px]"
            >
              <Image
                src="/images/vurderboligen-logo.png"
                alt="VurderBoligen"
                width={205}
                height={35}
                className="h-8 sm:h-9 w-auto"
              />
            </Link>

            <p className="text-[15px] sm:text-[16px] text-[#495647] leading-relaxed max-w-md">
              {t.landing.ergonomicsDesc}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#DCE2D4] text-[13px] sm:text-[14px] font-medium text-[#1D281C] shadow-2xs">
              <ShieldCheckIcon className="w-4 h-4 text-[#243323] shrink-0" />
              <span>
                {lang === "no"
                  ? "Uforpliktende & GDPR-trygg tjeneste i Norge"
                  : "Free, neutral & Norwegian GDPR compliant"}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#1D281C]">
              {lang === "no" ? "Snarveier" : "Navigation"}
            </h2>
            <ul className="space-y-1 text-[15px]">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center min-h-[40px] text-[#495647] hover:text-[#1D281C] transition-colors"
                >
                  {lang === "no" ? "Hjem" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="inline-flex items-center min-h-[40px] text-[#495647] hover:text-[#1D281C] transition-colors"
                >
                  {lang === "no" ? "Gratis verktøy" : "Free Tools"}
                </Link>
              </li>
              <li>
                <Link
                  href="/connect-agency?source=nav"
                  onClick={() => trackClick("nav")}
                  className="inline-flex items-center min-h-[40px] text-[#495647] hover:text-[#1D281C] transition-colors"
                >
                  {lang === "no" ? "Koble til megler" : "Connect Agency"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center min-h-[40px] text-[#495647] hover:text-[#1D281C] underline underline-offset-4 transition-colors"
                >
                  {lang === "no" ? "Personvern & GDPR" : "Privacy Policy & GDPR"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#1D281C]">
              {lang === "no" ? "Personvern & Trygghet" : "Privacy & Data Care"}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#495647] leading-relaxed">
              {lang === "no"
                ? "Opplysninger du sender inn brukes kun til å gi deg verdivurdering fra lokale meglere. Vi selger aldri kontaktdata til tredjeparter."
                : "Details you submit are used solely to connect you with matched local real-estate agencies for a valuation. We never sell your contact details."}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#B8C2AE] text-[#1D281C] hover:bg-[#E7ECE0] text-[14px] font-semibold transition-colors"
              >
                <span>{lang === "no" ? "Les personvern" : "Privacy Policy"}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={openConsentSettings}
                className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#DCE2D4] text-[14px] font-medium text-[#243323] hover:bg-[#E7ECE0] transition-colors cursor-pointer"
              >
                {lang === "no" ? "Informasjonskapsler" : "Cookie Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* SEO Links Strip: Top Calculators & Local Prices */}
        <div className="mt-10 pt-6 border-t border-[#DCE2D4] grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] sm:text-[14px]">
          <div className="space-y-2">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#1D281C]">
              {lang === "no" ? "Populære boligkalkulatorer" : "Popular Free Calculators"}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[#495647]">
              <Link href="/tools/broker-fee" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Meglerkostnad" : "Broker Fee"}
              </Link>
              <Link href="/tools/capital-gains-tax" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Gevinstskatt & botid" : "Capital Gains Tax"}
              </Link>
              <Link href="/tools/partner-buyout" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Kjøpe ut samboer" : "Partner Buyout"}
              </Link>
              <Link href="/tools/bridge-loan" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Mellomfinansiering" : "Bridge Loan"}
              </Link>
              <Link href="/tools/rent-or-sell" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Leie ut eller selge" : "Rent vs. Sell"}
              </Link>
              <Link href="/tools/property-tax" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Eiendomsskatt" : "Property Tax"}
              </Link>
              <Link href="/tools/document-fee" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Dokumentavgift" : "Stamp Duty"}
              </Link>
              <Link href="/tools/sun-conditions" className="hover:text-[#1D281C] transition-colors">
                {lang === "no" ? "Solforhold" : "Sun Conditions"}
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#1D281C]">
              {lang === "no" ? "Boligpris per m² i Norge" : "Local Prices per m²"}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[#495647]">
              <Link href="/boligpris/oslo" className="hover:text-[#1D281C] transition-colors">Oslo</Link>
              <Link href="/boligpris/baerum" className="hover:text-[#1D281C] transition-colors">Bærum</Link>
              <Link href="/boligpris/bergen" className="hover:text-[#1D281C] transition-colors">Bergen</Link>
              <Link href="/boligpris/stavanger" className="hover:text-[#1D281C] transition-colors">Stavanger</Link>
              <Link href="/boligpris/trondheim" className="hover:text-[#1D281C] transition-colors">Trondheim</Link>
              <Link href="/boligpris/drammen" className="hover:text-[#1D281C] transition-colors">Drammen</Link>
              <Link href="/boligpris/kristiansand" className="hover:text-[#1D281C] transition-colors">Kristiansand</Link>
              <Link href="/boligpris/tromso" className="hover:text-[#1D281C] transition-colors">Tromsø</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#DCE2D4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[13px] sm:text-[14px] text-[#495647]">
          <p>
            © {new Date().getFullYear()} VurderBoligen —{" "}
            {lang === "no"
              ? "Norsk selgerportal for bolig og tomt."
              : "Norwegian Home & Land Seller Portal."}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacy-policy"
              className="hover:text-[#1D281C] underline underline-offset-4 transition-colors"
            >
              {lang === "no" ? "Personvern & GDPR" : "Privacy Policy & GDPR"}
            </Link>
            <button
              type="button"
              onClick={openConsentSettings}
              className="hover:text-[#1D281C] underline underline-offset-4 transition-colors cursor-pointer"
            >
              {lang === "no" ? "Cookie-innstillinger" : "Cookie Settings"}
            </button>
            <Link
              href="/connect-agency?source=nav"
              onClick={() => trackClick("nav")}
              className="hover:text-[#1D281C] underline underline-offset-4 transition-colors"
            >
              {lang === "no" ? "Start vurdering" : "Request Valuation"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
