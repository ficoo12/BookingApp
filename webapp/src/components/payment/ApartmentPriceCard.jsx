import { BASE_URL } from "../../utility/config";

const ApartmentPriceCard = ({ apartment, totalPrice }) => {
  return (
    <div className="max-w-96 bg-white border border-slate-300 rounded-lg px-4 py-4">
      <div className="flex items-center gap-4">
        <img
          className="w-36 h-auto rounded-lg"
          src={`${BASE_URL}/${apartment.pictures[0]}`}
        ></img>
        <div>
          <p className="text-lg font-bold">{apartment.name}</p>
          <p>{apartment.type}</p>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold mt-4">Price details</p>
        <div className="flex justify-between mt-5">
          <p>{totalPrice}$</p>
        </div>
        <div className="w-full h-0.5 bg-gray-400 rounded-lg mt-3"></div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-xl font-bold">Total</p>
          <p className="text-xl font-bold">{totalPrice}$</p>
        </div>
      </div>
    </div>
  );
};

export default ApartmentPriceCard;
