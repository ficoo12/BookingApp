import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import { CalendarDateRangeIcon, UserIcon } from "@heroicons/react/24/solid";
import LOGO from "../assets/LOGO.svg";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Carousel from "./carousel";
const FindingApartments = () => {
  const navigate = useNavigate();
  const [openDateRange, setOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [guests, setGuests] = useState(1);
  const [apartments, setApartments] = useState([]);
  const [openGuests, setOpenGuests] = useState(false);

  const handleClickGuests = () => {
    setOpenGuests((prev) => !prev);
  };

  const handleChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  const handleClickDate = () => {
    setOpenDateRange((prev) => !prev);
  };

  const setGuestsHandler = (e) => {
    setGuests(Number(e.target.value));
  };

  const goToMoreInfoHandler = (id) => {
    navigate(`/more-info/${id}`, { state: { dateRange, guests } });
  };

  const findApartments = async () => {
    const startDate = dateRange.startDate.toISOString();
    const endDate = dateRange.endDate.toISOString();

    try {
      const response = await fetch(
        `http://localhost:8080/api/apartments/available?startDate=${startDate}&endDate=${endDate}&guests=${guests}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch apartments");
      }

      const data = await response.json();
      setApartments(data);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  return (
    <div>
      <div className="bg-sky-600 py-10 px-5">
        <nav className="flex justify-between items-center pb-10">
          <img className="w-15 h-auto" src={LOGO}></img>
          <a className="bg-amber-500 text-slate-800 font-bold rounded-sm px-5 py-3 text-lg hover:bg-amber-600 hover:cursor-pointer">
            Contact us
          </a>
        </nav>

        <div className="container mx-auto">
          <h1 className="text-white text-5xl font-semibold md:text-7xl">
            Pronađite svoj apartman iz snova
          </h1>
          <h2 className="text-white text-xl pt-5">
            Pregledajte vrhunske apartmane i pronađite savršen odmor za sebe!
          </h2>
          <div className="flex flex-wrap lg:flex-nowrap lg:w-full lg:space-y-0 bg-amber-500 w-fit px-4 py-5 rounded-lg space-x-2 mx-auto space-y-4 mt-10">
            <div className="w-full">
              <div
                onClick={handleClickDate}
                className="flex gap-2 items-center text-black bg-white rounded-lg text-lg py-4 px-4 hover:cursor-pointer hover:border-blue-400 border relative"
              >
                <CalendarDateRangeIcon className="w-8 h-auto text-black " />
                <button>{`${format(
                  dateRange.startDate,
                  "MMM dd, yyyy"
                )}`}</button>
                <span>-</span>
                <button>{`${format(
                  dateRange.endDate,
                  "MMM dd, yyyy"
                )}`}</button>
              </div>
              {openDateRange && (
                <DateRangePicker
                  className="absolute z-50"
                  minDate={new Date()}
                  ranges={[dateRange]}
                  onChange={handleChange}
                />
              )}
            </div>

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
                      onChange={setGuestsHandler}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={findApartments}
              className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer rounded-lg font-medium text-xl px-15 text-white h-fit py-4.5 w-full lg:w-fit"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-wrap gap-5 mt-12">
        {apartments.length === 0 ? (
          <p className="text-center mt-30 bg-white px-10 py-10 rounded-lg shadow-md">
            Odaberite datume kako bi započeli pretraživanje
          </p>
        ) : (
          apartments.map((apartment) => (
            <div
              key={apartment._id}
              className="border p-4 rounded-lg shadow-md w-fit text-black bg-white "
            >
              <div className="max-w-96 h-auto object-cover object-center rounded-lg">
                <Carousel autoSlide={true}>
                  {[
                    ...apartment.pictures.map((picture) => (
                      <img
                        className="rounded-lg"
                        src={`http://localhost:8080/${picture}`}
                      ></img>
                    )),
                  ]}
                </Carousel>
              </div>

              <h4 className="text-3xl font-semibold mt-4">{apartment.name}</h4>
              <p className="text-gray-500">
                Maks broj gostiju: {apartment.guests}
              </p>
              <p className="text-gray-500 mb-5">
                Price: ${apartment.price} per night
              </p>
              <button
                onClick={() => goToMoreInfoHandler(apartment._id)}
                className="text-white bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 text-xl"
              >
                Pogledaj detalje
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindingApartments;
