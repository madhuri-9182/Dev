import PropTypes from "prop-types";
import Button, {
  primaryButtonStyles,
  secondaryButtonStyles,
  tertiaryButtonStyles,
} from "./components/Button";
import CandidateTimeline from "./components/CandidateTimeline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box } from "@mui/material";
import { useEventScheduler } from "./hooks/useEventScheduler";
import { TemplateList } from "./components/TemplateList";
import { WeeklySchedule } from "./components/WeeklySchedule";

function EventScheduler({
  engagement,
  setSelectedEngagement,
}) {
  const {
    templates,
    scheduledEventsPerWeek,
    isUpdating,
    handleDrop,
    handleUnSchedule,
    updateEngagement,
    handleDateChange,
    hasChanges,
    resetChanges,
    updateEngagementSchedule,
    isUpdatingSchedule,
    markDoneUnDone,
  } = useEventScheduler({
    engagement,
    setSelectedEngagement,
  });

  return (
    <div className=" flex flex-col ">
      <div>
        <CandidateTimeline
          onStatusChange={(value) =>
            updateEngagement({ status: value })
          }
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
            markDoneUnDone={markDoneUnDone}
          />
        </DndProvider>
      </div>

      <Box className="flex gap-2 mt-2 ml-auto justify-end">
        {hasChanges ? (
          <>
            <Button
              sx={{
                ...secondaryButtonStyles,
                paddingBlock: 0.5,
              }}
              onClick={resetChanges}
              disabled={isUpdatingSchedule}
            >
              Cancel
            </Button>

            <Button
              disabled={scheduledEventsPerWeek.some(
                (event) =>
                  event.slots.some(
                    (slot) => slot?.template && !slot?.date
                  )
              )}
              sx={{
                ...primaryButtonStyles,
                paddingBlock: 0.5,
              }}
              loading={isUpdatingSchedule}
              onClick={updateEngagementSchedule}
            >
              Save
            </Button>
          </>
        ) : (
          <Button
            sx={{
              ...tertiaryButtonStyles,
              paddingBlock: 0.5,
            }}
            onClick={() => window.history.back()}
            disabled={isUpdatingSchedule}
          >
            Back
          </Button>
        )}
      </Box>
    </div>
  );
}

export default EventScheduler;

EventScheduler.propTypes = {
  engagement: PropTypes.object,
  setSelectedEngagement: PropTypes.func,
};
