import PropTypes from "prop-types";
import { Improvement } from "../../../../assets";
import {
  FormSection,
  TextArea,
} from "../FeedbackComponents";

const StrengthAndImprovementSection = ({
  register,
  errors,
}) => {
  return (
    <FormSection
      title="Strength and Improvement"
      subtitle="Please Provide the Strength and Improvement point of the Candidate"
      icon={Improvement}
    >
      <TextArea
        label="Candidate's Strength"
        placeholder="Please provide the Strength of the candidate"
        {...register("strength", {
          required: "Candidate's strength is required",
        })}
        error={errors.strength}
      />
      <TextArea
        label="Improvement Points"
        placeholder="Please provide the Improvement point of the candidate"
        {...register("improvementPoints", {
          required: "Improvement points are required",
        })}
        error={errors.improvementPoints}
      />
    </FormSection>
  );
};

StrengthAndImprovementSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default StrengthAndImprovementSection;
