import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import {
  PlusIcon,
  XCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { getColorForValue } from "../utils";

// Constants for textarea sizing
const TEXTAREA_CONFIG = {
  MIN_HEIGHT: "2.1rem",
  MIN_HEIGHT_PX: 32, // ~2rem
  MAX_HEIGHT_PX: 80, // ~5rem
  INITIAL_ROWS: 1,
};

// Prop types definition for better readability
const skillItemPropTypes = {
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
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  addQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  removeSkill: PropTypes.func.isRequired,
};

const SkillItem = ({
  skillField,
  skillIndex,
  control,
  errors,
  addQuestion,
  removeQuestion,
  removeSkill,
}) => {
  // Function to adjust textarea height
  const autoResizeTextarea = (element) => {
    if (!element) return;

    // Reset height to calculate the proper scrollHeight
    element.style.height = TEXTAREA_CONFIG.MIN_HEIGHT;

    // Calculate new height based on scrollHeight (clamped between min and max)
    const newHeight = Math.min(
      Math.max(
        element.scrollHeight,
        TEXTAREA_CONFIG.MIN_HEIGHT_PX
      ),
      TEXTAREA_CONFIG.MAX_HEIGHT_PX
    );
    element.style.height = `${newHeight}px`;
  };

  // Helper function to get error message
  const getErrorMessage = (path) => {
    const parts = path.split(".");
    let error = errors;

    // Navigate through the error object based on the path
    for (const part of parts) {
      if (!error || !error[part]) return null;
      error = error[part];
    }

    return error.message;
  };

  // Common textarea style
  const textareaStyle = {
    minHeight: TEXTAREA_CONFIG.MIN_HEIGHT,
    maxHeight: `${TEXTAREA_CONFIG.MAX_HEIGHT_PX}px`,
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };

  return (
    <div className="bg-[#E8F0F5] p-6 rounded-lg mb-6">
      {/* Header with skill name and score */}
      <div className="flex justify-between items-center mb-4">
        {/* Skill name input */}
        <div className="w-1/3">
          <Controller
            control={control}
            name={`skills.${skillIndex}.skillName`}
            rules={{
              required: "Skill name is required",
              minLength: {
                value: 2,
                message:
                  "Skill name must be at least 2 characters",
              },
            }}
            render={({ field }) => (
              <input
                className="w-full px-3 py-2 text-xs text-[#49454F] rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Skill Name"
                {...field}
                maxLength={100}
              />
            )}
          />
          {getErrorMessage(
            `skills.${skillIndex}.skillName`
          ) && (
            <span className="text-[#B10E0EE5] text-2xs">
              {getErrorMessage(
                `skills.${skillIndex}.skillName`
              )}
            </span>
          )}
        </div>
        {/* Score slider and remove button */}
        <div className="">
          <div className="flex items-center">
            <span className="ml-4 text-[#00000099]">
              <Controller
                control={control}
                name={`skills.${skillIndex}.score`}
                rules={{
                  validate: (value) =>
                    value > 0 ||
                    "Score must be greater than 0",
                }}
                render={({ field }) => (
                  <ScoreSlider
                    value={field.value}
                    onChange={field.onChange}
                    hasError={
                      errors?.skills?.[skillIndex]?.score
                        ? true
                        : false
                    }
                  />
                )}
              />
            </span>

            {/* Remove skill button (not shown for first skill) */}
            {skillIndex > 0 && (
              <button
                type="button"
                onClick={() => removeSkill(skillIndex)}
                className="ml-4 text-gray-500 hover:text-[#B10E0EE5]"
                aria-label="Remove skill"
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            )}
          </div>
          {errors?.skills?.[skillIndex]?.score && (
            <span className="text-[#B10E0EE5] text-2xs ml-2">
              {errors.skills[skillIndex].score.message}
            </span>
          )}
        </div>
      </div>

      {/* Questions and answers section */}
      {skillField.questions?.map(
        (question, questionIndex) => (
          <QuestionAnswerPair
            key={`${skillField.id}-q-${questionIndex}`}
            skillIndex={skillIndex}
            questionIndex={questionIndex}
            control={control}
            errors={errors}
            getErrorMessage={getErrorMessage}
            removeQuestion={removeQuestion}
            textareaStyle={textareaStyle}
            autoResizeTextarea={autoResizeTextarea}
            showRemoveButton={questionIndex > 0}
          />
        )
      )}

      {/* Add question button */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="rounded-full bg-gray-800 p-2 hover:opacity-90"
          onClick={() => addQuestion(skillIndex)}
          aria-label="Add question"
        >
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Summary section */}
      <div>
        <label className="block mb-1 font-[550] text-default">
          Summary:
        </label>
        <Controller
          control={control}
          name={`skills.${skillIndex}.summary`}
          rules={{
            required: "Summary is required",
            minLength: {
              value: 2,
              message:
                "Summary must be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <textarea
              className="w-full px-3 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
              placeholder="Add Summary"
              rows={4}
              maxLength={1000}
              {...field}
            />
          )}
        />
        {getErrorMessage(
          `skills.${skillIndex}.summary`
        ) && (
          <span className="text-[#B10E0EE5] text-2xs">
            {getErrorMessage(
              `skills.${skillIndex}.summary`
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default SkillItem;

// Component for the score slider
const ScoreSlider = ({ value, onChange, hasError }) => {
  // Calculate the color based on the current value
  const trackColor = hasError
    ? "#ffb4b4"
    : getColorForValue(value);

  return (
    <div className="flex gap-x-2 items-center">
      <div className="relative flex items-center w-40 mr-3">
        {/* Slider track (background) */}
        <div
          className={`absolute w-full h-2 bg-[#f5f5f5] rounded-full ${
            hasError ? "border border-[#B10E0EE5]" : ""
          }`}
        ></div>

        {/* Filled portion of the track */}
        <div
          className="absolute h-2 rounded-full transition-all duration-150"
          style={{
            width: `${value}%`,
            backgroundColor: trackColor,
          }}
        ></div>

        {/* Draggable thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 cursor-pointer rounded-full shadow-md transform -translate-y-0 transition-all duration-150 z-10"
          style={{
            left: `calc(${value}% - 0.5rem)`,
            borderColor: hasError
              ? "#B10E0EE5"
              : trackColor,
          }}
        ></div>

        {/* Invisible range input for functionality */}
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={value}
          onChange={(e) =>
            onChange(parseInt(e.target.value, 10))
          }
          className="absolute w-full h-5 opacity-0 cursor-pointer z-20"
          aria-label="Skill proficiency score"
        />
      </div>

      {/* Score display */}
      <span
        className={`font-medium text-sm ${
          hasError ? "text-[#B10E0EE5]" : "text-[#0000006b]"
        }`}
      >
        {value}/100
      </span>
    </div>
  );
};

// Component for question and answer pair with Controller implementation
const QuestionAnswerPair = ({
  skillIndex,
  questionIndex,
  control,
  getErrorMessage,
  removeQuestion,
  textareaStyle,
  autoResizeTextarea,
  showRemoveButton,
}) => (
  <div className="mb-5">
    {/* Question input */}
    <div className="flex items-start">
      <span className="font-[550] mr-4 text-default w-6 mt-2">
        {questionIndex + 1}.
      </span>
      <div className="w-full">
        <Controller
          control={control}
          name={`skills.${skillIndex}.questions.${questionIndex}.question`}
          rules={{
            required: "Question is required",
            minLength: {
              value: 2,
              message:
                "Question must be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <textarea
              className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
              placeholder="Question"
              rows={TEXTAREA_CONFIG.INITIAL_ROWS}
              style={textareaStyle}
              maxLength={1000}
              {...field}
              ref={(el) => {
                field.ref(el);
                if (el) {
                  // Initial resize with small delay
                  setTimeout(
                    () => autoResizeTextarea(el),
                    0
                  );
                }
              }}
              onInput={(e) => {
                field.onChange(e.target.value);
                autoResizeTextarea(e.target);
              }}
            />
          )}
        />
        {getErrorMessage(
          `skills.${skillIndex}.questions.${questionIndex}.question`
        ) && (
          <div className="mb-2 mt-1 text-[#B10E0EE5] text-2xs">
            {getErrorMessage(
              `skills.${skillIndex}.questions.${questionIndex}.question`
            )}
          </div>
        )}
      </div>
      {showRemoveButton && (
        <button
          type="button"
          onClick={() =>
            removeQuestion(skillIndex, questionIndex)
          }
          className="ml-2 text-gray-500 hover:text-[#B10E0EE5] mt-2"
          aria-label="Remove question"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      )}
    </div>

    {/* Answer input */}
    <div className="flex items-start mt-4">
      <span className="font-[550] mr-4 text-default w-6 mt-2">
        Ans.
      </span>
      <div className="w-full">
        <Controller
          control={control}
          name={`skills.${skillIndex}.questions.${questionIndex}.answer`}
          rules={{
            required: "Answer is required",
            minLength: {
              value: 2,
              message:
                "Answer must be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <textarea
              className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
              placeholder="Answer"
              rows={TEXTAREA_CONFIG.INITIAL_ROWS}
              style={textareaStyle}
              maxLength={5000}
              {...field}
              ref={(el) => {
                field.ref(el);
                if (el) {
                  // Initial resize with small delay
                  setTimeout(
                    () => autoResizeTextarea(el),
                    0
                  );
                }
              }}
              onInput={(e) => {
                field.onChange(e.target.value);
                autoResizeTextarea(e.target);
              }}
            />
          )}
        />
        {getErrorMessage(
          `skills.${skillIndex}.questions.${questionIndex}.answer`
        ) && (
          <div className="mb-2 text-[#B10E0EE5] text-2xs mt-1">
            {getErrorMessage(
              `skills.${skillIndex}.questions.${questionIndex}.answer`
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Assign prop types
SkillItem.propTypes = skillItemPropTypes;
ScoreSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
};
QuestionAnswerPair.propTypes = {
  skillIndex: PropTypes.number.isRequired,
  questionIndex: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  getErrorMessage: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  textareaStyle: PropTypes.object.isRequired,
  autoResizeTextarea: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
};
