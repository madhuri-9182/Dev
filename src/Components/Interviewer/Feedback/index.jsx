import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";

import {
  PlusIcon,
  XCircleIcon,
  Trash2Icon,
} from "lucide-react";
import {
  Improvement,
  Questions,
  Business,
  Remark,
  Skill,
  User,
} from "../../../assets";
import {
  FormRow,
  FormSection,
  Input,
  Select,
  TextArea,
} from "./FeedbackComponents";
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
} from "../../Constants/constants";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCandidateFeedback,
  updateCandidateFeedback,
} from "../api";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";
import { formatExperience } from "../Dashboard/utils/formatters";
import { getJobLabel } from "../../../utils/util";
import toast from "react-hot-toast";

// Main Form Component
const Feedback = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const interviewId = location.pathname.split("/")[3];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getFeedback", interviewId],
    queryFn: () => getCandidateFeedback(interviewId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    // watch,
  } = useForm({
    defaultValues: {
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
          score: 60,
          questions: [{ question: "", answer: "" }],
          summary: "",
        },
      ],
      summary: "",
      skillEvaluation: {
        communication: "",
        attitude: "",
      },
      strength: "",
      improvementPoints: "",
      overallRemark: "",
      score: 0,
    },
    mode: "onSubmit",
  });

  // Skills field array
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
    update: updateSkill,
    // replace: replaceSkills,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const remarkOptions = [
    { id: "HREC", name: "Highly Recommend" },
    { id: "REC", name: "Recommend" },
    { id: "NREC", name: "Not Recommended" },
    { id: "SNREC", name: "Strongly Not Recommended" },
    { id: "NJ", name: "Not Joined" },
  ];

  const [communicationRating, setCommunicationRating] =
    useState("");
  const [attitudeRating, setAttitudeRating] = useState("");

  // Transform skill_based_performance to skills array format
  const transformSkillsData = (skillsData) => {
    if (!skillsData) return [];

    return Object.entries(skillsData).map(
      ([skillName, skillData]) => {
        // Transform questions array to match the expected format
        const questions = skillData.questions.map((q) => ({
          question: q.que || "",
          answer: q.ans || "",
        }));

        // No need to add a second empty question - only one is required now

        return {
          skillName,
          score: parseInt(skillData.score, 10) || 60, // Default to 60 if parsing fails
          questions,
          summary: skillData.summary || "",
        };
      }
    );
  };

  // update form values when data loads
  useEffect(() => {
    if (data && Object.keys(data?.data).length > 0) {
      const responseData = data?.data;
      const candidate = responseData?.candidate;
      const interviewer = responseData?.interviewer;

      // Transform skills data
      const transformedSkills = transformSkillsData(
        responseData?.skill_based_performance
      );

      // Get communication and attitude values (capitalize first letter to match the buttons)
      const communicationValue =
        responseData?.skill_evaluation?.Communication || "";
      const attitudeValue =
        responseData?.skill_evaluation?.Attitude || "";

      // Set the state for UI buttons
      setCommunicationRating(
        communicationValue.charAt(0).toUpperCase() +
          communicationValue.slice(1)
      );
      setAttitudeRating(
        attitudeValue.charAt(0).toUpperCase() +
          attitudeValue.slice(1)
      );

      // Reset the form with all values
      reset({
        candidateDetails: {
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone.split("+91")[1],
          yearsOfExperience: formatExperience(
            candidate.year,
            candidate.month
          ),
          role: getJobLabel(candidate.role),
          company: candidate.company,
        },
        interviewerDetails: {
          yearsOfExperience: formatExperience(
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
        skillEvaluation: {
          communication:
            communicationValue.charAt(0).toUpperCase() +
            communicationValue.slice(1),
          attitude:
            attitudeValue.charAt(0).toUpperCase() +
            attitudeValue.slice(1),
        },
        strength: responseData?.strength || "",
        improvementPoints:
          responseData?.improvement_points || "",
        overallRemark: responseData?.overall_remark || "",
        score: responseData?.overall_score || 0,
      });
    }
  }, [data, reset, getValues]);

  // Function to add a new question to a skill
  const addQuestion = (skillIndex) => {
    // Get the current skill
    const currentSkill = getValues(`skills.${skillIndex}`);

    // Add a new question to the questions array
    const updatedSkill = {
      ...currentSkill,
      questions: [
        ...currentSkill.questions,
        { question: "", answer: "" },
      ],
    };

    // Update the skill in the field array
    updateSkill(skillIndex, updatedSkill);
  };

  // Function to remove a question from a skill
  const removeQuestion = (skillIndex, questionIndex) => {
    // Get the current skill
    const currentSkill = getValues(`skills.${skillIndex}`);

    // Remove the question at questionIndex
    const updatedQuestions = [...currentSkill.questions];
    updatedQuestions.splice(questionIndex, 1);

    // Update the skill with the new questions array
    const updatedSkill = {
      ...currentSkill,
      questions: updatedQuestions,
    };

    // Update the skill in the field array
    updateSkill(skillIndex, updatedSkill);
  };

  const transformFormData = (formData) => {
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

    return {
      interview_id: Number(interviewId),
      skill_based_performance,
      skill_evaluation: {
        Communication:
          formData.skillEvaluation.communication.toLowerCase(),
        Attitude:
          formData.skillEvaluation.attitude.toLowerCase(),
      },
      strength: formData.strength,
      improvement_points: formData.improvementPoints,
      overall_remark: formData.overallRemark,
      overall_score: Number(formData.score),
    };
  };

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
        `Error submitting feedback: ${
          error.message || "Please try again"
        }`
      );
    },
  });

  const onSubmit = (data) => {
    const transformedData = transformFormData(data);
    console.log(transformedData, "transformedData");
    mutate({ id: interviewId, data: transformedData });
    // Handle form submission here
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 my-14">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Candidate Details Section */}
        <FormSection
          title="Candidate Details"
          subtitle="Please Provide Candidate Details"
          icon={User}
        >
          <FormRow>
            <Input
              label="Candidate Name"
              placeholder="Enter Name"
              {...register("candidateDetails.name", {
                required: "Name is required",
              })}
              error={errors.candidateDetails?.name}
              disabled
            />
            <Input
              label="Candidate Email"
              placeholder="Enter Email"
              type="email"
              {...register("candidateDetails.email", {
                required: "Email is required",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Invalid email address",
                },
              })}
              error={errors.candidateDetails?.email}
              disabled
            />
          </FormRow>
          <FormRow>
            <Input
              label="Candidate Phone Number"
              placeholder="Enter Number"
              type="tel"
              {...register("candidateDetails.phone", {
                required: "Phone number is required",
                pattern: {
                  value: MOBILE_REGEX,
                  message: "Invalid phone number",
                },
              })}
              error={errors.candidateDetails?.phone}
              disabled
            />
            <Input
              label="Candidate Year of Experience"
              placeholder="Enter Year"
              type="text"
              {...register(
                "candidateDetails.yearsOfExperience",
                {
                  required:
                    "Years of experience is required",
                }
              )}
              error={
                errors.candidateDetails?.yearsOfExperience
              }
              disabled
            />
          </FormRow>
          <FormRow>
            <Input
              label="Role"
              placeholder="Enter Role"
              {...register("candidateDetails.role", {
                required: "Role is required",
              })}
              error={errors.candidateDetails?.role}
              disabled
            />
            <Input
              label="Current Company"
              placeholder="Enter Company"
              {...register("candidateDetails.company", {
                required: "Company is required",
              })}
              error={errors.candidateDetails?.company}
              disabled
            />
          </FormRow>
        </FormSection>

        {/* Interviewer Details Section */}
        <FormSection
          title="Interviewer Details"
          subtitle="Please Provide Interviewer Details"
          icon={Business}
        >
          <FormRow>
            <Input
              label="Interviewer Year of Experience"
              placeholder="Enter Year"
              type="text"
              {...register(
                "interviewerDetails.yearsOfExperience",
                {
                  required:
                    "Years of experience is required",
                }
              )}
              error={
                errors.interviewerDetails?.yearsOfExperience
              }
              disabled
            />
            <Input
              label="Current Company"
              placeholder="Enter Company"
              {...register("interviewerDetails.company", {
                required: "Company is required",
              })}
              error={errors.interviewerDetails?.company}
              disabled
            />
          </FormRow>
          <FormRow>
            <Input
              label="Interview Date"
              placeholder="DD/MM/YYYY"
              type="text"
              {...register(
                "interviewerDetails.interviewDate",
                {
                  required: "Interview date is required",
                }
              )}
              error={
                errors.interviewerDetails?.interviewDate
              }
              disabled
            />
          </FormRow>
        </FormSection>

        {/* Questions Asked Section */}
        <FormSection
          title="Question Asked"
          subtitle="Please Provide Asked Question"
          icon={Questions}
        >
          {skillFields.map((skillField, skillIndex) => {
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
                      {...register(
                        `skills.${skillIndex}.skillName`,
                        {
                          required:
                            "Skill name is required",
                        }
                      )}
                    />
                    {errors.skills?.[skillIndex]
                      ?.skillName && (
                      <span className="text-[#B10E0EE5] text-2xs">
                        {
                          errors.skills[skillIndex]
                            .skillName.message
                        }
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
                                    parseInt(
                                      e.target.value,
                                      10
                                    )
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
                        onClick={() =>
                          removeSkill(skillIndex)
                        }
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
                          <span className=" font-medium mr-4 text-default">
                            {questionIndex + 1}.
                          </span>
                          <input
                            className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
                            placeholder="Question"
                            {...register(
                              `skills.${skillIndex}.questions.${questionIndex}.question`,
                              {
                                required:
                                  "Question is required",
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
                        {errors.skills?.[skillIndex]
                          ?.questions?.[questionIndex]
                          ?.question && (
                          <div className="ml-[27px] mb-2 mt-1 text-[#B10E0EE5] text-2xs">
                            {
                              errors.skills[skillIndex]
                                .questions[questionIndex]
                                .question.message
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
                                required:
                                  "Answer is required",
                              }
                            )}
                          />
                          {errors.skills?.[skillIndex]
                            ?.questions?.[questionIndex]
                            ?.answer && (
                            <div className="mb-2 text-[#B10E0EE5] text-2xs mt-1">
                              {
                                errors.skills[skillIndex]
                                  .questions[questionIndex]
                                  .answer.message
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
                    {...register(
                      `skills.${skillIndex}.summary`,
                      {
                        required: "Summary is required",
                      }
                    )}
                  />
                  {errors.skills?.[skillIndex]?.summary && (
                    <span className="text-[#B10E0EE5] text-2xs">
                      {
                        errors.skills[skillIndex].summary
                          .message
                      }
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-2 text-sm bg-black hover:opacity-80 text-white font-medium rounded-lg"
              onClick={() =>
                appendSkill({
                  skillName: "",
                  score: 60,
                  questions: [{ question: "", answer: "" }],
                  summary: "",
                })
              }
            >
              Add Skill
            </button>
          </div>
        </FormSection>

        {/* Skill Evaluation Section */}
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
                {[
                  "Poor",
                  "Average",
                  "Good",
                  "Excellent",
                ].map((rating) => (
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
                      // Update the form value
                      setValue(
                        "skillEvaluation.communication",
                        rating,
                        { shouldValidate: true }
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
                {[
                  "Poor",
                  "Average",
                  "Good",
                  "Excellent",
                ].map((rating) => (
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
                      // Update the form value
                      setValue(
                        "skillEvaluation.attitude",
                        rating,
                        { shouldValidate: true }
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

        {/* Strength and Improvement Section */}
        <FormSection
          title="Strength and Improvement"
          subtitle="Please Provide the Strength and Improvement point of the Candidate"
          icon={Improvement}
        >
          <TextArea
            label="Candidate's Strength"
            placeholder="Please provide the Strength of the candidate"
            {...register("strength", {
              required: "Candidate's strength is required",
            })}
            error={errors.strength}
          />
          <TextArea
            label="Improvement Points"
            placeholder="Please provide the Improvement point of the candidate"
            {...register("improvementPoints", {
              required: "Improvement points are required",
            })}
            error={errors.improvementPoints}
          />
        </FormSection>

        {/* Overall Remark Section */}
        <FormSection
          title="Overall Remark"
          subtitle=""
          icon={Remark}
        >
          <FormRow>
            <div className="mb-6 w-full">
              <Controller
                control={control}
                name="overallRemark"
                rules={{
                  required: "Overall remark is required",
                }}
                render={({ field }) => (
                  <>
                    <Select
                      label="Overall Remark"
                      options={remarkOptions}
                      {...field}
                    />
                    {errors.overallRemark && (
                      <span className="text-[#B10E0EE5] text-2xs">
                        {errors.overallRemark.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-medium text-default">
                Overall Score
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 text-default text-[#49454F] rounded-md border border-gray-300 outline-none"
                {...register("score", {
                  required: "Score is required",
                })}
              />
            </div>
          </FormRow>

          <div className="flex justify-end mt-6 ">
            <button
              type="submit"
              className={`px-6 py-2 text-sm bg-black hover:opacity-80 text-white font-medium rounded-lg ${
                isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isPending
                ? "Submitting..."
                : "Submit Feedback"}
            </button>
          </div>
        </FormSection>
      </form>
    </div>
  );
};

export default Feedback;
