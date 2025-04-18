import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import {
  PlusIcon,
  XCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { getColorForValue } from "../utils";
import {
  useEffect,
  useRef,
  memo,
  useState,
  useCallback,
} from "react";

// Constants for textarea sizing
const TEXTAREA_CONFIG = {
  MIN_HEIGHT: "3.2rem",
  MIN_HEIGHT_PX: 48, // ~2rem
  MAX_HEIGHT_PX: 80, // ~5rem
  INITIAL_ROWS: 2,
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
  // Ref to track the skill item container for scroll position restoration
  const skillContainerRef = useRef(null);

  // Store scroll position before DOM updates
  const scrollPositionRef = useRef(0);

  // Track which questions were recently added to only resize those
  const [
    lastAddedQuestionIndex,
    setLastAddedQuestionIndex,
  ] = useState(null);

  // Save scroll position before adding/removing questions
  const saveScrollPosition = () => {
    if (skillContainerRef.current) {
      scrollPositionRef.current = window.scrollY;
    }
  };

  // Restore scroll position after DOM updates
  const restoreScrollPosition = () => {
    window.scrollTo({
      top: scrollPositionRef.current,
      behavior: "auto", // Using "auto" instead of "smooth" to prevent additional visual changes
    });
  };

  // Function to adjust textarea height with optimizations - memoized to prevent recreating on every render
  const autoResizeTextarea = useCallback(
    (element, force = false) => {
      if (!element) return;

      // Skip resizing for textareas that don't need it
      if (
        !force &&
        element.dataset.heightCalculated === "true"
      ) {
        return;
      }

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

      // Only update if height actually changed
      if (parseInt(element.style.height) !== newHeight) {
        element.style.height = `${newHeight}px`;
      }

      // Mark this textarea as having its height calculated
      element.dataset.heightCalculated = "true";
    },
    []
  );

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

  // Common textarea style with transition for smooth height changes
  const textareaStyle = {
    minHeight: TEXTAREA_CONFIG.MIN_HEIGHT,
    maxHeight: `${TEXTAREA_CONFIG.MAX_HEIGHT_PX}px`,
    whiteSpace: "normal",
    overflowWrap: "break-word",
    transition: "height 150ms ease-out", // Smooth transition for height changes
  };

  // Clear the last added question index whenever questions change
  useEffect(() => {
    if (lastAddedQuestionIndex !== null) {
      // Reset the last added question index after a short delay
      const timeoutId = setTimeout(() => {
        setLastAddedQuestionIndex(null);
      }, 300); // Delay should be longer than transition time

      return () => clearTimeout(timeoutId);
    }
  }, [
    lastAddedQuestionIndex,
    skillField.questions?.length,
  ]);

  // Wrapped add/remove functions to preserve scroll position and track changes
  const handleAddQuestion = (index) => {
    saveScrollPosition();
    addQuestion(index);
    // Set the last added question index to the new one
    setLastAddedQuestionIndex(
      skillField.questions?.length || 0
    );
    // Restore scroll after DOM update
    setTimeout(restoreScrollPosition, 0);
  };

  const handleRemoveQuestion = (skillIdx, questionIdx) => {
    saveScrollPosition();
    removeQuestion(skillIdx, questionIdx);
    // No need to recalculate heights when removing - existing textareas stay the same
    // Restore scroll after DOM update
    setTimeout(restoreScrollPosition, 0);
  };

  return (
    <div
      ref={skillContainerRef}
      className="bg-[#E8F0F5] p-6 rounded-lg mb-6 transition-all duration-150 ease-out"
      data-error-section={`skills.${skillIndex}`}
    >
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
              maxLength: {
                value: 95,
                message:
                  "Skill name cannot be more than 100 characters",
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

      {/* Questions container with smooth transition */}
      <div className="questions-container transition-all duration-150 ease-out">
        {skillField.questions?.map(
          (question, questionIndex) => (
            <MemoizedQuestionAnswerPair
              key={`${skillField.id}-q-${questionIndex}`}
              skillIndex={skillIndex}
              questionIndex={questionIndex}
              control={control}
              errors={errors}
              getErrorMessage={getErrorMessage}
              removeQuestion={handleRemoveQuestion}
              textareaStyle={textareaStyle}
              autoResizeTextarea={autoResizeTextarea}
              showRemoveButton={questionIndex > 0}
              isNewlyAdded={
                questionIndex === lastAddedQuestionIndex
              }
              questionText={question.question || ""}
              answerText={question.answer || ""}
            />
          )
        )}
      </div>

      {/* Add question button */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="rounded-full bg-gray-800 p-2 hover:opacity-90"
          onClick={() => handleAddQuestion(skillIndex)}
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
            maxLength: {
              value: 950,
              message:
                "Summary cannot be more than 1000 characters",
            },
          }}
          render={({ field }) => (
            <textarea
              className="w-full px-3 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
              placeholder="Add Summary"
              rows={4}
              data-error-key={`skills.${skillIndex}.summary`}
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
const ScoreSlider = ({
  value,
  onChange,
  hasError,
  errorKey,
}) => {
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
          data-error-key={errorKey}
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
  // autoResizeTextarea,
  showRemoveButton,
  isNewlyAdded,
  questionText,
  answerText,
}) => {
  // Refs for the textareas
  const questionTextareaRef = useRef(null);
  const answerTextareaRef = useRef(null);

  // Cache for storing calculated heights by text content
  const questionHeightCache = useRef(new Map());
  const answerHeightCache = useRef(new Map());

  // Refs to track previous content
  const prevQuestionContent = useRef(questionText);
  const prevAnswerContent = useRef(answerText);

  // Custom resize function that uses cache
  const resizeWithCache = useCallback(
    (element, content, cache) => {
      if (!element) return;

      // If we have a cached height for this exact content, use it
      if (cache.current.has(content)) {
        const cachedHeight = cache.current.get(content);
        if (element.style.height !== cachedHeight) {
          element.style.height = cachedHeight;
        }
        return;
      }

      // Otherwise, calculate height
      element.style.height = TEXTAREA_CONFIG.MIN_HEIGHT;

      const newHeight = Math.min(
        Math.max(
          element.scrollHeight,
          TEXTAREA_CONFIG.MIN_HEIGHT_PX
        ),
        TEXTAREA_CONFIG.MAX_HEIGHT_PX
      );

      const heightString = `${newHeight}px`;
      element.style.height = heightString;

      // Store in cache for future use
      cache.current.set(content, heightString);
    },
    []
  );

  // Effect to handle initial resize - only if content changed or first render
  useEffect(() => {
    // Only resize if content changed or is newly added
    if (
      isNewlyAdded ||
      questionText !== prevQuestionContent.current ||
      answerText !== prevAnswerContent.current
    ) {
      // Update the question textarea if needed
      if (
        questionTextareaRef.current &&
        (isNewlyAdded ||
          questionText !== prevQuestionContent.current)
      ) {
        resizeWithCache(
          questionTextareaRef.current,
          questionText,
          questionHeightCache
        );
        prevQuestionContent.current = questionText;
      }

      // Update the answer textarea if needed
      if (
        answerTextareaRef.current &&
        (isNewlyAdded ||
          answerText !== prevAnswerContent.current)
      ) {
        resizeWithCache(
          answerTextareaRef.current,
          answerText,
          answerHeightCache
        );
        prevAnswerContent.current = answerText;
      }
    }
  }, [
    isNewlyAdded,
    questionText,
    answerText,
    resizeWithCache,
  ]);

  // Custom onChange handlers to update height only when content changes
  const handleQuestionChange = (onChange) => (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Only resize if content actually changed
    if (newValue !== prevQuestionContent.current) {
      resizeWithCache(
        e.target,
        newValue,
        questionHeightCache
      );
      prevQuestionContent.current = newValue;
    }
  };

  const handleAnswerChange = (onChange) => (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Only resize if content actually changed
    if (newValue !== prevAnswerContent.current) {
      resizeWithCache(
        e.target,
        newValue,
        answerHeightCache
      );
      prevAnswerContent.current = newValue;
    }
  };

  return (
    <div className="mb-5 question-answer-container transition-all duration-150 ease-out">
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
              maxLength: {
                value: 950,
                message:
                  "Question cannot be more than 1000 characters",
              },
            }}
            render={({ field }) => (
              <textarea
                className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
                placeholder="Question"
                rows={TEXTAREA_CONFIG.INITIAL_ROWS}
                style={textareaStyle}
                data-error-key={`skills.${skillIndex}.questions.${questionIndex}.question`}
                value={field.value || ""}
                onChange={handleQuestionChange(
                  field.onChange
                )}
                onBlur={field.onBlur}
                name={field.name}
                ref={(el) => {
                  field.ref && field.ref(el);
                  questionTextareaRef.current = el;
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
              maxLength: {
                value: 4900,
                message:
                  "Answer cannot be more than 5000 characters",
              },
            }}
            render={({ field }) => (
              <textarea
                className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none resize-none overflow-y-auto"
                placeholder="Answer"
                rows={TEXTAREA_CONFIG.INITIAL_ROWS}
                style={textareaStyle}
                data-error-key={`skills.${skillIndex}.questions.${questionIndex}.answer`}
                value={field.value || ""}
                onChange={handleAnswerChange(
                  field.onChange
                )}
                onBlur={field.onBlur}
                name={field.name}
                ref={(el) => {
                  field.ref && field.ref(el);
                  answerTextareaRef.current = el;
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
};

// Memoized version of QuestionAnswerPair to prevent unnecessary re-renders
const MemoizedQuestionAnswerPair = memo(
  QuestionAnswerPair,
  (prevProps, nextProps) => {
    // Only re-render if one of these essential props changed
    return (
      prevProps.questionIndex === nextProps.questionIndex &&
      prevProps.skillIndex === nextProps.skillIndex &&
      prevProps.isNewlyAdded === nextProps.isNewlyAdded &&
      prevProps.questionText === nextProps.questionText &&
      prevProps.answerText === nextProps.answerText &&
      prevProps.showRemoveButton ===
        nextProps.showRemoveButton &&
      JSON.stringify(
        prevProps.errors?.skills?.[prevProps.skillIndex]
          ?.questions?.[prevProps.questionIndex]
      ) ===
        JSON.stringify(
          nextProps.errors?.skills?.[nextProps.skillIndex]
            ?.questions?.[nextProps.questionIndex]
        )
    );
  }
);

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
  textareaStyle: PropTypes.object.isRequired,
  autoResizeTextarea: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
  isNewlyAdded: PropTypes.bool,
  questionText: PropTypes.string,
  answerText: PropTypes.string,
};
MemoizedQuestionAnswerPair.propTypes =
  QuestionAnswerPair.propTypes;
