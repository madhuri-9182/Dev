/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import {
  useEngagementTemplates,
  useUpdateEngagementSchedule,
  useUpdateEngagementStatus,
} from "../api";
import moment from "moment/moment";
import {
  getScheduledEventsPerWeekInitialValue,
  prepareOperationsPayload,
} from "../utils";
import { useNavigate } from "react-router-dom";

export const useEventScheduler = ({ engagement, setSelectedEngagement }) => {
  const { mutateAsync: mutateEngagementStatus, isPending: isUpdating } =
    useUpdateEngagementStatus();

  const {
    mutateAsync: mutateEngagementSchedule,
    isPending: isUpdatingSchedule,
  } = useUpdateEngagementSchedule();

  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const {
    data,
    isFetching: isFetchingtemplates,
    isLoading: isLoadingtemplates,
  } = useEngagementTemplates();
  const _templates = data?.results || [];

  const [scheduledEventsPerWeek, setScheduledEventsPerWeek] = useState(
    getScheduledEventsPerWeekInitialValue(engagement)
  );

  const loadInitialState = useCallback((_templates) => {
    const templates = JSON.parse(JSON.stringify(_templates));
    const engagementOperations = JSON.parse(
      JSON.stringify(engagement.engagementoperations)
    );
    const scheduledEventsPerWeekCopy =
      getScheduledEventsPerWeekInitialValue(engagement);
    engagementOperations.forEach((operation) => {
      const weekData = scheduledEventsPerWeekCopy.find(
        (week) => week.week === operation.week
      );
      const emptySlotIndex = weekData.slots.findIndex((slot) => slot === null);

      if (emptySlotIndex !== -1) {
        const templateIndex = _templates.findIndex(
          (t) => t?.id === operation.template.id
        );

        templates[templateIndex] = null;
        weekData.slots[emptySlotIndex] = {
          ...operation,
          template: { ...operation.template, index: templateIndex },
        };
      }
    });

    setScheduledEventsPerWeek([...scheduledEventsPerWeekCopy]);

    setTemplates([...templates]);
  }, []);

  useEffect(() => {
    if (!hasChanges && _templates.length > 0) {
      loadInitialState(_templates);
    }
  }, [hasChanges]);

  useEffect(() => {
    if (!isFetchingtemplates && _templates.length > 0) {
      loadInitialState(_templates);
    }
  }, [isFetchingtemplates]);

  useEffect(() => {
    if (!isFetchingtemplates)
      setSelectedEngagement((engagement) => {
        const operations = [];
        scheduledEventsPerWeek.forEach((week) => {
          week.slots.forEach((slot) => {
            if (slot?.template) {
              operations.push(slot);
            }
          });
        });
        engagement.engagementoperations = operations;
        return { ...engagement };
      });
  }, [scheduledEventsPerWeek]);

  const resetChanges = async () => {
    setHasChanges(false);
  };

  const handleDrop = useCallback((item, weekIndex, slotIndex) => {
    setHasChanges(true);
    setTemplates((prevTemplates) => {
      setScheduledEventsPerWeek((prevScheduledEventsPerWeek) =>
        prevScheduledEventsPerWeek.map((weekData, idx) => {
          if (idx === weekIndex) {
            const newSlots = [...weekData.slots];
            const slot = newSlots[slotIndex];
            const template = prevTemplates[item.index];
            if (slot) {
              newSlots[slotIndex] = {
                ...slot,
                template: {
                  id: template.id,
                  template_name: template.template_name,
                  index: item.index,
                },
              };
            } else {
              newSlots[slotIndex] = {
                id: -1,
                template: {
                  id: template.id,
                  template_name: template.template_name,
                  index: item.index,
                },
                week: weekData.week,
                date: null,
                delivery_status: "PED",
              };
            }
            return { ...weekData, slots: newSlots };
          }
          return weekData;
        })
      );

      return prevTemplates.map((_, index) => (index !== item.index ? _ : null));
    });
  }, []);

  const handleUnSchedule = useCallback((event) => {
    setHasChanges(true);
    setTemplates((prevEvents) => {
      prevEvents[event.template.index] = event.template;
      return [...prevEvents];
    });

    setScheduledEventsPerWeek((prevScheduledEventsPerWeek) =>
      prevScheduledEventsPerWeek.map((weekData) => ({
        ...weekData,
        slots: weekData.slots.map((slot) =>
          slot === event ? { ...slot, template: null } : slot
        ),
      }))
    );
  }, []);

  const updateEngagement = async (update) => {
    if (update.status) {
      await mutateEngagementStatus({
        engagementId: engagement.id,
        payload: { status: update.status },
      });
      setSelectedEngagement({ ...engagement, status: update.status });
    }
  };
  const handleDateChange = (date, weekIndex, slotIndex) => {
    setHasChanges(true);
    const newDate = moment(date.$d).format("DD/MM/YYYY HH:mm:ss");
    setScheduledEventsPerWeek((prevScheduledEventsPerWeek) => {
      prevScheduledEventsPerWeek[weekIndex].slots[slotIndex].date = newDate;
      return [...prevScheduledEventsPerWeek];
    });
  };

  const markDoneUnDone = (weekIndex, slotIndex, done) => {
    setHasChanges(true);
    setScheduledEventsPerWeek((prevScheduledEventsPerWeek) => {
      prevScheduledEventsPerWeek[weekIndex].slots[
        slotIndex
      ].operation_complete_status = done ? "SUC" : "PEN";
      return [...prevScheduledEventsPerWeek];
    });
  };

  const updateEngagementSchedule = async () => {
    await mutateEngagementSchedule({
      engagementId: engagement.id,
      payload: {
        template_data: prepareOperationsPayload(scheduledEventsPerWeek),
      },
    });
    navigate("/client/engagement/dashboard");
  };

  return {
    templates,
    scheduledEventsPerWeek,
    isUpdating,
    handleDrop,
    handleUnSchedule,
    updateEngagement,
    handleDateChange,
    hasChanges,
    resetChanges,
    isLoadingtemplates,
    updateEngagementSchedule,
    isUpdatingSchedule,
    markDoneUnDone,
    isFetchingtemplates,
  };
};
