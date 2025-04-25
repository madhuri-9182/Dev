import PropTypes from "prop-types";
import { Questions } from "../../../../assets";
import { FormSection } from "../FeedbackComponents";
import SkillItem from "./SkillItem";

const SkillsSection = ({
  skillFields,
  register,
  control,
  errors,
  addQuestion,
  removeQuestion,
  removeSkill,
  appendSkill,
}) => {
  return (
    <FormSection
      title="Question Asked"
      subtitle="Please Provide Asked Question"
      icon={Questions}
    >
      {skillFields.map((skillField, skillIndex) => (
        <SkillItem
          key={skillField.id}
          skillField={skillField}
          skillIndex={skillIndex}
          register={register}
          control={control}
          errors={errors}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          removeSkill={removeSkill}
        />
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          className="px-6 py-2 text-xs sm:text-sm bg-black hover:opacity-80 text-white font-medium rounded-lg w-full sm:w-auto"
          onClick={() =>
            appendSkill({
              skillName: "",
              score: 0,
              questions: [{ question: "", answer: "" }],
              summary: "",
            })
          }
        >
          Add Skill
        </button>
      </div>
    </FormSection>
  );
};

SkillsSection.propTypes = {
  skillFields: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  addQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  removeSkill: PropTypes.func.isRequired,
  appendSkill: PropTypes.func.isRequired,
};

export default SkillsSection;
