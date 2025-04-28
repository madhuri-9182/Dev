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
import { LoadingState } from "../../shared/loading-error-state";

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
  formattedTime: "",
  // Commented out recurrence related fields
  /* recurring: "none",
  showRecurrenceOptions: false,
  recurrence: {
    frequency: "WEEKLY",
    interval: 1,
    days: [],
    count: null,
    until: null,
    monthDay: [],
    yearDay: [],
  }, */
};

const CALENDAR_CONFIG = {
  initialView: "timeGridWeek",
  slotDuration: "01:00:00",
  slotLabelInterval: "01:00:00",
  snapDuration: "00:30:00",
  slotMinTime: "00:00:00",
  slotMaxTime: "24:00:00",
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
  const [currentSelection, setCurrentSelection] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsGoogleSync, setNeedsGoogleSync] =
    useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Queries and Mutations
  const { mutate: handleGoogleAuthCallback } = useMutation({
    mutationFn: (data) =>
      axios.post("/api/google-auth/callback/", data),
    onSuccess: () => {
      navigate("/interviewer/calendar/");
      fetchAllEvents();
    },
    onError: () => {
      navigate("/interviewer/calendar/");
      toast.error("Failed to connect to Google Calendar");
    },
  });

  const {
    data: googleEvents,
    refetch: refetchGoogleEvents,
    isError: isGoogleEventsError,
  } = useQuery({
    queryKey: ["googleEvents"],
    queryFn: () => axios.get("/api/events/"),
    enabled: false,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isGoogleEventsError) {
      setNeedsGoogleSync(true);
    }
  }, [isGoogleEventsError]);

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
        blockData,
        {
          params: {
            sync: needsGoogleSync ? "False" : "True",
          },
        }
      ),
    onSuccess: () => {
      refetchBlockedTimes();
      closePopup();
      toast.success("Calendar time blocked successfully");
    },
    onError: (error) => {
      toast.error(
        Object.values(error.response.data?.errors)[0][0] ||
          "Failed to block calendar time"
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
        !popupRef.current.contains(event.target) &&
        !event.target.closest(".fc-highlight") // Don't close when clicking on the selection
      ) {
        closePopup();
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

  // Effect to maintain selection when popup is visible
  useEffect(() => {
    if (popupVisible && currentSelection) {
      // Check if the selection is still visible
      const hasHighlight =
        document.querySelectorAll(".fc-highlight").length >
        0;

      if (!hasHighlight) {
        // Reapply the selection if it's not visible
        const api = getCalendarApi();
        if (api) {
          api.select({
            start: currentSelection.start,
            end: currentSelection.end,
            allDay: currentSelection.allDay,
          });
        }
      }
    }
  }, [popupVisible, currentSelection]);

  // Effect to prevent unselection when interacting
  useEffect(() => {
    const preventUnselect = (e) => {
      // Only prevent unselect when popup is visible and clicking is not on close buttons
      if (
        popupVisible &&
        !e.target.closest(".close-popup-button") &&
        !e.target.closest(".fc-event")
      ) {
        // Check if we lost our highlight and need to reapply
        const hasHighlight =
          document.querySelectorAll(".fc-highlight")
            .length > 0;
        if (!hasHighlight && currentSelection) {
          const api = getCalendarApi();
          if (api) {
            setTimeout(() => {
              api.select({
                start: currentSelection.start,
                end: currentSelection.end,
                allDay: currentSelection.allDay,
              });
            }, 0);
          }
        }
      }
    };

    document.addEventListener(
      "click",
      preventUnselect,
      true
    );
    return () => {
      document.removeEventListener(
        "click",
        preventUnselect,
        true
      );
    };
  }, [popupVisible, currentSelection]);

  // Fetch events helper
  const fetchAllEvents = async () => {
    setIsLoading(true);

    try {
      // First fetch blocked times
      await refetchBlockedTimes();

      // Then fetch Google events
      try {
        const googleResponse = await refetchGoogleEvents();

        // Check if we need to show the sync button
        if (
          googleResponse?.data?.status === "failed" &&
          googleResponse?.data?.message ===
            "OAuth token not found for the user"
        ) {
          setNeedsGoogleSync(true);
        } else {
          setNeedsGoogleSync(false);
        }
      } catch (error) {
        console.error(
          "Error fetching Google events:",
          error
        );
        setNeedsGoogleSync(true);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      toast.error("Failed to load calendar data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Calendar sync
  const handleGoogleSync = async () => {
    setIsSyncing(true);

    try {
      const authResponse = await axios.get(
        "/api/google-auth/init/"
      );
      if (authResponse.data?.data?.url) {
        window.location.href = authResponse.data.data.url;
      } else {
        toast.error(
          "Failed to initiate Google Calendar sync"
        );
      }
    } catch (error) {
      console.error(
        "Error initializing Google Auth:",
        error
      );
      toast.error("Failed to connect to Google Calendar");
      setIsSyncing(false);
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

  // Close popup and clear selection
  const closePopup = () => {
    setPopupVisible(false);
    setCurrentSelection(null);
    const api = getCalendarApi();
    if (api) {
      api.unselect();
    }
  };

  // Popup position calculation
  const calculatePopupPosition = (jsEvent) => {
    const rect = jsEvent.target.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollY =
      window.scrollY || document.documentElement.scrollTop;

    const popupWidth = 384; // Tailwind w-96 = 384px
    const popupHeight = 270;

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

  // const updatePopupPosition = () => {
  //   const selectedCells =
  //     document.querySelectorAll(".fc-highlight");
  //   if (selectedCells.length > 0) {
  //     const mockEvent = { target: selectedCells[0] };
  //     const position = calculatePopupPosition(mockEvent);
  //     setPopupPosition(position);
  //   }
  // };

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

    // Store the selection info for reuse
    setCurrentSelection({
      start: startDate,
      end: modifiedEndDate || endDate,
      allDay: false,
    });

    // Delay showing popup until selection is visible
    setTimeout(() => {
      const selectedElements =
        document.querySelectorAll(".fc-highlight");
      let position;

      if (selectedElements.length > 0) {
        position = calculatePopupPosition({
          target: selectedElements[0],
        });
      } else if (
        selectionInfo.jsEvent &&
        selectionInfo.jsEvent.target
      ) {
        position = calculatePopupPosition(
          selectionInfo.jsEvent
        );
      } else {
        // Fallback positioning
        position = {
          top: window.innerHeight / 2 - 135,
          // Commented out recurrence options check
          // top:
          //   window.innerHeight / 2 -
          //   (updatedEvent.showRecurrenceOptions
          //     ? 200
          //     : 135),
          left: window.innerWidth / 2 - 192,
        };
      }

      setPopupPosition(position);
      setPopupVisible(true);
    }, 10);
  };

  /* Commented out recurrence data preparation function
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
  */

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

    /* Commented out recurrence data handling
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
    */

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

  // Render loading screen
  if (isLoading) return <LoadingState />;

  return (
    <div className="font-roboto max-w-full my-0 mx-auto">
      {/* Toolbar */}
      <CalendarToolbar
        calendarTitle={calendarTitle}
        activeView={activeView}
        handleToday={handleToday}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleViewChange={handleViewChange}
        handleBack={() =>
          navigate("/interviewer/dashboard/")
        }
        needsGoogleSync={needsGoogleSync}
        handleGoogleSync={handleGoogleSync}
        isSyncing={isSyncing}
      />

      {/* Calendar */}
      <div className="bg-white border-none rounded-lg max-h-[500px]">
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
          unselectAuto={false} // Prevent automatic unselection
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
          height="75vh"
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
          onClick={closePopup}
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
          closePopup={closePopup}
          isLoading={isBlockingCalendar}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
