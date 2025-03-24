import { useLocation } from "react-router-dom";
import {
  getJobLabel,
  getSpecialization,
} from "../../../../../../utils/util";
import {
  getFeedbackInputColor,
  getRemarksLabel,
} from "../../util";

export const useCandidateData = () => {
  const { state } = useLocation();
  const data = state?.data;

  if (!data) {
    return {
      loading: false,
      error: "No candidate data found",
      formItems: [],
      skillsCount: 0,
      skillsData: {},
    };
  }

  const defaultInputClassName =
    "border-[#CAC4D0] text-[#49454F] bg-gray-50";

  const formItems = [
    {
      label: "Name",
      value: data?.candidate?.name,
      className: defaultInputClassName,
    },
    {
      label: "Function",
      value: getSpecialization(
        data?.candidate?.specialization
      ),
      className: defaultInputClassName,
    },
    {
      label: "Feedback",
      value: getRemarksLabel(data?.overall_remark),
      className: getFeedbackInputColor(
        data?.overall_remark
      ),
    },
    {
      label: "Role",
      value: getJobLabel(data?.candidate?.role),
      className: defaultInputClassName,
    },
    {
      label: "Date & Time",
      value: data?.interview_date,
      className: defaultInputClassName,
    },
    {
      label: "Score",
      value: `${data?.overall_score}/100`,
      className: getFeedbackInputColor(
        data?.overall_remark
      ),
    },
  ];

  return {
    loading: false,
    error: null,
    formItems,
    skillsCount:
      Object.keys(data?.skill_based_performance || {})
        .length || 0,
    skillsData: data?.skill_based_performance || {},
  };
};
