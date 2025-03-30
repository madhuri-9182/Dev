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
        <p className="text-gray-500">Loading video...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : videoUrl ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
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
  file: PropTypes.object,
};
