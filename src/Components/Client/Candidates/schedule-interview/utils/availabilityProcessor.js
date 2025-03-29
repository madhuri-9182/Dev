/**
 * Functions for processing availability data for interview scheduling
 */
import { createHourlySlots } from "./hourlySlots";
import {
  timeToHours,
  formatTimeDisplay,
} from "./timeUtils";

// Process API data to determine which hourly slots are available
export const processAvailabilityData = (data) => {
  // Initialize time slots with availability properties
  const hourlySlots = createHourlySlots({
    includeAvailability: true,
  });

  // If no data available, return the base hourly slots
  if (!data || !data.length) {
    return hourlySlots;
  }

  // Process each availability slot from API
  data.forEach((slot) => {
    const startHour = timeToHours(slot.start_time);
    const endHour = timeToHours(slot.end_time);

    // Check each hourly slot to see if it can accommodate a 1-hour meeting
    hourlySlots.forEach((hourlySlot) => {
      // Convert slot time label to 24-hour format using our utility function
      const slotHour = timeToHours(
        hourlySlot.time.replace(" ", ":00 ")
      );

      // A slot is available if a 1-hour window can start at any 15-minute interval within it
      const canFitFullHour =
        // Check if slot can accommodate a meeting starting at :00
        (slotHour >= startHour &&
          slotHour + 1 <= endHour) ||
        // Check if slot can accommodate a meeting starting at :15
        (slotHour + 0.25 >= startHour &&
          slotHour + 1.25 <= endHour) ||
        // Check if slot can accommodate a meeting starting at :30
        (slotHour + 0.5 >= startHour &&
          slotHour + 1.5 <= endHour) ||
        // Check if slot can accommodate a meeting starting at :45
        (slotHour + 0.75 >= startHour &&
          slotHour + 1.75 <= endHour);

      if (canFitFullHour) {
        hourlySlot.available = true;
        hourlySlot.slotIds.push(slot.id);
      }
    });
  });

  return hourlySlots;
};

// Generate available 1-hour windows within a slot
export const generateAvailableWindows = (
  selectedSlot,
  data
) => {
  if (!selectedSlot || !data || !data.length) return [];

  // Get the hour of the selected slot (24-hour format)
  const hourStr = selectedSlot.split(" ")[0];
  const isPM = selectedSlot.includes("PM");
  let hour = parseInt(hourStr);
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 12; // Keep 12 PM as 12 in 24h format

  const windows = [];
  const timeWindows = {};

  // Filter relevant slots that can accommodate windows in the selected hour
  const relevantSlots = data.filter((slot) => {
    const startTime = timeToHours(slot.start_time);
    const endTime = timeToHours(slot.end_time);

    // Check if this availability period can accommodate any 1-hour window starting within the selected hour
    return (
      // For a window starting at :00
      (hour >= startTime && hour + 1 <= endTime) ||
      // For a window starting at :15
      (hour + 0.25 >= startTime &&
        hour + 1.25 <= endTime) ||
      // For a window starting at :30
      (hour + 0.5 >= startTime && hour + 1.5 <= endTime) ||
      // For a window starting at :45
      (hour + 0.75 >= startTime && hour + 1.75 <= endTime)
    );
  });

  // Process each relevant slot
  relevantSlots.forEach((slot) => {
    const startTime = slot.start_time.split(":");
    const startHour = parseInt(startTime[0]);
    const startMin = parseInt(startTime[1]);

    const endTime = slot.end_time.split(":");
    const endHour = parseInt(endTime[0]);
    const endMin = parseInt(endTime[1]);

    // For each 15-minute interval in the hour, check if we can fit a 1-hour window
    const startTimeInMinutes = startHour * 60 + startMin;
    const endTimeInMinutes = endHour * 60 + endMin;

    // Check for 15-minute intervals (00, 15, 30, 45)
    [0, 15, 30, 45].forEach((minutes) => {
      const startMinutes = hour * 60 + minutes;
      if (
        startMinutes >= startTimeInMinutes &&
        startMinutes + 60 <= endTimeInMinutes
      ) {
        const timeKey = `${hour}:${minutes
          .toString()
          .padStart(2, "0")}`;
        if (!timeWindows[timeKey]) {
          timeWindows[timeKey] = {
            slots: [],
            minuteValue: startMinutes,
          };
        }
        timeWindows[timeKey].slots.push(slot.id);
      }
    });
  });

  // Convert the grouped windows to our array format
  Object.keys(timeWindows).forEach((timeKey) => {
    const [h, m] = timeKey.split(":").map(Number);
    const formattedStart = formatTimeDisplay(h, m);
    const formattedEnd = formatTimeDisplay(h + 1, m);

    windows.push({
      window: `${formattedStart} - ${formattedEnd}`,
      slotIds: timeWindows[timeKey].slots, // Now we store all matching slot IDs
      startTime: `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:00`,
      endTime: `${(h + 1).toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:00`,
      minuteValue: timeWindows[timeKey].minuteValue, // Store for sorting
    });
  });

  // Sort windows by time
  windows.sort((a, b) => a.minuteValue - b.minuteValue);

  return windows;
};
