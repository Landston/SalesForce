/**
 * @description adds bold <strong> html tag to a list of keywords
 * @param {String} input text
 * @param {String[]} keywords
 * @returns {String}
 */
export function boldKeywords(input, keywords) {
  if (!input || input.trim().length === 0) return;
  if (!Array.isArray(keywords)) keywords = [keywords];

  return input.replace(
    new RegExp("(\\b)(" + keywords.join("|") + ")(\\b)", "ig"),
    "$1<strong>$2</strong>$3"
  );
}

export function stripTags(str) {
  if (!str) return "";
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

export function truncate(str, n, useWordBoundary = true) {
  if (!str || str.length <= n) {
    return str;
  }
  const subString = str.substr(0, n - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "\u2026"
  ); // &hellip;
}

export function htmlDecode(input) {
  if (!input) return "";
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export function unescapeHtmlLabels(labelsInput) {
  return Object.fromEntries(
    Object.entries(labelsInput).map((entry) => [entry[0], htmlDecode(entry[1])])
  );
}

/**
 * @description Checks if a string is not empty (valid)
 * @param {String} input string to validate
 * @returns {Boolean} true if valid input
 */
export function validateInputString(input = "") {
  return input && typeof input === "string" && input.trim().length > 0;
}

/**
 * @description Process template strings
 * @param {Object} data replace template with key value pairs
 * @param {String} str string with templates
 * @param {Boolean} removeEmptyTemplates true to remove empty templates that doesn't was replaced with some value
 * @returns {String}
 */
export function templateStringReplacement(data = {}, str, removeEmptyTemplates = false) {
  if (!data || typeof data !== "object" || !validateInputString(str)) return "";
  Object.keys(data).forEach((key) => {
    str = str.replace(`{{${key}}}`, `${data[key]}`);
  });

  if (removeEmptyTemplates) str = str.replace(/{{[\S\s]*?}}/g, "");
  return str;
}
