import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCandidateFeedback } from "../../../Interviewer/api";
import {
  ErrorState,
  LoadingState,
} from "../../../shared/loading-error-state";
import {
  createFileFromUrl,
  getErrorMessage,
} from "../../../../utils/util";
import { useEffect, useState } from "react";
import CandidateSidebar from "../schedule-interview/components/CandidateSidebar";
import CandidateViewForm from "./CandidateViewForm";

const CandidateView = () => {
  const { state } = useLocation();
  const [resumeFile, setResumeFile] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["candidate-feedback", state.id],
    queryFn: () => getCandidateFeedback(state.id),
  });

  useEffect(() => {
    const fetchResume = async (cv) => {
      if (
        !cv ||
        typeof cv !== "string" ||
        cv.trim() === ""
      ) {
        return null;
      }
      const file = await createFileFromUrl(cv);
      return file;
    };
    if (!data) {
      return;
    }
    if (!isLoading && Object.keys(data?.data)?.length > 0) {
      fetchResume(data?.data?.candidate?.cv)
        .then((file) => {
          setResumeFile(file);
        })
        .catch((error) => {
          console.error("Error fetching resume:", error);
        });
    }
  }, [data, isLoading]);

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

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
