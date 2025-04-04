import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import BasicDatePicker from "../../../../../utils/BasicDatePicker";
import { createHourlySlots } from "../utils/hourlySlots";

/**
 * Component for selecting date and time slots
 */

const hourlySlots = createHourlySlots();
function TimeSlotSelector({
  selectedDate,
  setSelectedDate,
  availableHourlySlots,
  selectedTimeSlot,
  handleTimeSlotSelect,
  isLoading,
  isError,
}) {
  return (
    <>
      {/* Date Picker */}

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

      {/* Time Slots */}
      <div className="mt-14">
        {isLoading ? (
          <p className="text-default text-[#6B6F7B] flex items-center gap-3">
            Loading availability{" "}
            <Loader2 className="animate-spin" />
          </p>
        ) : isError ? (
          <div className="flex flex-wrap justify-start items-center gap-4">
            {hourlySlots.map((slot, index) => (
              <div
                key={index}
                className={`flex items-center justify-center py-1 px-3 h-8 rounded-[4px] text-xs w-16 bg-[#C7C7C7] text-[#6B6F7B] cursor-not-allowed`}
              >
                {slot.time}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-start items-center gap-4">
            {availableHourlySlots.map((slot, index) => (
              <div
                key={index}
                className={`flex items-center justify-center py-1 px-3 h-8 rounded-[4px] text-xs w-16 ${
                  slot.available
                    ? selectedTimeSlot === slot.time
                      ? "border border-black bg-[#59B568] text-white cursor-pointer"
                      : "bg-[#59B568] text-white cursor-pointer hover:bg-[#4da75c]"
                    : "bg-[#C7C7C7] text-[#6B6F7B] cursor-not-allowed"
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
  selectedDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.object,
  ]),
  setSelectedDate: PropTypes.func,
  availableHourlySlots: PropTypes.array,
  selectedTimeSlot: PropTypes.string,
  handleTimeSlotSelect: PropTypes.func,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};
