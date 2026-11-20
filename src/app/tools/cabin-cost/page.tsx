import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { CabinCostTool } from "@/components/tools/CabinCostTool";

export const metadata: Metadata = buildToolMetadata("cabin-cost");

export default function CabinCostPage() {
  const tool = getToolBySlug("cabin-cost");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CabinCostTool />
    </>
  );
}
