import { FormItem } from "./components/FormItems";
import { SkillList, SkillTable } from "./components";
import { useCandidateData } from "./hooks/useCandidateData";
import { LoadingState } from "../../../../shared/loading-error-state";

const CandidateFeedback = () => {
  const {
    loading,
    error,
    formItems,
    skillsCount,
    skillsData,
  } = useCandidateData();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="px-3 w-full pt-6">
      <FormItem formItems={formItems} />
      <div className="mt-12">
        <div className="w-[50%] min-w-[450px] ml-6">
          <div className="w-full max-h-[200px] overflow-y-auto">
            <p className="text-md text-[#6B6F7B] font-semibold mb-8">
              Skills & Values ({skillsCount})
            </p>
            <SkillList skills={skillsData} />
          </div>
          <div className="mt-7">
            <SkillTable skills={skillsData} />
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            className="w-[200px] bg-[#007AFF] text-white rounded-full h-[36px] text-xs font-medium text-center"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateFeedback;
