// SkillItem.jsx - Responsive skill item component with character counters
import PropTypes from "prop-types";
import { Controller, useWatch } from "react-hook-form";
import {
  PlusIcon,
  XCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { getColorForValue } from "../utils";
import { useState, useEffect } from "react";

const skillItemPropTypes = {
  skillField: PropTypes.object.isRequired,
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
  const getErrorMessage = (path) => {
    const parts = path.split(".");
    let error = errors;

    for (const part of parts) {
      if (!error || !error[part]) return null;
      error = error[part];
    }

    return error.message;
  };

  // Watch the summary field value
  const summaryValue = useWatch({
    control,
    name: `skills.${skillIndex}.summary`,
    defaultValue: "",
  });

  // Character count state for summary
  const [summaryCharCount, setSummaryCharCount] = useState(0);

  // Update character count when summary value changes
  useEffect(() => {
    setSummaryCharCount(summaryValue?.length || 0);
  }, [summaryValue]);

  return (
    <div
      className="bg-[#E8F0F5] p-4 lg:p-6 rounded-lg mb-4 lg:mb-6"
      data-error-section={`skills.${skillIndex}`}
    >
      {/* Header with skill name and score */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        {/* Skill name input */}
        <div className="w-full lg:w-1/3">
          <Controller
            control={control}
            name={`skills.${skillIndex}.skillName`}
            rules={{
              required: "Skill name is required",
              minLength: {
                value: 2,
                message: "Skill name must be at least 2 characters",
              },
              maxLength: {
                value: 95,
                message: "Skill name cannot be more than 100 characters",
              },
            }}
            render={({ field }) => (
              <input
                className="w-full px-3 py-2 text-xs text-[#49454F] rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Skill Name"
                data-error-key={`skills.${skillIndex}.skillName`}
                {...field}
              />
            )}
          />
          {getErrorMessage(`skills.${skillIndex}.skillName`) && (
            <span className="text-[#B10E0EE5] text-2xs">
              {getErrorMessage(`skills.${skillIndex}.skillName`)}
            </span>
          )}
        </div>

        {/* Score slider and remove button */}
        <div className="w-full lg:w-auto">
          <div className="flex items-center justify-between lg:justify-start">
            <span className="text-[#00000099]">
              <Controller
                control={control}
                name={`skills.${skillIndex}.score`}
                rules={{
                  validate: (value) => value > 0 || "Score must be greater than 0",
                }}
                render={({ field }) => (
                  <ScoreSlider
                    value={field.value}
                    onChange={field.onChange}
                    hasError={errors?.skills?.[skillIndex]?.score ? true : false}
                    errorKey={`skills.${skillIndex}.score`}
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

      {/* Questions container */}
      <div className="questions-container">
        {skillField.questions?.map((question, questionIndex) => (
          <QuestionAnswerPair
            key={`${skillField.id}-q-${questionIndex}`}
            skillIndex={skillIndex}
            questionIndex={questionIndex}
            control={control}
            errors={errors}
            getErrorMessage={getErrorMessage}
            removeQuestion={removeQuestion}
            showRemoveButton={questionIndex > 0}
          />
        ))}
      </div>

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
        <label className="block mb-1 font-[550] text-sm lg:text-default">
          Summary:
        </label>
        <Controller
          control={control}
          name={`skills.${skillIndex}.summary`}
          rules={{
            required: "Summary is required",
            minLength: {
              value: 2,
              message: "Summary must be at least 2 characters",
            },
            maxLength: {
              value: 1000,
              message: "Summary cannot be more than 1000 characters",
            },
          }}
          render={({ field }) => (
            <>
              <textarea
                className="w-full px-3 py-2 text-sm lg:text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
                placeholder="Add Summary"
                rows={4}
                data-error-key={`skills.${skillIndex}.summary`}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setSummaryCharCount(e.target.value.length);
                }}
              />
              <div className="text-2xs flex justify-between items-center mt-1">
                <span className="text-[#B10E0EE5]">
                  {getErrorMessage(`skills.${skillIndex}.summary`)}
                </span>
                <span className={summaryCharCount > 1000 ? 'text-[#B10E0EE5]' : 'text-[#49454F]'}>
                  {summaryCharCount}/1000
                </span>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

// Component for the score slider - responsive
const ScoreSlider = ({ value, onChange, hasError, errorKey }) => {
  const trackColor = hasError ? "#ffb4b4" : getColorForValue(value);

  return (
    <div className="flex gap-x-2 items-center">
      <div className="relative flex items-center w-32 lg:w-40 mr-3">
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
            borderColor: hasError ? "#B10E0EE5" : trackColor,
          }}
        ></div>

        {/* Invisible range input for functionality */}
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="absolute w-full h-5 opacity-0 cursor-pointer z-20"
          aria-label="Skill proficiency score"
          data-error-key={errorKey}
        />
      </div>

      {/* Score display */}
      <span
        className={`font-medium text-xs lg:text-sm ${
          hasError ? "text-[#B10E0EE5]" : "text-[#0000006b]"
        }`}
      >
        {value}/100
      </span>
    </div>
  );
};

// Question and answer component - responsive
const QuestionAnswerPair = ({
  skillIndex,
  questionIndex,
  control,
  getErrorMessage,
  removeQuestion,
  showRemoveButton,
}) => {
  const [textareaHeight, setTextareaHeight] = useState({
    question: "3.2rem",
    answer: "3.2rem",
  });

  // Watch field values
  const questionValue = useWatch({
    control,
    name: `skills.${skillIndex}.questions.${questionIndex}.question`,
    defaultValue: "",
  });

  const answerValue = useWatch({
    control,
    name: `skills.${skillIndex}.questions.${questionIndex}.answer`,
    defaultValue: "",
  });

  // Character count states
  const [questionCharCount, setQuestionCharCount] = useState(0);
  const [answerCharCount, setAnswerCharCount] = useState(0);

  // Update character counts when field values change
  useEffect(() => {
    setQuestionCharCount(questionValue?.length || 0);
  }, [questionValue]);

  useEffect(() => {
    setAnswerCharCount(answerValue?.length || 0);
  }, [answerValue]);

  const handleTextareaChange = (field, type) => (e) => {
    const { value } = e.target;
    field.onChange(value);

    // Update character count immediately for responsive feedback
    if (type === 'question') {
      setQuestionCharCount(value.length);
    } else if (type === 'answer') {
      setAnswerCharCount(value.length);
    }

    e.target.style.height = "3.2rem";
    const newHeight = Math.min(Math.max(e.target.scrollHeight, 48), 80);
    setTextareaHeight((prev) => ({
      ...prev,
      [type]: `${newHeight}px`,
    }));
  };

  return (
    <div className="mb-5">
      {/* Question input */}
      <div className="flex items-start gap-2">
        <span className="font-[550] text-sm lg:text-default w-6 mt-2">
          {questionIndex + 1}.
        </span>
        <div className="flex-1">
          <Controller
            control={control}
            name={`skills.${skillIndex}.questions.${questionIndex}.question`}
            rules={{
              required: "Question is required",
              minLength: {
                value: 2,
                message: "Question must be at least 2 characters",
              },
              maxLength: {
                value: 1000,
                message: "Question cannot be more than 1000 characters",
              },
            }}
            render={({ field }) => (
              <>
                <textarea
                  className="w-full px-3 lg:px-4 py-2 text-sm lg:text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
                  placeholder="Question"
                  rows={2}
                  style={{
                    minHeight: "3.2rem",
                    height: textareaHeight.question,
                    maxHeight: "80px",
                    transition: "height 150ms ease-out",
                  }}
                  data-error-key={`skills.${skillIndex}.questions.${questionIndex}.question`}
                  {...field}
                  onChange={handleTextareaChange(field, "question")}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[#B10E0EE5] text-2xs">
                    {getErrorMessage(
                      `skills.${skillIndex}.questions.${questionIndex}.question`
                    )}
                  </span>
                  <span className={`text-2xs ${questionCharCount > 1000 ? 'text-[#B10E0EE5]' : 'text-[#49454F]'}`}>
                    {questionCharCount}/1000
                  </span>
                </div>
              </>
            )}
          />
        </div>
        {showRemoveButton && (
          <button
            type="button"
            onClick={() => removeQuestion(skillIndex, questionIndex)}
            className="text-gray-500 hover:text-[#B10E0EE5] mt-2"
            aria-label="Remove question"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Answer input */}
      <div className="flex items-start gap-2 mt-4">
        <span className="font-[550] text-sm lg:text-default w-6 mt-2">
          Ans.
        </span>
        <div className="flex-1">
          <Controller
            control={control}
            name={`skills.${skillIndex}.questions.${questionIndex}.answer`}
            rules={{
              required: "Answer is required",
              minLength: {
                value: 2,
                message: "Answer must be at least 2 characters",
              },
              maxLength: {
                value: 5000,
                message: "Answer cannot be more than 5000 characters",
              },
            }}
            render={({ field }) => (
              <>
                <textarea
                  className="w-full px-3 lg:px-4 py-2 text-sm lg:text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
                  placeholder="Answer"
                  rows={2}
                  style={{
                    minHeight: "3.2rem",
                    height: textareaHeight.answer,
                    maxHeight: "80px",
                    transition: "height 150ms ease-out",
                  }}
                  data-error-key={`skills.${skillIndex}.questions.${questionIndex}.answer`}
                  {...field}
                  onChange={handleTextareaChange(field, "answer")}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[#B10E0EE5] text-2xs">
                    {getErrorMessage(
                      `skills.${skillIndex}.questions.${questionIndex}.answer`
                    )}
                  </span>
                  <span className={`text-2xs ${answerCharCount > 5000 ? 'text-[#B10E0EE5]' : 'text-[#49454F]'}`}>
                    {answerCharCount}/5000
                  </span>
                </div>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

// Assign prop types
SkillItem.propTypes = skillItemPropTypes;
ScoreSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  errorKey: PropTypes.string,
};
QuestionAnswerPair.propTypes = {
  skillIndex: PropTypes.number.isRequired,
  questionIndex: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  getErrorMessage: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
};

export default SkillItem;