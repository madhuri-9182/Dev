import PropTypes from "prop-types";
import { formatExperience } from "../../../../../utils/util";
import { CANDIDATE_SOURCE } from "../../../../Constants/constants";
import { handleFileDownload } from "../../../../../utils/util";

/**
 * Sidebar component showing candidate details and remarks
 */
function CandidateSidebar({
  candidate,
  file,
  register,
  errors,
  disabled = false,
}) {
  // Handle file download

  // Sidebar content items
  const SIDEBAR_CONTENT = [
    {
      label: "Experience",
      value: formatExperience(
        candidate?.years_of_experience
      ),
    },
    {
      label: "Email",
      value: candidate?.email,
    },
    {
      label: "Company",
      value: candidate?.current_company,
    },
    {
      label: "Designation",
      value: candidate?.current_designation
        ? candidate.current_designation
        : "N/A",
    },
    {
      label: "Source",
      value: CANDIDATE_SOURCE.find(
        (source) => source.id === candidate?.source
      )?.name,
    },
  ];

  return (
    <div className="p-10 flex flex-col gap-y-4 bg-[#E7E4E8CC] rounded-2xl w-[340px]">
      <div className="flex flex-col gap-y-6">
        {SIDEBAR_CONTENT.map((content, index) => (
          <div
            key={index}
            className="flex flex-col gap-y-1 text-[#6B6F7B]"
          >
            <label
              className="text-2xs uppercase"
              htmlFor={content.label}
            >
              {content.label}
            </label>
            <span className="font-bold text-xs">
              {content.value}
            </span>
          </div>
        ))}

        <div className="flex flex-col gap-y-1">
          <label
            htmlFor="cv"
            className="text-2xs uppercase text-[#6B6F7B]"
          >
            CV
          </label>
          <span
            className="text-xs font-bold text-[#6B6F7B] hover:text-[#007AFF] cursor-pointer"
            onClick={() => handleFileDownload(file)}
          >
            Download
          </span>
        </div>

        {/* {check if it is from client schedule interview or client feedback} */}
        {disabled ? (
          <div className="flex flex-col">
            <textarea
              value={candidate?.remarks}
              placeholder="Write your remarks here"
              disabled={disabled}
              className="rounded-2xl italic text-2xs text-[#6B6F7B] disabled:cursor-not-allowed disabled:opacity-50 p-4 w-full h-[120px] bg-[#F6F6F6] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <textarea
              {...register("remark", { maxLength: 255 })}
              placeholder="Write your remarks here"
              className="rounded-2xl italic text-2xs text-[#6B6F7B] p-4 w-full h-[120px] bg-[#F6F6F6] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
            />
            {errors.remark && (
              <p className="text-red-500 text-xs mt-1">
                {errors.remark.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateSidebar;

CandidateSidebar.propTypes = {
  candidate: PropTypes.object,
  file: PropTypes.object,
  register: PropTypes.func,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
};
