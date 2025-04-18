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
                  data-error-key="overallRemark"
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
          <label className="block mb-1 font-[550] text-default required-field-label">
            Overall Score
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 outline-none bg-[#b0b0b03a] opacity-50 cursor-not-allowed"
            readOnly
            data-error-key="score"
            {...register("score", {
              required: "Score is required",
            })}
          />
        </div>
      </FormRow>
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
};

export default OverallRemarkSection;
