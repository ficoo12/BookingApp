import { useState, useEffect } from "react";
import { format } from "date-fns";
const Reservations = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservationData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`http://localhost:8080/api/reservations`);
        const reservations = await response.json();
        setReservations(reservations);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservationData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1>Sve rezervacije</h1>
      <div className="flex flex-wrap justify-center gap-4 mt-5">
        {Array.isArray(reservations) &&
          reservations.map((reservation) => (
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
              <p>Apartman: {reservation.apartment.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Reservations;
