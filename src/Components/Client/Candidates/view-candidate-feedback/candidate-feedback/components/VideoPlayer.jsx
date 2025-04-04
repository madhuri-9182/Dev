import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const VideoPlayer = ({ file }) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file) {
      try {
        // Create a URL for the file object
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setIsLoading(false);

        // Clean up the URL when component unmounts
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Error creating video URL:", err);
        setError("Failed to load video");
        setIsLoading(false);
      }
    }
  }, [file]);

  return (
    <div className="w-full rounded-lg flex items-center justify-center">
      {isLoading ? (
        <div className="animate-spin rounded-full mt-8 h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : videoUrl ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain border-2 border-[#49454f] rounded-lg"
          controls
          autoPlay={false}
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <p className="text-gray-500">
          No video file selected
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;

VideoPlayer.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File),
  ]),
};
