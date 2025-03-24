/**
 * Custom hook for managing interview scheduling logic
 */
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDateToDDMMYYYY } from "../../../../../utils/util";
import {
  calculateExperienceYear,
  getTimeFromWindow,
} from "../utils/timeUtils";
import {
  processAvailabilityData,
  generateAvailableWindows,
} from "../utils/availabilityProcessor";

// Import API function - in a real implementation, this would be imported from an API service
// import { getInterviewAvailability } from '../api';

/**
 * Custom hook for interview scheduling
 * @param {Object} candidateData - The candidate data
 * @param {Function} getInterviewAvailability - API function to get availability data
 * @returns {Object} - Scheduling state and handlers
 */
const useInterviewScheduling = (
  candidateData,
  getInterviewAvailability
) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState(null);
  const [availableHourlySlots, setAvailableHourlySlots] =
    useState([]);
  const [availableWindows, setAvailableWindows] = useState(
    []
  );
  const [selectedWindow, setSelectedWindow] =
    useState(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState(
    []
  );
  const [schedulingError, setSchedulingError] =
    useState(null);

  // Query params for availability API
  const getAvailabilityQueryParams = useCallback(() => {
    if (!selectedDate || !candidateData) return null;

    // Format date as YYYY-MM-DD
    const formattedDate =
      formatDateToDDMMYYYY(selectedDate);

    // Calculate experience year based on our logic
    const experienceYear = calculateExperienceYear(
      candidateData?.years_of_experience
    );

    return {
      date: formattedDate,
      designation_id: candidateData?.role,
      specialization: candidateData?.specialization,
      company: candidateData?.current_company,
      designation: candidateData?.current_designation,
      experience_year: experienceYear,
    };
  }, [selectedDate, candidateData]);

  // Query for availability data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAvailability", selectedDate],
    queryFn: () => {
      const params = getAvailabilityQueryParams();
      if (params) {
        return getInterviewAvailability(params);
      }
    },
    enabled: !!selectedDate,
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });

  // Process availability data when it's received
  useEffect(() => {
    if (data && data.data) {
      const processedSlots = processAvailabilityData(
        data.data
      );
      setAvailableHourlySlots(processedSlots);
      // Reset selected time slot and related states when data changes
      setSelectedTimeSlot(null);
      setAvailableWindows([]);
      setSelectedWindow(null);
      setSelectedSlotIds([]);
    }
  }, [data]);

  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    if (!slot.available) return;

    // If clicking on the same slot, deselect it
    if (selectedTimeSlot === slot.time) {
      setSelectedTimeSlot(null);
      setAvailableWindows([]);
      setSelectedWindow(null);
      setSelectedSlotIds([]);
    } else {
      setSelectedTimeSlot(slot.time);
      // Generate available windows based on the selected slot
      const windows = generateAvailableWindows(
        slot.time,
        data?.data
      );
      setAvailableWindows(windows);
      setSelectedWindow(null);
      setSelectedSlotIds(slot.slotIds);
    }
  };

  // Handle window selection
  const handleWindowSelect = (window) => {
    if (selectedWindow === window.window) {
      setSelectedWindow(null);
      setSelectedSlotIds([]);
    } else {
      setSelectedWindow(window.window);
      setSelectedSlotIds(window.slotIds);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    availableHourlySlots,
    availableWindows,
    selectedWindow,
    selectedSlotIds,
    schedulingError,
    setSchedulingError,
    handleTimeSlotSelect,
    handleWindowSelect,
    isLoading,
    isError,
    error,
    getTimeFromWindow,
  };
};

export default useInterviewScheduling;
