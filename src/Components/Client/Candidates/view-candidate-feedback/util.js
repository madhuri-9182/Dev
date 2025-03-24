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
  if (["REC", "HREC"].includes(value)) {
    return "bg-[#59B568] text-white border-[#59B568] shadow";
  } else if (value === "NJ") {
    return "bg-[#ffbe5d] text-white border-[#ffbe5d] shadow";
  } else {
    return "bg-[#ec1313] text-white border-[#ec1313] shadow";
  }
};

export const getRemarksLabel = (key) => {
  const remark = REMARK_OPTIONS.find(
    (remark) => remark.id === key
  );
  return remark ? remark.name : key;
};
