import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";

const GuestsField = ({ guests, onChange }) => {
  // Stays local: pure UI state that has no place in the URL.
  const [openGuests, setOpenGuests] = useState(false);

  const handleClickGuests = () => {
    setOpenGuests((prev) => !prev);
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClickGuests}
        className="flex space-x-2 bg-white px-2 py-4 rounded-lg text-black items-center text-xl border hover:cursor-pointer hover:border-blue-400  relative"
      >
        <UserIcon className="text-black w-8 h-auto" />
        <p>Guests: {guests}</p>
      </div>
      {openGuests && (
        <div className="space-y-3 bg-white py-4 px-4 rounded-lg text-black w-96 absolute">
          <div className="flex justify-between">
            <div>
              <label className="text-xl">Guests</label>
              <br />
              <span className="text-gray-500">Total guests</span>
            </div>
            <input
              className="bg-transparent text-black border border-black rounded-lg px-4 py-2"
              min="1"
              max="10"
              type="number"
              value={guests}
              onChange={(e) => onChange(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestsField;
