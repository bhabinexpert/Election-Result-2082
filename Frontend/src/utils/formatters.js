// ----- Number Formatter Utility -----
// Formats large numbers for display (e.g., 1200000 → "12L" or "1.2M")

/**
 * Format a number with commas (Nepali-friendly)
 * e.g., 1234567 → "12,34,567"
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString("en-IN");
};

/**
 * Format a number in short form
 * e.g., 1200000 → "1.2M", 50000 → "50K"
 */
export const formatShortNumber = (num) => {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
};

/**
 * Calculate percentage
 */
export const calcPercentage = (part, total) => {
  if (!total) return "0";
  return ((part / total) * 100).toFixed(1);
};
