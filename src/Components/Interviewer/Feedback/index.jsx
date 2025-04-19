// Feedback.jsx - Main container component
import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

// Import our custom hook for error handling
import { useFormErrorHandler } from "./hooks/useErrorFormHandler";

import {
  getCandidateFeedback,
  updateCandidateFeedback,
} from "../api";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";
import {
  formatExperienceFromYearsAndMonths,
  getErrorMessage,
  getJobLabel,
} from "../../../utils/util";

import CandidateDetailsSection from "./sections/CandidateDetailsSection";
import InterviewerDetailsSection from "./sections/InterviewerDetailsSection";
import SkillsSection from "./sections/SkillSection";
import SkillEvaluationSection from "./sections/SkillEvaluationSection";
import StrengthAndImprovementSection from "./sections/StrengthAndImprovementSection";
import OverallRemarkSection from "./sections/OverallRemarkSection";
import ResourcesSection from "./sections/ResourcesSection"; // Import our new section
import { REMARK_OPTIONS } from "../../Constants/constants";

// Initial form state
const DEFAULT_FORM_VALUES = {
  candidateDetails: {
    name: "",
    email: "",
    phone: "",
    yearsOfExperience: "",
    role: "",
    company: "",
  },
  interviewerDetails: {
    yearsOfExperience: "",
    company: "",
    interviewDate: "",
  },
  skills: [
    {
      skillName: "",
      score: 0,
      questions: [{ question: "", answer: "" }],
      summary: "",
    },
  ],
  summary: "",
  skillEvaluation: {
    communication: "",
    attitude: "",
    additional: [], // Add this for custom skill evaluations
  },
  strength: "",
  improvementPoints: "",
  overallRemark: "",
  score: 0,
  resources: {
    file: null,
    link: "",
  },
};

// Utility functions
const transformSkillsData = (skillsData) => {
  if (!skillsData) return [];

  return Object.entries(skillsData).map(
    ([skillName, skillData]) => {
      // Transform questions array to match the expected format
      const questions = skillData.questions.map((q) => ({
        question: q.que || "",
        answer: q.ans || "",
      }));

      return {
        skillName,
        score: parseInt(skillData.score, 10) || 0, // Default to 0 if parsing fails
        questions,
        summary: skillData.summary || "",
      };
    }
  );
};

const transformFormData = (formData, interviewId) => {
  // Create a new FormData instance
  const formDataObject = new FormData();

  // Add interview ID
  formDataObject.append(
    "interview_id",
    String(interviewId)
  );

  // Transform skill-based performance
  const skill_based_performance = {};

  formData.skills.forEach((skill) => {
    if (skill.skillName) {
      // Transform questions to match API format
      const apiQuestions = skill.questions.map((q) => ({
        que: q.question,
        ans: q.answer,
      }));

      skill_based_performance[skill.skillName] = {
        score: String(skill.score),
        summary: skill.summary,
        questions: apiQuestions,
      };
    }
  });

  // Add skill-based performance as JSON string
  formDataObject.append(
    "skill_based_performance",
    JSON.stringify(skill_based_performance)
  );

  // Transform skill evaluation data
  const skill_evaluation = {
    Communication:
      formData.skillEvaluation.communication.toLowerCase(),
    Attitude:
      formData.skillEvaluation.attitude.toLowerCase(),
  };

  // Add additional skill evaluations if they exist
  if (
    formData.skillEvaluation.additional &&
    formData.skillEvaluation.additional.length > 0
  ) {
    formData.skillEvaluation.additional.forEach((item) => {
      if (item.name && item.rating) {
        skill_evaluation[item.name] =
          item.rating.toLowerCase();
      }
    });
  }

  // Add skill evaluation as JSON string
  formDataObject.append(
    "skill_evaluation",
    JSON.stringify(skill_evaluation)
  );

  // Add other form fields - ensure all values are strings
  formDataObject.append(
    "strength",
    formData.strength || ""
  );
  formDataObject.append(
    "improvement_points",
    formData.improvementPoints || ""
  );
  formDataObject.append(
    "overall_remark",
    formData.overallRemark || ""
  );
  formDataObject.append(
    "overall_score",
    String(formData.score || 0)
  );

  // Add the file if it exists
  if (formData.resources.file) {
    formDataObject.append(
      "attachment",
      formData.resources.file
    );
  }

  // Add the link if it exists
  if (formData.resources.link) {
    formDataObject.append("link", formData.resources.link);
  }
  return formDataObject;
};

