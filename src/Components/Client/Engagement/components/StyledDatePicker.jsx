import { styled } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const StyledDatePicker = styled(DatePicker)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "30px",
    fontSize: "12px",
    "& .MuiInputBase-input": {
      "&::placeholder": {
        color: "#6B7280",
        opacity: 1,
      },
    },
  },
}));

export const StyledDateTimePicker = styled(DateTimePicker)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "30px",
    fontSize: "12px",
    "&::placeholder": {
      color: "#6B7280",
      opacity: 1,
    },
  },
}));
