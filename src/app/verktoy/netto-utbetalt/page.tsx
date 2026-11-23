import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { NetCashTool } from "@/components/tools/NetCashTool";

export const metadata: Metadata = buildToolMetadata("net-cash");

export default function NetCashCalculatorPage() {
  const tool = getToolBySlug("net-cash");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <NetCashTool />
    </>
  );
}
