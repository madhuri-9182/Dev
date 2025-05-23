// Feedback.jsx - Main container component with mobile responsiveness
import { useEffect, useState, useRef } from "react";
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
import ResourcesSection from "./sections/ResourcesSection";
import MobileTabNavigation from "./MobileTabNavigation";
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
    additional: [],
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

  return Object.entries(skillsData)?.map(
    ([skillName, skillData]) => {
      let questions = [];

      if (
        skillData.questions &&
        skillData.questions.length > 0
      ) {
        questions = skillData.questions.map((q) => ({
          question: q.que || "",
          answer: q.ans || "",
        }));
      } else {
        questions = [{ question: "", answer: "" }];
      }

      return {
        skillName,
        score: parseInt(skillData.score, 10) || 0,
        questions,
        summary: skillData.summary || "",
      };
    }
  );
};

const transformFormData = (formData, interviewId) => {
  const formDataObject = new FormData();

  formDataObject.append(
    "interview_id",
    String(interviewId)
  );

  const skill_based_performance = {};

  formData.skills.forEach((skill) => {
    if (skill.skillName) {
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

  formDataObject.append(
    "skill_based_performance",
    JSON.stringify(skill_based_performance)
  );

  const skill_evaluation = {
    Communication:
      formData.skillEvaluation.communication.toLowerCase(),
    Attitude:
      formData.skillEvaluation.attitude.toLowerCase(),
  };

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

  formDataObject.append(
    "skill_evaluation",
    JSON.stringify(skill_evaluation)
  );

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

  if (formData.resources.file) {
    formDataObject.append(
      "attachment",
      formData.resources.file
    );
  }

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

  // State for mobile tab navigation
  const [activeSection, setActiveSection] =
    useState("candidate");
  const sectionRefs = {
    candidate: useRef(null),
    interviewer: useRef(null),
    skills: useRef(null),
    evaluation: useRef(null),
    strength: useRef(null),
    overall: useRef(null),
    resources: useRef(null),
  };

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
    clearErrors,
    setError,
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

    const validSkills = skills.filter(
      (skill) => skill.skillName
    );

    if (validSkills.length === 0) return 0;

    const totalScore = validSkills.reduce(
      (sum, skill) =>
        sum + (parseInt(skill.score, 10) || 0),
      0
    );

    return Math.round(totalScore / validSkills.length);
  };

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

  // Handle scroll detection for active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Account for sticky header

      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop;
          const height = ref.current.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(key);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle tab click
  const handleTabClick = (sectionId) => {
    const ref = sectionRefs[sectionId];
    if (ref.current) {
      const offset = 100; // Adjusted for mobile header height
      const elementPosition =
        ref.current.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

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

    const communication =
      skillEvaluationData.Communication || "";
    const attitude = skillEvaluationData.Attitude || "";

    const additional = [];

    Object.entries(skillEvaluationData).forEach(
      ([key, value]) => {
        if (key !== "Communication" && key !== "Attitude") {
          additional.push({
            name: key,
            rating:
              value.charAt(0).toUpperCase() +
              value.slice(1),
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

      const transformedSkills = transformSkillsData(
        responseData?.skill_based_performance
      );

      const transformedSkillEvaluation =
        transformSkillEvaluation(
          responseData?.skill_evaluation
        );

      const attachmentUrl =
        responseData?.attachment || null;

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
          file: null,
          link: responseData?.link || "",
        },
        attachmentUrl: attachmentUrl,
      });
    }
  }, [data, reset, getValues]);

  // Validate functions
  const validateSkillScores = (formData) => {
    const invalidSkills = formData.skills.filter(
      (skill) =>
        skill.skillName &&
        (skill.score === 0 || skill.score === "0")
    );

    if (invalidSkills.length > 0) {
      invalidSkills.forEach((skill, index) => {
        setValue(`skills.${index}.score`, 0, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      });

      if (invalidSkills.length > 0) {
        const firstInvalidIndex = formData.skills.findIndex(
          (skill) =>
            skill.skillName &&
            (skill.score === 0 || skill.score === "0")
        );

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

  const validateSkillEvaluations = (formData) => {
    let isValid = true;

    if (!formData.skillEvaluation.communication) {
      setValue("skillEvaluation.communication", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      isValid = false;
    }

    if (!formData.skillEvaluation.attitude) {
      setValue("skillEvaluation.attitude", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      isValid = false;
    }

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

  const validateResources = (formData) => {
    const hasFile = !!formData.resources.file;
    const hasLink =
      !!formData.resources.link &&
      formData.resources.link.trim() !== "";

    if (!hasFile && !hasLink) {
      // Set a custom error for the file field
      setError("resources.file", {
        type: "manual",
        message: "Please provide either a file or a link",
      });

      // Scroll to the resources section
      const resourceSection = document.querySelector(
        '[data-error-section="resources"]'
      );

      if (resourceSection) {
        scrollToAndFocusElement(resourceSection);
      }

      return false;
    }

    // Clear any custom errors for resources if validation passes
    clearErrors("resources.file");

    return true;
  };

  // Form submission handler
  const onSubmit = (data) => {
    if (!validateSkillScores(data)) {
      return;
    }

    if (!validateSkillEvaluations(data)) {
      return;
    }

    if (!validateResources(data)) {
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
    const isFormValid = await trigger();

    if (isFormValid) {
      const values = getValues();

      if (!validateSkillScores(values)) {
        return;
      }

      if (!validateSkillEvaluations(values)) {
        return;
      }

      if (!validateResources(values)) {
        return;
      }

      const transformedData = transformFormData(
        values,
        interviewId
      );
      mutate({
        id: interviewId,
        data: transformedData,
      });
    } else {
      handleErrors();
    }
  };

  // Utility functions for questions
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

  const removeQuestion = (skillIndex, questionIndex) => {
    clearErrors(
      `skills.${skillIndex}.questions.${questionIndex}`
    );

    const currentSkill = getValues(`skills.${skillIndex}`);
    const updatedQuestions = [...currentSkill.questions];

    updatedQuestions.splice(questionIndex, 1);

    const updatedSkill = {
      ...currentSkill,
      questions: updatedQuestions,
    };

    updateSkill(skillIndex, updatedSkill);

    updatedQuestions.forEach((_, idx) => {
      if (idx >= questionIndex) {
        clearErrors(
          `skills.${skillIndex}.questions.${idx}`
        );
      }
    });
  };

  // Loading and error states
  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6 my-2 lg:my-14">
      <MobileTabNavigation
        activeSection={activeSection}
        onTabClick={handleTabClick}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="mt-4 lg:mt-0"
      >
        <div ref={sectionRefs.candidate}>
          <CandidateDetailsSection
            register={register}
            errors={errors}
          />
        </div>

        <div ref={sectionRefs.interviewer}>
          <InterviewerDetailsSection
            register={register}
            errors={errors}
          />
        </div>

        <div ref={sectionRefs.skills}>
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
        </div>

        <div ref={sectionRefs.evaluation}>
          <SkillEvaluationSection
            control={control}
            setValue={setValue}
            errors={errors}
            register={register}
          />
        </div>

        <div ref={sectionRefs.strength}>
          <StrengthAndImprovementSection
            register={register}
            errors={errors}
            watch={watch}
          />
        </div>

        <div ref={sectionRefs.overall}>
          <OverallRemarkSection
            control={control}
            register={register}
            errors={errors}
            remarkOptions={REMARK_OPTIONS}
            isPending={isPending}
          />
        </div>

        <div ref={sectionRefs.resources}>
          <ResourcesSection
            register={register}
            errors={errors}
            setValue={setValue}
            trigger={trigger}
            watch={watch}
            getValues={getValues}
          />
        </div>

        <div className="flex justify-end mt-6 pb-6 lg:pb-0">
          <button
            type="button"
            onClick={handleManualSubmit}
            className={`w-full lg:w-auto px-6 py-3 lg:py-2 text-default sm:text-sm bg-black hover:opacity-80 text-white font-medium rounded-lg ${
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
