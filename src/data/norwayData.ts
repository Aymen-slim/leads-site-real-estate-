export interface NeighborhoodData {
  id: string;
  name: string;
  housePriceM2: number; // NOK per m² for Houses / Villas
  landPriceM2: number;  // NOK per m² for Constructible Land
  avgDaysToSell: number;
  yoyGrowthPct: number;
  buyerDemandScore: number; // 1-100
  lat: number;
  lng: number;
}

export interface CityData {
  id: string;
  name: string;
  regionNo: string;
  regionEn: string;
  neighborhoods: NeighborhoodData[];
}

export const NORWAY_CITIES: CityData[] = [
  {
    id: "oslo",
    name: "Oslo",
    regionNo: "Oslo og Østlandet",
    regionEn: "Oslo & Eastern Norway",
    neighborhoods: [
      {
        id: "frogner",
        name: "Frogner / Bygdøy",
        housePriceM2: 124500,
        landPriceM2: 46800,
        avgDaysToSell: 19,
        yoyGrowthPct: 6.8,
        buyerDemandScore: 96,
        lat: 59.9171,
        lng: 10.7035,
      },
      {
        id: "vestre-aker",
        name: "Vestre Aker / Holmenkollen",
        housePriceM2: 108200,
        landPriceM2: 39500,
        avgDaysToSell: 22,
        yoyGrowthPct: 6.2,
        buyerDemandScore: 94,
        lat: 59.9565,
        lng: 10.6691,
      },
      {
        id: "nordre-aker",
        name: "Nordre Aker / Ullevål",
        housePriceM2: 104800,
        landPriceM2: 37900,
        avgDaysToSell: 18,
        yoyGrowthPct: 6.5,
        buyerDemandScore: 95,
        lat: 59.9482,
        lng: 10.7512,
      },
      {
        id: "ullern",
        name: "Ullern / Skøyen",
        housePriceM2: 111400,
        landPriceM2: 41200,
        avgDaysToSell: 21,
        yoyGrowthPct: 5.9,
        buyerDemandScore: 92,
        lat: 59.9248,
        lng: 10.6524,
      },
      {
        id: "nordstrand",
        name: "Nordstrand / Bekkelaget",
        housePriceM2: 92600,
        landPriceM2: 33400,
        avgDaysToSell: 24,
        yoyGrowthPct: 5.7,
        buyerDemandScore: 91,
        lat: 59.8632,
        lng: 10.7889,
      },
      {
        id: "østensjø",
        name: "Østensjø / Oppsal",
        housePriceM2: 76400,
        landPriceM2: 26200,
        avgDaysToSell: 23,
        yoyGrowthPct: 5.4,
        buyerDemandScore: 89,
        lat: 59.8891,
        lng: 10.8342,
      },
    ],
  },
  {
    id: "baerum",
    name: "Bærum",
    regionNo: "Akershus Vest",
    regionEn: "Western Akershus",
    neighborhoods: [
      {
        id: "snaroya-fornebu",
        name: "Snarøya / Fornebu",
        housePriceM2: 102500,
        landPriceM2: 36900,
        avgDaysToSell: 24,
        yoyGrowthPct: 6.1,
        buyerDemandScore: 93,
        lat: 59.8938,
        lng: 10.6143,
      },
      {
        id: "stabekk-jar",
        name: "Stabekk / Jar",
        housePriceM2: 94800,
        landPriceM2: 33800,
        avgDaysToSell: 22,
        yoyGrowthPct: 5.8,
        buyerDemandScore: 92,
        lat: 59.9081,
        lng: 10.6062,
      },
      {
        id: "sandvika-blommenholm",
        name: "Sandvika / Blommenholm",
        housePriceM2: 86200,
        landPriceM2: 29400,
        avgDaysToSell: 26,
        yoyGrowthPct: 5.2,
        buyerDemandScore: 88,
        lat: 59.8908,
        lng: 10.5278,
      },
      {
        id: "bekkestua-haslum",
        name: "Bekkestua / Haslum",
        housePriceM2: 88900,
        landPriceM2: 31100,
        avgDaysToSell: 25,
        yoyGrowthPct: 5.5,
        buyerDemandScore: 90,
        lat: 59.9182,
        lng: 10.5886,
      },
    ],
  },
  {
    id: "bergen",
    name: "Bergen",
    regionNo: "Vestland",
    regionEn: "Western Norway",
    neighborhoods: [
      {
        id: "bergenshus-kalfaret",
        name: "Bergenhus / Kalfaret",
        housePriceM2: 78500,
        landPriceM2: 26800,
        avgDaysToSell: 25,
        yoyGrowthPct: 5.9,
        buyerDemandScore: 91,
        lat: 60.3885,
        lng: 5.3442,
      },
      {
        id: "fana-paradis",
        name: "Fana / Paradis",
        housePriceM2: 69400,
        landPriceM2: 23500,
        avgDaysToSell: 27,
        yoyGrowthPct: 5.4,
        buyerDemandScore: 90,
        lat: 60.3352,
        lng: 5.3481,
      },
      {
        id: "arstad-landas",
        name: "Årstad / Landås",
        housePriceM2: 64200,
        landPriceM2: 21100,
        avgDaysToSell: 24,
        yoyGrowthPct: 5.1,
        buyerDemandScore: 88,
        lat: 60.3651,
        lng: 5.3629,
      },
      {
        id: "ytrebygda-sandsli",
        name: "Ytrebygda / Sandsli",
        housePriceM2: 56800,
        landPriceM2: 18400,
        avgDaysToSell: 29,
        yoyGrowthPct: 4.8,
        buyerDemandScore: 85,
        lat: 60.2941,
        lng: 5.2815,
      },
    ],
  },
  {
    id: "stavanger",
    name: "Stavanger",
    regionNo: "Rogaland",
    regionEn: "Rogaland Region",
    neighborhoods: [
      {
        id: "eiganes-vaaland",
        name: "Eiganes og Våland",
        housePriceM2: 74200,
        landPriceM2: 25900,
        avgDaysToSell: 21,
        yoyGrowthPct: 7.4,
        buyerDemandScore: 94,
        lat: 58.9612,
        lng: 5.7185,
      },
      {
        id: "madla-hafrsfjord",
        name: "Madla / Hafrsfjord",
        housePriceM2: 62800,
        landPriceM2: 21400,
        avgDaysToSell: 24,
        yoyGrowthPct: 6.6,
        buyerDemandScore: 90,
        lat: 58.9481,
        lng: 5.6542,
      },
      {
        id: "hinna-gausel",
        name: "Hinna / Gausel",
        housePriceM2: 64900,
        landPriceM2: 22100,
        avgDaysToSell: 23,
        yoyGrowthPct: 6.9,
        buyerDemandScore: 91,
        lat: 58.9145,
        lng: 5.7318,
      },
    ],
  },
  {
    id: "trondheim",
    name: "Trondheim",
    regionNo: "Trøndelag",
    regionEn: "Central Norway",
    neighborhoods: [
      {
        id: "byasen-ila",
        name: "Byåsen / Ila",
        housePriceM2: 64500,
        landPriceM2: 20900,
        avgDaysToSell: 26,
        yoyGrowthPct: 4.9,
        buyerDemandScore: 88,
        lat: 63.4185,
        lng: 10.3512,
      },
      {
        id: "øya-singsaker",
        name: "Øya / Singsaker",
        housePriceM2: 79800,
        landPriceM2: 27400,
        avgDaysToSell: 20,
        yoyGrowthPct: 5.6,
        buyerDemandScore: 93,
        lat: 63.4228,
        lng: 10.4084,
      },
      {
        id: "lade-strindheim",
        name: "Lade / Strindheim",
        housePriceM2: 71200,
        landPriceM2: 24100,
        avgDaysToSell: 23,
        yoyGrowthPct: 5.3,
        buyerDemandScore: 90,
        lat: 63.4415,
        lng: 10.4452,
      },
    ],
  },
  {
    id: "drammen",
    name: "Drammen",
    regionNo: "Buskerud",
    regionEn: "Buskerud Region",
    neighborhoods: [
      {
        id: "bragernes-toppenhaug",
        name: "Bragernes / Toppenhaug",
        housePriceM2: 59400,
        landPriceM2: 19200,
        avgDaysToSell: 28,
        yoyGrowthPct: 4.7,
        buyerDemandScore: 87,
        lat: 59.7462,
        lng: 10.2045,
      },
      {
        id: "konnerud-skoger",
        name: "Konnerud / Skoger",
        housePriceM2: 49800,
        landPriceM2: 15800,
        avgDaysToSell: 31,
        yoyGrowthPct: 4.3,
        buyerDemandScore: 84,
        lat: 59.7185,
        lng: 10.1542,
      },
      {
        id: "åssiden-lier",
        name: "Åssiden / Lierstranda",
        housePriceM2: 53200,
        landPriceM2: 17100,
        avgDaysToSell: 29,
        yoyGrowthPct: 4.5,
        buyerDemandScore: 86,
        lat: 59.7542,
        lng: 10.1489,
      },
    ],
  },
  {
    id: "kristiansand",
    name: "Kristiansand",
    regionNo: "Agder",
    regionEn: "Southern Norway",
    neighborhoods: [
      {
        id: "lund-kuholmen",
        name: "Lund / Kuholmen",
        housePriceM2: 61800,
        landPriceM2: 20400,
        avgDaysToSell: 26,
        yoyGrowthPct: 5.8,
        buyerDemandScore: 89,
        lat: 58.1512,
        lng: 8.0185,
      },
      {
        id: "vaagsbygd-flekkeroy",
        name: "Vågsbygd / Flekkerøy",
        housePriceM2: 51400,
        landPriceM2: 16900,
        avgDaysToSell: 30,
        yoyGrowthPct: 5.1,
        buyerDemandScore: 86,
        lat: 58.1145,
        lng: 7.9682,
      },
    ],
  },
  {
    id: "tromso",
    name: "Tromsø",
    regionNo: "Troms",
    regionEn: "Northern Norway",
    neighborhoods: [
      {
        id: "tromsoya-sor",
        name: "Tromsøya Sør / Sentrum",
        housePriceM2: 66900,
        landPriceM2: 22300,
        avgDaysToSell: 25,
        yoyGrowthPct: 5.2,
        buyerDemandScore: 90,
        lat: 69.6492,
        lng: 18.9553,
      },
      {
        id: "kvaloysletta",
        name: "Kvaløysletta / Tomasjord",
        housePriceM2: 54200,
        landPriceM2: 17600,
        avgDaysToSell: 29,
        yoyGrowthPct: 4.6,
        buyerDemandScore: 85,
        lat: 69.6852,
        lng: 18.8641,
      },
    ],
  },
];

