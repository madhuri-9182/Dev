/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  IoMdTime,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { LuMessageSquare } from "react-icons/lu";

/**
 * Calendar popup for adding blocked time with Google Calendar-like UI
 * @param {Object} props Component props
 * @param {Object} props.popupRef Ref for the popup
 * @param {Object} props.popupPosition Position for the popup
 * @param {Object} props.newEvent New event data
 * @param {Function} props.setNewEvent Function to update event data
 * @param {Function} props.handleSaveEvent Handler for saving event
 * @param {Function} props.setPopupVisible Function to control popup visibility
 * @param {Boolean} props.isLoading Loading state for save button
 * @returns {JSX.Element} Popup component
 */
const CalendarPopup = ({
  popupRef,
  popupPosition,
  newEvent,
  setNewEvent,
  handleSaveEvent,
  setPopupVisible,
  isLoading,
}) => {
  // State for expanded recurrence options
  const [showRecurrenceOptions, setShowRecurrenceOptions] =
    useState(false);

  // Initialize recurrence state with default values
  const [recurrence, setRecurrence] = useState({
    frequency: "WEEKLY", // default frequency
    interval: 1, // default interval (every 1 week/day/month/etc)
    days: [], // selected days of week
    count: null, // number of occurrences
    until: null, // end date
    monthDay: [], // days of month for monthly recurrence
    yearDay: [], // days of year for yearly recurrence
  });

  // Update newEvent when recurrence changes
  useEffect(() => {
    setNewEvent({
      ...newEvent,
      recurrence: recurrence,
      showRecurrenceOptions: showRecurrenceOptions, // Pass this state up to parent
    });
  }, [recurrence, showRecurrenceOptions]);

  // Frequency options from the image
  const frequencyOptions = [
    { value: "WEEKLY", label: "Weekly" },
    { value: "DAILY", label: "Daily" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  // Days of week options
  const daysOfWeek = [
    { value: "MO", label: "M", fullLabel: "Monday" },
    { value: "TU", label: "T", fullLabel: "Tuesday" },
    { value: "WE", label: "W", fullLabel: "Wednesday" },
    { value: "TH", label: "T", fullLabel: "Thursday" },
    { value: "FR", label: "F", fullLabel: "Friday" },
    { value: "SA", label: "S", fullLabel: "Saturday" },
    { value: "SU", label: "S", fullLabel: "Sunday" },
  ];

  // Toggle a day in the days array
  const toggleDay = (day) => {
    setRecurrence((prev) => {
      // Filter out any null values and then check if day exists
      const cleanDays = prev.days.filter((d) => d !== null);
      const newDays = cleanDays.includes(day)
        ? cleanDays.filter((d) => d !== day)
        : [...cleanDays, day];

      return {
        ...prev,
        days: newDays,
      };
    });
  };

  // Helper to get the current day for default selection
  useEffect(() => {
    if (
      recurrence.frequency === "WEEKLY" &&
      recurrence.days.length === 0
    ) {
      // Get the day of the selected date and set it as default
      try {
        const selectedDate = new Date(newEvent.date);
        const dayIndex = selectedDate.getDay();
        // Convert to day code (MO, TU, etc)
        const dayValues = [
          "SU",
          "MO",
          "TU",
          "WE",
          "TH",
          "FR",
          "SA",
        ];
        const defaultDay = dayValues[dayIndex];

        // Clear any null values and set the default day
        setRecurrence((prev) => ({
          ...prev,
          days: [defaultDay],
        }));
      } catch (e) {
        console.error("Error setting default day", e);
      }
    }
  }, [newEvent.date, recurrence.frequency]);

  // Handle frequency change
  const handleFrequencyChange = (frequency) => {
    setRecurrence((prev) => ({
      ...prev,
      frequency,
      // Reset days array when changing frequency
      days: frequency === "WEEKLY" ? prev.days : [],
    }));
  };

  // Handle interval change
  const handleIntervalChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setRecurrence((prev) => ({
      ...prev,
      interval: isNaN(value)
        ? 1
        : Math.min(Math.max(value, 1), 90), // Constrain between 1 and 90
    }));
  };

  // Handle count change (number of occurrences)
  const handleCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setRecurrence((prev) => ({
      ...prev,
      count: isNaN(value)
        ? null
        : Math.min(Math.max(value, 1), 250), // Constrain between 1 and 250
      until: null, // Reset until when count is set
    }));
  };

  // Handle until date change
  const handleUntilChange = (e) => {
    const untilDate = e.target.value;
    setRecurrence((prev) => ({
      ...prev,
      until: untilDate,
      count: null, // Reset count when until is set
    }));
  };

  return (
    <div
      ref={popupRef}
      className="bg-white rounded-lg shadow-xl w-96 absolute z-50 flex flex-col"
      style={{
        top: popupPosition.top,
        left: popupPosition.left,
        maxHeight: showRecurrenceOptions
          ? "400px"
          : "270px",
      }}
    >
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <div className="w-9/12">
          <input
            type="text"
            placeholder="Add title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                title: e.target.value,
              })
            }
            className="text-sm font-medium w-full border-b-2 border-blue-500 focus:outline-none py-1"
          />
        </div>
        <button
          onClick={() => setPopupVisible(false)}
          className="bg-transparent border-none text-[#5f6368] text-lg w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6]"
        >
          ×
        </button>
      </div>

      {/* Event details */}
      <div className="px-4 py-2 flex flex-col space-y-4 overflow-y-auto">
        {/* Date and time */}
        <div className="flex items-start">
          <div className="text-gray-500 w-8 flex-shrink-0 mt-1">
            <IoMdTime className="w-[18px] h-[18px]" />
          </div>
          <div className="flex-grow">
            <div className="font-medium text-xs">
              {newEvent.formattedTime}
            </div>
            <div
              className="flex items-center mt-1 text-gray-500 text-2xs cursor-pointer"
              onClick={() =>
                setShowRecurrenceOptions(
                  !showRecurrenceOptions
                )
              }
            >
              <span>{"Doesn't repeat"}</span>
              {showRecurrenceOptions ? (
                <IoIosArrowUp className="h-4 w-4 ml-1" />
              ) : (
                <IoIosArrowDown className="h-4 w-4 ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start">
          <div className="text-gray-500 w-8 flex-shrink-0 mt-1">
            <LuMessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-grow">
            <textarea
              placeholder="Add description or notes"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  description: e.target.value,
                })
              }
              className="w-full text-xs p-2 border border-gray-200 rounded resize-none h-20 focus:outline-none focus:border-blue-400"
            ></textarea>
          </div>
        </div>
        {showRecurrenceOptions && (
          <div className=" mb-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3 text-default">
              Recurrence
            </h3>

            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">
                Frequency
              </label>
              <select
                value={recurrence.frequency}
                onChange={(e) =>
                  handleFrequencyChange(e.target.value)
                }
                className="w-full px-2 py-1 text-2xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {frequencyOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">
                Repeat every
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={recurrence.interval}
                  onChange={handleIntervalChange}
                  className="w-16 px-2 py-1 text-2xs border border-gray-300 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs">
                  {recurrence.frequency === "DAILY" &&
                    "day(s)"}
                  {recurrence.frequency === "WEEKLY" &&
                    "week(s)"}
                  {recurrence.frequency === "MONTHLY" &&
                    "month(s)"}
                  {recurrence.frequency === "YEARLY" &&
                    "year(s)"}
                  {recurrence.frequency === "HOURLY" &&
                    "hour(s)"}
                  {recurrence.frequency === "MINUTELY" &&
                    "minute(s)"}
                  {recurrence.frequency === "SECONDLY" &&
                    "second(s)"}
                </span>
              </div>
            </div>

            {/* Days of week selector (for WEEKLY) */}
            {recurrence.frequency === "WEEKLY" && (
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">
                  Repeat on
                </label>
                <div className="flex justify-between">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      title={day.fullLabel}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-2xs
                      ${
                        recurrence.days.includes(day.value)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* End options */}
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">
                Ends
              </label>

              {/* Never end */}
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="end-never"
                  name="ends"
                  checked={
                    !recurrence.count && !recurrence.until
                  }
                  onChange={() => {
                    setRecurrence((prev) => ({
                      ...prev,
                      count: null,
                      until: null,
                    }));
                  }}
                  className="mr-2 text-2xs"
                />
                <label
                  htmlFor="end-never"
                  className="text-2xs"
                >
                  Never
                </label>
              </div>

              {/* End after X occurrences */}
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="end-count"
                  name="ends"
                  checked={!!recurrence.count}
                  onChange={() => {
                    setRecurrence((prev) => ({
                      ...prev,
                      count: 10,
                      until: null,
                    }));
                  }}
                  className="mr-2 text-2xs"
                />
                <label
                  htmlFor="end-count"
                  className="text-2xs flex items-center"
                >
                  After
                  <input
                    type="number"
                    min="1"
                    max="250"
                    value={recurrence.count || ""}
                    onChange={handleCountChange}
                    disabled={!recurrence.count}
                    className="mx-2 w-16 p-1 border border-gray-300 rounded text-2xs"
                  />
                  occurrences
                </label>
              </div>

              {/* End on specific date */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="end-until"
                  name="ends"
                  checked={!!recurrence.until}
                  onChange={() => {
                    const twoMonthsFromNow = new Date();
                    twoMonthsFromNow.setMonth(
                      twoMonthsFromNow.getMonth() + 2
                    );
                    const formattedDate = twoMonthsFromNow
                      .toISOString()
                      .split("T")[0];

                    setRecurrence((prev) => ({
                      ...prev,
                      until: formattedDate,
                      count: null,
                    }));
                  }}
                  className="mr-2 text-2xs"
                />
                <label
                  htmlFor="end-until"
                  className="text-2xs flex items-center"
                >
                  On
                  <input
                    type="date"
                    value={recurrence.until || ""}
                    onChange={handleUntilChange}
                    disabled={!recurrence.until}
                    className="ml-2 p-1 border border-gray-300 rounded text-2xs"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t flex justify-end space-x-2 sticky bottom-0 bg-white z-10">
        <button
          className="text-[#007AFF] font-medium text-default px-3 py-1 hover:bg-[#dee8f6] rounded-full"
          onClick={() =>
            setShowRecurrenceOptions(!showRecurrenceOptions)
          }
        >
          {showRecurrenceOptions ? "Hide" : "More"} options
        </button>
        <button
          onClick={handleSaveEvent}
          disabled={isLoading}
          className="p-1 px-4 rounded-full text-default font-medium text-white
             bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default CalendarPopup;

CalendarPopup.propTypes = {
  popupRef: PropTypes.object,
  popupPosition: PropTypes.object,
  newEvent: PropTypes.object,
  setNewEvent: PropTypes.func,
  handleSaveEvent: PropTypes.func,
  setPopupVisible: PropTypes.func,
  isLoading: PropTypes.bool,
};
