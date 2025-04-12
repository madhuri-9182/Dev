import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  createFileFromUrl,
  getJobLabel,
  getSpecialization,
  isValidUrl,
} from "../../../utils/util";
import { Eye } from "iconsax-react";

// Function to render guideline text with clickable links
const renderGuideline = (text) => {
  if (isValidUrl(text)) {
    // Ensure the URL has http/https prefix
    const url = text.startsWith("http")
      ? text
      : `https://${text}`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {text}
      </a>
    );
  }
  return text;
};

const JobViewModal = ({ job, open, onClose }) => {
  const handleViewDescription = async () => {
    // Check if job description file exists
    if (job?.job_description_file) {
      const file = await createFileFromUrl(
        job.job_description_file
      );
      // handleFileDownload(file);
      const blobUrl = URL.createObjectURL(file);
      window.open(blobUrl, "_blank");

      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle className="flex justify-between items-center">
        <div className="text-base font-semibold text-[#333B69]">
          {getJobLabel(job?.name)} (
          {getSpecialization(job?.specialization)})
        </div>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-6">
          {/* Job Role & Specialization */}
          <div className="grid grid-cols-2 gap-4">
            <JobDetails
              title="Job Role"
              description={getJobLabel(job?.name)}
            />
            <JobDetails
              title="Specialization"
              description={getSpecialization(
                job?.specialization
              )}
            />
          </div>

          {/* Total Positions & Interview Time */}
          <div className="grid grid-cols-2 gap-4">
            <JobDetails
              title="Total Positions"
              description={job?.total_positions || "N/A"}
            />
            <JobDetails
              title="Interview Time"
              description={job?.interview_time || "N/A"}
            />
          </div>

          {/* Job Description */}
          <div>
            <div className="flex flex-col gap-y-1">
              <h3 className="text-xs font-semibold text-[#49454F]">
                Job Description
              </h3>
              {job?.job_description_file && (
                <button
                  onClick={handleViewDescription}
                  className="flex items-center justify-start gap-1 text-[#007aff] hover:text-[#005bbb] text-default font-medium w-fit"
                >
                  <Eye size={16} /> Click to View
                </button>
              )}
            </div>
            {!job?.job_description_file && (
              <p className="text-default text-[#49454F]">
                No job description available
              </p>
            )}
          </div>

          {/* Mandatory Skills */}
          <div>
            <h3 className="text-xs font-semibold text-[#49454F] mb-2">
              Essential Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job?.mandatory_skills?.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#E5ECF6] text-[#49454F] rounded-full text-default"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Interview Guidelines */}
          <div>
            <h3 className="text-xs font-semibold text-[#49454F] mb-2">
              Interview Guidelines
            </h3>
            <div className="border rounded-lg overflow-hidden">
              {job?.other_details?.map((section, index) => (
                <div
                  key={index}
                  className={`p-4 ${
                    index % 2 === 0
                      ? "bg-[#f8f7f7]"
                      : "bg-white"
                  }`}
                >
                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-gray-600">
                        Time:
                      </span>
                      <span className="text-default">
                        {section.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-gray-600">
                        Details:
                      </span>
                      <span className="text-default">
                        {section.details}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">
                      Guidelines:
                    </span>
                    <ul className="list-disc pl-5 mt-1 text-default">
                      {section.guidelines
                        .split("\n")
                        .map((line, i) => (
                          <li key={i}>
                            {renderGuideline(line)}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

JobViewModal.propTypes = {
  job: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default JobViewModal;

const JobDetails = ({ title, description }) => (
  <div className="text-[#49454F]">
    <h3 className="text-xs font-semibold">{title}</h3>
    <p className="text-sm">{description}</p>
  </div>
);

JobDetails.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};
