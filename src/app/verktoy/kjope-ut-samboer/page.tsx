import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { PartnerBuyoutTool } from "@/components/tools/PartnerBuyoutTool";

export const metadata: Metadata = buildToolMetadata("partner-buyout");

export default function PartnerBuyoutPage() {
  const tool = getToolBySlug("partner-buyout");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PartnerBuyoutTool />
    </>
  );
}
