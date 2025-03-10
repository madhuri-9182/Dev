/**
 * Custom day header content renderer for FullCalendar
 * @param {Object} args FullCalendar day header content args
 * @returns {JSX.Element} Custom day header component
 */
const DayHeaderContent = (args) => {
  const { date, view } = args;
  const viewType = view.type;
  const weekDayStr = date.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const dayStr = date.toLocaleDateString("en-US", {
    day: "numeric",
  });
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    weekday: "short",
  });
  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
    year: "numeric",
  });
  const isToday = todayDate === dateStr;

  if (viewType === "dayGridMonth") {
    return (
      <p
        className={`${
          isToday ? "text-[#0957d0]" : "text-black"
        } text-2xs uppercase font-light p-1`}
      >
        {weekDayStr}
      </p>
    );
  }

  if (
    viewType === "timeGridWeek" ||
    viewType === "timeGridDay"
  ) {
    return (
      <div className="p-2 flex flex-col gap-y-1 items-center">
        <p
          className={`${
            isToday ? "text-[#0957d0]" : "text-black"
          } text-2xs uppercase font-light`}
        >
          {weekDayStr}
        </p>
        <p
          className={`text-xl flex font-light items-center justify-center h-11 w-11 ${
            isToday
              ? "bg-[#0957d0] text-white rounded-full"
              : "text-black"
          }`}
        >
          {dayStr}
        </p>
      </div>
    );
  }

  return null;
};

export default DayHeaderContent;
