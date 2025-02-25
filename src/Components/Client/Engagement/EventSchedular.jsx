import React from "react";
import Button from "./components/Button";
import { DraggableEventCard } from "./components/EventCard";
import CandidateTimeline from "./components/CandidateTimeline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableWeekSlotCard from "./components/DroppableWeekSlotCard";
import { Box, Typography } from "@mui/material";
import { useEventScheduler } from "./hooks/useEventScheduler";
import { TemplateList } from "./components/TemplateList";
import { WeeklySchedule } from "./components/WeeklySchedule";

export const ItemTypes = {
  EVENT_CARD: "eventCard",
};

function EventScheduler({ engagement, setSelectedEngagement }) {
  const {
    templates,
    scheduledEventsPerWeek,
    isUpdating,
    handleDrop,
    handleUnSchedule,
    updateEngagement,
    handleDateChange,
    hasChanges,
    isLoadingtemplates,
    resetChanges,
  } = useEventScheduler({
    engagement,
    setSelectedEngagement,
  });

  return (
    <div className="pr-6 flex flex-col ">
      <div>
        <CandidateTimeline
          onStatusChange={(value) => updateEngagement({ status: value })}
          engagement={engagement}
          isUpdating={isUpdating}
        />
      </div>

      <div className="flex-grow flex mt-5">
        <DndProvider backend={HTML5Backend}>
          <TemplateList templates={templates} />

          <WeeklySchedule
            scheduledEventsPerWeek={scheduledEventsPerWeek}
            handleDrop={handleDrop}
            handleUnSchedule={handleUnSchedule}
            onChangeDate={handleDateChange}
          />
        </DndProvider>
      </div>
      {hasChanges && (
        <Box className="flex gap-2 mt-2 ml-auto justify-end">
          <Button
            sx={{
              backgroundColor: "white",
              borderColor: "#79747E",
              paddingBlock: 0.5,
              color: "#79747E",
            }}
            variant="outlined"
            onClick={resetChanges}
            loading={isLoadingtemplates}
          >
            Cancel
          </Button>

          <Button
            sx={{
              paddingBlock: 0.5,
              backgroundColor: "#007AFF",
              color: "white",
            }}
            loading={isUpdating}
          >
            Save
          </Button>
        </Box>
      )}
    </div>
  );
}

export default EventScheduler;
