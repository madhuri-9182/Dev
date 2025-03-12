import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import axios from "../../../api/axios";
import toast from "react-hot-toast";

// Components
import CalendarToolbar from "./components/CalendarToolbar";
import CalendarPopup from "./components/CalendarPopup";
import DayHeaderContent from "./components/DayHeaderContent";

// Utils
import {
  formatCustomTitle,
  formatSelectedDate,
} from "./utils/dateFormatters";
import { getFormattedEvents } from "./utils/eventFormatters";

// Styles
import "./index.css";
import moment from "moment";

const CalendarComponent = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const calendarRef = useRef(null);
  const popupRef = useRef(null);

  // State
  const [activeView, setActiveView] =
    useState("timeGridWeek");
  const [calendarTitle, setCalendarTitle] =
    useState("Calendar");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
  });
  const [newEvent, setNewEvent] = useState({
    title: "Interview Available Time",
    description:
      "This time slot is available for interviews.",
    date: "",
    start_time: "",
    end_time: "",
    recurring: "none",
    formattedTime: "",
    recurrence: {
      frequency: "WEEKLY",
      interval: 1,
      days: [],
      count: null,
      until: null,
      monthDay: [],
      yearDay: [],
    },
  });

  // Google Auth Callback Mutation
  const callbackMutation = useMutation({
    mutationFn: (data) =>
      axios.post("/api/google-auth/callback/", data),
    onSuccess: () => {
      navigate("/interviewer/calendar/");
    },
    onError: () => {
      navigate("/interviewer/dashboard/");
    },
  });

  // Query for Google Calendar events
  const {
    data: googleEvents,
    refetch: refetchGoogleEvents,
    error: googleEventsError,
  } = useQuery({
    queryKey: ["googleEvents"],
    queryFn: () => axios.get("/api/events/"),
    enabled: false,
    retry: 1,
    retryDelay: 1000,
  });

  // Query for blocked calendar times
  const {
    data: blockedTimes,
    refetch: refetchBlockedTimes,
  } = useQuery({
    queryKey: ["blockedTimes"],
    queryFn: async () =>
      axios.get("/api/interviewer/block-calendar/"),
    enabled: false,
  });

  // Mutation for blocking calendar time
  const blockCalendarMutation = useMutation({
    mutationFn: (blockData) =>
      axios.post(
        "/api/interviewer/block-calendar/",
        blockData
      ),
    onSuccess: () => {
      refetchBlockedTimes();
      setPopupVisible(false);
    },
    onError: (error) => {
      toast.error(
        Object.values(error.response.data?.errors)[0][0]
      );
    },
  });

  // Effects
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const scope = urlParams.get("scope");

    if (code && state) {
      callbackMutation.mutate({
        state,
        authorization_response: window.location.href,
        scope: scope || "",
      });
    } else {
      refetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setPopupVisible(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    if (googleEventsError) {
      toast.error("Error fetching Google events");
      navigate("/interviewer/dashboard/");
    }
  }, [googleEventsError, navigate]);

  const refetchEvents = async () => {
    try {
      try {
        await refetchGoogleEvents();
      } catch (error) {
        // Instead of initializing Google Auth, redirect to calendar
        console.error(
          "Error fetching Google events:",
          error
        );
        navigate("/interviewer/dashboard/");
        return;
      }
      await refetchBlockedTimes();
    } catch (error) {
      console.error("Error fetching events:", error);
      navigate("/interviewer/dashboard/");
    }
  };

  // Calendar navigation handlers
  const handleDatesSet = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.prev();
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.next();
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.today();
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handleViewChange = (newView) => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.changeView(newView);
      api.setOption(
        "selectable",
        newView !== "dayGridMonth"
      );
      setActiveView(newView);
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const calculatePopupPosition = (jsEvent) => {
    // Get the selected element's position
    const rect = jsEvent.target.getBoundingClientRect();

    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Popup dimensions
    const popupWidth = 384; // Tailwind w-96 = 384px
    const popupHeight = 400; // Fixed height

    // Calculate where the element is in the viewport vertically (using center point)
    const positionRatio =
      (rect.top + rect.height / 2) / windowHeight;

    let top, left;

    // HORIZONTAL POSITIONING
    // Check if there's enough space on the right side
    if (rect.right + 10 + popupWidth <= windowWidth) {
      // Position 10px to the right of the element
      left = rect.right + 10;
    } else {
      // Not enough space on right, position 10px to the left
      left = rect.left - 10 - popupWidth;
    }

    // VERTICAL POSITIONING
    if (positionRatio < 0.4) {
      top = rect.bottom + window.scrollY - 10;
    } else {
      top =
        rect.top +
        window.scrollY +
        rect.height / 2 -
        popupHeight / 2;
    }

    // BOUNDARY CHECKS
    // Prevent going above the viewport
    if (top < window.scrollY) {
      top = window.scrollY + 10;
    }

    // Prevent going below the viewport
    const visibleBottom = windowHeight + window.scrollY;
    if (top + popupHeight > visibleBottom) {
      top = visibleBottom - popupHeight - 10;
    }

    // Prevent going off the left side
    if (left < 0) {
      left = 10;
    }

    return { top, left };
  };

  // Event handlers
  const handleSelect = (selectionInfo) => {
    const startDate = new Date(selectionInfo.start);
    const endDate = new Date(selectionInfo.end);

    const timeDiffInMinutes =
      (endDate - startDate) / (1000 * 60);

    if (timeDiffInMinutes < 60) {
      toast.error(
        "Please select time frame of at least 1 hour."
      );

      calendarRef.current?.getApi().unselect();
      return;
    }

    // Format dates for display and API
    const dateInfo = formatSelectedDate(startDate, endDate);
    setNewEvent({ ...newEvent, ...dateInfo });

    // Get the calendar view type
    const viewType =
      calendarRef.current?.getApi().view.type;

    // Calculate proper popup position that won't go off-screen
    const position = calculatePopupPosition(
      selectionInfo.jsEvent,
      viewType
    );
    setPopupPosition(position);

    setPopupVisible(true);
  };

  const handleSaveEvent = () => {
    // Prepare the data for the API
    const blockData = {
      date: newEvent.date,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time,
    };

    const defaultDescription =
      "This time slot is available for interviews.";
    if (
      newEvent.description &&
      newEvent.description.trim() !== "" &&
      newEvent.description !== defaultDescription
    ) {
      blockData.notes = newEvent.description;
    }

    // Check if this is a recurring event - either by recurring flag or by recurrence data
    // const hasRecurrenceData =
    //   newEvent.recurrence &&
    //   ((newEvent.recurrence.days &&
    //     newEvent.recurrence.days.length > 0) ||
    //     newEvent.recurrence.count ||
    //     newEvent.recurrence.until);

    // if (
    //   newEvent.recurring !== "none" ||
    //   hasRecurrenceData
    // ) {
    //   blockData.recurrence = {
    //     frequency: newEvent.recurrence.frequency,
    //     intervals: newEvent.recurrence.interval || 1,
    //   };

    //   // Add days if selected (for weekly recurrence), filtering out null values
    //   if (
    //     newEvent.recurrence.days &&
    //     newEvent.recurrence.days.length > 0
    //   ) {
    //     const cleanDays = newEvent.recurrence.days.filter(
    //       (day) => day !== null
    //     );
    //     if (cleanDays.length > 0) {
    //       blockData.recurrence.days = cleanDays;
    //     }
    //   }

    //   // Add count or until if specified
    //   if (newEvent.recurrence.count) {
    //     blockData.recurrence.count =
    //       newEvent.recurrence.count;
    //   } else if (newEvent.recurrence.until) {
    //     blockData.recurrence.until =
    //       newEvent.recurrence.until;
    //   }

    //   // Add month_day or year_day if applicable, filtering out null values
    //   if (
    //     newEvent.recurrence.monthDay &&
    //     newEvent.recurrence.monthDay.length > 0
    //   ) {
    //     const cleanMonthDays =
    //       newEvent.recurrence.monthDay.filter(
    //         (day) => day !== null
    //       );
    //     if (cleanMonthDays.length > 0) {
    //       blockData.recurrence.month_day = cleanMonthDays;
    //     }
    //   }

    //   if (
    //     newEvent.recurrence.yearDay &&
    //     newEvent.recurrence.yearDay.length > 0
    //   ) {
    //     const cleanYearDays =
    //       newEvent.recurrence.yearDay.filter(
    //         (day) => day !== null
    //       );
    //     if (cleanYearDays.length > 0) {
    //       blockData.recurrence.year_day = cleanYearDays;
    //     }
    //   }
    // }

    // Log the data for debugging purposes
    console.log("Sending block data:", blockData);

    // Send the data to the API
    blockCalendarMutation.mutate(blockData);
  };

  return (
    <div className="font-roboto max-w-full p-5 my-0 mx-auto">
      {/* Toolbar */}
      <CalendarToolbar
        calendarTitle={calendarTitle}
        activeView={activeView}
        handleToday={handleToday}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleViewChange={handleViewChange}
      />

      {/* Calendar */}
      <div className="bg-white border-none rounded-lg">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}
          datesSet={handleDatesSet}
          initialView="timeGridWeek"
          headerToolbar={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          slotDuration={"01:00:00"}
          slotLabelInterval={"01:00:00"}
          snapDuration={"00:30:00"}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          slotMinTime={"09:00:00"}
          slotMaxTime={"22:00:00"}
          allDaySlot={false}
          select={handleSelect}
          events={getFormattedEvents(
            googleEvents,
            blockedTimes
          )}
          // eventClick={handleEventClick}
          height="auto"
          eventClassNames="rounded-md text-xs px-1 py-0.5 overflow-hidden text-white shadow-md"
          dayHeaderContent={DayHeaderContent}
          nowIndicator={true}
          dayHeaderClassNames="text-center px-0.5 py-1"
          slotLabelClassNames="text-right pr-2 text-[#70757a]"
          selectAllow={function (selectInfo) {
            // First check if the selection is in the future
            const isInFuture =
              moment().diff(selectInfo.start) <= 0;

            // Check if start and end are on the same day
            const startDate = moment(
              selectInfo.start
            ).startOf("day");
            const endDate = moment(selectInfo.end).startOf(
              "day"
            );
            const isSameDay = startDate.isSame(endDate);

            // Return true only if both conditions are met
            return isInFuture && isSameDay;
          }}
        />
      </div>

      {/* Popup */}
      {popupVisible && (
        <CalendarPopup
          popupRef={popupRef}
          popupPosition={popupPosition}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleSaveEvent={handleSaveEvent}
          setPopupVisible={setPopupVisible}
          isLoading={blockCalendarMutation.isLoading}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
