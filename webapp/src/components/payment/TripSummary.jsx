import { format } from "date-fns";
import { UserIcon } from "@heroicons/react/24/solid";

const TripSummary = ({ startDate, endDate, guests }) => {
  return (
    <div className="max-w-96 flex flex-col gap-2">
      <h2 className="text-3xl font-semibold">Your trip</h2>
      <div className="flex justify-between">
        <p className="text-xl font-medium">Dates</p>
        <div>
          <p>
            {format(startDate, "dd.MM.yyyy.")} -{" "}
            {format(endDate, "dd.MM.yyyy.")}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-xl font-medium">Guests</p>
        <div className="flex items-center gap-2">
          <p>{guests}</p>
          <UserIcon className="w-6"></UserIcon>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
