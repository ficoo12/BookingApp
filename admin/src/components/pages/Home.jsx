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
        <h1>Reservations:</h1>
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
                <p>Number of guests: {reservation.numberOfGuests}</p>
                <p>Total price: {reservation.totalPrice}€</p>
              </div>

              <p></p>
              <p>
                Apartment: {reservation.apartment?.name ?? "Deleted apartment"}
              </p>
            </div>
          ))}
        </div>
        <Link to="/reservations" className="underline mt-5">
          All reservations
        </Link>
      </div>
      <div className="space-y-4 ">
        <h1 className="mt-5">Added apartments:</h1>
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
                <span className="text-xl font-semibold">Apartment type:</span>{" "}
                {apartment.type}
              </p>
              <p>
                <span className="text-xl font-semibold">
                  Apartment description:
                </span>{" "}
                {apartment.desc}
              </p>
              <p>
                {" "}
                <span className="text-xl font-semibold">
                  Maximum number of guests:
                </span>{" "}
                {apartment.guests}
              </p>
              <p>
                {" "}
                <span className="text-xl font-semibold">Apartment photos:</span>
              </p>
              <div className="flex flex-wrap gap-4">
                {apartment.pictures.map((picture) => (
                  <img
                    key={picture}
                    className="max-w-40 h-auto rounded-lg object-cover"
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
