import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { useEffect, useRef } from "react";
import {
  PlusIcon,
  XCircleIcon,
  Trash2Icon,
} from "lucide-react";

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
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  addQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  removeSkill: PropTypes.func.isRequired,
};

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
  // Create refs for auto-resizing textareas
  const textareaRefs = useRef({});

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

  // Setup auto-resize for textareas
  useEffect(() => {
    const textareas = Object.values(textareaRefs.current);

    // Add event listeners to all textareas
    textareas.forEach((textarea) => {
      if (!textarea) return;

      // Initial resize
      autoResizeTextarea(textarea);

      // Create a named function for the event listener to use in cleanup
      const resizeHandler = () =>
        autoResizeTextarea(textarea);
      textarea.addEventListener("input", resizeHandler);

      // Store the handler on the element for cleanup
      textarea._resizeHandler = resizeHandler;
    });

    // Cleanup function to remove listeners
    return () => {
      textareas.forEach((textarea) => {
        if (textarea && textarea._resizeHandler) {
          textarea.removeEventListener(
            "input",
            textarea._resizeHandler
          );
        }
      });
    };
  }, [skillField.questions?.length]); // Re-run when questions change

  // Helper for creating textarea refs
  const createTextareaRef = (
    fieldName,
    required = true
  ) => {
    const refKey = fieldName.replace(/\./g, "_");

    return (el) => {
      // Store in our ref object
      textareaRefs.current[refKey] = el;

      if (!el) return;

      // Register with react-hook-form
      const refFn = register(fieldName, {
        required: required
          ? `${fieldName.split(".").pop()} is required`
          : false,
      }).ref;

      if (refFn) refFn(el);

      // Initial resize with small delay to ensure content is properly rendered
      setTimeout(() => autoResizeTextarea(el), 0);
    };
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
          <input
            className="w-full px-3 py-2 text-xs text-[#49454F] rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Skill Name"
            {...register(`skills.${skillIndex}.skillName`, {
              required: "Skill name is required",
            })}
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
            createTextareaRef={createTextareaRef}
            autoResizeTextarea={autoResizeTextarea}
            getErrorMessage={getErrorMessage}
            removeQuestion={removeQuestion}
            textareaStyle={textareaStyle}
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
        <textarea
          className="w-full px-3 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Add Summary"
          rows={4}
          {...register(`skills.${skillIndex}.summary`, {
            required: "Summary is required",
          })}
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
const ScoreSlider = ({ value, onChange, hasError }) => (
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
        className={`absolute h-2 ${
          hasError ? "bg-[#ffb4b4]" : "bg-[#91caff]"
        } rounded-full transition-all duration-150`}
        style={{ width: `${value}%` }}
      ></div>

      {/* Draggable thumb */}
      <div
        className={`absolute w-4 h-4 bg-white border-2 cursor-pointer ${
          hasError
            ? "border-[#B10E0EE5]"
            : "border-[#91caff]"
        } rounded-full shadow-md transform -translate-y-0 transition-all duration-150 z-10`}
        style={{ left: `calc(${value}% - 0.5rem)` }}
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

// Component for question and answer pair
const QuestionAnswerPair = ({
  skillIndex,
  questionIndex,
  createTextareaRef,
  autoResizeTextarea,
  getErrorMessage,
  removeQuestion,
  textareaStyle,
  showRemoveButton,
}) => (
  <div className="mb-5">
    {/* Question input */}
    <div className="flex items-start">
      <span className="font-[550] mr-4 text-default w-6 mt-2">
        {questionIndex + 1}.
      </span>
      <div className="w-full">
        <textarea
          className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
          placeholder="Question"
          rows={TEXTAREA_CONFIG.INITIAL_ROWS}
          ref={createTextareaRef(
            `skills.${skillIndex}.questions.${questionIndex}.question`
          )}
          style={textareaStyle}
          onInput={(e) => autoResizeTextarea(e.target)}
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
        <textarea
          className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
          placeholder="Answer"
          rows={TEXTAREA_CONFIG.INITIAL_ROWS}
          ref={createTextareaRef(
            `skills.${skillIndex}.questions.${questionIndex}.answer`
          )}
          style={textareaStyle}
          onInput={(e) => autoResizeTextarea(e.target)}
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
  createTextareaRef: PropTypes.func.isRequired,
  autoResizeTextarea: PropTypes.func.isRequired,
  getErrorMessage: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  textareaStyle: PropTypes.object.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
};
