import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { SellAsIsTool } from "@/components/tools/SellAsIsTool";

export const metadata: Metadata = buildToolMetadata("sell-as-is");

export default function SellAsIsCalculatorPage() {
  const tool = getToolBySlug("sell-as-is");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <SellAsIsTool />
    </>
  );
}
