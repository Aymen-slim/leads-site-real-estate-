import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { BridgeLoanTool } from "@/components/tools/BridgeLoanTool";

export const metadata: Metadata = buildToolMetadata("bridge-loan");

export default function BridgeLoanPage() {
  const tool = getToolBySlug("bridge-loan");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BridgeLoanTool />
    </>
  );
}
