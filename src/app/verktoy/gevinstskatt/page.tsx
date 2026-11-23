import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { CapitalGainsTaxTool } from "@/components/tools/CapitalGainsTaxTool";

export const metadata: Metadata = buildToolMetadata("capital-gains-tax");

export default function CapitalGainsTaxPage() {
  const tool = getToolBySlug("capital-gains-tax");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CapitalGainsTaxTool />
    </>
  );
}
