import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { RentOrSellTool } from "@/components/tools/RentOrSellTool";

export const metadata: Metadata = buildToolMetadata("rent-or-sell");

export default function RentOrSellPage() {
  const tool = getToolBySlug("rent-or-sell");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <RentOrSellTool />
    </>
  );
}
