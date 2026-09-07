import { useEffect } from "react";
import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getApartments, getReservations } from "../../utility/api";
import { BASE_URL } from "../../utility/config";
import { queryKeys } from "../../utility/queryKeys";

const Home = () => {
  const {
    data: reservations,
    isPending: reservationsPending,
    isError: isReservationsError,
    error: reservationsError,
  } = useQuery({
    queryKey: queryKeys.reservations,
    queryFn: getReservations,
  });

  const {
    data: apartments,
    isPending: apartmentsPending,
    isError: isApartmentsError,
    error: apartmentsError,
  } = useQuery({
    queryKey: queryKeys.apartments.all,
    queryFn: getApartments,
  });

  const token = useRouteLoaderData("root");
  const logoutSubmit = useSubmit();

  useEffect(() => {
    if (token === "EXPIRED") {
      logoutSubmit(null, { action: "/logout", method: "post" });
    }
  }, [token, logoutSubmit]);

  return (
    <div className=" max-w-4xl  mx-auto">
      <div>
        <h1>Rezervacije:</h1>
        <div className="flex gap-4 mt-5">
          {reservationsPending && <p>Loading...</p>}
          {isReservationsError && <p>{reservationsError.message}</p>}
          {reservations?.slice(0, 2).map((reservation) => (
            <div
              key={reservation._id}
              className="bg-white rounded-lg w-fit px-10 py-5 dark:bg-gray-800"
            >
              <div>
                <p>{reservation.guestName}</p>
                <p>Phone number: {reservation.guestPhoneNumber}</p>
                <p>Email: {reservation.guestEmail}</p>
                <p>
                  {format(reservation.startDate, "MMM dd, yyyy")} -
                  {format(reservation.endDate, "MMM dd, yyyy")}
                </p>
                <p>Broj gostiju: {reservation.numberOfGuests}</p>
                <p>Ukupna cijena: {reservation.totalPrice}€</p>
              </div>

              <p></p>
              <p>
                Apartman: {reservation.apartment?.name ?? "Obrisan apartman"}
              </p>
            </div>
          ))}
        </div>
        <Link to="/reservations" className="underline mt-5">
          Sve rezervacije
        </Link>
      </div>
      <div className="space-y-4 ">
        <h1 className="mt-5">Dodani apartmani:</h1>
        {apartmentsPending && <p>Loading apartments...</p>}
        {isApartmentsError && <p>{apartmentsError.message}</p>}
        {apartments?.map((apartment) => {
          return (
            <div
              key={apartment._id}
              className="bg-white border border-gray-400 rounded-lg px-5 py-5 space-y-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="text-4xl font-bold">{apartment.name}</p>
              <p>
                <span className="text-xl font-semibold">Tip apartmana:</span>{" "}
                {apartment.type}
              </p>
              <p>
                <span className="text-xl font-semibold">Opis apartmana:</span>{" "}
                {apartment.desc}
              </p>
              <p>
                {" "}
                <span className="text-xl font-semibold">
                  Maksimalan broj gostiju:
                </span>{" "}
                {apartment.guests}
              </p>
              <p>
                {" "}
                <span className="text-xl font-semibold">
                  Fotografije apartmana:
                </span>
              </p>
              <div className="flex flex-wrap gap-4">
                {apartment.pictures.map((picture) => (
                  <img
                    key={picture}
                    className="max-w-40 h-auto rounded-lg"
                    src={`${BASE_URL}/${picture}`}
                  ></img>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Home;
