"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import type { ToolCatalogEntry } from "@/data/norwayToolsData";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import { ToolIcon } from "@/components/ToolIcon";
import { ToolSeoGuide } from "@/components/ToolSeoGuide";

interface ToolShellProps {
  slug: string;
  iconKey: ToolCatalogEntry["iconKey"];
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  ctaSource: string;
  children: React.ReactNode;
}

export function ToolShell({
  slug,
  iconKey,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  ctaSource,
  children,
}: ToolShellProps) {
  const { lang, isModern, trackClick } = useApp();

  if (isModern) {
    return (
      <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
        <div className="max-w-5xl mx-auto mb-4">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DCE5DF] hover:border-[#147A53] text-[#1D281C] text-[14px] font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 text-[#147A53]" />
            <span>{lang === "no" ? "Alle 16 gratis verktøy" : "All 16 Free Tools"}</span>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto nm-card p-4 sm:p-10 space-y-6 sm:space-y-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#E6F2EC] text-[#0F3D2E] flex items-center justify-center shrink-0">
              <ToolIcon iconKey={iconKey} className="w-6 h-6 sm:w-7 sm:h-7" />
            </span>
            <div className="min-w-0">
              <h1 className="nm-h1">{title}</h1>
              <p className="nm-body-lg mt-2">{subtitle}</p>
            </div>
          </div>

          {children}

          <Link
            href={ctaHref}
            onClick={() => trackClick(ctaSource)}
            className="nm-btn-primary w-full min-h-[72px] sm:min-h-[82px] px-5 sm:px-7 py-4 sm:py-5 text-[18px] sm:text-2xl justify-between text-left"
          >
            <span>{ctaLabel}</span>
            <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
          </Link>
        </div>

        <ToolSeoGuide slug={slug} />
      </main>
    );
  }

  return (
    <main className="bg-[#FFFFFF] min-h-[calc(100vh-140px)] py-8 px-4 sm:py-12 sm:px-6 lg:py-16">
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-none bg-[#EDF0E7] border border-[#DCE2CF] hover:bg-[#DCE2CF] text-[#000000] text-[15px] font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 text-[#5D726A]" />
          <span>{lang === "no" ? "Alle 16 gratis verktøy" : "All 16 Free Tools"}</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto bg-[#FFFFFF] border border-[#DCE2CF] rounded-none p-6 sm:p-10 lg:p-12 space-y-6 sm:space-y-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#DCE2CF] border border-[#5D726A] text-[#000000] flex items-center justify-center shrink-0">
            <ToolIcon iconKey={iconKey} className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <div className="min-w-0">
            <h1 className="kr-h1">{title}</h1>
            <p className="kr-body-lg mt-2">{subtitle}</p>
          </div>
        </div>

        {children}

        <Link
          href={ctaHref}
          onClick={() => trackClick(ctaSource)}
          className="kr-btn-primary w-full min-h-[72px] sm:min-h-[84px] px-5 sm:px-7 py-4 sm:py-5 border-2 border-[#5D726A] text-[18px] sm:text-2xl justify-between text-left"
        >
          <span>{ctaLabel}</span>
          <ArrowRightIcon className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        </Link>
      </div>

      <ToolSeoGuide slug={slug} />
    </main>
  );
}
