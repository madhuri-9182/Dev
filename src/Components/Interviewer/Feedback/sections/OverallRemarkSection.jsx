import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Remark } from "../../../../assets";
import {
  FormRow,
  FormSection,
  Select,
} from "../FeedbackComponents";

const OverallRemarkSection = ({
  control,
  register,
  errors,
  remarkOptions,
  isPending,
}) => {
  return (
    <FormSection
      title="Overall Remark"
      subtitle=""
      icon={Remark}
    >
      <FormRow>
        <div className="mb-6 w-full">
          <Controller
            control={control}
            name="overallRemark"
            rules={{
              required: "Overall remark is required",
            }}
            render={({ field }) => (
              <>
                <Select
                  label="Overall Remark"
                  options={remarkOptions}
                  {...field}
                />
                {errors.overallRemark && (
                  <span className="text-[#B10E0EE5] text-2xs">
                    {errors.overallRemark.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-default">
            Overall Score
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 outline-none"
            {...register("score", {
              required: "Score is required",
            })}
          />
        </div>
      </FormRow>

      <div className="flex justify-end mt-6 ">
        <button
          type="submit"
          className={`px-6 py-2 text-sm bg-black hover:opacity-80 text-white font-medium rounded-lg ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </FormSection>
  );
};

OverallRemarkSection.propTypes = {
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  remarkOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isPending: PropTypes.bool,
};

export default OverallRemarkSection;
