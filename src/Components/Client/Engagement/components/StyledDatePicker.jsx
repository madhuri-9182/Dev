import { styled } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "30px",
    fontSize: "12px",
  },
}));

export const StyledDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "30px",
    fontSize: "12px",
  },
}));
