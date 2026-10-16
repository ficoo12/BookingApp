import LOGO from "../../assets/LOGO.svg";
import DateRangeField from "./DateRangeField";
import GuestsField from "./GuestsField";

const SearchHero = ({ startDate, endDate, guests, setCriteria }) => {
  // replace: true -> moving around the calendar doesn't create a new history entry
  const handleChange = (selection) => {
    setCriteria(selection);
  };

  const setGuestsHandler = (value) => {
    setCriteria({ guests: value });
  };

  // replace: false -> Search pushes a new history entry,
  // so "back" returns to the previous search.
  const findApartments = () => {
    setCriteria({ startDate, endDate, guests }, { replace: false });
  };

  return (
    <div className="bg-sky-600 py-10 px-5">
      <nav className="flex justify-between items-center pb-10">
        <img className="w-15 h-auto" src={LOGO}></img>
      </nav>

      <div className="container mx-auto">
        <h1 className="text-white text-5xl font-semibold md:text-7xl">
          Find your dream apartment
        </h1>
        <h2 className="text-white text-xl pt-5">
          Browse top apartments and find the perfect getaway for you!
        </h2>
        <div className="flex flex-wrap lg:flex-nowrap lg:w-full lg:space-y-0 bg-amber-500 w-fit px-4 py-5 rounded-lg space-x-2 mx-auto space-y-4 mt-10">
          <DateRangeField
            startDate={startDate}
            endDate={endDate}
            onChange={handleChange}
          />

          <GuestsField guests={guests} onChange={setGuestsHandler} />

          <button
            onClick={findApartments}
            className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer rounded-lg font-medium text-xl px-15 text-white h-fit py-4.5 w-full lg:w-fit"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
