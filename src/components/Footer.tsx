"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { HouseIcon, ShieldCheckIcon, ArrowRightIcon } from "@/components/Icons";

export function Footer() {
  const { lang, t } = useApp();

  return (
    <footer className="bg-[#EDF0E7] text-[#292823] border-t border-[#DCE2CF]">
      <div className="kr-container py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Brand & Neutral Valuation Notice */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-[#000000] min-h-[44px]"
            >
              <span className="w-10 h-10 rounded-[2px] bg-[#000000] text-[#EDF0E7] flex items-center justify-center shrink-0">
                <HouseIcon className="w-5 h-5" />
              </span>
              <span className="text-[22px] font-medium tracking-tight text-[#000000] leading-none">
                Krogsveen Stil
              </span>
            </Link>

            <p className="text-[16px] text-[#292823] leading-relaxed max-w-md">
              {t.landing.ergonomicsDesc}
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[2px] bg-[#FFFFFF] border border-[#DCE2CF] text-[14px] font-medium text-[#000000]">
              <ShieldCheckIcon className="w-4 h-4 text-[#5D726A] shrink-0" />
              <span>
                {lang === "no"
                  ? "Uforpliktende & GDPR-trygg tjeneste i Norge"
                  : "Free, neutral & Norwegian GDPR compliant"}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-[15px] font-semibold uppercase tracking-wider text-[#000000]">
              {lang === "no" ? "Snarveier" : "Navigation"}
            </h2>
            <ul className="space-y-1.5 text-[16px]">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center min-h-[44px] text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] underline-offset-4"
                >
                  {lang === "no" ? "Hjem" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="/connect-agency"
                  className="inline-flex items-center min-h-[44px] text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] underline-offset-4"
                >
                  {lang === "no" ? "Koble til megler" : "Connect Agency"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center min-h-[44px] text-[#292823] hover:text-[#000000] underline decoration-[#5D726A] underline-offset-4"
                >
                  {lang === "no" ? "Personvernerklæring" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Privacy & Data Protection */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-[15px] font-semibold uppercase tracking-wider text-[#000000]">
              {lang === "no" ? "Personvern & Trygghet" : "Privacy & Data Care"}
            </h2>
            <p className="text-[15px] text-[#292823] leading-relaxed">
              {lang === "no"
                ? "Opplysninger du sender inn brukes kun til å gi deg verdivurdering fra lokale meglere. Vi selger aldri kontaktdata til tredjeparter."
                : "Details you submit are used solely to connect you with matched local real-estate agencies for a valuation. We never sell your contact details."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[2px] bg-[#FFFFFF] border border-[#5D726A] text-[#000000] hover:bg-[#DCE2CF] text-[15px] font-medium transition-colors"
              >
                <span>
                  {lang === "no" ? "Les personvern" : "Privacy Policy"}
                </span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <a
                href="mailto:personvern@krogsveen-stil.no"
                className="inline-flex items-center min-h-[44px] text-[15px] font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4"
              >
                personvern@krogsveen-stil.no
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-10 pt-6 border-t border-[#DCE2CF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[14px] text-[#292823]">
          <p>
            © {new Date().getFullYear()} Krogsveen Stil —{" "}
            {lang === "no"
              ? "Norsk selgerportal for bolig og tomt."
              : "Norwegian Home & Land Seller Portal."}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacy-policy"
              className="hover:text-[#000000] underline underline-offset-4"
            >
              {lang === "no" ? "Personvern & GDPR" : "Privacy Policy & GDPR"}
            </Link>
            <Link
              href="/connect-agency"
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
