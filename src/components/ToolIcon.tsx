import React from "react";
import type { ToolCatalogEntry } from "@/data/norwayToolsData";
import {
  HouseIcon,
  LandPlotIcon,
  ScaleMeasureIcon,
  UsersFamilyIcon,
  PaintRollerIcon,
  TaxDocumentIcon,
  HandshakeSplitIcon,
  BriefcasePercentIcon,
  BridgeArrowsIcon,
  KeyRentIcon,
  LandmarkTaxIcon,
  StampReceiptIcon,
  CabinMountainIcon,
  BoltFastIcon,
  CompassLeaseIcon,
  SunHorizonIcon,
} from "@/components/Icons";

export function ToolIcon({
  iconKey,
  className = "w-6 h-6 sm:w-7 sm:h-7",
}: {
  iconKey: ToolCatalogEntry["iconKey"];
  className?: string;
}) {
  switch (iconKey) {
    case "price-m2":
      return <ScaleMeasureIcon className={className} />;
    case "net-cash":
      return <HouseIcon className={className} />;
    case "land":
      return <LandPlotIcon className={className} />;
    case "inheritance":
      return <UsersFamilyIcon className={className} />;
    case "as-is":
      return <PaintRollerIcon className={className} />;
    case "tax-calc":
      return <TaxDocumentIcon className={className} />;
    case "partner-buyout":
      return <HandshakeSplitIcon className={className} />;
    case "broker-fee":
      return <BriefcasePercentIcon className={className} />;
    case "bridge-loan":
      return <BridgeArrowsIcon className={className} />;
    case "rent-or-sell":
      return <KeyRentIcon className={className} />;
    case "property-tax":
      return <LandmarkTaxIcon className={className} />;
    case "document-fee":
      return <StampReceiptIcon className={className} />;
    case "cabin-cost":
      return <CabinMountainIcon className={className} />;
    case "energy-rating":
      return <BoltFastIcon className={className} />;
    case "ground-lease":
      return <CompassLeaseIcon className={className} />;
    case "sun-conditions":
      return <SunHorizonIcon className={className} />;
    default:
      return <ScaleMeasureIcon className={className} />;
  }
}
