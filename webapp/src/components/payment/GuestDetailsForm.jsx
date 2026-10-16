import { BanknotesIcon } from "@heroicons/react/24/solid";

const inputClassName =
  "h-10 border border-gray-400 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 ";

const GuestDetailsForm = ({ values, onChange, message, onSubmit }) => {
  return (
    <div className="bg-white border border-gray-400 rounded-md max-w-2xl p-5 flex flex-col gap-4 lg:w-full lg:h-fit">
      <h2 className="text-xl font-medium">Guest Details and payment method</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={values.guestName}
        onChange={(e) => onChange("guestName", e.target.value)}
        className={inputClassName}
      />
      <input
        type="email"
        placeholder="Email"
        value={values.guestEmail}
        onChange={(e) => onChange("guestEmail", e.target.value)}
        className={inputClassName}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={values.guestPhone}
        onChange={(e) => onChange("guestPhone", e.target.value)}
        className={inputClassName}
      />
      <div>
        <div className="flex gap-3 items-center">
          <BanknotesIcon className="w-5 h-auto" />
          <label>Choose payment method</label>
        </div>
        <select className="h-10 border border-gray-400 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400">
          <option>By cash</option>
        </select>
      </div>

      {message && <p className="text-green-500">{message}</p>}
      <button
        onClick={onSubmit}
        className="bg-blue-500 text-white px-6 py-4 rounded-md hover:cursor-pointer hover:bg-blue-600 text-lg"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default GuestDetailsForm;
