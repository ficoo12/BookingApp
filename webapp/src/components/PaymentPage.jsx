import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSearchCriteria } from "../hooks/useSearchCriteria";
import { useApartment } from "../hooks/useApartment";
import { usePriceQuote } from "../hooks/usePriceQuote";
import { BASE_URL } from "../utility/config";
import ApartmentPriceCard from "./payment/ApartmentPriceCard";
import TripSummary from "./payment/TripSummary";
import GuestDetailsForm from "./payment/GuestDetailsForm";

const PaymentPage = () => {
  const [guestDetails, setGuestDetails] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [message, setMessage] = useState("");

  const params = useParams();
  const navigate = useNavigate();
  const { startDate, endDate, checkIn, checkOut, guests, query } =
    useSearchCriteria();

  const apartment = useApartment(params.id);
  const totalPrice = usePriceQuote(apartment?.priceList_id, checkIn, checkOut);

  const guestDetailsChangeHandler = (field, value) => {
    setGuestDetails((prev) => ({ ...prev, [field]: value }));
  };

  const makeReservation = async () => {
    const { guestName, guestEmail, guestPhone } = guestDetails;
    if (!guestName || !guestEmail || !guestPhone) {
      setMessage("Please enter all guest details.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apartmentId: params.id,
          guestName,
          guestEmail,
          guestPhoneNumber: guestPhone,
          numberOfGuests: guests,
          startDate: checkIn,
          endDate: checkOut,
          totalPrice,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        navigate("/confirmation", {
          state: {
            apartmentName: apartment?.name,
            apartmentPhoto: apartment?.pictures?.[0],
            // The server recomputes the price; show what it charged.
            totalPrice: result.reservation.totalPrice,
            guestName,
            guestEmail,
          },
        });
      } else {
        setMessage(result.error || "Booking failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while booking.");
    }
  };

  return (
    <div className="">
      <div className="flex items-center gap-4">
        <Link to={`/more-info/${params.id}?${query}`}>
          <ChevronLeftIcon className="w-8 h-auto text-black"></ChevronLeftIcon>
        </Link>
        <h1 className="text-3xl font-bold">Confirm your reservation</h1>
      </div>
      <div className="container  mx-auto space-y-10 mt-10 lg:flex justify-between lg:mt-30">
        <div className="space-y-10">
          {!apartment ? (
            <p>Loading...</p>
          ) : (
            <ApartmentPriceCard apartment={apartment} totalPrice={totalPrice} />
          )}
          <TripSummary startDate={startDate} endDate={endDate} guests={guests} />
        </div>
        <GuestDetailsForm
          values={guestDetails}
          onChange={guestDetailsChangeHandler}
          message={message}
          onSubmit={makeReservation}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
