import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { GroundLeaseTool } from "@/components/tools/GroundLeaseTool";

export const metadata: Metadata = buildToolMetadata("ground-lease");

export default function GroundLeasePage() {
  const tool = getToolBySlug("ground-lease");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <GroundLeaseTool />
    </>
  );
}
