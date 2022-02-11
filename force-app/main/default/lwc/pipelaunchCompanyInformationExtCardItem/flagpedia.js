import { TLD } from "./tld";

/**
 * @description
 * @param {String} country
 * @returns {String|Boolean}
 */
export default function generateFlagpediaLink(country = "") {
  if (!country || typeof country !== "string") return false;
  const tld = TLD.find((tld) => tld.country === country);
  return tld ? `https://flagcdn.com/${tld.tld}.svg` : false;
}
