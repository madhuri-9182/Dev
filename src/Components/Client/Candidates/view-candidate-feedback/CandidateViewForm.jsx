import PropTypes from "prop-types";
import { getJobLabel } from "../../../../utils/util";
import {
  REMARK_OPTIONS,
  SPECIALIZATIONS,
} from "../../../Constants/constants";
import { formatExperience } from "../../../Interviewer/Dashboard/utils/formatters";
import { useNavigate, useLocation } from "react-router-dom";

const CandidateViewForm = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const CANDIDATE_FORM_ITEMS = [
    {
      label: "Name",
      value: data?.candidate?.name,
    },
    {
      label: "Role",
      value: getJobLabel(data?.candidate?.role),
    },
    {
      label: "Function",
      value: SPECIALIZATIONS.find(
        (spec) =>
          spec.id === data?.candidate?.specialization
      )?.name,
    },
  ];

  const INTERVIEW_FORM_ITEMS = [
    {
      label: "Interviewer Experience",
      value: formatExperience(
        data?.interviewer?.total_experience_months,
        data?.interviewer?.total_experience_years
      ),
    },
    {
      label: "Interviewer Company",
      value: data?.interviewer?.current_company,
    },
    {
      label: "Date & Time",
      value: data?.interview_date,
    },
  ];

  const getFeedbackInputColor = (value) => {
    if (["REC", "HREC"].includes(value)) {
      return "bg-[#59B568] text-white border-[#59B568]";
    } else {
      return "bg-[#B10E0EE5] text-white border-[#B10E0EE5]";
    }
  };

  const FEEDBACK_FORM_ITEMS = [
    {
      label: "Feedback",
      value: REMARK_OPTIONS.find(
        (option) => option.id === data?.overall_remark
      )?.name,
      className: getFeedbackInputColor(
        data?.overall_remark
      ),
    },
    {
      label: "Score",
      value: `${data?.overall_score}/100`,
      className: getFeedbackInputColor(
        data?.overall_remark
      ),
    },
  ];

  return (
    <div className="w-[97%]">
      <div className="flex items-center justify-around gap-x-2">
        <FormItem
          formItems={CANDIDATE_FORM_ITEMS}
          className="w-1/3"
        />
        <FormItem
          formItems={INTERVIEW_FORM_ITEMS}
          className="w-2/3"
        />
      </div>
      <div className="mt-28 flex justify-center items-center flex-col gap-y-4">
        {FEEDBACK_FORM_ITEMS.map((item, idx) => (
          <div
            className="flex gap-x-3 items-center"
            key={idx}
          >
            <label className="text-2xs w-20 font-bold text-right text-[#6B6F7B]">
              {item.label}
            </label>
            <input
              value={item.value || ""}
              readOnly
              type="text"
              className={`rounded-lg w-[200px] text-2xs py-[6px] px-3 border text-center shadow ${item.className}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-20 flex justify-center items-center gap-x-3">
        <div className="w-20"></div>
        <button
          type="button"
          className="w-[200px] bg-[#007AFF] text-white rounded-full h-[36px] text-xs font-medium text-center"
          onClick={() => {
            navigate(`${location.pathname}/feedback`);
          }}
        >
          View & Download Report
        </button>
      </div>
    </div>
  );
};

export default CandidateViewForm;

CandidateViewForm.propTypes = { data: PropTypes.object };

const FormItem = ({ formItems, className }) => (
  <div className={`flex flex-col gap-y-3 ${className}`}>
    {formItems.map((item, idx) => (
      <div
        className="flex items-center gap-x-3 justify-end"
        key={idx}
      >
        <label className="text-2xs font-bold text-[#6B6F7B] text-right w-1/3">
          {item.label}
        </label>
        <input
          value={item.value || ""}
          readOnly
          type="text"
          className="rounded-lg w-[200px] text-2xs py-[6px] px-3 border border-[#CAC4D0] text-[#49454F] text-center bg-gray-50"
        />
      </div>
    ))}
  </div>
);

FormItem.propTypes = {
  formItems: PropTypes.array,
  className: PropTypes.string,
};
