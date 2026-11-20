import type { Metadata } from "next";
import {
  getMunicipalityTax,
  getToolBySlug,
  ToolCatalogEntry,
} from "@/data/norwayToolsData";
import { CityData, NeighborhoodData, formatNok } from "@/data/norwayData";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vurderboligen.no"
).replace(/\/$/, "");

export function buildToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return {
      title: "Gratis boligkalkulator | VurderBoligen",
      description:
        "Gratis norske boligkalkulatorer og lokal verdivurdering fra erfarne eiendomsmeglere.",
    };
  }

  const canonical = `${SITE_URL}${tool.path}`;
  return {
    title: tool.seoTitleNo,
    description: tool.seoDescNo,
    keywords: tool.seoKeywordsNo,
    alternates: { canonical },
    openGraph: {
      title: tool.seoTitleNo,
      description: tool.seoDescNo,
      url: canonical,
      siteName: "VurderBoligen",
      locale: "nb_NO",
      type: "website",
    },
  };
}

export function buildToolJsonLd(tool: ToolCatalogEntry) {
  const url = `${SITE_URL}${tool.path}`;
  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.titleNo,
    description: tool.seoDescNo,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: ["nb", "en"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NOK",
    },
    provider: {
      "@type": "Organization",
      name: "VurderBoligen",
      url: SITE_URL,
    },
  };

  const faqPage =
    tool.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((item) => ({
            "@type": "Question",
            name: item.qNo,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.aNo,
            },
          })),
        }
      : null;

  return faqPage ? [webApp, faqPage] : [webApp];
}

export function buildLocalPriceMetadata(
  city: CityData,
  area?: NeighborhoodData
): Metadata {
  if (area) {
    const title = `Boligpris ${area.name} (${city.name}) 2026 — ${formatNok(
      area.housePriceM2
    )}/m² | VurderBoligen`;
    const description = `Oppdatert kvadratmeterpris i ${area.name}, ${city.name}: Enebolig ${formatNok(
      area.housePriceM2
    )}/m², byggetomt ${formatNok(area.landPriceM2)}/m², snitt salgstid ${
      area.avgDaysToSell
    } dager og +${area.yoyGrowthPct} % prisvekst.`;
    const canonical = `${SITE_URL}/boligpris/${city.id}/${area.id}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "VurderBoligen",
        locale: "nb_NO",
        type: "website",
      },
    };
  }

  const avgHouse = Math.round(
    city.neighborhoods.reduce((s, n) => s + n.housePriceM2, 0) /
      city.neighborhoods.length
  );
  const title = `Boligpris ${city.name} (2026) — Pris per m² for enebolig og tomt | VurderBoligen`;
  const description = `Sjekk oppdatert kvadratmeterpris per bydel i ${city.name} (${city.regionNo}). Snittpris enebolig ca. ${formatNok(
    avgHouse
  )}/m². Gratis oppslag og lokal verdivurdering.`;
  const canonical = `${SITE_URL}/boligpris/${city.id}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "VurderBoligen",
      locale: "nb_NO",
      type: "website",
    },
  };
}

export function buildPropertyTaxMetadata(municipalityId: string): Metadata {
  const rule = getMunicipalityTax(municipalityId);
  if (!rule) return buildToolMetadata("property-tax");

  const title = rule.hasResidentialTax
    ? `Eiendomsskatt ${rule.name} (2026) — ${rule.promilleHome
        .toFixed(2)
        .replace(".", ",")} promille kalkulator | VurderBoligen`
    : `Eiendomsskatt ${rule.name} (2026) — 0 kr på bolig og hytte | VurderBoligen`;
  const description = `Beregn eiendomsskatt i ${rule.name} (${rule.countyNo}) for 2026. ${rule.noteNo}`;
  const canonical = `${SITE_URL}/tools/property-tax/${rule.id}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "VurderBoligen",
      locale: "nb_NO",
      type: "website",
    },
  };
}
