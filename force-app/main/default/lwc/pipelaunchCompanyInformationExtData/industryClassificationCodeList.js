const CODE_LIST = {
  A: "Agriculture, Forestry, and Fishing",
  B: "Mining",
  C: "Construction",
  D: "Manufacturing",
  E: "Transportation, Communications, Electric, Gas, and Sanitary Services",
  F: "Wholesale Trade",
  G: "Retail Trade",
  H: "Finance, Insurance, and Real Estate",
  I: "Services",
  J: "Public Sector",
  Y: "Unknown industry"
};

export default function getIndustryClassificationLabel(code) {
  if (!code) return "Unknown industry";
  return CODE_LIST[code] || "Unknown industry";
}
