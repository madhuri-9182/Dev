/**
 * Format date string to display format DD/MM/YYYY, DAY
 * @param {string} dateTimeString - Date time string in format DD/MM/YYYY HH:MM:SS
 * @returns {string} Formatted date string
 */
export const formatDate = (dateTimeString) => {
  // Handle the format DD/MM/YYYY HH:MM:SS
  const [datePart] = dateTimeString.split(" ");
  const [day, month, year] = datePart.split("/");

  // Create date with explicit values (months are 0-indexed in JS)
  const date = new Date(year, month - 1, day);

  // Get day name
  const days = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
  ];
  const dayName = days[date.getDay()];

  return `${day}/${month}/${year}, ${dayName}`;
};

/**
 * Format time string to display format HH:MM AM/PM
 * @param {string} dateTimeString - Date time string in format DD/MM/YYYY HH:MM:SS
 * @returns {string} Formatted time string
 */
export const formatTime = (dateTimeString) => {
  // Extract time part
  const [, timePart] = dateTimeString.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");

  // Convert to numbers
  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr.padStart(2, "0");

  // AM/PM format
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12

  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Format experience to readable string (e.g. "2 Years 3 Months")
 * @param {number} years - Number of years
 * @param {number} months - Number of months
 * @returns {string} Formatted experience string
 */
export const formatExperience = (years, months) => {
  if (years === 0 && months === 0) return "No experience";
  if (years === 0)
    return `${months} Month${months !== 1 ? "s" : ""}`;
  if (months === 0)
    return `${years} Year${years !== 1 ? "s" : ""}`;
  return `${years} Year${
    years !== 1 ? "s" : ""
  } ${months} Month${months !== 1 ? "s" : ""}`;
};
