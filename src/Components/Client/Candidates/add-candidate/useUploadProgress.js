import { useCallback, useRef, useState } from "react";

export const useUploadProgress = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  const startProgress = useCallback(() => {
    setIsUploading(true);
    setUploadProgress(0);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(progressIntervalRef.current);
          return 90;
        }
        const increment = Math.max(
          1,
          (95 - prevProgress) / 10
        );
        return Math.min(90, prevProgress + increment);
      });
    }, 200);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

  return {
    isUploading,
    uploadProgress,
    startProgress,
    stopProgress,
    resetProgress,
    setUploadProgress,
  };
};
