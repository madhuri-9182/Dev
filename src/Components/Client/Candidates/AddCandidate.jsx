import { useState, useRef, useCallback } from "react";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import {
  CANDIDATE_SOURCE,
  SPECIALIZATIONS,
} from "../../Constants/constants";
import { useMutation } from "@tanstack/react-query";
import { parseResume } from "./api";
import UploadProgress from "./UploadProgress";
import toast from "react-hot-toast";
import {
  ResumeTable,
  UploadButton,
} from "./AddCandidateComponents";
import { FilterGroup } from "./components/FilterGroup";
import { useUploadProgress } from "./useUploadProgress";

// Main component
function ClientAddCandidate() {
  const { data: roles } = useAllJobs();

  const uploadCVRef = useRef(null);
  const uploadBulkCVRef = useRef(null);

  const [filesMap, setFilesMap] = useState(new Map());
  const [selectedRole, setSelectedRole] = useState("");
  const [
    selectedSpecialization,
    setSelectedSpecialization,
  ] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [resumeTableData, setResumeTableData] = useState(
    []
  ); // Store table data
  const [editingRowId, setEditingRowId] = useState(null); // Track editing row

  const {
    isUploading,
    uploadProgress,
    startProgress,
    stopProgress,
    resetProgress,
    setUploadProgress,
  } = useUploadProgress();

  const { mutate } = useMutation({
    mutationFn: (formdata) =>
      parseResume(formdata, setUploadProgress),
    onMutate: startProgress,
    onSuccess: (data) => {
      stopProgress();
      setUploadProgress(100);
      const dataWithId = data.data.map((row, index) => ({
        ...row,
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
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

  const handleFileUpload = useCallback(
    (files) => {
      const formdata = new FormData();
      const filesArray = Array.isArray(files)
        ? files
        : [files];

      filesArray.forEach((file) =>
        formdata.append("resume", file)
      );

      // Store files in a map for later association with parsed data
      const newFilesMap = new Map();
      filesArray.forEach((file, index) =>
        newFilesMap.set(index, file)
      );
      setFilesMap(newFilesMap);

      mutate(formdata);
    },
    [mutate]
  );

  const isUploadButtonDisabled =
    !selectedRole ||
    !selectedSpecialization ||
    !selectedSource;

  return (
    <div>
      <div className="pl-3 space-y-2">
        <div className="flex flex-col space-y-2">
          <FilterGroup
            label="Role"
            options={roles}
            selectedOption={selectedRole}
            onSelect={setSelectedRole}
          />
          <FilterGroup
            label="Function"
            options={SPECIALIZATIONS}
            selectedOption={selectedSpecialization}
            onSelect={setSelectedSpecialization}
          />
          <FilterGroup
            label="Source"
            options={CANDIDATE_SOURCE}
            selectedOption={selectedSource}
            onSelect={setSelectedSource}
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
          onClick={() => uploadCVRef.current?.click()}
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
          onClick={() => uploadBulkCVRef.current?.click()}
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
          selectedSource={selectedSource}
          selectedRole={selectedRole}
          selectedSpecialization={selectedSpecialization}
        />
      )}
    </div>
  );
}

export default ClientAddCandidate;
