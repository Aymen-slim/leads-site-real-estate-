import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import { TOOL_CATALOG } from "@/data/norwayToolsData";
import { ToolsHubClient } from "@/components/tools/ToolsHubClient";

export const metadata: Metadata = {
  title:
    "16 Gratis boligkalkulatorer for selgere i Norge (2026) | VurderBoligen",
  description:
    "Alle gratis norske kalkulatorer for bolig: Pris per m², netto utbetalt, meglerkostnad, gevinstskatt, utkjøp av samboer, mellomfinansiering, leie ut vs selge, eiendomsskatt, dokumentavgift, hyttekostnad, energimerking, tomtefeste og solforhold.",
  alternates: { canonical: `${SITE_URL}/verktoy` },
  openGraph: {
    title: "16 Gratis boligkalkulatorer for selgere i Norge | VurderBoligen",
    description:
      "Beregn boligverdi, skatt, meglerkostnader, eiendomsskatt, utkjøp av samboer og solforhold gratis på sekunder.",
    url: `${SITE_URL}/verktoy`,
    siteName: "VurderBoligen",
    locale: "nb_NO",
    type: "website",
  },
};

export default function FreeToolsHubPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gratis norske boligkalkulatorer — VurderBoligen",
    numberOfItems: TOOL_CATALOG.length,
    itemListElement: TOOL_CATALOG.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.titleNo,
      url: `${SITE_URL}${tool.path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <ToolsHubClient />
    </>
  );
}
