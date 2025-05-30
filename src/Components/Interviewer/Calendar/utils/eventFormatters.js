/**
 * Formats Google Calendar events and blocked times for FullCalendar
 * @param {Object} googleEvents Google Calendar events data
 * @param {Object} blockedTimes Blocked calendar time slots
 * @returns {Array} Formatted events for FullCalendar
 */
export const getFormattedEvents = (
  googleEvents,
  blockedTimes
) => {
  const formattedEvents = [];
  const eventTimeMap = new Map();

  // Add Google events
  if (googleEvents?.data?.data?.events) {
    googleEvents.data.data.events.forEach((event) => {
      const eventKey = `${event.start}-${event.end}`;

      formattedEvents.push({
        title: event.summary || "Google Calendar Event",
        start: event.start,
        end: event.end,
        classNames: "google-cal-google-event",
        eventKey,
      });

      eventTimeMap.set(
        eventKey,
        formattedEvents.length - 1
      );
    });
  }

  // Add blocked times
  if (blockedTimes?.data?.results) {
    blockedTimes.data.results.forEach((block) => {
      const dateParts = block.date.split("/");
      const [day, month, year] = dateParts;
      const formattedDate = `${year}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(2, "0")}`;
      const timezoneOffset = "+05:30";

      const isoStartTime = `${formattedDate}T${block.start_time}${timezoneOffset}`;
      const isoEndTime = `${formattedDate}T${block.end_time}${timezoneOffset}`;
      const eventKey = `${isoStartTime}-${isoEndTime}`;
      const className = block?.is_booked
        ? "google-cal-blocked-booked-time"
        : "google-cal-blocked-time";

      // Check if there's already a Google event at this time
      if (eventTimeMap.has(eventKey)) {
        // Replace the Google event
        const index = eventTimeMap.get(eventKey);
        formattedEvents[index] = {
          title: "Interview Available Time",
          start: isoStartTime,
          end: isoEndTime,
          classNames: className,
          eventKey,
          extendedProps: {
            type: "blocked",
            // Use notes field if available, otherwise use default description
            description:
              block.notes ||
              "This time slot is available for interviews.",
          },
        };
      } else {
        // Add as a new event
        formattedEvents.push({
          title: "Interview Available Time",
          start: isoStartTime,
          end: isoEndTime,
          classNames: className,
          eventKey,
          extendedProps: {
            type: "blocked",
            // Use notes field if available, otherwise use default description
            description:
              block.notes ||
              "This time slot is available for interviews.",
          },
        });

        eventTimeMap.set(
          eventKey,
          formattedEvents.length - 1
        );
      }
    });
  }

  // Clean up tracking property
  return formattedEvents.map((event) => {
    // eslint-disable-next-line no-unused-vars
    const { eventKey, ...cleanEvent } = event;
    return cleanEvent;
  });
};