export interface LandSizeOption {
  id: string;
  labelEn: string;
  labelNo: string;
  avgSqm: number;
  basePlots: number;
}

export const LAND_SIZE_OPTIONS: LandSizeOption[] = [
  {
    id: "under-500",
    labelEn: "Under 500 m²",
    labelNo: "Under 500 m²",
    avgSqm: 420,
    basePlots: 1,
  },
  {
    id: "500-1000",
    labelEn: "500 – 1,000 m²",
    labelNo: "500 – 1 000 m²",
    avgSqm: 780,
    basePlots: 2,
  },
  {
    id: "1000-2500",
    labelEn: "1,000 – 2,500 m²",
    labelNo: "1 000 – 2 500 m²",
    avgSqm: 1650,
    basePlots: 3,
  },
  {
    id: "over-2500",
    labelEn: "Over 2,500 m²",
    labelNo: "Over 2 500 m²",
    avgSqm: 3200,
    basePlots: 6,
  },
];

export interface LandZoneOption {
  id: string;
  code: string;
  labelEn: string;
  labelNo: string;
  descEn: string;
  descNo: string;
  braFactor: number; // Constructible floor ratio
  valueMultiplier: number;
  developerDemandEn: string;
  developerDemandNo: string;
}

export const LAND_ZONE_OPTIONS: LandZoneOption[] = [
  {
    id: "villa",
    code: "R+1 / Villa",
    labelEn: "Detached Villa / Single Family (Småhus)",
    labelNo: "Enebolig / Småhusbebyggelse (BYA 24%)",
    descEn: "Standard residential plot for detached houses or twin villas",
    descNo: "Standard boligtomt for enebolig eller tomannsbolig",
    braFactor: 0.35,
    valueMultiplier: 1.0,
    developerDemandEn: "High Private & Small-Builder Demand",
    developerDemandNo: "Høy etterspørsel fra boligkjøpere og småhusbyggere",
  },
  {
    id: "r2",
    code: "R+2",
    labelEn: "R+2 Zone (Ground + 2 Floors / Townhouses)",
    labelNo: "R+2 Sone (3 etasjer / Rekkehus og flermannsbolig)",
    descEn: "Allows dense townhouse rows or 4–6 unit residential buildings",
    descNo: "Tillater tett rekkehusbebyggelse eller flermannsboliger",
    braFactor: 0.65,
    valueMultiplier: 1.38,
    developerDemandEn: "Very High Developer Demand (+38% Land Premium)",
    developerDemandNo: "Svært høy utbyggerinteresse (+38 % tomtepremie)",
  },
  {
    id: "r3",
    code: "R+3",
    labelEn: "R+3 Zone (Ground + 3 Floors / Apartment Block)",
    labelNo: "R+3 Sone (4 etasjer / Lavblokk og leilighetsbygg)",
    descEn: "Multi-story residential apartment development with underground parking",
    descNo: "Leilighetsbygg over fire plan med garasjekjeller",
    braFactor: 1.15,
    valueMultiplier: 1.75,
    developerDemandEn: "Priority Institutional Builder Target (+75% Premium)",
    developerDemandNo: "Prioritert av profesjonelle utbyggere (+75 % premie)",
  },
  {
    id: "commercial",
    code: "Commercial / Mixed",
    labelEn: "Commercial / Combined Retail & Residential",
    labelNo: "Næring / Kombinert bolig- og næringsformål",
    descEn: "Ground-floor commercial space with residential units or business park",
    descNo: "Næring på gateplan kombinert med bolig eller kontor",
    braFactor: 1.3,
    valueMultiplier: 1.62,
    developerDemandEn: "Strong Commercial Investor Appetite",
    developerDemandNo: "Sterk etterspørsel fra nærings- og eiendomsinvestorer",
  },
];

