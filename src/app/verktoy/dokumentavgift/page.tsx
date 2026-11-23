import type { Metadata } from "next";
import { buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/data/norwayToolsData";
import { DocumentFeeTool } from "@/components/tools/DocumentFeeTool";

export const metadata: Metadata = buildToolMetadata("document-fee");

export default function DocumentFeePage() {
  const tool = getToolBySlug("document-fee");
  const jsonLd = tool ? buildToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <DocumentFeeTool />
    </>
  );
}
