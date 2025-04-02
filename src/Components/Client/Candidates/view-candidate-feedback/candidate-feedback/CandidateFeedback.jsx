import { FormItem } from "./components/FormItems";
import { SkillList, SkillTable } from "./components";
import { useCandidateData } from "./hooks/useCandidateData";
import { LoadingState } from "../../../../shared/loading-error-state";
import { useEffect, useState } from "react";
import Modal from "../../../../shared/Modal";
import InterviewFeedbackPDF from "../../../../PDF Report/InterviewFeedbackPDF";
import { useLocation } from "react-router-dom";
import axios from "../../../../../api/axios";
import { CircularProgress } from "@mui/material";
import { createFileFromUrl } from "../../../../../utils/util";
import VideoPlayer from "./components/VideoPlayer";

const CandidateFeedback = () => {
  const {
    loading,
    error,
    formItems,
    skillsCount,
    skillsData,
    recording_link,
  } = useCandidateData();

  const location = useLocation();
  const { state } = location;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingLink, setRecordingLink] = useState("");

  useEffect(() => {
    const fetchRecordingLink = async (url) => {
      const file = await createFileFromUrl(url);
      return file;
    };
    if (recording_link) {
      fetchRecordingLink(recording_link).then((file) => {
        setRecordingLink(file);
      });
    }
  }, [recording_link]);

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

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/generate-pdf",
        state.data,
        {
          responseType: "blob", // Important to receive binary data
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "generated.pdf"; // Set the download file name
      link.click();

      // Clean up the URL object after download
      URL.revokeObjectURL(link.href);
      setIsLoading(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="px-3 w-full pt-6">
      <FormItem formItems={formItems} />
      <div className="mt-12">
        <div className="w-full flex gap-x-8">
          <div className="w-[50%] min-w-[450px] ml-6">
            <div className="w-full max-h-[200px] overflow-y-auto scroll-hidden scroll-container">
              <div className="w-[97%]">
                <p className="text-md text-[#6B6F7B] font-semibold mb-8">
                  Skills & Values ({skillsCount})
                </p>
                <SkillList skills={skillsData} />
              </div>
            </div>
            <div className="mt-7">
              <SkillTable skills={skillsData} />
            </div>
          </div>
          <div className="w-[50%] min-w-[400px] max-w-[530px] h-[300px]">
            <VideoPlayer file={recordingLink} />
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            className="w-[200px] bg-[#007AFF] text-white rounded-full h-[36px] text-xs font-medium text-center"
            onClick={() => setIsModalOpen(true)}
          >
            Download Report
          </button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Feedback Report"
        className="min-w-fit top-auto left-auto"
      >
        <div className="flex flex-row-reverse">
          <button
            disabled={isLoading}
            className="primary-button flex items-center"
            onClick={handleDownload}
          >
            Download PDF
            {isLoading && (
              <CircularProgress
                size={16}
                sx={{
                  color: "white", // Change this to any color you want
                  marginLeft: "5px",
                }}
              />
            )}
          </button>
        </div>
        <InterviewFeedbackPDF
          data={state.data}
          recording_link={recordingLink}
        />
      </Modal>
    </div>
  );
};

export default CandidateFeedback;
