// sections/SkillEvaluationSection.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWatch } from "react-hook-form";
import { Skill } from "../../../../assets";
import { FormSection } from "../FeedbackComponents";

const SkillEvaluationSection = ({
  control,
  setValue,
  errors,
}) => {
  const [communicationRating, setCommunicationRating] =
    useState("");
  const [attitudeRating, setAttitudeRating] = useState("");

  // Watch for changes in the form values
  const skillEvaluation = useWatch({
    control,
    name: "skillEvaluation",
  });

  // Set the initial values from the form
  useEffect(() => {
    if (skillEvaluation) {
      setCommunicationRating(skillEvaluation.communication);
      setAttitudeRating(skillEvaluation.attitude);
    }
  }, [skillEvaluation]);

  const ratingOptions = [
    "Poor",
    "Average",
    "Good",
    "Excellent",
  ];

  return (
    <FormSection
      title="Skill Evaluation"
      subtitle="Please Evaluate Candidate's skill"
      icon={Skill}
    >
      <div className="space-y-6">
        <div className="p-4 bg-white rounded-xl border border-gray-300">
          <h3 className="text-md font-semibold mb-2">
            Communication
          </h3>
          <p className="text-gray-600 mb-2 text-default">
            How would you like to rate?
          </p>
          <div className="flex gap-3">
            {ratingOptions.map((rating) => (
              <button
                key={rating}
                type="button"
                className={`px-6 py-2 text-default rounded-md ${
                  communicationRating === rating
                    ? "bg-[#007aff] text-white"
                    : "bg-[#D9D9D9] text-[#00000099] hover:bg-gray-300"
                }`}
                onClick={() => {
                  setCommunicationRating(rating);
                  setValue(
                    "skillEvaluation.communication",
                    rating,
                    {
                      shouldValidate: true,
                    }
                  );
                }}
              >
                {rating}
              </button>
            ))}
          </div>
          {errors.skillEvaluation?.communication && (
            <div className="text-[#B10E0EE5] text-2xs mt-2">
              Communication rating is required
            </div>
          )}
        </div>

        <div className="p-4 bg-white rounded-xl border-gray-300 border">
          <h3 className="text-md font-semibold mb-2">
            Attitude
          </h3>
          <p className="text-gray-600 text-default mb-2">
            How would you like to rate?
          </p>
          <div className="flex gap-4">
            {ratingOptions.map((rating) => (
              <button
                key={rating}
                type="button"
                className={`px-6 py-2 text-default rounded-md ${
                  attitudeRating === rating
                    ? "bg-[#007aff] text-white"
                    : "bg-[#D9D9D9] text-[#00000099] hover:bg-gray-300"
                }`}
                onClick={() => {
                  setAttitudeRating(rating);
                  setValue(
                    "skillEvaluation.attitude",
                    rating,
                    {
                      shouldValidate: true,
                    }
                  );
                }}
              >
                {rating}
              </button>
            ))}
          </div>
          {errors.skillEvaluation?.attitude && (
            <div className="text-[#B10E0EE5] text-2xs mt-2">
              Attitude rating is required
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
};

SkillEvaluationSection.propTypes = {
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default SkillEvaluationSection;
