import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeftIcon,
  UserIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSearchCriteria } from "../hooks/useSearchCriteria";

const PaymentPage = () => {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [message, setMessage] = useState("");
  const [apartmentData, setApartmentData] = useState([]);
  const [totalPrice, setTotalPrice] = useState();

  const params = useParams();
  const navigate = useNavigate();
  const { startDate, endDate, guests, query } = useSearchCriteria();

  useEffect(() => {
    const fetchApartmentData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/apartments/${params.id}`
      );
      const apartmentData = await response.json();
      setApartmentData(apartmentData);
    };
    fetchApartmentData();
  }, [params.id]);

  useEffect(() => {
    if (!apartmentData[0]?.priceList_id) {
      return;
    }
    const getTheTotalPrice = async () => {
      const response = await fetch(
        `http://localhost:8080/api/priceList/${apartmentData[0]?.priceList_id}/quote`,
        {
          method: "POST",
          body: JSON.stringify({ startDate, endDate }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const totalPriceResponse = await response.json();
        setTotalPrice(totalPriceResponse.totalPrice);
      } else {
        console.error(response.body);
      }
    };

    getTheTotalPrice();
  }, [apartmentData[0]?.priceList_id, startDate, endDate]);

  const makeReservation = async () => {
    if (!guestName || !guestEmail || !guestPhone) {
      setMessage("Please enter all guest details.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/reservations`, {
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
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalPrice,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        navigate("/confirmation", {
          state: {
            apartmentName: apartmentData[0]?.name,
            apartmentPhoto: apartmentData[0]?.pictures?.[0],
            totalPrice,
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
        <h1 className="text-3xl font-bold">Potvrdite svoju rezervaciju</h1>
      </div>
      <div className="container  mx-auto space-y-10 mt-10 lg:flex justify-between lg:mt-30">
        <div className="space-y-10">
          {apartmentData.length === 0 ? (
            <p>Loading...</p>
          ) : (
            apartmentData.map((apartment) => {
              return (
                <div
                  key={apartment._id}
                  className="max-w-96 bg-white border border-slate-300 rounded-lg px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      className="w-36 h-auto rounded-lg"
                      src={`http://localhost:8080/${apartment.pictures[0]}`}
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
            })
          )}
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
        </div>
        <div className="bg-white border border-gray-400 rounded-md max-w-2xl p-5 flex flex-col gap-4 lg:w-full lg:h-fit">
          <h2 className="text-xl font-medium">
            Guest Details and payment method
          </h2>
          <input
            type="text"
            placeholder="Full Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="h-10 border border-gray-400 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 "
          />
          <input
            type="email"
            placeholder="Email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="h-10 border border-gray-400 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 "
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="h-10 border border-gray-400 mt-1 rounded px-4 w-full bg-gray-50 text-gray-400 "
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
            onClick={makeReservation}
            className="bg-blue-500 text-white px-6 py-4 rounded-md hover:cursor-pointer hover:bg-blue-600 text-lg"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
