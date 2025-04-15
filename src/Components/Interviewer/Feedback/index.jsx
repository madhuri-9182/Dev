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

  return {
    interview_id: Number(interviewId),
    skill_based_performance,
    skill_evaluation,
    strength: formData.strength,
    improvement_points: formData.improvementPoints,
    overall_remark: formData.overallRemark,
    overall_score: Number(formData.score),
  };
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
  } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

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

      toast.error(
        "All skills must have a score greater than 0"
      );
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

    // If form validation passes, then check skill scores
    if (isFormValid) {
      const values = getValues();
      if (validateSkillScores(values)) {
        const transformedData = transformFormData(
          values,
          interviewId
        );
        mutate({
          id: interviewId,
          data: transformedData,
        });
      }
    } else {
      // Show error toast if form validation fails
      toast.error(
        "Please fix form errors before submitting"
      );
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