export interface RepairItem {
  id: string;
  labelEn: string;
  labelNo: string;
  descEn: string;
  descNo: string;
  contractorCostNok: number;
  resaleValueAddedNok: number;
  weeksOfWork: number;
}

export const REPAIR_ITEMS: RepairItem[] = [
  {
    id: "paint",
    labelEn: "Paint & Interior Surfaces",
    labelNo: "Maling og overflater",
    descEn: "Full interior repainting, wall plastering, and floor sanding",
    descNo: "Helsparkling, maling av vegger/tak og sliping av gulv",
    contractorCostNok: 145000,
    resaleValueAddedNok: 160000,
    weeksOfWork: 3,
  },
  {
    id: "kitchen",
    labelEn: "Outdated Kitchen",
    labelNo: "Eldre kjøkken",
    descEn: "Demolition, new cabinetry, countertops, plumbing, and appliances",
    descNo: "Riving, ny kjøkkeninnredning, rørlegger, elektriker og hvitevarer",
    contractorCostNok: 390000,
    resaleValueAddedNok: 260000,
    weeksOfWork: 6,
  },
  {
    id: "roof",
    labelEn: "Old Roof & Drainage",
    labelNo: "Eldre yttertak og beslag",
    descEn: "Scaffolding, membrane replacement, battens, tiles, and gutters",
    descNo: "Stillas, ny undertaksmembran, lekter, takstein og takrenner",
    contractorCostNok: 480000,
    resaleValueAddedNok: 310000,
    weeksOfWork: 5,
  },
  {
    id: "bathroom",
    labelEn: "Bathroom / Wet Room (TG3)",
    labelNo: "Eldre bad / våtrom (TG3)",
    descEn: "Full wet-room membrane rebuild according to TEK17 standards",
    descNo: "Totalrenovering av våtrom med ny membran og dokumentasjon",
    contractorCostNok: 440000,
    resaleValueAddedNok: 295000,
    weeksOfWork: 7,
  },
  {
    id: "windows",
    labelEn: "Windows & Electrical Panel",
    labelNo: "Vinduer og elektrisk anlegg",
    descEn: "3-layer insulated windows and upgraded fuse box / wiring",
    descNo: "Utskifting til 3-lags isolerglass og oppgradert sikringsskap",
    contractorCostNok: 275000,
    resaleValueAddedNok: 190000,
    weeksOfWork: 4,
  },
];

export function formatNok(amount: number): string {
  const rounded = Math.round(amount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " kr";
}
