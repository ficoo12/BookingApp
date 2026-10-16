import { BASE_URL } from "../../utility/config";
import Carousel from "../Carousel";

const ApartmentCard = ({ apartment, onViewDetails }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md w-fit text-black bg-white ">
      <div className="max-w-96 h-auto object-cover object-center rounded-lg">
        <Carousel autoSlide={true}>
          {apartment.pictures.map((picture) => (
            <img
              key={picture}
              className="rounded-lg"
              src={`${BASE_URL}/${picture}`}
            ></img>
          ))}
        </Carousel>
      </div>

      <h4 className="text-3xl font-semibold mt-4">{apartment.name}</h4>
      <p className="text-gray-500">Max guests: {apartment.guests}</p>
      <button
        onClick={onViewDetails}
        className="text-white bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 text-xl"
      >
        View details
      </button>
    </div>
  );
};

export default ApartmentCard;
