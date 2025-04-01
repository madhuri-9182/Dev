import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCandidateFeedback } from "../../../Interviewer/api";
import {
  ErrorState,
  LoadingState,
} from "../../../shared/loading-error-state";
import { createFileFromUrl } from "../../../../utils/util";
import { useEffect, useState } from "react";
import CandidateSidebar from "../schedule-interview/components/CandidateSidebar";
import CandidateViewForm from "./CandidateViewForm";

const CandidateView = () => {
  const { state } = useLocation();
  const [resumeFile, setResumeFile] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["candidate-feedback"],
    queryFn: () => getCandidateFeedback(state.id),
  });

  useEffect(() => {
    const fetchResume = async (cv) => {
      const file = await createFileFromUrl(cv);
      return file;
    };
    if (!isLoading && Object.keys(data?.data)?.length > 0) {
      const file = fetchResume(data?.data?.candidate?.cv);
      setResumeFile(file);
    }
  }, [data, isLoading]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const formatCandidate = (candidate) => {
    return {
      years_of_experience: {
        year: candidate.year,
        month: candidate.month,
      },
      email: candidate.email,
      current_company: candidate.company,
      source: candidate.source,
      current_designation: candidate?.current_designation,
      remark: candidate.remark,
    };
  };
  return (
    <>
      <div className="w-full flex gap-x-12">
        <CandidateSidebar
          candidate={formatCandidate(data?.data?.candidate)}
          file={resumeFile}
          disabled={true}
        />

        <div className="w-3/4 p-6">
          <CandidateViewForm data={data?.data} />
        </div>
      </div>
    </>
  );
};

export default CandidateView;
