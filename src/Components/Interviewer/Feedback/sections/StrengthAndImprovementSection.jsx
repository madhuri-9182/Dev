import PropTypes from "prop-types";
import { Improvement } from "../../../../assets";
import {
  FormSection,
  TextArea,
} from "../FeedbackComponents";

const StrengthAndImprovementSection = ({
  register,
  errors,
  watch,
}) => {

  const strengthValue = watch('strength');
  const improvementPointsValue = watch('improvementPoints');

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
          maxLength: {
            value: 450,
            message:
              "Candidate's Strength cannot be more than 450 characters",
          },
        })}
        error={errors.strength}
        maxLength={450}
        value={strengthValue}
      />
      <TextArea
        label="Improvement Points"
        placeholder="Please provide the Improvement point of the candidate"
        {...register("improvementPoints", {
          required: "Improvement points are required",
          maxLength: {
            value: 450,
            message:
              "Improvement points cannot be more than 450 characters",
          },
        })}
        error={errors.improvementPoints}
        maxLength={450}
        value={improvementPointsValue}
      />
    </FormSection>
  );
};

StrengthAndImprovementSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default StrengthAndImprovementSection;
