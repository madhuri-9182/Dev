import moment from "moment";

/**
 * Formats calendar title based on current view
 * @param {Object} api FullCalendar API object
 * @returns {String} Formatted title
 */
export const formatCustomTitle = (api) => {
  const view = api.view;
  const viewType = view.type;
  const start = view.currentStart;
  const end = view.currentEnd;

  if (viewType === "dayGridMonth") {
    return start.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  if (viewType === "timeGridWeek") {
    const startMonth = start.toLocaleDateString("en-US", {
      month: "short",
    });
    const endMonth = end.toLocaleDateString("en-US", {
      month: "short",
    });
    const year = start.getFullYear();

    return startMonth !== endMonth
      ? `${startMonth} - ${endMonth} ${year}`
      : `${startMonth} ${year}`;
  }

  if (viewType === "timeGridDay") {
    return start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return api.view.title;
};

/**
 * Formats date from selection for display and API
 * @param {Date} startDate Selection start date
 * @param {Date} endDate Selection end date
 * @returns {Object} Formatted date information
 */
export const formatSelectedDate = (startDate, endDate) => {
  return {
    date: moment(startDate).format("DD/MM/YYYY"),
    start_time: moment(startDate).format("H:mm"),
    end_time: moment(endDate).format("H:mm"),
    formattedTime: `${moment(startDate).format(
      "dddd, D MMMM"
    )} ${moment(startDate).format("h:mm A")} - ${moment(
      endDate
    ).format("h:mm A")}`,
  };
};
