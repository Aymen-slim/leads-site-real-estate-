import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/connect-agency", destination: "/koble-til-megler", permanent: true },
      { source: "/sell", destination: "/selg", permanent: true },
      { source: "/privacy-policy", destination: "/personvern", permanent: true },
      { source: "/tools", destination: "/verktoy", permanent: true },
      { source: "/tools/price-per-m2", destination: "/verktoy/pris-per-m2", permanent: true },
      { source: "/tools/net-cash", destination: "/verktoy/netto-utbetalt", permanent: true },
      { source: "/tools/land-buildability", destination: "/verktoy/tomtedeling", permanent: true },
      { source: "/tools/inherited-property", destination: "/verktoy/arvet-bolig", permanent: true },
      { source: "/tools/sell-as-is", destination: "/verktoy/selge-som-den-er", permanent: true },
      { source: "/tools/capital-gains-tax", destination: "/verktoy/gevinstskatt", permanent: true },
      { source: "/tools/partner-buyout", destination: "/verktoy/kjope-ut-samboer", permanent: true },
      { source: "/tools/broker-fee", destination: "/verktoy/meglerkostnad", permanent: true },
      { source: "/tools/bridge-loan", destination: "/verktoy/mellomfinansiering", permanent: true },
      { source: "/tools/rent-or-sell", destination: "/verktoy/leie-ut-eller-selge", permanent: true },
      { source: "/tools/property-tax", destination: "/verktoy/eiendomsskatt", permanent: true },
      {
        source: "/tools/property-tax/:municipality",
        destination: "/verktoy/eiendomsskatt/:municipality",
        permanent: true,
      },
      { source: "/tools/document-fee", destination: "/verktoy/dokumentavgift", permanent: true },
      { source: "/tools/cabin-cost", destination: "/verktoy/hyttekostnad", permanent: true },
      { source: "/tools/energy-rating", destination: "/verktoy/energimerking", permanent: true },
      { source: "/tools/ground-lease", destination: "/verktoy/tomtefeste", permanent: true },
      { source: "/tools/sun-conditions", destination: "/verktoy/solforhold", permanent: true },
    ];
  },
};

export default nextConfig;
