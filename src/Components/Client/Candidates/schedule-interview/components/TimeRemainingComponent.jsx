import { Clock } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const TimeRemainingComponent = ({
  time,
  onTimerComplete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    // Check if we need to show a countdown timer
    if (time) {
      const lastScheduledTime = new Date(time);
      const unlockTime = new Date(
        lastScheduledTime.getTime() + 70 * 60 * 1000
      );

      // Start countdown if we're still within the 70-minute window
      const updateCountdown = () => {
        const now = new Date();
        const diffInMs = unlockTime - now;

        if (diffInMs > 0) {
          // Convert to minutes and seconds
          const minutes = Math.floor(
            diffInMs / (1000 * 60)
          );
          const seconds = Math.floor(
            (diffInMs % (1000 * 60)) / 1000
          );
          setTimeRemaining(
            `${minutes}:${seconds
              .toString()
              .padStart(2, "0")}`
          );
          return true; // Continue the timer
        } else {
          setTimeRemaining(null);
          // Call the callback when timer completes to enable the button
          if (onTimerComplete) {
            onTimerComplete();
          }
          return false; // Stop the timer
        }
      };

      // Initial check - if no time remaining, don't set up the interval
      if (updateCountdown()) {
        const timerId = setInterval(() => {
          const shouldContinue = updateCountdown();
          if (!shouldContinue) {
            clearInterval(timerId);
          }
        }, 1000);

        return () => clearInterval(timerId);
      } else {
        // If timer is already completed on mount, call the callback
        if (onTimerComplete) {
          onTimerComplete();
        }
      }
    }
  }, [time, onTimerComplete]);

  return (
    <div className="flex items-center justify-end mt-2">
      {timeRemaining && (
        <div className="mt-2 text-xs text-[#B10E0EE5] flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Scheduling again will be available in{" "}
          {timeRemaining}
        </div>
      )}
    </div>
  );
};

TimeRemainingComponent.propTypes = {
  time: PropTypes.string,
  onTimerComplete: PropTypes.func,
};

export default TimeRemainingComponent;
