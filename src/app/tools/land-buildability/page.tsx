import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { LandBuildabilityTool } from "@/components/tools/LandBuildabilityTool";

export const metadata: Metadata = buildToolMetadata("land-buildability");

export default function LandBuildabilityCalculatorPage() {
  const tool = getToolBySlug("land-buildability");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <LandBuildabilityTool />
    </>
  );
}
