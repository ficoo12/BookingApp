import { useNavigate } from "react-router-dom";
import { useSearchCriteria } from "../hooks/useSearchCriteria";
import { useAvailableApartments } from "../hooks/useAvailableApartments";
import SearchHero from "./search/SearchHero";
import ApartmentCard from "./search/ApartmentCard";

const FindingApartments = () => {
  const navigate = useNavigate();
  const {
    startDate,
    endDate,
    checkIn,
    checkOut,
    guests,
    setCriteria,
    query,
    isSearchActive,
  } = useSearchCriteria();

  const apartments = useAvailableApartments({
    checkIn,
    checkOut,
    guests,
    isSearchActive,
  });

  const goToMoreInfoHandler = (id) => {
    navigate(`/more-info/${id}?${query}`);
  };

  return (
    <div>
      <SearchHero
        startDate={startDate}
        endDate={endDate}
        guests={guests}
        setCriteria={setCriteria}
      />
      <div className="flex justify-center flex-wrap gap-5 mt-12">
        {apartments.length === 0 ? (
          <p className="text-center mt-30 bg-white px-10 py-10 rounded-lg shadow-md">
            Select dates to start searching
          </p>
        ) : (
          apartments.map((apartment) => (
            <ApartmentCard
              key={apartment._id}
              apartment={apartment}
              onViewDetails={() => goToMoreInfoHandler(apartment._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FindingApartments;
