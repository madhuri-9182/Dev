import { FormItem } from "./components/FormItems";
import { SkillList, SkillTable } from "./components";
import { useCandidateData } from "./hooks/useCandidateData";
import { LoadingState } from "../../../../shared/loading-error-state";
import { useEffect, useState } from "react";
import Modal from "../../../../shared/Modal";
import InterviewFeedbackPDF from "../../../../PDF Report/InterviewFeedbackPDF";
import { useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import {
  createFileFromUrl,
  handleFileDownload,
} from "../../../../../utils/util";
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [recordingLink, setRecordingLink] = useState("");
  const [recordingLoading, setRecordingLoading] =
    useState(false);
  const [recordingError, setRecordingError] =
    useState(null);

  useEffect(() => {
    const fetchRecordingLink = async (url) => {
      try {
        setRecordingLoading(true);
        const file = await createFileFromUrl(url);
        setRecordingLink(file);
        return file;
      } catch (error) {
        console.error("Error fetching recording:", error);
        setRecordingError("Failed to load recording.");
        return null;
      } finally {
        setRecordingLoading(false);
      }
    };

    if (recording_link) {
      fetchRecordingLink(recording_link);
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
    if (!state?.data?.pdf_file) {
      console.error("PDF file URL is missing");
      return;
    }

    try {
      setIsDownloading(true);
      const file = await createFileFromUrl(
        state.data.pdf_file
      );

      if (!file) {
        throw new Error("Failed to create file from URL");
      }

      await handleFileDownload(file);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
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
            {recordingLoading ? (
              <div className="h-full flex items-center justify-center">
                <CircularProgress
                  size={40}
                  sx={{ color: "#007AFF" }}
                />
              </div>
            ) : recordingError ? (
              <div className="h-full flex items-center justify-center text-red-500">
                {recordingError}
              </div>
            ) : (
              <VideoPlayer file={recordingLink} />
            )}
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            className="w-[200px] primary-button h-9"
            onClick={() => setIsModalOpen(true)}
            disabled={!state?.data}
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
            disabled={isDownloading}
            className="primary-button flex items-center justify-center"
            onClick={handleDownload}
          >
            {isDownloading
              ? "Downloading..."
              : "Download PDF"}
            {isDownloading && (
              <CircularProgress
                size={16}
                sx={{
                  color: "white",
                  marginLeft: "5px",
                }}
              />
            )}
          </button>
        </div>
        <InterviewFeedbackPDF
          data={state?.data}
          recording_link={recordingLink}
        />
      </Modal>
    </div>
  );
};

export default CandidateFeedback;
