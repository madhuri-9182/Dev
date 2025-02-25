import React from "react";
import { Typography } from "@mui/material";
import DroppableWeekSlotCard from "./DroppableWeekSlotCard";

export const WeeklySchedule = ({
  scheduledEventsPerWeek,
  handleDrop,
  handleUnSchedule,
  onChangeDate,
}) => {
  return (
    <div
      style={{ height: "calc(100vh - 275px" }}
      className="flex-grow flex gap-5 flex-col  overflow-auto"
    >
      {scheduledEventsPerWeek.map((weekData, weekIndex) => (
        <div key={weekData.week} className="flex justify-evenly items-center">
          <div className="flex gap-20 items-center">
            <Typography
              component={"span"}
              textTransform={"uppercase"}
              variant="subtitle2"
              fontWeight={"600"}
            >
              Week {weekData.week}
            </Typography>

            <DroppableWeekSlotCard
              event={weekData.slots[0]}
              onDrop={(item) => handleDrop(item, weekIndex, 0)}
              onUnSchedule={(event) => handleUnSchedule(event)}
              onChangeDate={(value) => onChangeDate(value, weekIndex, 0)}
            />
            <DroppableWeekSlotCard
              event={weekData.slots[1]}
              onDrop={(item) => handleDrop(item, weekIndex, 1)}
              onUnSchedule={(event) => handleUnSchedule(event)}
              onChangeDate={(value) => onChangeDate(value, weekIndex, 1)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
