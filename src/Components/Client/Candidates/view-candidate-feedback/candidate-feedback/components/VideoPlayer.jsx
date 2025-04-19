import { useRef, useState } from "react";
import PropTypes from "prop-types";

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const processVideoUrl = (url) => {
    if (url && url.includes("?X-Amz-Algorithm")) {
      // It's an S3 pre-signed URL - use it directly
      return url;
    } else if (url) {
      // Add localhost:8000 prefix for non-S3 URLs
      return `http://localhost:8000${
        url.startsWith("/") ? "" : "/"
      }${url}`;
    }
    return null;
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full rounded-lg flex items-center justify-center relative">
      {!url ? (
        <p className="text-red-500 text-xs mt-10">
          No video available for this candidate.
        </p>
      ) : (
        <>
          {isLoading && (
            <div className="mt-10 flex items-center justify-center z-10 bg-gray-100 bg-opacity-50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <video
            ref={videoRef}
            className={`w-full h-full object-contain border-2 border-[#49454f] rounded-lg ${
              isLoading ? "hidden" : ""
            }`}
            controls
            autoPlay={false}
            src={url ? processVideoUrl(url) : ""}
            onError={(e) => {
              console.error("Video playback error:", e);
              videoRef.current.src = ""; // Clear the source on error
            }}
            preload="metadata"
            onLoadedData={handleLoadedData}
          >
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;

VideoPlayer.propTypes = {
  url: PropTypes.string,
};
