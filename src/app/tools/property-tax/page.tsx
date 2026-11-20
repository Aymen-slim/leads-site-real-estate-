import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { PropertyTaxTool } from "@/components/tools/PropertyTaxTool";

export const metadata: Metadata = buildToolMetadata("property-tax");

export default function PropertyTaxPage() {
  const tool = getToolBySlug("property-tax");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PropertyTaxTool />
    </>
  );
}
