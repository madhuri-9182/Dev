/* eslint-disable react-hooks/exhaustive-deps */
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
import moment from "moment";

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

// Constants
const DEFAULT_EVENT = {
  title: "Interview Available Time",
  description:
    "This time slot is available for interviews.",
  date: "",
  start_time: "",
  end_time: "",
  recurring: "none",
  formattedTime: "",
  showRecurrenceOptions: false,
  recurrence: {
    frequency: "WEEKLY",
    interval: 1,
    days: [],
    count: null,
    until: null,
    monthDay: [],
    yearDay: [],
  },
};

const CALENDAR_CONFIG = {
  initialView: "timeGridWeek",
  slotDuration: "01:00:00",
  slotLabelInterval: "01:00:00",
  snapDuration: "00:30:00",
  slotMinTime: "10:00:00",
  slotMaxTime: "21:00:00",
  allDaySlot: false,
};

const CalendarComponent = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const calendarRef = useRef(null);
  const popupRef = useRef(null);

  // State
  const [activeView, setActiveView] = useState(
    CALENDAR_CONFIG.initialView
  );
  const [calendarTitle, setCalendarTitle] =
    useState("Calendar");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
  });
  const [newEvent, setNewEvent] = useState(DEFAULT_EVENT);

  // Queries and Mutations
  const { mutate: handleGoogleAuthCallback } = useMutation({
    mutationFn: (data) =>
      axios.post("/api/google-auth/callback/", data),
    onSuccess: () => navigate("/interviewer/calendar/"),
    onError: () => navigate("/interviewer/dashboard/"),
  });

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

  const {
    data: blockedTimes,
    refetch: refetchBlockedTimes,
  } = useQuery({
    queryKey: ["blockedTimes"],
    queryFn: () =>
      axios.get("/api/interviewer/block-calendar/"),
    enabled: false,
  });

  const {
    mutate: blockCalendarTime,
    isPending: isBlockingCalendar,
  } = useMutation({
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
      handleGoogleAuthCallback({
        state,
        authorization_response: window.location.href,
        scope: scope || "",
      });
    } else {
      fetchAllEvents();
    }
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
    if (popupVisible && newEvent.showRecurrenceOptions) {
      updatePopupPosition();
    }
  }, [newEvent.showRecurrenceOptions, popupVisible]);

  useEffect(() => {
    if (googleEventsError) {
      toast.error("Error fetching Google events");
      navigate("/interviewer/dashboard/");
    }
  }, [googleEventsError, navigate]);

  // Fetch events helper
  const fetchAllEvents = async () => {
    try {
      try {
        await refetchGoogleEvents();
      } catch (error) {
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

  // Calendar navigation helpers
  const getCalendarApi = () =>
    calendarRef.current?.getApi();

  const handlePrev = () => {
    const api = getCalendarApi();
    if (api) {
      api.prev();
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handleNext = () => {
    const api = getCalendarApi();
    if (api) {
      api.next();
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handleToday = () => {
    const api = getCalendarApi();
    if (api) {
      api.today();
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handleViewChange = (newView) => {
    const api = getCalendarApi();
    if (api) {
      api.changeView(newView);
      api.setOption(
        "selectable",
        newView !== "dayGridMonth"
      );
      setActiveView(newView);
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  const handleDatesSet = () => {
    const api = getCalendarApi();
    if (api) {
      setCalendarTitle(formatCustomTitle(api));
    }
  };

  // Popup position calculation
  const calculatePopupPosition = (
    jsEvent,
    showRecurrenceOptions
  ) => {
    const rect = jsEvent.target.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollY =
      window.scrollY || document.documentElement.scrollTop;

    const popupWidth = 384; // Tailwind w-96 = 384px
    const popupHeight = showRecurrenceOptions ? 400 : 270;

    const elementBottom = rect.bottom;
    const elementTop = rect.top;
    const isInBottomPortion =
      elementBottom > windowHeight * 0.6;

    // Calculate horizontal position
    let left;
    if (rect.left < windowWidth / 2) {
      left = rect.right + 10;
      if (left + popupWidth > windowWidth) {
        left = rect.left - popupWidth - 10;
      }
    } else {
      left = rect.left - popupWidth - 10;
      if (left < 0) {
        left = rect.right + 10;
        if (left + popupWidth > windowWidth) {
          left = Math.max(
            10,
            (windowWidth - popupWidth) / 2
          );
        }
      }
    }

    // Calculate vertical position
    let top;
    if (isInBottomPortion) {
      top = elementTop + scrollY - popupHeight - 10;
    } else if (elementTop < windowHeight * 0.3) {
      top = elementBottom + scrollY + 10;
    } else {
      const elementHeight = rect.height;
      top =
        elementTop +
        scrollY +
        elementHeight / 2 -
        popupHeight / 2;
    }

    // Boundary checks
    left = Math.max(
      10,
      Math.min(left, windowWidth - popupWidth - 10)
    );
    top = Math.max(
      scrollY + 10,
      Math.min(
        top,
        windowHeight + scrollY - popupHeight - 10
      )
    );

    return { top, left };
  };

  const updatePopupPosition = () => {
    const selectedCells =
      document.querySelectorAll(".fc-highlight");
    if (selectedCells.length > 0) {
      const mockEvent = { target: selectedCells[0] };
      const position = calculatePopupPosition(
        mockEvent,
        newEvent.showRecurrenceOptions
      );
      setPopupPosition(position);
    }
  };

  // Event handlers
  const handleSelect = (selectionInfo) => {
    const startDate = new Date(selectionInfo.start);
    const endDate = new Date(selectionInfo.end);
    let modifiedEndDate = endDate;

    // Calculate time difference in minutes
    const timeDiffInMinutes =
      (endDate - startDate) / (1000 * 60);

    // Adjust to 1 hour for short selections (clicks)
    if (timeDiffInMinutes <= 30) {
      modifiedEndDate = new Date(startDate);
      modifiedEndDate.setHours(startDate.getHours() + 1);

      const api = getCalendarApi();
      if (api) {
        api.unselect();
        api.select({
          start: startDate,
          end: modifiedEndDate,
          allDay: false,
        });
      }
    }

    // Format dates for display and API
    const dateInfo = formatSelectedDate(
      startDate,
      modifiedEndDate
    );
    const updatedEvent = { ...DEFAULT_EVENT, ...dateInfo };

    // Set state before showing popup
    setNewEvent(updatedEvent);

    // Delay showing popup until selection is visible
    setTimeout(() => {
      const selectedElements =
        document.querySelectorAll(".fc-highlight");
      let position;

      if (selectedElements.length > 0) {
        position = calculatePopupPosition(
          { target: selectedElements[0] },
          updatedEvent.showRecurrenceOptions
        );
      } else if (
        selectionInfo.jsEvent &&
        selectionInfo.jsEvent.target
      ) {
        position = calculatePopupPosition(
          selectionInfo.jsEvent,
          updatedEvent.showRecurrenceOptions
        );
      } else {
        // Fallback positioning
        position = {
          top:
            window.innerHeight / 2 -
            (updatedEvent.showRecurrenceOptions
              ? 200
              : 135),
          left: window.innerWidth / 2 - 192,
        };
      }

      setPopupPosition(position);
      setPopupVisible(true);
    }, 10);
  };

  const prepareRecurrenceData = (event) => {
    const recurrenceData = {};

    if (event.recurrence.frequency) {
      recurrenceData.frequency = event.recurrence.frequency;
    }

    recurrenceData.intervals =
      event.recurrence.interval || 1;

    // Add days if selected (for weekly recurrence)
    const cleanDays = event.recurrence.days?.filter(
      (day) => day !== null && day !== undefined
    );
    if (cleanDays?.length > 0) {
      recurrenceData.days = cleanDays;
    }

    // Add count or until if specified
    if (event.recurrence.count) {
      recurrenceData.count = event.recurrence.count;
    } else if (event.recurrence.until) {
      recurrenceData.until = event.recurrence.until;
    }

    // Add month_day or year_day if applicable
    const cleanMonthDays =
      event.recurrence.monthDay?.filter(
        (day) => day !== null && day !== undefined
      );
    if (cleanMonthDays?.length > 0) {
      recurrenceData.month_day = cleanMonthDays;
    }

    const cleanYearDays = event.recurrence.yearDay?.filter(
      (day) => day !== null && day !== undefined
    );
    if (cleanYearDays?.length > 0) {
      recurrenceData.year_day = cleanYearDays;
    }

    return recurrenceData;
  };

  const handleSaveEvent = () => {
    // Prepare the data for the API
    const blockData = {
      date: newEvent.date,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time,
    };

    // Add description if provided and not default
    const defaultDescription =
      "This time slot is available for interviews.";
    if (
      newEvent.description &&
      newEvent.description.trim() !== "" &&
      newEvent.description !== defaultDescription
    ) {
      blockData.notes = newEvent.description;
    }

    // Add recurrence data if applicable
    const showRecurrenceOptions =
      newEvent.showRecurrenceOptions || false;
    const hasRecurrenceData =
      showRecurrenceOptions &&
      newEvent.recurrence &&
      (newEvent.recurrence.days?.length > 0 ||
        newEvent.recurrence.count ||
        newEvent.recurrence.until);

    if (
      showRecurrenceOptions &&
      (newEvent.recurring !== "none" || hasRecurrenceData)
    ) {
      blockData.recurrence =
        prepareRecurrenceData(newEvent);
    }

    // Send the data to the API
    blockCalendarTime(blockData);
  };

  // Check if selection is valid
  const isSelectionAllowed = (selectInfo) => {
    // Check if selection is in the future
    const isInFuture = moment().diff(selectInfo.start) <= 0;

    // Check if start and end are on the same day
    const startDate = moment(selectInfo.start).startOf(
      "day"
    );
    const endDate = moment(selectInfo.end).startOf("day");
    const isSameDay = startDate.isSame(endDate);

    // Return true only if both conditions are met
    return isInFuture && isSameDay;
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
          initialView={CALENDAR_CONFIG.initialView}
          headerToolbar={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          slotDuration={CALENDAR_CONFIG.slotDuration}
          slotLabelInterval={
            CALENDAR_CONFIG.slotLabelInterval
          }
          snapDuration={CALENDAR_CONFIG.snapDuration}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          slotMinTime={CALENDAR_CONFIG.slotMinTime}
          slotMaxTime={CALENDAR_CONFIG.slotMaxTime}
          allDaySlot={CALENDAR_CONFIG.allDaySlot}
          select={handleSelect}
          events={getFormattedEvents(
            googleEvents,
            blockedTimes
          )}
          height="auto"
          eventClassNames="rounded-md text-xs px-1 py-0.5 overflow-hidden text-white shadow-md"
          dayHeaderContent={DayHeaderContent}
          nowIndicator={true}
          dayHeaderClassNames="text-center px-0.5 py-1"
          slotLabelClassNames="text-right pr-2 text-[#70757a]"
          selectAllow={isSelectionAllowed}
        />
      </div>

      {/* Popup background overlay */}
      {popupVisible && (
        <div
          className="fixed inset-0 bg-transparent z-10"
          onClick={() => setPopupVisible(false)}
        />
      )}

      {/* Popup */}
      {popupVisible && (
        <CalendarPopup
          popupRef={popupRef}
          popupPosition={popupPosition}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleSaveEvent={handleSaveEvent}
          setPopupVisible={setPopupVisible}
          isLoading={isBlockingCalendar}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
