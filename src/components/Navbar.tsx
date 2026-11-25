"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ArrowRightIcon } from "@/components/Icons";
import { ModernNavbar } from "@/components/modern/ModernNavbar";

export function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, isModern, trackClick } = useApp();

  if (pathname.startsWith("/admin")) return null;
  if (isModern) return <ModernNavbar />;

  const isHome = pathname === "/";
  const isTools = pathname.startsWith("/verktoy") || pathname.startsWith("/tools") || pathname.startsWith("/boligpris");
  const isAgency = pathname === "/koble-til-megler" || pathname === "/selg" || pathname === "/connect-agency" || pathname === "/sell";

  return (
    <header className="bg-[#EDF0E7] text-[#292823] border-b border-[#DCE2CF] sm:sticky sm:top-0 z-40">
      <div className="kr-container">
        <div className="flex flex-row items-center justify-between py-3.5 sm:py-4 gap-3 min-h-[68px] md:min-h-[78px]">
          <Link
            href="/"
            className="inline-flex items-center min-h-[44px] w-fit focus-visible:outline-2 focus-visible:outline-[#5D726A]"
          >
            <Image
              src="/images/vurderboligen-logo.png"
              alt="VurderBoligen"
              width={210}
              height={36}
              priority
              className="h-8 sm:h-9 w-auto"
            />
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop Navigation */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex md:flex-wrap items-center gap-3 w-auto"
            >
              <Link
                href="/"
                className={`min-h-[48px] px-4 py-2.5 rounded-none text-[16px] sm:text-[17px] font-medium flex items-center justify-center transition-colors active:scale-[0.985] ${isHome
                  ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                  : "bg-[#FFFFFF]/60 sm:bg-transparent text-[#292823] hover:bg-[#DCE2CF]"
                  }`}
              >
                {lang === "no" ? "Hjem" : "Home"}
              </Link>

              <Link
                href="/verktoy"
                className={`min-h-[48px] px-4 py-2.5 rounded-none text-[16px] sm:text-[17px] font-medium flex items-center justify-center transition-colors active:scale-[0.985] ${isTools
                  ? "bg-[#FFFFFF] text-[#000000] border border-[#5D726A]"
                  : "bg-[#FFFFFF]/60 sm:bg-transparent text-[#292823] hover:bg-[#DCE2CF]"
                  }`}
              >
                {lang === "no" ? "Gratis verktøy" : "Free Tools"}
              </Link>

              <Link
                href="/koble-til-megler?source=nav"
                onClick={() => trackClick("nav")}
                className={`col-span-2 sm:col-span-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-none text-[16px] sm:text-[17px] font-medium transition-colors active:scale-[0.985] ${isAgency
                  ? "bg-[#5D726A] text-[#FFFFFF]"
                  : "bg-[#B8C49E] hover:bg-[#C5D0AF] text-[#000000]"
                  }`}
              >
                <span>
                  {lang === "no"
                    ? "Få gratis verdivurdering og e-takst"
                    : "Get free valuation and e-appraisal"}
                </span>
                <ArrowRightIcon className="w-4 h-4 shrink-0" />
              </Link>
            </nav>

            {/* Always-reachable NO / EN Language Selector */}
            <div
              role="group"
              aria-label="Language selector"
              className="inline-flex rounded-none bg-[#FFFFFF] border border-[#DCE2CF] p-0.5 gap-0.5 shrink-0"
            >
              <button
                type="button"
                onClick={() => setLang("no")}
                aria-pressed={lang === "no"}
                className={`min-h-[40px] px-2.5 sm:px-3 rounded-none text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer ${lang === "no"
                  ? "bg-[#292823] text-[#FFFFFF]"
                  : "text-[#000000] hover:bg-[#DCE2CF]"
                  }`}
              >
                NO
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`min-h-[40px] px-2.5 sm:px-3 rounded-none text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer ${lang === "en"
                  ? "bg-[#292823] text-[#FFFFFF]"
                  : "text-[#000000] hover:bg-[#DCE2CF]"
                  }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
