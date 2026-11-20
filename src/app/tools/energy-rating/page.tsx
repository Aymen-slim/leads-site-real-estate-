import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { EnergyRatingTool } from "@/components/tools/EnergyRatingTool";

export const metadata: Metadata = buildToolMetadata("energy-rating");

export default function EnergyRatingPage() {
  const tool = getToolBySlug("energy-rating");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <EnergyRatingTool />
    </>
  );
}
