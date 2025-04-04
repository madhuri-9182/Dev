import { REMARK_OPTIONS } from "../../../Constants/constants";

export const COLORS = {
  PRIMARY: "#ffd966",
  SECONDARY: "#c9daf8",
  TEXT_PRIMARY: "#49454F",
  BORDER: "#CAC4D0",
  BACKGROUND_LIGHT: "#E5E7EB",

  // Feedback colors
  SUCCESS: "#4AD1A9",
  WARNING: "#ffbe5d",
  ERROR: "#eb0f0fb0",
};

export const getFeedbackColor = (score) => {
  const numScore = Number(score);
  if (numScore < 33) {
    return COLORS.ERROR;
  } else if (numScore < 66) {
    return COLORS.WARNING;
  } else {
    return COLORS.SUCCESS;
  }
};

export const getFeedbackInputColor = (value) => {
  switch (value) {
    case "REC":
      return "bg-[#2ECC71] text-white border-[#2ECC71] shadow";
    case "HREC":
      return "bg-[#27AE60] text-white border-[#27AE60] shadow";
    case "NJ":
      return "bg-[#00ABF0] text-white border-[#00ABF0] shadow";
    case "NREC":
      return "bg-[#ec1313] text-white border-[#ec1313] shadow";
    case "SNREC":
      return "bg-[#B71C1C] text-white border-[#B71C1C] shadow";
    default:
      return "bg-[#C4C4C4] border-[#C4C4C4] shadow";
  }
};

export const getRemarksLabel = (key) => {
  const remark = REMARK_OPTIONS.find(
    (remark) => remark.id === key
  );
  return remark ? remark.name : key;
};
