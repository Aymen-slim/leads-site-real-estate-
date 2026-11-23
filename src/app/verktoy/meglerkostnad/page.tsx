import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { BrokerFeeTool } from "@/components/tools/BrokerFeeTool";

export const metadata: Metadata = buildToolMetadata("broker-fee");

export default function BrokerFeePage() {
  const tool = getToolBySlug("broker-fee");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BrokerFeeTool />
    </>
  );
}
