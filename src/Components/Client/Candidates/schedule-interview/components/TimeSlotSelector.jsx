import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import BasicDatePicker from "../../../../../utils/BasicDatePicker";

/**
 * Component for selecting date and time slots
 */
function TimeSlotSelector({
  selectedDate,
  setSelectedDate,
  availableHourlySlots,
  selectedTimeSlot,
  handleTimeSlotSelect,
  isLoading,
  isError,
  error,
}) {
  return (
    <>
      {/* Date Picker */}
      <div className="mt-24">
        <div className="px-4 py-2 w-[328px] h-[100px] bg-[#ECE6F0] rounded-xl">
          <div>
            <span className="text-xs text-[#49454F]">
              Select Date
            </span>
          </div>
          <BasicDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </div>

      {/* Time Slots */}
      <div className="mt-8">
        <h3 className="font-medium text-sm mb-3 text-[#49454F]">
          Select Time Slot
        </h3>

        {isLoading ? (
          <p className="text-default text-[#6B6F7B] flex items-center gap-3">
            Loading availability{" "}
            <Loader2 className="animate-spin" />
          </p>
        ) : isError ? (
          <p className="text-default text-[#6B6F7B]">
            {error?.response?.data?.message ||
              "Could not load availability data"}
          </p>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {availableHourlySlots.map((slot, index) => (
              <div
                key={index}
                className={`text-center py-1 px-3 rounded-lg text-xs max-w-max ${
                  slot.available
                    ? selectedTimeSlot === slot.time
                      ? "bg-[#3D884A] text-white cursor-pointer"
                      : "bg-[#59B568] text-white cursor-pointer hover:bg-[#4da75c]"
                    : "bg-[#C7C7C7] text-[#6B6F7B]"
                }`}
                onClick={() => {
                  if (slot.available) {
                    handleTimeSlotSelect(slot);
                  }
                }}
              >
                {slot.time}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TimeSlotSelector;

TimeSlotSelector.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  setSelectedDate: PropTypes.func,
  availableHourlySlots: PropTypes.array,
  selectedTimeSlot: PropTypes.string,
  handleTimeSlotSelect: PropTypes.func,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  error: PropTypes.object,
};
