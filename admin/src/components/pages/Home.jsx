import { useContext, useEffect, useState } from "react";
import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import { format } from "date-fns";
import { ApartmentsContext } from "../../store/apartments-context";
const Home = () => {
  const { apartments, onLoadingData } = useContext(ApartmentsContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [reservations, setReservations] = useState([]);
  const token = useRouteLoaderData("root");
  const logoutSubmit = useSubmit();
  const [localToken, setLocalToken] = useState(null);

  if (token !== localToken) {
    setLocalToken(token);
  }
  useEffect(() => {
    if (localToken && apartments.length === 0) {
      onLoadingData();
    }

    if (localToken === "EXPIRED") {
      logoutSubmit(null, { action: "/logout", method: "post" });
    }
  }, [localToken, logoutSubmit, apartments, onLoadingData]);

  useEffect(() => {
    setLoading(true);
    const fetchReservationData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reservations`);
        const reservations = await response.json();
        setReservations(reservations);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservationData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong...</p>;
  }

  return (
    <div className=" max-w-4xl  mx-auto">
      <div>
        <h1>Rezervacije:</h1>
        <div className="flex gap-4 mt-5">
          {Array.isArray(reservations) &&
            reservations.slice(0, 2).map((reservation) => (
              <div className="bg-white rounded-lg w-fit px-10 py-5">
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
                <p>Apartman: {reservation.apartment.name}</p>
              </div>
            ))}
        </div>
        <Link to="/reservations" className="underline mt-5">
          Sve rezervacije
        </Link>
      </div>
      <div className="space-y-4 ">
        <h1 className="mt-5">Dodani apartmani:</h1>
        {Array.isArray(apartments) &&
          apartments.map((apartment) => {
            return (
              <div className="bg-white border border-gray-400 rounded-lg px-5 py-5 space-y-5">
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
                  {apartment.pictures.map((pictures) => (
                    <img
                      className="max-w-40 h-auto rounded-lg"
                      src={`http://localhost:8080/${pictures}`}
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