// Main Form Component
const Feedback = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const interviewId = location.pathname.split("/")[3];

  // Set up react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    trigger,
    watch,
  } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  // Use our custom error handling hook
  const { handleErrors, scrollToAndFocusElement } =
    useFormErrorHandler(errors);

  // Set up field array for skills
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
    update: updateSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const calculateAverageScore = (skills) => {
    if (!skills || skills.length === 0) return 0;

    // Filter out skills with no name (incomplete skills)
    const validSkills = skills.filter(
      (skill) => skill.skillName
    );

    if (validSkills.length === 0) return 0;

    // Calculate the sum of all skill scores
    const totalScore = validSkills.reduce(
      (sum, skill) =>
        sum + (parseInt(skill.score, 10) || 0),
      0
    );

    // Return the average (rounded to nearest integer)
    return Math.round(totalScore / validSkills.length);
  };

  // Add this after the useFieldArray declaration
  // Watch for changes in skills array to recalculate score
  const watchedSkills = useWatch({
    control,
    name: "skills",
    defaultValue: DEFAULT_FORM_VALUES.skills,
  });

  useEffect(() => {
    const averageScore =
      calculateAverageScore(watchedSkills);
    setValue("score", averageScore);
  }, [watchedSkills, setValue]);

  // Fetch feedback data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getFeedback", interviewId],
    queryFn: () => getCandidateFeedback(interviewId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Submit feedback mutation
  const { mutate, isPending } = useMutation({
    mutationFn: updateCandidateFeedback,
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      queryClient.invalidateQueries("getFeedback");
      reset();
      navigate("/interviewer/dashboard");
    },
    onError: (error) => {
      toast.error(
        `${
          error.response?.data?.message
            ? error.response.data.message
            : `Error submitting feedback: ${
                error.message || "Please try again"
              }`
        }`
      );
    },
  });

  // Transform skill evaluation data
  const transformSkillEvaluation = (
    skillEvaluationData
  ) => {
    if (!skillEvaluationData)
      return {
        communication: "",
        attitude: "",
        additional: [],
      };

    // Extract the default evaluations
    const communication =
      skillEvaluationData.Communication || "";
    const attitude = skillEvaluationData.Attitude || "";

    // Create the additional evaluations array
    const additional = [];

    // Process all other evaluations as additional
    Object.entries(skillEvaluationData).forEach(
      ([key, value]) => {
        if (key !== "Communication" && key !== "Attitude") {
          additional.push({
            name: key,
            rating:
              value.charAt(0).toUpperCase() +
              value.slice(1), // Capitalize first letter
          });
        }
      }
    );

    return {
      communication:
        communication.charAt(0).toUpperCase() +
        communication.slice(1),
      attitude:
        attitude.charAt(0).toUpperCase() +
        attitude.slice(1),
      additional,
    };
  };

  // Update form values when data loads
  useEffect(() => {
    if (data && Object.keys(data?.data).length > 0) {
      const responseData = data?.data;
      const candidate = responseData?.candidate;
      const interviewer = responseData?.interviewer;

      // Transform skills data
      const transformedSkills = transformSkillsData(
        responseData?.skill_based_performance
      );

      // Transform skill evaluation data
      const transformedSkillEvaluation =
        transformSkillEvaluation(
          responseData?.skill_evaluation
        );

      // Check if there's an attachment
      const attachmentUrl =
        responseData?.attachment || null;

      // Reset the form with all values
      reset({
        candidateDetails: {
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone.split("+91")[1],
          yearsOfExperience:
            formatExperienceFromYearsAndMonths(
              candidate.year,
              candidate.month
            ),
          role: getJobLabel(candidate.role),
          company: candidate.company,
        },
        interviewerDetails: {
          yearsOfExperience:
            formatExperienceFromYearsAndMonths(
              interviewer.total_experience_years,
              interviewer.total_experience_months
            ),
          company: interviewer.current_company,
          interviewDate:
            responseData?.interview_date.split(" ")[0],
        },
        skills:
          transformedSkills.length > 0
            ? transformedSkills
            : getValues("skills"),
        skillEvaluation: transformedSkillEvaluation,
        strength: responseData?.strength || "",
        improvementPoints:
          responseData?.improvement_points || "",
        overallRemark: responseData?.overall_remark || "",
        score: responseData?.overall_score || 0,
        resources: {
          file: null, // We'll load this using the createFileFromUrl function
          link: responseData?.link || "",
        },
        attachmentUrl: attachmentUrl, // Store the attachment URL to be processed
      });
    }
  }, [data, reset, getValues]);

  // Validate that no skill has a score of 0
  const validateSkillScores = (formData) => {
    const invalidSkills = formData.skills.filter(
      (skill) =>
        skill.skillName &&
        (skill.score === 0 || skill.score === "0")
    );

    if (invalidSkills.length > 0) {
      // Set errors for each skill with score of 0
      invalidSkills.forEach((skill, index) => {
        setValue(`skills.${index}.score`, 0, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      });

      // Find and focus the first invalid skill score
      if (invalidSkills.length > 0) {
        // Get the index of the first invalid skill
        const firstInvalidIndex = formData.skills.findIndex(
          (skill) =>
            skill.skillName &&
            (skill.score === 0 || skill.score === "0")
        );

        // Find and focus the score element
        const scoreElement = document.querySelector(
          `[data-error-key="skills.${firstInvalidIndex}.score"]`
        );

        if (scoreElement) {
          scrollToAndFocusElement(scoreElement);
        }
      }

      toast.error(
        "All skills must have a score greater than 0"
      );
      return false;
    }

    return true;
  };

  // Validate skill evaluations (both default and additional)
  const validateSkillEvaluations = (formData) => {
    let isValid = true;

    // Check if communication rating is missing
    if (!formData.skillEvaluation.communication) {
      setValue("skillEvaluation.communication", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      isValid = false;
    }

    // Check if attitude rating is missing
    if (!formData.skillEvaluation.attitude) {
      setValue("skillEvaluation.attitude", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      isValid = false;
    }

    // Check additional skill evaluations
    if (
      formData.skillEvaluation.additional &&
      formData.skillEvaluation.additional.length > 0
    ) {
      formData.skillEvaluation.additional.forEach(
        (item, index) => {
          if (!item.rating) {
            setValue(
              `skillEvaluation.additional.${index}.rating`,
              "",
              {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              }
            );
            isValid = false;
          }
        }
      );
    }

    if (!isValid) {
      // Find and focus the first skill evaluation error
      let firstErrorElement;

      if (!formData.skillEvaluation.communication) {
        firstErrorElement = document.querySelector(
          '[data-error-key="skillEvaluation.communication"]'
        );
      } else if (!formData.skillEvaluation.attitude) {
        firstErrorElement = document.querySelector(
          '[data-error-key="skillEvaluation.attitude"]'
        );
      } else {
        // Find the first additional skill with missing rating
        const firstMissingIndex =
          formData.skillEvaluation.additional.findIndex(
            (item) => !item.rating
          );
        if (firstMissingIndex >= 0) {
          firstErrorElement = document.querySelector(
            `[data-error-key="skillEvaluation.additional.${firstMissingIndex}.rating"]`
          );
        }
      }

      if (firstErrorElement) {
        scrollToAndFocusElement(firstErrorElement);
      }

      toast.error("Please rate all skill evaluations");
      return false;
    }

    return true;
  };

  // Form submission handler
  const onSubmit = (data) => {
    // Validate skill scores
    if (!validateSkillScores(data)) {
      return;
    }

    // Validate skill evaluations
    if (!validateSkillEvaluations(data)) {
      return;
    }

    const transformedData = transformFormData(
      data,
      interviewId
    );
    mutate({ id: interviewId, data: transformedData });
  };

  // Manual submit handler with validation
  const handleManualSubmit = async () => {
    // First, trigger form validation
    const isFormValid = await trigger();

    // If form validation passes, then check skill scores and evaluations
    if (isFormValid) {
      const values = getValues();

      // First validate skill scores
      if (!validateSkillScores(values)) {
        return;
      }

      // Then validate skill evaluations
      if (!validateSkillEvaluations(values)) {
        return;
      }

      // If all validations pass, submit the form
      const transformedData = transformFormData(
        values,
        interviewId
      );
      mutate({
        id: interviewId,
        data: transformedData,
      });
    } else {
      // Use our custom error handler to focus on the first error
      handleErrors();
    }
  };

  // Utility function to add a question to a skill
  const addQuestion = (skillIndex) => {
    const currentSkill = getValues(`skills.${skillIndex}`);
    const updatedSkill = {
      ...currentSkill,
      questions: [
        ...currentSkill.questions,
        { question: "", answer: "" },
      ],
    };
    updateSkill(skillIndex, updatedSkill);
  };

  // Utility function to remove a question from a skill
  const removeQuestion = (skillIndex, questionIndex) => {
    const currentSkill = getValues(`skills.${skillIndex}`);
    const updatedQuestions = [...currentSkill.questions];
    updatedQuestions.splice(questionIndex, 1);

    const updatedSkill = {
      ...currentSkill,
      questions: updatedQuestions,
    };

    updateSkill(skillIndex, updatedSkill);
  };

  // Loading and error states
  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  return (
    <div className="max-w-7xl mx-auto p-6 my-14">
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <CandidateDetailsSection
          register={register}
          errors={errors}
        />

        <InterviewerDetailsSection
          register={register}
          errors={errors}
        />

        <SkillsSection
          skillFields={skillFields}
          register={register}
          control={control}
          errors={errors}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          removeSkill={removeSkill}
          appendSkill={appendSkill}
        />

        <SkillEvaluationSection
          control={control}
          setValue={setValue}
          errors={errors}
          register={register}
        />

        <StrengthAndImprovementSection
          register={register}
          errors={errors}
        />

        <OverallRemarkSection
          control={control}
          register={register}
          errors={errors}
          remarkOptions={REMARK_OPTIONS}
          isPending={isPending}
        />
        <ResourcesSection
          register={register}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
          watch={watch}
          getValues={getValues}
        />
        <div className="flex justify-end mt-6 ">
          <button
            type="button"
            onClick={handleManualSubmit}
            className={`px-6 py-2 text-sm bg-black hover:opacity-80 text-white font-medium rounded-lg ${
              isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isPending}
          >
            {isPending
              ? "Submitting..."
              : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;
