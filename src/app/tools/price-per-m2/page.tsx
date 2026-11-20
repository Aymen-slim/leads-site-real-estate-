import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { PricePerM2Tool } from "@/components/tools/PricePerM2Tool";

export const metadata: Metadata = buildToolMetadata("price-per-m2");

export default function PricePerM2CalculatorPage() {
  const tool = getToolBySlug("price-per-m2");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PricePerM2Tool />
    </>
  );
}
