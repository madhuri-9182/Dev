import PropTypes from "prop-types";

const UploadProgress = ({ isUploading, progress = 0 }) => {
  if (!isUploading && progress === 0) return null;

  return (
    <div className="w-full mt-11 flex items-center justify-center flex-col">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl font-medium text-black">
          {progress === 100 ? "" : "Uploading File"}
        </span>
      </div>
      <div className="w-full h-[10px] bg-[#D9D9D9] rounded-md overflow-hidden">
        <div
          className="h-full bg-[#056DDC] rounded-md transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;

UploadProgress.propTypes = {
  isUploading: PropTypes.bool,
  progress: PropTypes.number,
};
