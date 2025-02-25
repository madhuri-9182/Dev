import { useCallback, useEffect, useState } from "react";
import { useEngagementTemplates, useUpdateEngagementStatus } from "../api";
import moment from "moment/moment";
import { NOTICE_PERIOD } from "../constants";
import { getScheduledEventsPerWeekInitialValue } from "../utils";

export const useEventScheduler = ({ engagement, setSelectedEngagement }) => {
  const { mutateAsync: mutateEngagementStatus, isPending: isUpdating } =
    useUpdateEngagementStatus();

  const [templates, setTemplates] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const {
    data,
    isFetching: isLoadingtemplates,
    refetch,
  } = useEngagementTemplates();
  const _templates = data?.results || [];

  const [scheduledEventsPerWeek, setScheduledEventsPerWeek] = useState(
    getScheduledEventsPerWeekInitialValue(engagement)
  );

  useEffect(() => {
    if (!isLoadingtemplates) {
      debugger;
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
        const emptySlotIndex = weekData.slots.findIndex(
          (slot) => slot === null
        );

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
    }
  }, [isLoadingtemplates]);

  const resetChanges = async () => {
    await refetch();
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
  };
};
