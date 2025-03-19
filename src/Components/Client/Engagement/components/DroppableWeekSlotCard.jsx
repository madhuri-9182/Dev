/* eslint-disable react/prop-types */
import { useDrop } from "react-dnd";
import { ItemTypes } from "../constants";
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
import { Delete } from "@mui/icons-material";

const StyledCard = styled(Card)(() => ({
  borderRadius: "16px",
  boxShadow: "none",
  padding: "0",
  width: "max-content",
  height: "max-content",
  color: "#979DA3",
  backgroundColor: "#F5F7FA",
  border: "1px solid #79747E",
}));

const StyledCardActionArea = styled(CardActionArea)(() => ({
  width: "250px",
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

const formatEventDate = (date, delivery_status) => {
  if (!date) return "Not scheduled";
  if (
    delivery_status !== "SUC" &&
    moment.duration(moment(date, "DD/MM/YYYY HH:mm:ss").diff(moment())) < 0
  )
    return (
      "Time Expired: " +
      moment(date, "DD/MM/YYYY HH:mm:ss").format("dddd, DD MMM YYYY, hh:mm A")
    );

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
      <Typography fontSize={12}>Drag and Drop an Item Here</Typography>
    </StyledCardActionArea>
  </StyledCard>
);

const DateTimeControl = ({ event, isCompleted, onChangeDate }) => {
  let dateIconColor = "#C4C4C4";

  if (!isCompleted && event) {
    if (event.template) {
      if (!event.date) {
        dateIconColor = "red";
      } else if (event.date) {
        if (
          moment.duration(
            moment(event.date, "DD/MM/YYYY HH:mm:ss").diff(moment())
          ) < 0
        ) {
          dateIconColor = "darkorange";
        } else {
          dateIconColor = "#171717";
        }
      }
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Tooltip
        arrow
        title={formatEventDate(event?.date, event?.delivery_status)}
      >
        <span style={{ height: "16px" }}>
          <StyledDateTimePicker
            disabled={isCompleted || !event?.template}
            value={parseEventDate(event?.date)}
            minDate={dayjs(new Date())}
            sx={datePickerStyles}
            onChange={(value) => {
              onChangeDate(value);
            }}
            slots={{
              openPickerIcon: () => (
                <Calendar size={16} color={dateIconColor} />
              ),
            }}
          />
        </span>
      </Tooltip>
    </LocalizationProvider>
  );
};

const ControlButtons = ({
  event,
  isCompleted,
  markDoneUnDone,
  onChangeDate,
}) => (
  <Box className={"flex flex-col justify-between h-[40px] ml-1"}>
    <DateTimeControl
      onChangeDate={onChangeDate}
      event={event}
      isCompleted={isCompleted}
    />

    <IconButton
      onClick={() => markDoneUnDone(event?.operation_complete_status !== "SUC")}
      size="small"
      style={{ padding: 0 }}
      disabled={!isCompleted}
      sx={{
        color: "#171717",
      }}
    >
      <TickSquare
        size="16"
        style={{
          fill:
            event?.operation_complete_status === "SUC" ? "lightgreen" : "none",
        }}
      />
    </IconButton>
  </Box>
);

function DroppableWeekSlotCard({
  onDrop,
  event,
  onUnSchedule,
  markDoneUnDone,
  onChangeDate,
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.EVENT_CARD,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const isCompleted = event?.delivery_status === "SUC";

  return (
    <Box
      className={`flex items-center height-max-content relative ${
        isCompleted ? "opacity-70" : ""
      }`}
      sx={{
        "&:hover [data-id=close-button]": {
          display: "block",
        },
      }}
    >
      {event?.template && !isCompleted ? (
        <IconButton
          onClick={() => event?.template && !isCompleted && onUnSchedule(event)}
          sx={{
            color: "white",
            position: "absolute",
            right: 26,
            top: -2,
            zIndex: 5,
            display: "none",
            cursor: "pointer",
            padding: 0,
          }}
          data-id="close-button"
          size="small"
        >
          <Delete sx={{ fontSize: "14px" }} />
        </IconButton>
      ) : (
        ""
      )}

      {event?.template ? (
        <EventCard
          title={event.template.template_name}
          selected={true}
          dimension={{ height: "64px", width: "250px" }}
          isEditable={false}
        />
      ) : (
        <EmptySlotCard isOver={isOver} dropRef={drop} />
      )}
      <ControlButtons
        event={event}
        isCompleted={isCompleted}
        markDoneUnDone={markDoneUnDone}
        onChangeDate={onChangeDate}
      />
    </Box>
  );
}

export default DroppableWeekSlotCard;
