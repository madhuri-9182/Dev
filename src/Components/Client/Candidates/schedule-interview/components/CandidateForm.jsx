import PropTypes from "prop-types";
import { getJobLabel } from "../../../../../utils/util";
import { SPECIALIZATIONS } from "../../../../Constants/constants";

/**
 * Form component for displaying candidate basic information
 */
function CandidateForm({ candidate, jobs }) {
  // Get job role and function for display
  const role = jobs?.find(
    (job) => job.id === candidate?.role
  )?.name;
  const roleValue = getJobLabel(role);
  const functionValue = SPECIALIZATIONS.find(
    (spec) => spec.id === candidate?.specialization
  )?.name;

  // Form items
  const FORM_ITEMS = [
    {
      label: "Name",
      value: candidate?.name,
    },
    {
      label: "Role",
      value: roleValue,
    },
    {
      label: "Function",
      value: functionValue,
    },
  ];

  return (
    <div className="w-[40%] flex flex-col gap-y-3">
      {FORM_ITEMS.map((item, idx) => (
        <div
          className="flex items-center gap-x-3"
          key={idx}
        >
          <label className="text-2xs font-bold text-[#6B6F7B] text-right w-1/3">
            {item.label}
          </label>
          <input
            value={item.value || ""}
            readOnly
            type="text"
            className="rounded-lg w-2/3 text-2xs py-[6px] px-3 border border-[#CAC4D0] text-[#49454F] text-center bg-gray-50"
          />
        </div>
      ))}
    </div>
  );
}

export default CandidateForm;

CandidateForm.propTypes = {
  candidate: PropTypes.object,
  jobs: PropTypes.array,
};
