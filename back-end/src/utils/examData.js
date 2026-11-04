export const EXAM_CATEGORIES = [
  {
    id: "civil-services",
    name: { en: "Civil Services", hi: "सिविल सेवा" },
    icon: "landmark",
    color: "#3B82F6",
    exams: ["UPSC", "MPPSC", "UPPSC", "BPSC", "RPSC", "JPSC", "CGPSC", "HPSC", "MPSC", "GPSC", "OPSC", "UKPSC"],
  },
  {
    id: "ssc",
    name: { en: "SSC Exams", hi: "एसएससी परीक्षाएं" },
    icon: "file-check",
    color: "#06B6D4",
    exams: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD", "SSC CPO", "SSC JE", "SSC Stenographer"],
  },
  {
    id: "banking",
    name: { en: "Banking Exams", hi: "बैंकिंग परीक्षाएं" },
    icon: "banknote",
    color: "#10B981",
    exams: ["IBPS PO", "IBPS Clerk", "IBPS SO", "IBPS RRB", "SBI PO", "SBI Clerk", "RBI Grade B", "RBI Assistant", "NABARD Grade A"],
  },
  {
    id: "railway",
    name: { en: "Railway Exams", hi: "रेलवे परीक्षाएं" },
    icon: "train-front",
    color: "#F59E0B",
    exams: ["RRB NTPC", "RRB Group D", "RRB ALP", "RRB JE", "RRB Technician", "RPF Constable", "RPF SI"],
  },
  {
    id: "defence",
    name: { en: "Defence Exams", hi: "रक्षा परीक्षाएं" },
    icon: "shield",
    color: "#EF4444",
    exams: ["NDA", "CDS", "AFCAT", "CAPF", "Agniveer Army", "Agniveer Vayu", "Navy SSR/MR", "Coast Guard Navik"],
  },
  {
    id: "police",
    name: { en: "Police Exams", hi: "पुलिस परीक्षाएं" },
    icon: "siren",
    color: "#6366F1",
    exams: ["MP Police", "UP Police", "Bihar Police", "Rajasthan Police", "Delhi Police", "Maharashtra Police", "Haryana Police", "State Police SI"],
  },
  {
    id: "teaching",
    name: { en: "Teaching Exams", hi: "शिक्षक परीक्षाएं" },
    icon: "graduation-cap",
    color: "#8B5CF6",
    exams: ["CTET", "UGC NET", "CSIR NET", "MPTET", "UPTET", "REET", "HTET", "KVS", "NVS"],
  },
  {
    id: "engineering-medical",
    name: { en: "Engineering & Medical", hi: "इंजीनियरिंग और मेडिकल" },
    icon: "stethoscope",
    color: "#EC4899",
    exams: ["JEE Main", "JEE Advanced", "NEET UG", "NEET PG", "GATE", "BITSAT", "VITEEE"],
  },
  {
    id: "other-competitive",
    name: { en: "Other Competitive Exams", hi: "अन्य प्रतियोगी परीक्षाएं" },
    icon: "trophy",
    color: "#14B8A6",
    exams: ["CUET UG", "CUET PG", "CAT", "XAT", "CLAT", "AILET", "NIFT", "NID DAT", "AIBE", "Judicial Services"],
  },
  {
    id: "other-government",
    name: { en: "Other Government Exams", hi: "अन्य सरकारी परीक्षाएं" },
    icon: "building-2",
    color: "#F97316",
    exams: ["FCI", "EPFO", "ESIC", "LIC AAO", "LIC ADO", "NICL AO", "IB ACIO", "India Post GDS", "ISRO", "DRDO", "BARC"],
  },
];

export const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

