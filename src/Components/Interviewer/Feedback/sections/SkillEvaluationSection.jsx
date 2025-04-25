// SkillEvaluationSection.jsx - Responsive skill evaluation
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWatch, useFieldArray } from "react-hook-form";
import { Skill } from "../../../../assets";
import { FormSection } from "../FeedbackComponents";
import { Check, X } from "lucide-react";
import { Edit, Trash } from "iconsax-react";

const SkillEvaluationSection = ({
  control,
  setValue,
  errors,
  register,
}) => {
  // Use fieldArray for dynamic skill evaluations
  const {
    fields: evaluationFields,
    append: appendEvaluation,
    remove: removeEvaluation,
    update: updateEvaluation,
  } = useFieldArray({
    control,
    name: "skillEvaluation.additional",
  });

  // States for managing UI
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingSkillName, setEditingSkillName] = useState("");

  // State to store rating selections for UI
  const [ratingSelections, setRatingSelections] = useState({
    communication: "",
    attitude: "",
    additional: [],
  });

  // Watch for changes in the form values
  const skillEvaluation = useWatch({
    control,
    name: "skillEvaluation",
  });

  // Set the initial values from the form
  useEffect(() => {
    if (skillEvaluation) {
      setRatingSelections((prev) => ({
        ...prev,
        communication: skillEvaluation.communication,
        attitude: skillEvaluation.attitude,
        additional: skillEvaluation.additional
          ? skillEvaluation.additional.map((item) => ({
              name: item.name,
              rating: item.rating,
            }))
          : [],
      }));
    }
  }, [skillEvaluation]);

  // Register validation for communication and attitude
  useEffect(() => {
    register("skillEvaluation.communication", {
      required: "Communication rating is required",
    });
    register("skillEvaluation.attitude", {
      required: "Attitude rating is required",
    });
  }, [register]);

  // Register validation for additional skills when they change
  useEffect(() => {
    if (evaluationFields && evaluationFields.length > 0) {
      evaluationFields.forEach((field, index) => {
        register(`skillEvaluation.additional.${index}.rating`, {
          required: "Rating is required",
        });
      });
    }
  }, [evaluationFields, register]);

  const ratingOptions = ["Poor", "Average", "Good", "Excellent"];

  // Get background color based on rating
  const getRatingColor = (rating) => {
    switch (rating) {
      case "Poor":
        return "#dd463b";
      case "Average":
        return "#eb8c51";
      case "Good":
        return "#a0ca69";
      case "Excellent":
        return "#5cb357";
      default:
        return "#D9D9D9";
    }
  };

  // Event handlers
  const handleAddSkillClick = () => {
    setIsAddingSkill(true);
    setNewSkillName("");
  };

  const handleSaveNewSkill = () => {
    if (newSkillName.trim()) {
      appendEvaluation({
        name: newSkillName.trim(),
        rating: "",
      });
      setRatingSelections((prev) => ({
        ...prev,
        additional: [
          ...prev.additional,
          { name: newSkillName.trim(), rating: "" },
        ],
      }));

      const newIndex = evaluationFields.length;
      register(`skillEvaluation.additional.${newIndex}.rating`, {
        required: "Rating is required",
      });

      setIsAddingSkill(false);
      setNewSkillName("");
    }
  };

  const handleCancelAddSkill = () => {
    setIsAddingSkill(false);
    setNewSkillName("");
  };

  const handleEditSkill = (index) => {
    setEditingIndex(index);
    setEditingSkillName(evaluationFields[index].name);
  };

  const handleSaveEditSkill = (index) => {
    if (editingSkillName.trim()) {
      const updatedField = {
        ...evaluationFields[index],
        name: editingSkillName.trim(),
      };
      updateEvaluation(index, updatedField);

      const updatedAdditional = [...ratingSelections.additional];
      updatedAdditional[index] = {
        ...updatedAdditional[index],
        name: editingSkillName.trim(),
      };

      setRatingSelections((prev) => ({
        ...prev,
        additional: updatedAdditional,
      }));

      setEditingIndex(null);
      setEditingSkillName("");
    }
  };

  const handleCancelEditSkill = () => {
    setEditingIndex(null);
    setEditingSkillName("");
  };

  const handleRemoveEvaluation = (index) => {
    removeEvaluation(index);
    const updatedAdditional = [...ratingSelections.additional];
    updatedAdditional.splice(index, 1);
    setRatingSelections((prev) => ({
      ...prev,
      additional: updatedAdditional,
    }));
  };

  const handleRatingClick = (type, index, rating) => {
    if (type === "communication") {
      setValue("skillEvaluation.communication", rating, {
        shouldValidate: true,
      });
      setRatingSelections((prev) => ({
        ...prev,
        communication: rating,
      }));
    } else if (type === "attitude") {
      setValue("skillEvaluation.attitude", rating, {
        shouldValidate: true,
      });
      setRatingSelections((prev) => ({
        ...prev,
        attitude: rating,
      }));
    } else if (type === "additional") {
      setValue(`skillEvaluation.additional.${index}.rating`, rating, {
        shouldValidate: true,
      });
      const updatedAdditional = [...ratingSelections.additional];
      updatedAdditional[index] = {
        ...updatedAdditional[index],
        rating,
      };
      setRatingSelections((prev) => ({
        ...prev,
        additional: updatedAdditional,
      }));
    }
  };

  const hasError = (path) => {
    if (!errors) return false;

    const parts = path.split(".");
    let current = errors;

    for (const part of parts) {
      if (!current[part]) return false;
      current = current[part];
    }

    return true;
  };

  return (
    <FormSection
      title="Skill Evaluation"
      subtitle="Please Evaluate Candidate's skill"
      icon={Skill}
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Communication (default) */}
        <div
          className={`p-4 bg-white rounded-xl border ${
            hasError("skillEvaluation.communication")
              ? "border-[#B10E0EE5]"
              : "border-gray-300"
          }`}
          data-error-section="skillEvaluation.communication"
        >
          <h3 className="text-sm lg:text-md font-semibold mb-2">
            Communication
          </h3>
          <p className="text-gray-600 mb-2 text-xs lg:text-default">
            How would you like to rate?
          </p>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {ratingOptions.map((rating) => (
              <button
                key={rating}
                type="button"
                style={{
                  backgroundColor:
                    ratingSelections.communication === rating
                      ? getRatingColor(rating)
                      : "#D9D9D9",
                  color:
                    ratingSelections.communication === rating
                      ? "white"
                      : "#00000099",
                }}
                className="px-4 lg:px-6 py-2 text-xs lg:text-default rounded-md hover:bg-gray-300 flex-1 lg:flex-none min-w-[70px]"
                onClick={() => handleRatingClick("communication", null, rating)}
                data-error-key="skillEvaluation.communication"
              >
                {rating}
              </button>
            ))}
          </div>
          {errors?.skillEvaluation?.communication && (
            <div className="text-[#B10E0EE5] text-2xs mt-2">
              Communication rating is required
            </div>
          )}
        </div>

        {/* Attitude (default) */}
        <div
          className={`p-4 bg-white rounded-xl border ${
            hasError("skillEvaluation.attitude")
              ? "border-[#B10E0EE5]"
              : "border-gray-300"
          }`}
          data-error-section="skillEvaluation.attitude"
        >
          <h3 className="text-sm lg:text-md font-semibold mb-2">Attitude</h3>
          <p className="text-gray-600 text-xs lg:text-default mb-2">
            How would you like to rate?
          </p>
          <div className="flex flex-wrap gap-2 lg:gap-4">
            {ratingOptions.map((rating) => (
              <button
                key={rating}
                type="button"
                style={{
                  backgroundColor:
                    ratingSelections.attitude === rating
                      ? getRatingColor(rating)
                      : "#D9D9D9",
                  color:
                    ratingSelections.attitude === rating ? "white" : "#00000099",
                }}
                className="px-4 lg:px-6 py-2 text-xs lg:text-default rounded-md hover:bg-gray-300 flex-1 lg:flex-none min-w-[70px]"
                onClick={() => handleRatingClick("attitude", null, rating)}
                data-error-key="skillEvaluation.attitude"
              >
                {rating}
              </button>
            ))}
          </div>
          {errors?.skillEvaluation?.attitude && (
            <div className="text-[#B10E0EE5] text-2xs mt-2">
              Attitude rating is required
            </div>
          )}
        </div>

        {/* Additional custom skill evaluations */}
        {evaluationFields.map((field, index) => (
          <div
            key={field.id}
            className={`p-4 bg-white rounded-xl border ${
              hasError(`skillEvaluation.additional.${index}.rating`)
                ? "border-[#B10E0EE5]"
                : "border-gray-300"
            }`}
            data-error-section={`skillEvaluation.additional.${index}`}
          >
            {editingIndex === index ? (
              /* Editing mode */
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-md text-xs lg:text-default text-[#49454F]"
                    placeholder="Enter skill name"
                    value={editingSkillName}
                    onChange={(e) => setEditingSkillName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-green-600 hover:text-green-800 w-8 h-8 flex items-center justify-center hover:bg-[#f6f6f6] rounded-full"
                    onClick={() => handleSaveEditSkill(index)}
                  >
                    <Check size={20} />
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center hover:bg-[#f6f6f6] rounded-full"
                    onClick={handleCancelEditSkill}
                  >
                    <X size={20} />
                  </button>
                </div>
                {editingSkillName.trim() === "" && (
                  <div className="text-[#B10E0EE5] text-2xs mt-1">
                    Skill name cannot be empty
                  </div>
                )}
              </div>
            ) : (
              /* Display mode */
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm lg:text-md font-semibold">
                  {field.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditSkill(index)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveEvaluation(index)}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            )}

            {editingIndex !== index && (
              <>
                <p className="text-gray-600 text-xs lg:text-default mb-2">
                  How would you like to rate?
                </p>
                <div className="flex flex-wrap gap-2 lg:gap-4">
                  {ratingOptions.map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      style={{
                        backgroundColor:
                          ratingSelections.additional[index]?.rating === rating
                            ? getRatingColor(rating)
                            : "#D9D9D9",
                        color:
                          ratingSelections.additional[index]?.rating === rating
                            ? "white"
                            : "#00000099",
                      }}
                      className={`px-4 lg:px-6 py-2 text-xs lg:text-default rounded-md hover:bg-gray-300 flex-1 lg:flex-none min-w-[70px] ${
                        hasError(`skillEvaluation.additional.${index}.rating`)
                          ? "ring-1 ring-[#B10E0EE5]"
                          : ""
                      }`}
                      onClick={() => handleRatingClick("additional", index, rating)}
                      data-error-key={`skillEvaluation.additional.${index}.rating`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                {errors?.skillEvaluation?.additional?.[index]?.rating && (
                  <div className="text-[#B10E0EE5] text-2xs mt-2">
                    Rating is required
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* New skill input area */}
        {isAddingSkill && (
          <div className="p-4 bg-white rounded-xl border-gray-300 border">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-md text-xs lg:text-default text-[#49454F]"
                placeholder="Enter skill name (e.g. Leadership, Problem Solving)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />
              <button
                type="button"
                className="text-green-600 hover:text-green-800 w-8 h-8 flex items-center justify-center hover:bg-[#f6f6f6] rounded-full"
                onClick={handleSaveNewSkill}
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center hover:bg-[#f6f6f6] rounded-full"
                onClick={handleCancelAddSkill}
              >
                <X size={16} />
              </button>
            </div>
            {newSkillName.trim() === "" && (
              <div className="text-[#B10E0EE5] text-2xs">
                Skill name cannot be empty
              </div>
            )}
          </div>
        )}

        {/* Add new skill evaluation button */}
        {!isAddingSkill && (
          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-2 text-xs sm:text-sm bg-black hover:opacity-80 text-white font-medium rounded-lg w-full sm:w-auto"
              onClick={handleAddSkillClick}
            >
              <span>Add Skill Evaluation</span>
            </button>
          </div>
        )}
      </div>
    </FormSection>
  );
};

SkillEvaluationSection.propTypes = {
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object,
  register: PropTypes.func.isRequired,
};

export default SkillEvaluationSection;