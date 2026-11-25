"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { getToolBySlug, type ToolCatalogEntry } from "@/data/norwayToolsData";
import { ArrowLeftIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/Icons";
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
  const tool = getToolBySlug(slug);
  const referenceYear = tool?.referenceYear || "2026";
  const sourceNames = tool?.sources?.map((s) => s.name) || [];

  if (isModern) {
    return (
      <main className="bg-[#F8FAF9] min-h-[calc(100vh-140px)] py-6 px-3 sm:py-10 sm:px-6">
        <div className="max-w-5xl mx-auto mb-4">
          <Link
            href="/verktoy"
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

          {tool && (
            <div className="rounded-xl bg-[#F8FAF9] border border-[#DCE5DF] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[13px] sm:text-[14px]">
              <div className="flex flex-wrap items-center gap-2 text-[#3B4D44]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F3D2E]">
                  <ShieldCheckIcon className="w-4 h-4 text-[#147A53] shrink-0" />
                  <span>
                    {lang === "no"
                      ? `Kilder (${referenceYear}):`
                      : `Sources (${referenceYear}):`}
                  </span>
                </span>
                {sourceNames.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {sourceNames.map((name) => (
                      <span
                        key={name}
                        className="px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#DCE5DF] text-[#1D281C] text-[12px] font-medium"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span>{lang === "no" ? tool.dataSourceNo : tool.dataSourceEn}</span>
                )}
              </div>
              <a
                href="#kilder-og-grunnlag"
                className="font-semibold text-[#147A53] hover:text-[#0F3D2E] underline underline-offset-4 shrink-0"
              >
                {lang === "no" ? "Se beregningsgrunnlag" : "View methodology"}
              </a>
            </div>
          )}

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
          href="/verktoy"
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

        {tool && (
          <div className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-none px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[14px]">
            <div className="flex flex-wrap items-center gap-2 text-[#292823]">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#000000]">
                <ShieldCheckIcon className="w-4 h-4 text-[#5D726A] shrink-0" />
                <span>
                  {lang === "no"
                    ? `Kilder (${referenceYear}):`
                    : `Sources (${referenceYear}):`}
                </span>
              </span>
              {sourceNames.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {sourceNames.map((name) => (
                    <span
                      key={name}
                      className="px-2.5 py-0.5 bg-[#FFFFFF] border border-[#BFBFBD] text-[#000000] text-[13px] font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <span>{lang === "no" ? tool.dataSourceNo : tool.dataSourceEn}</span>
              )}
            </div>
            <a
              href="#kilder-og-grunnlag"
              className="font-medium text-[#000000] underline decoration-[#5D726A] underline-offset-4 shrink-0"
            >
              {lang === "no" ? "Se beregningsgrunnlag" : "View methodology"}
            </a>
          </div>
        )}

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
