import PropTypes from "prop-types";
import { Business } from "../../../../assets";
import {
  FormRow,
  FormSection,
  Input,
} from "../FeedbackComponents";

const InterviewerDetailsSection = ({
  register,
  errors,
}) => {
  return (
    <FormSection
      title="Interviewer Details"
      subtitle="Please Provide Interviewer Details"
      icon={Business}
    >
      <FormRow>
        <Input
          label="Interviewer Year of Experience"
          placeholder="Enter Year"
          type="text"
          {...register(
            "interviewerDetails.yearsOfExperience",
            {
              required: "Years of experience is required",
            }
          )}
          error={
            errors.interviewerDetails?.yearsOfExperience
          }
          disabled
        />
        <Input
          label="Current Company"
          placeholder="Enter Company"
          {...register("interviewerDetails.company", {
            required: "Company is required",
          })}
          error={errors.interviewerDetails?.company}
          disabled
        />
      </FormRow>
      <FormRow>
        <Input
          label="Interview Date"
          placeholder="DD/MM/YYYY"
          type="text"
          {...register("interviewerDetails.interviewDate", {
            required: "Interview date is required",
          })}
          error={errors.interviewerDetails?.interviewDate}
          disabled
        />
      </FormRow>
    </FormSection>
  );
};

InterviewerDetailsSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default InterviewerDetailsSection;
