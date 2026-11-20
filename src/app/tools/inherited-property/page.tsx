import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { InheritedPropertyTool } from "@/components/tools/InheritedPropertyTool";

export const metadata: Metadata = buildToolMetadata("inherited-property");

export default function InheritedPropertyCalculatorPage() {
  const tool = getToolBySlug("inherited-property");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <InheritedPropertyTool />
    </>
  );
}
