import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import { CalendarDateRangeIcon } from "@heroicons/react/24/solid";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangeField = ({ startDate, endDate, onChange }) => {
  // Stays local: pure UI state that has no place in the URL.
  const [openDateRange, setOpenDateRange] = useState(false);

  const dateRange = { startDate, endDate, key: "selection" };

  const handleClickDate = () => {
    setOpenDateRange((prev) => !prev);
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClickDate}
        className="flex gap-2 items-center text-black bg-white rounded-lg text-lg py-4 px-4 hover:cursor-pointer hover:border-blue-400 border relative"
      >
        <CalendarDateRangeIcon className="w-8 h-auto text-black " />
        <button>{`${format(startDate, "MMM dd, yyyy")}`}</button>
        <span>-</span>
        <button>{`${format(endDate, "MMM dd, yyyy")}`}</button>
      </div>
      {openDateRange && (
        <DateRangePicker
          className="absolute z-50"
          minDate={new Date()}
          ranges={[dateRange]}
          onChange={(ranges) => onChange(ranges.selection)}
        />
      )}
    </div>
  );
};

export default DateRangeField;
