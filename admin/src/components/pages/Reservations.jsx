import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getReservations } from "../../utility/api";
import { queryKeys } from "../../utility/queryKeys";
import ReservationsCalendar from "../ReservationsCalendar";

const VIEWS = [
  { id: "calendar", label: "Kalendar" },
  { id: "list", label: "Popis" },
];

const Reservations = () => {
  const [view, setView] = useState("calendar");

  const {
    data: reservations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.reservations,
    queryFn: getReservations,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1>Sve rezervacije</h1>
        {/* radiogroup rather than buttons: the two are one exclusive choice, so
            arrow keys should move between them and the state be announced. */}
        <div
          role="radiogroup"
          aria-label="Prikaz rezervacija"
          className="inline-flex rounded-md border border-gray-300 p-1 dark:border-gray-700"
        >
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={view === id}
              onClick={() => setView(id)}
              className={[
                "rounded px-4 py-1.5 text-sm font-medium transition-colors hover:cursor-pointer",
                view === id
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {reservations.length === 0 && (
        <p className="mt-5 text-gray-600 dark:text-gray-400">
          Još nema rezervacija.
        </p>
      )}

      {reservations.length > 0 && view === "calendar" && (
        <div className="mt-5">
          <ReservationsCalendar reservations={reservations} />
        </div>
      )}

      {reservations.length > 0 && view === "list" && (
        <div className="flex flex-wrap justify-center gap-4 mt-5">
          {reservations.map((reservation) => (
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
              <p>
                Apartman: {reservation.apartment?.name ?? "Obrisan apartman"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
