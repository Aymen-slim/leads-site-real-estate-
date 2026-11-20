import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { SunConditionsTool } from "@/components/tools/SunConditionsTool";

export const metadata: Metadata = buildToolMetadata("sun-conditions");

export default function SunConditionsPage() {
  const tool = getToolBySlug("sun-conditions");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <SunConditionsTool />
    </>
  );
}
