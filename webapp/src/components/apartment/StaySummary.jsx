import { UserIcon } from "@heroicons/react/24/solid";

const StaySummary = ({
  apartmentName,
  totalNights,
  formattedStartDate,
  formattedEndDate,
  guests,
}) => {
  return (
    <div>
      <h4 className="text-2xl font-bold mt-5">
        {totalNights} {totalNights === 1 ? "night" : "nights"} in{" "}
        {apartmentName}
      </h4>
      <p className="text-slate-600">
        {formattedStartDate} - {formattedEndDate}
      </p>
      <div className="flex align-middle">
        <UserIcon className="w-8 h-auto"></UserIcon>
        <p className="text-slate-600">{guests}</p>
      </div>
    </div>
  );
};

export default StaySummary;
