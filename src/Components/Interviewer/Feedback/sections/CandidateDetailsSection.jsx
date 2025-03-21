import PropTypes from "prop-types";
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
} from "../../../Constants/constants";
import { User } from "../../../../assets";
import {
  FormRow,
  FormSection,
  Input,
} from "../FeedbackComponents";

const CandidateDetailsSection = ({ register, errors }) => {
  return (
    <FormSection
      title="Candidate Details"
      subtitle="Please Provide Candidate Details"
      icon={User}
    >
      <FormRow>
        <Input
          label="Candidate Name"
          placeholder="Enter Name"
          {...register("candidateDetails.name", {
            required: "Name is required",
          })}
          error={errors.candidateDetails?.name}
          disabled
        />
        <Input
          label="Candidate Email"
          placeholder="Enter Email"
          type="email"
          {...register("candidateDetails.email", {
            required: "Email is required",
            pattern: {
              value: EMAIL_REGEX,
              message: "Invalid email address",
            },
          })}
          error={errors.candidateDetails?.email}
          disabled
        />
      </FormRow>
      <FormRow>
        <Input
          label="Candidate Phone Number"
          placeholder="Enter Number"
          type="tel"
          {...register("candidateDetails.phone", {
            required: "Phone number is required",
            pattern: {
              value: MOBILE_REGEX,
              message: "Invalid phone number",
            },
          })}
          error={errors.candidateDetails?.phone}
          disabled
        />
        <Input
          label="Candidate Year of Experience"
          placeholder="Enter Year"
          type="text"
          {...register(
            "candidateDetails.yearsOfExperience",
            {
              required: "Years of experience is required",
            }
          )}
          error={errors.candidateDetails?.yearsOfExperience}
          disabled
        />
      </FormRow>
      <FormRow>
        <Input
          label="Role"
          placeholder="Enter Role"
          {...register("candidateDetails.role", {
            required: "Role is required",
          })}
          error={errors.candidateDetails?.role}
          disabled
        />
        <Input
          label="Current Company"
          placeholder="Enter Company"
          {...register("candidateDetails.company", {
            required: "Company is required",
          })}
          error={errors.candidateDetails?.company}
          disabled
        />
      </FormRow>
    </FormSection>
  );
};

CandidateDetailsSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default CandidateDetailsSection;
