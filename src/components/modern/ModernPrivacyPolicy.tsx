"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { openConsentSettings } from "@/lib/consent";
import { ArrowLeftIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/Icons";

export function ModernPrivacyPolicy() {
  const { lang, trackClick } = useApp();

  const sections =
    lang === "no"
      ? [
          {
            title: "1. Hvem som er behandlingsansvarlig",
            body: "VurderBoligen driver denne norske selgerportalen for bolig, enebolig, byggetomt og leilighet. Vi tar personvernet ditt på alvor og behandler alle personopplysninger i samsvar med norsk personopplysningslov og EUs personvernforordning (GDPR).",
          },
          {
            title: "2. Hvilke opplysninger vi samler inn",
            body: "Når du bruker vår tjeneste eller ber om verdivurdering via «Koble til megler», samler vi kun inn opplysningene du frivillig oppgir: eiendomstype, kommune eller bydel, omtrentlig areal eller tilstand, samt navn og telefonnummer slik at vi kan formidle et konkret svar.",
          },
          {
            title: "3. Hvordan opplysningene brukes og deles",
            body: "Opplysningene brukes utelukkende til å koble deg med relevante lokale eiendomsmeglere eller seriøse kjøpere som kan gi deg en gratis, uforpliktende verdivurdering eller et kjøpstilbud. Kontaktinformasjonen din blir aldri solgt til urelaterte markedsføringsselskaper eller spam-lister.",
          },
          {
            title: "4. Informasjonskapsler, samtykke og analyse",
            body: "Nødvendige informasjonskapsler (kr_lang, kr_ab, kr_consent) husker språkvalg, sideversjon og samtykkevalget ditt. Valgfri analyse (kr_vid og Google Analytics 4) aktiveres kun dersom du trykker «Godta alle». Du kan endre eller trekke tilbake samtykket ditt når som helst.",
          },
          {
            title: "5. Dine rettigheter etter GDPR",
            body: "Du har til enhver tid rett til innsyn i hvilke opplysninger vi har lagret om deg, rett til å be om retting av feil informasjon, og rett til å få opplysningene slettet eller trekke tilbake samtykket ditt. Send oss en e-post for rask behandling.",
          },
          {
            title: "6. Kontakt for personvern og sletting",
            body: "Har du spørsmål om personvern, innsyn eller sletting av dine opplysninger? Kontakt oss direkte på personvern@vurderboligen.no, så svarer vi innen én virkedag.",
          },
        ]
      : [
          {
            title: "1. Data Controller & Scope",
            body: "VurderBoligen operates this Norwegian property seller portal for houses, family villas, constructible land plots, and apartments. We process personal data strictly in compliance with the Norwegian Personal Data Act (Personopplysningsloven) and the EU General Data Protection Regulation (GDPR).",
          },
          {
            title: "2. Information We Collect",
            body: "When you request a valuation or submit an inquiry through Connect Agency, we collect only the details you voluntarily provide: property type, municipality/neighborhood, estimated area or condition, and your name and phone number so a local advisor can follow up.",
          },
          {
            title: "3. How Your Data Is Used & Shared",
            body: "Your details are used exclusively to match you with vetted local real-estate agencies or active buyers able to provide a free, non-binding valuation or direct purchase offer. We never sell or rent your contact details to unrelated third-party marketing lists.",
          },
          {
            title: "4. Cookies, Consent & Analytics",
            body: "Strictly necessary cookies (kr_lang, kr_ab, kr_consent) remember your language choice, keep layout consistent across visits, and save your consent preference. Optional analytics (kr_vid and Google Analytics 4) only run if you click 'Accept all'. You can update or withdraw consent anytime.",
          },
          {
            title: "5. Your Rights Under GDPR",
            body: "You have the right to request access to the personal data we hold about you, request correction of inaccurate information, object to processing, or ask for immediate deletion and withdrawal of consent at any time.",
          },
          {
            title: "6. Contact & Deletion Requests",
            body: "For any privacy questions, data access requests, or deletion requests, email us at personvern@vurderboligen.no and we will respond within one business day.",
          },
        ];

  return (
    <main className="bg-[#F4F5F0] py-10 sm:py-14 lg:py-16">
      <div className="nm-container max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#DCE2D4] text-[15px] font-medium text-[#1D281C] hover:bg-[#E7ECE0] transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{lang === "no" ? "Tilbake til forsiden" : "Back to Home"}</span>
          </Link>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E7ECE0] border border-[#D4DCCB] text-[#243323] text-[14px] font-semibold">
            <ShieldCheckIcon className="w-4 h-4 text-[#243323]" />
            <span>
              {lang === "no"
                ? "GDPR-trygg · Sist oppdatert: November 2026"
                : "GDPR Compliant · Last updated: November 2026"}
            </span>
          </span>
        </div>

        <section className="nm-card p-6 sm:p-10 lg:p-12 space-y-4">
          <h1 className="nm-display text-[#1D281C]">
            {lang === "no" ? "Personvernerklæring & GDPR" : "Privacy Policy & GDPR"}
          </h1>
          <p className="nm-body-lg">
            {lang === "no"
              ? "Tydelig informasjon på vanlig språk om hvordan vi beskytter eiendoms- og kontaktopplysningene dine."
              : "Clear, plain-language explanation of how we protect your property and contact details."}
          </p>
        </section>

        <section className="space-y-4">
          {sections.map((section) => (
            <article key={section.title} className="nm-card p-6 sm:p-8 space-y-2.5">
              <h2 className="nm-h3 text-[#1D281C]">{section.title}</h2>
              <p className="text-[16px] sm:text-[17px] leading-[1.65] text-[#495647]">
                {section.body}
              </p>
            </article>
          ))}
        </section>

        <section className="bg-[#E7ECE0] border border-[#D4DCCB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="nm-h3 text-[#1D281C]">
              {lang === "no"
                ? "Klar til å sjekke verdien på boligen?"
                : "Ready to get a local property valuation?"}
            </h2>
            <p className="text-[16px] text-[#495647] mt-1">
              {lang === "no"
                ? "Helt gratis og uforpliktende på under ett minutt."
                : "Completely free and non-binding in under one minute."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openConsentSettings}
              className="nm-btn-secondary w-full sm:w-auto"
            >
              {lang === "no" ? "Endre cookie-valg" : "Cookie Settings"}
            </button>
            <Link
              href="/connect-agency?source=nav"
              onClick={() => trackClick("nav")}
              className="nm-btn-primary w-full sm:w-auto shrink-0"
            >
              <span>{lang === "no" ? "Koble til megler" : "Connect Agency"}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
