/**
 * Time utility functions for interview scheduling
 */

// Convert time string to hours for calculations
export const timeToHours = (timeStr) => {
  const [timePart, period] = timeStr.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);

  let decimalHours = hours;

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    decimalHours += 12;
  } else if (period === "AM" && hours === 12) {
    decimalHours = 0;
  }

  // Add minutes as fraction of hour
  decimalHours += minutes / 60;

  return decimalHours;
};

// Format time for display (e.g., "3:30pm")
export const formatTimeDisplay = (hour, minute) => {
  const period = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute
    .toString()
    .padStart(2, "0")}${period}`;
};

// Extract time from window string (e.g., "10:00am - 11:00am" => "10:00")
export const getTimeFromWindow = (windowStr) => {
  if (!windowStr) return null;

  // Expected format: "10:00am - 11:00am"
  const startTimeStr = windowStr.split(" - ")[0];

  // Extract hours and minutes
  let hours = parseInt(startTimeStr.match(/\d+/)[0]);
  const minutes = startTimeStr.includes(":")
    ? parseInt(startTimeStr.split(":")[1].match(/\d+/)[0])
    : 0;

  // Convert to 24-hour format
  if (
    startTimeStr.toLowerCase().includes("pm") &&
    hours < 12
  ) {
    hours += 12;
  } else if (
    startTimeStr.toLowerCase().includes("am") &&
    hours === 12
  ) {
    hours = 0;
  }

  // Format as HH:MM
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Calculate experience in years
export const calculateExperienceYear = (
  yearsOfExperience
) => {
  if (!yearsOfExperience) return 0;

  const { year, month } = yearsOfExperience;
  const numYear = parseInt(year) || 0;
  const numMonth = parseInt(month) || 0;

  return numMonth >= 6 ? numYear + 1 : numYear;
};
