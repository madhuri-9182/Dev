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
import { LightTooltip } from "../../../../shared/LightTooltip";
import { FiDownload, FiExternalLink } from "react-icons/fi";

const CandidateFeedback = () => {
  const {
    loading,
    error,
    formItems,
    skillsCount,
    skillsData,
    recording_link,
    attachment,
    link,
  } = useCandidateData();

  const location = useLocation();
  const { state } = location;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [
    isAttachmentDownloading,
    setIsAttachmentDownloading,
  ] = useState(false);
  const [attachmentFile, setAttachmentFile] =
    useState(null);
  const [attachmentError, setAttachmentError] =
    useState(null);

  useEffect(() => {
    const fetchAttachment = async (url) => {
      try {
        const file = await createFileFromUrl(url);
        setAttachmentFile(file);
      } catch (error) {
        console.error("Error fetching attachment:", error);
        setAttachmentError("Failed to load attachment.");
      }
    };

    if (attachment) {
      fetchAttachment(attachment);
    }
  }, [attachment]);

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

  const handleAttachmentDownload = async () => {
    if (!attachment) {
      console.error("Attachment URL is missing");
      return;
    }

    try {
      setIsAttachmentDownloading(true);

      if (attachmentFile) {
        await handleFileDownload(attachmentFile);
      } else {
        const file = await createFileFromUrl(attachment);
        if (!file) {
          throw new Error("Failed to create file from URL");
        }
        await handleFileDownload(file);
      }
    } catch (error) {
      console.error("Error downloading attachment:", error);
    } finally {
      setIsAttachmentDownloading(false);
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
          <div className="w-[50%] min-w-[400px] max-w-[530px]">
            <div className="w-full h-[300px]">
              <VideoPlayer url={recording_link} />
            </div>
            {/* Additional Resources Section */}
            {(attachment || link) && (
              <div className="mt-6 mx-6 px-4 py-3 border border-gray-200 rounded-lg">
                <h3 className="text-md text-[#6B6F7B] font-semibold mb-4">
                  Additional Resources
                </h3>
                <div className="space-y-3">
                  {attachment && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="mb-3 sm:mb-0">
                        <p className="font-medium text-default text-gray-800">
                          {attachmentFile
                            ? attachmentFile.name
                                ?.split("/")
                                .pop()
                                .split("?")[0]
                            : "Document"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Attached Document
                        </p>
                      </div>
                      <button
                        onClick={handleAttachmentDownload}
                        disabled={
                          isAttachmentDownloading ||
                          attachmentError
                        }
                        className={`px-4 py-2 rounded-md text-xs flex items-center ${
                          attachmentError
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        }`}
                      >
                        {isAttachmentDownloading
                          ? "Downloading..."
                          : "Download"}
                        <FiDownload className="ml-2" />
                      </button>
                    </div>
                  )}
                  {link && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="mb-3 sm:mb-0">
                        <p
                          className="font-medium text-gray-800 truncate max-w-xs text-default"
                          title={link}
                        >
                          {link.length > 40
                            ? `${link.substring(0, 40)}...`
                            : link}
                        </p>
                        <p className="text-xs text-gray-500">
                          Attached Link
                        </p>
                      </div>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs text-center transition-colors flex items-center"
                      >
                        Open Link
                        <FiExternalLink className="ml-2" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
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
        <div className="flex flex-row-reverse px-4">
          {!state?.data?.pdf_file ? (
            <LightTooltip
              title="PDF will be available shortly"
              placement="bottom"
              color="#056DDC"
              className="cursor-not-allowed"
              PopperProps={{
                sx: {
                  zIndex: 99999, // Ensure the tooltip is above other elements
                },
              }}
            >
              <span>
                {" "}
                <button
                  disabled={true} // Add disabled prop
                  className="primary-button flex items-center justify-center opacity-70" // Add opacity to indicate disabled state
                  type="button"
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
              </span>
            </LightTooltip>
          ) : (
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
          )}
        </div>
        <InterviewFeedbackPDF
          data={state?.data}
          recording_link={recording_link}
        />
      </Modal>
    </div>
  );
};

export default CandidateFeedback;
