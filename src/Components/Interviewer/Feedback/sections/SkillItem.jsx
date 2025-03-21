import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import {
  PlusIcon,
  XCircleIcon,
  Trash2Icon,
} from "lucide-react";

const SkillItem = ({
  skillField,
  skillIndex,
  register,
  control,
  errors,
  addQuestion,
  removeQuestion,
  removeSkill,
}) => {
  return (
    <div
      key={skillField.id}
      className="bg-[#E8F0F5] p-6 rounded-lg mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3">
          <input
            className="w-full px-3 py-2 text-xs text-[#49454F] rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Skill Name"
            {...register(`skills.${skillIndex}.skillName`, {
              required: "Skill name is required",
            })}
          />
          {errors.skills?.[skillIndex]?.skillName && (
            <span className="text-[#B10E0EE5] text-2xs">
              {errors.skills[skillIndex].skillName.message}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <span className="ml-4 text-[#00000099]">
            <Controller
              control={control}
              name={`skills.${skillIndex}.score`}
              render={({ field }) => (
                <div className="flex gap-x-2 items-center">
                  <div className="relative flex items-center w-40 mr-3">
                    {/* Slider track (background) */}
                    <div className="absolute w-full h-2 bg-[#f5f5f5] rounded-full"></div>

                    {/* Filled portion of the track */}
                    <div
                      className="absolute h-2 bg-[#91caff] rounded-full transition-all duration-150"
                      style={{
                        width: `${field.value}%`,
                      }}
                    ></div>

                    {/* Draggable thumb */}
                    <div
                      className="absolute w-4 h-4 bg-white border-2 cursor-progress border-[#91caff] rounded-full shadow-md transform -translate-y-0 transition-all duration-150 z-10"
                      style={{
                        left: `calc(${field.value}% - 0.5rem)`,
                      }}
                    ></div>

                    {/* Invisible range input for functionality */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="absolute w-full h-5 opacity-0 cursor-pointer z-20"
                    />
                  </div>

                  {/* Score display */}
                  <span className="text-[#0000006b] font-medium text-sm">
                    {field.value}/100
                  </span>
                </div>
              )}
            />
          </span>
          {skillIndex > 0 && (
            <button
              type="button"
              onClick={() => removeSkill(skillIndex)}
              className="ml-4 text-gray-500 hover:text-[#B10E0EE5]"
            >
              <Trash2Icon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Questions for this skill */}
      {skillField.questions &&
        skillField.questions.map(
          (question, questionIndex) => (
            <div
              key={`${skillField.id}-q-${questionIndex}`}
              className="mb-5"
            >
              <div className="flex items-center">
                <span className="font-medium mr-4 text-default">
                  {questionIndex + 1}.
                </span>
                <input
                  className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Question"
                  {...register(
                    `skills.${skillIndex}.questions.${questionIndex}.question`,
                    {
                      required: "Question is required",
                    }
                  )}
                />
                {questionIndex > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeQuestion(
                        skillIndex,
                        questionIndex
                      )
                    }
                    className="ml-2 text-gray-500 hover:text-[#B10E0EE5]"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              {errors.skills?.[skillIndex]?.questions?.[
                questionIndex
              ]?.question && (
                <div className="ml-[27px] mb-2 mt-1 text-[#B10E0EE5] text-2xs">
                  {
                    errors.skills[skillIndex].questions[
                      questionIndex
                    ].question.message
                  }
                </div>
              )}
              <div className="ml-[27px] mt-4">
                <input
                  className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Answer"
                  {...register(
                    `skills.${skillIndex}.questions.${questionIndex}.answer`,
                    {
                      required: "Answer is required",
                    }
                  )}
                />
                {errors.skills?.[skillIndex]?.questions?.[
                  questionIndex
                ]?.answer && (
                  <div className="mb-2 text-[#B10E0EE5] text-2xs mt-1">
                    {
                      errors.skills[skillIndex].questions[
                        questionIndex
                      ].answer.message
                    }
                  </div>
                )}
              </div>
            </div>
          )
        )}

      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="rounded-full bg-gray-800 p-2"
          onClick={() => addQuestion(skillIndex)}
        >
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      <div>
        <label className="block mb-1 font-medium text-default">
          Summary :
        </label>
        <textarea
          className="w-full px-3 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Add Summary"
          rows={4}
          {...register(`skills.${skillIndex}.summary`, {
            required: "Summary is required",
          })}
        />
        {errors.skills?.[skillIndex]?.summary && (
          <span className="text-[#B10E0EE5] text-2xs">
            {errors.skills[skillIndex].summary.message}
          </span>
        )}
      </div>
    </div>
  );
};

SkillItem.propTypes = {
  skillField: PropTypes.shape({
    id: PropTypes.string.isRequired,
    skillName: PropTypes.string,
    score: PropTypes.number,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string,
        answer: PropTypes.string,
      })
    ),
  }).isRequired,
  skillIndex: PropTypes.number.isRequired,
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  addQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  removeSkill: PropTypes.func.isRequired,
};

export default SkillItem;
