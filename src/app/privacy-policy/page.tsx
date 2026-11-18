"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowLeftIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/Icons";

export default function PrivacyPolicyPage() {
  const { lang } = useApp();

  const sections =
    lang === "no"
      ? [
          {
            title: "1. Hvem som er behandlingsansvarlig",
            body: "Krogsveen Stil driver denne norske selgerportalen for enebolig, byggetomt og leilighet. Vi behandler alle personopplysninger i samsvar med norsk personopplysningslov og EUs personvernforordning (GDPR).",
          },
          {
            title: "2. Hvilke opplysninger vi samler inn",
            body: "Når du bruker tjenesten eller ber om verdivurdering via «Koble til megler», samler vi kun inn opplysningene du frivillig oppgir: eiendomstype, kommune eller bydel, omtrentlig areal eller tilstand, samt navn, telefonnummer og e-postadresse.",
          },
          {
            title: "3. Hvordan opplysningene brukes og deles",
            body: "Opplysningene brukes utelukkende til å koble deg med relevante lokale eiendomsmeglere eller seriøse kjøpere som kan gi deg en gratis, uforpliktende verdivurdering eller et kjøpstilbud. Kontaktinformasjonen din blir aldri solgt til urelaterte tredjeparter.",
          },
          {
            title: "4. Lagringstid og nettleserdata",
            body: "Språkvalg og testvariant for brukeropplevelsen lagres lokalt i nettleseren din (localStorage) slik at siden husker dine valg. Henvendelser lagres kun så lenge det er nødvendig for å gi deg verdivurderingen eller oppfylle lovpålagte krav.",
          },
          {
            title: "5. Dine rettigheter etter GDPR",
            body: "Du har til enhver tid rett til innsyn i opplysningene dine, rett til retting, og rett til sletting eller tilbaketrekking av samtykke. Send en e-post til oss dersom du ønsker innsyn eller sletting.",
          },
          {
            title: "6. Kontakt for personvern og sletting",
            body: "Har du spørsmål om personvern, innsyn eller sletting av dine data? Kontakt oss på personvern@krogsveen-stil.no, så svarer vi innen én virkedag.",
          },
        ]
      : [
          {
            title: "1. Data Controller & Scope",
            body: "Krogsveen Stil operates this Norwegian property seller portal for houses, family villas, constructible land plots, and apartments. We process personal data in compliance with the Norwegian Personal Data Act and EU GDPR.",
          },
          {
            title: "2. Information We Collect",
            body: "When you request a valuation or submit an inquiry through Connect Agency, we collect only the details you voluntarily provide: property type, municipality or neighborhood, estimated size or condition, and your name, phone number, and email address.",
          },
          {
            title: "3. How Your Data Is Used & Shared",
            body: "Your details are used exclusively to match you with vetted local real-estate agencies or active buyers able to provide a free, non-binding valuation or direct purchase offer. We never sell your contact details to unrelated third parties.",
          },
          {
            title: "4. Retention & Browser Storage",
            body: "Language and interface preferences are stored locally in your browser (localStorage) to keep navigation consistent. Valuation inquiries are kept only for as long as needed to deliver your match or meet statutory obligations.",
          },
          {
            title: "5. Your Rights Under GDPR",
            body: "You have the right to request access to the personal data we hold about you, request correction of inaccurate information, object to processing, or ask for immediate deletion and withdrawal of consent at any time.",
          },
          {
            title: "6. Contact & Deletion Requests",
            body: "For any privacy questions, data access requests, or deletion requests, email us at personvern@krogsveen-stil.no and we will respond within one business day.",
          },
        ];

  return (
    <main className="bg-[#FFFFFF] py-10 sm:py-14">
      <div className="kr-container max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-[2px] bg-[#EDF0E7] border border-[#DCE2CF] text-[16px] font-medium text-[#000000] hover:bg-[#DCE2CF]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{lang === "no" ? "Tilbake til forsiden" : "Back to Home"}</span>
          </Link>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-[#EDF0E7] border border-[#DCE2CF] text-[#000000] text-[14px] font-medium">
            <ShieldCheckIcon className="w-4 h-4 text-[#5D726A]" />
            <span>
              {lang === "no"
                ? "Sist oppdatert: November 2026"
                : "Last updated: November 2026"}
            </span>
          </span>
        </div>

        <section className="bg-[#EDF0E7] border border-[#DCE2CF] rounded-[2px] p-6 sm:p-10 space-y-4">
          <h1 className="kr-display-serif text-[#000000]">
            {lang === "no" ? "Personvernerklæring" : "Privacy Policy"}
          </h1>
          <p className="kr-body-lg">
            {lang === "no"
              ? "Tydelig informasjon om hvordan vi beskytter eiendoms- og kontaktopplysningene dine."
              : "Clear, plain-language explanation of how we protect your property and contact details."}
          </p>
        </section>

        <section className="space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="bg-[#FFFFFF] border border-[#DFDFDF] rounded-[2px] p-6 sm:p-8 space-y-2"
            >
              <h2 className="kr-h3 text-[#000000]">{section.title}</h2>
              <p className="text-[17px] leading-[1.6] text-[#292823]">
                {section.body}
              </p>
            </article>
          ))}
        </section>

        <section className="bg-[#DCE2CF] rounded-[2px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="kr-h3 text-[#000000]">
              {lang === "no"
                ? "Klar til å sjekke verdien på boligen?"
                : "Ready to get a local property valuation?"}
            </h2>
            <p className="text-[16px] text-[#292823] mt-1">
              {lang === "no"
                ? "Helt gratis og uforpliktende på under ett minutt."
                : "Completely free and non-binding in under one minute."}
            </p>
          </div>
          <Link
            href="/connect-agency"
            className="kr-btn-primary border border-[#5D726A] w-full sm:w-auto shrink-0"
          >
            <span>
              {lang === "no" ? "Koble til megler" : "Connect Agency"}
            </span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </main>
  );
}
