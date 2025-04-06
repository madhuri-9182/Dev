/**
 * Extracts and formats date from a datetime string
 * @param {string} dateTime - DateTime string that might contain both date and time
 * @returns {string} Formatted date
 */
export const formatDate = (dateTime) => {
  return typeof dateTime === "string" &&
    dateTime.includes(" ")
    ? dateTime.split(" ")[0]
    : dateTime;
};

/**
 * Formats a number as Indian currency
 * @param {string|number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  });
};
