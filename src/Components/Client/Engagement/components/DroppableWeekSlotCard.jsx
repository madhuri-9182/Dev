import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../EventSchedular";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Calendar, TickSquare } from "iconsax-react";
import EventCard from "./EventCard";
import { StyledDateTimePicker } from "./StyledDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "none",
  padding: "0",
  width: "max-content",
  height: "max-content",
  color: "#979DA3",
  backgroundColor: "#F5F7FA",
  border: "1px solid #79747E",
}));

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  width: "220px",
  height: "64px",
  padding: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const datePickerStyles = {
  "& input,& fieldset": { display: "none" },
  "& button": { padding: 0 },
  "& .MuiInputAdornment-root": { margin: 0 },
  "& .MuiInputBase-root": { padding: 0, height: "16px" },
};

const formatEventDate = (date) => {
  if (!date) return "Not scheduled";
  return moment(date, "DD/MM/YYYY HH:mm:ss").format(
    "dddd, DD MMM YYYY, hh:mm A"
  );
};

const parseEventDate = (date) => {
  if (!date) return null;
  return dayjs(
    moment(date, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
  );
};

const EmptySlotCard = ({ isOver, dropRef }) => (
  <StyledCard
    ref={dropRef}
    sx={{
      ...(isOver
        ? {
            border: "1px dashed #007AFF",
            backgroundColor: "#007AFF2A",
          }
        : {}),
    }}
  >
    <StyledCardActionArea>
      <AddCircleOutlineOutlinedIcon fontSize={"small"} sx={{ mr: 1 }} />
      <Typography fontSize={13}>Drag and Drop an Item Here</Typography>
    </StyledCardActionArea>
  </StyledCard>
);

const DateTimeControl = ({ event, isCompleted, onChangeDate }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Tooltip arrow title={formatEventDate(event?.date)}>
      <span style={{ height: "16px" }}>
        <StyledDateTimePicker
          disabled={isCompleted || !event}
          value={parseEventDate(event?.date)}
          minDate={dayjs(new Date())}
          sx={datePickerStyles}
          onChange={(value) => {
            onChangeDate(value);
          }}
          slots={{
            openPickerIcon: () => (
              <Calendar size={16} color={event?.date ? "#171717" : "#C4C4C4"} />
            ),
          }}
        />
      </span>
    </Tooltip>
  </LocalizationProvider>
);

const ControlButtons = ({ event, isCompleted, onUnSchedule, onChangeDate }) => (
  <Box className={"flex flex-col justify-between h-[40px] ml-1"}>
    <DateTimeControl
      onChangeDate={onChangeDate}
      event={event}
      isCompleted={isCompleted}
    />
    <IconButton
      onClick={() => event?.template && !isCompleted && onUnSchedule(event)}
      size="small"
      style={{ padding: 0 }}
    >
      <TickSquare size="16" color={event?.template ? "#171717" : "#C4C4C4"} />
    </IconButton>
  </Box>
);

function DroppableWeekSlotCard({ onDrop, event, onUnSchedule, onChangeDate }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.EVENT_CARD,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const isCompleted = event?.delivery_status === "SUC";

  return (
    <Box
      className={`flex items-center height-max-content ${
        isCompleted ? "opacity-70" : ""
      }`}
    >
      {event?.template ? (
        <EventCard
          title={event.template.template_name}
          selected={true}
          dimension={{ height: "64px", width: "220px" }}
          isEditable={false}
        />
      ) : (
        <EmptySlotCard isOver={isOver} dropRef={drop} />
      )}
      <ControlButtons
        event={event}
        isCompleted={isCompleted}
        onUnSchedule={onUnSchedule}
        onChangeDate={onChangeDate}
      />
    </Box>
  );
}

export default DroppableWeekSlotCard;
