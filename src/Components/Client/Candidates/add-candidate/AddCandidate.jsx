import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import useAllJobs from "../../../../hooks/useFetchAllJobs";
import {
  CANDIDATE_SOURCE,
  SPECIALIZATIONS,
} from "../../../Constants/constants";
import { useMutation } from "@tanstack/react-query";
import { parseResume } from "../api";
import UploadProgress from "./UploadProgress";
import toast from "react-hot-toast";
import {
  ResumeTable,
  UploadButton,
} from "./AddCandidateComponents";
import { FilterGroup } from "../components/FilterGroup";
import { useUploadProgress } from "./useUploadProgress";
import { useLocation } from "react-router-dom";

function ClientAddCandidate() {
  // Get location to access route state
  const location = useLocation();
  const selectedJob = location.state?.selectedJob;
  const { data: roles } = useAllJobs();
  const {
    isUploading,
    uploadProgress,
    startProgress,
    stopProgress,
    resetProgress,
    setUploadProgress,
  } = useUploadProgress();

  // Refs
  const uploadCVRef = useRef(null);
  const uploadBulkCVRef = useRef(null);

  // State
  const [filesMap, setFilesMap] = useState(new Map());
  const [filters, setFilters] = useState({
    role: selectedJob?.id || "", // Prefill with selected job id if available
    specialization: "",
    source: "",
  });
  const [resumeTableData, setResumeTableData] = useState(
    []
  );
  const [editingRowId, setEditingRowId] = useState(null);

  useEffect(() => {
    if (selectedJob?.id) {
      setFilters((prev) => ({
        ...prev,
        role: selectedJob.id,
      }));
    }
  }, [selectedJob]);

  // Derived state
  const isUploadButtonDisabled =
    !filters.role ||
    !filters.specialization ||
    !filters.source;

  // Filter handlers

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const { mutate: parseResumeMutation } = useMutation({
    mutationFn: (formdata) =>
      parseResume(formdata, setUploadProgress),
    onMutate: startProgress,
    onSuccess: (data) => {
      stopProgress();
      setUploadProgress(100);
      const dataWithId = data.data.map((row, index) => ({
        ...row,
        id: generateUniqueId(),
        file: filesMap.get(index),
      }));
      setResumeTableData(dataWithId);
      setTimeout(resetProgress, 0);
    },
    onError: (error) => {
      stopProgress();
      resetProgress();
      toast.error("Error parsing resume", {
        position: "top-right",
      });
      console.error("Error parsing resume", error);
    },
    onSettled: stopProgress,
  });

  // Helper functions

  const generateUniqueId = () =>
    `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

  const createFilesMap = (filesArray) => {
    const newFilesMap = new Map();
    filesArray.forEach((file, index) =>
      newFilesMap.set(index, file)
    );
    return newFilesMap;
  };

  // File upload handlers

  const handleFileUpload = useCallback(
    (files) => {
      const formdata = new FormData();
      const filesArray = Array.isArray(files)
        ? files
        : [files];

      filesArray.forEach((file) =>
        formdata.append("resume", file)
      );

      const newFilesMap = createFilesMap(filesArray);
      setFilesMap(newFilesMap);

      parseResumeMutation(formdata);
    },
    [parseResumeMutation]
  );

  const handleSingleFileUpload = () =>
    uploadCVRef.current?.click();
  const handleBulkFileUpload = () =>
    uploadBulkCVRef.current?.click();

  return (
    <div>
      <div className="pl-3 space-y-2">
        <div className="flex flex-col space-y-2">
          <FilterGroup
            label="Role"
            options={roles}
            selectedOption={filters.role}
            onSelect={(value) =>
              handleFilterChange("role", value)
            }
          />
          <FilterGroup
            label="Function"
            options={SPECIALIZATIONS}
            selectedOption={filters.specialization}
            onSelect={(value) =>
              handleFilterChange("specialization", value)
            }
          />
          <FilterGroup
            label="Source"
            options={CANDIDATE_SOURCE}
            selectedOption={filters.source}
            onSelect={(value) =>
              handleFilterChange("source", value)
            }
          />
        </div>
      </div>

      <div className="w-full flex mt-6 gap-32">
        <input
          type="file"
          ref={uploadCVRef}
          className="hidden"
          accept=".pdf"
          onChange={(e) =>
            handleFileUpload(e.target.files[0])
          }
        />
        <UploadButton
          label="Upload CV"
          onClick={handleSingleFileUpload}
          disabled={isUploadButtonDisabled}
        />
        <input
          type="file"
          ref={uploadBulkCVRef}
          className="hidden"
          accept=".pdf"
          multiple={true}
          onChange={(e) =>
            handleFileUpload(Array.from(e.target.files))
          }
        />
        <UploadButton
          label="Bulk Upload CV"
          onClick={handleBulkFileUpload}
          disabled={isUploadButtonDisabled}
        />
      </div>

      <UploadProgress
        isUploading={isUploading}
        progress={uploadProgress}
      />

      {resumeTableData?.length > 0 && (
        <ResumeTable
          data={resumeTableData}
          setData={setResumeTableData}
          editingRowId={editingRowId}
          setEditingRowId={setEditingRowId}
          selectedSource={filters.source}
          selectedRole={filters.role}
          selectedSpecialization={filters.specialization}
        />
      )}
    </div>
  );
}

export default ClientAddCandidate;
