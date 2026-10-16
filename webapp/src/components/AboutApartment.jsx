import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { ChevronLeftIcon, ShareIcon } from "@heroicons/react/24/solid";
import { useSearchCriteria } from "../hooks/useSearchCriteria";
import { useApartment } from "../hooks/useApartment";
import { usePriceQuote } from "../hooks/usePriceQuote";
import ImageSlider from "./apartment/ImageSlider";
import ApartmentInfo from "./apartment/ApartmentInfo";
import StaySummary from "./apartment/StaySummary";
import BookingCard from "./apartment/BookingCard";
import DescriptionModal from "./apartment/DescriptionModal";

const AboutApartment = () => {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { startDate, endDate, checkIn, checkOut, guests, query } =
    useSearchCriteria();

  const apartment = useApartment(params.id);
  const totalPrice = usePriceQuote(apartment?.priceList_id, checkIn, checkOut);

  const formattedStartDate = format(startDate, "MMM dd, yyyy");
  const formattedEndDate = format(endDate, "MMM dd, yyyy");
  const totalNights = differenceInDays(endDate, startDate);

  const goToPaymentHandler = (id) => {
    navigate(`/payment/${id}?${query}`);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div>
      <nav className="flex justify-between px-3 py-3 bg-white">
        <Link to={`/?${query}`}>
          <ChevronLeftIcon className="w-8 h-auto"></ChevronLeftIcon>
        </Link>
        <ShareIcon className="w-8 h-auto"></ShareIcon>
      </nav>
      <div className="container mx-auto">
        {!apartment ? (
          <p className="text-center mt-30">Loading...</p>
        ) : (
          <div className="w-full text-black">
            <ImageSlider pictures={apartment.pictures} alt={apartment.name} />
            <div className="mt-10 lg:flex lg:justify-between">
              <div>
                <ApartmentInfo apartment={apartment} onShowMore={toggleModal} />
                <StaySummary
                  apartmentName={apartment.name}
                  totalNights={totalNights}
                  formattedStartDate={formattedStartDate}
                  formattedEndDate={formattedEndDate}
                  guests={guests}
                />
              </div>
              <BookingCard
                formattedStartDate={formattedStartDate}
                formattedEndDate={formattedEndDate}
                guests={guests}
                totalPrice={totalPrice}
                onReserve={() => goToPaymentHandler(apartment._id)}
              />
            </div>
            {modal && (
              <DescriptionModal
                description={apartment.desc}
                onClose={toggleModal}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutApartment;
