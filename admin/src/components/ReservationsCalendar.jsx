import { useCallback, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  differenceInCalendarDays,
} from "date-fns";
import { hr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ReservationsCalendar.css";

// Built once at module scope: the localizer is stateless and rebuilding it on
// every render would remount the calendar's internals.
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: hr }),
  getDay,
  locales: { hr },
});

const formats = {
  monthHeaderFormat: "LLLL yyyy.",
  agendaHeaderFormat: ({ start, end }, culture, loc) =>
    `${loc.format(start, "d. MMM yyyy.", culture)} – ${loc.format(
      end,
      "d. MMM yyyy.",
      culture
    )}`,
  agendaDateFormat: "EEE d. MMM",
};

const messages = {
  today: "Danas",
  previous: "Nazad",
  next: "Naprijed",
  month: "Mjesec",
  agenda: "Popis",
  date: "Datum",
  time: "Vrijeme",
  event: "Rezervacija",
  allDay: "cijeli dan",
  noEventsInRange: "Nema rezervacija u ovom razdoblju.",
  showMore: (count) => `+ još ${count}`,
};

const APARTMENT_COLORS = [
  "#2563eb",
  "#be123c",
  "#0d9488",
  "#a16207",
  "#7c3aed",
  "#c2410c",
  "#4d7c0f",
  "#0369a1",
];

const DELETED_APARTMENT_COLOR = "#6b7280";

const buildApartmentColors = (reservations) => {
  const names = new Map();
  for (const { apartment } of reservations) {
    if (apartment?._id) names.set(apartment._id, apartment.name);
  }

  const sorted = [...names.entries()].sort(([, a], [, b]) =>
    a.localeCompare(b, "hr")
  );

  return new Map(
    sorted.map(([id, name], index) => [
      id,
      { name, color: APARTMENT_COLORS[index % APARTMENT_COLORS.length] },
    ])
  );
};

const formatRange = (start, end) =>
  `${format(start, "d. MMM yyyy.", { locale: hr })} – ${format(
    end,
    "d. MMM yyyy.",
    { locale: hr }
  )}`;

const nightsBetween = (start, end) =>
  Math.max(differenceInCalendarDays(end, start), 0);

const nightsLabel = (nights) => `${nights} ${nights === 1 ? "noć" : "noći"}`;

const ReservationsCalendar = ({ reservations }) => {
  const [selected, setSelected] = useState(null);

  const apartmentColors = useMemo(
    () => buildApartmentColors(reservations),
    [reservations]
  );

  const events = useMemo(
    () =>
      reservations.map((reservation) => {
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return {
          id: reservation._id,
          title: `${reservation.guestName} · ${
            reservation.apartment?.name ?? "Obrisan apartman"
          }`,
          start,
          end,
          allDay: true,
          resource: reservation,
        };
      }),
    [reservations]
  );

  const eventPropGetter = useCallback(
    (event) => ({
      style: {
        backgroundColor:
          apartmentColors.get(event.resource.apartment?._id)?.color ??
          DELETED_APARTMENT_COLOR,
        color: "#ffffff",
      },
    }),
    [apartmentColors]
  );

  const tooltipAccessor = useCallback(
    (event) =>
      `${event.resource.guestName}\n${
        event.resource.apartment?.name ?? "Obrisan apartman"
      }\n${formatRange(event.start, event.end)}`,
    []
  );

  const legend = useMemo(
    () =>
      [...apartmentColors.entries()].map(([id, { name, color }]) => ({
        id,
        name,
        color,
      })),
    [apartmentColors]
  );

  return (
    <div className="space-y-4">
      {legend.length > 0 && (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {legend.map((apartment) => (
            <li
              key={apartment.id}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full"
                style={{ backgroundColor: apartment.color }}
              />
              {apartment.name}
            </li>
          ))}
        </ul>
      )}

      <Calendar
        localizer={localizer}
        culture="hr"
        events={events}
        messages={messages}
        formats={formats}
        views={["month", "agenda"]}
        defaultView="month"
        startAccessor="start"
        endAccessor="end"
        tooltipAccessor={tooltipAccessor}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(event) => setSelected(event.resource)}
        popup
      />

      {selected && (
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{selected.guestName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selected.apartment?.name ?? "Obrisan apartman"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:cursor-pointer dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Zatvori
            </button>
          </div>
          <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Termin</dt>
              <dd>
                {formatRange(
                  new Date(selected.startDate),
                  new Date(selected.endDate)
                )}{" "}
                (
                {nightsLabel(
                  nightsBetween(
                    new Date(selected.startDate),
                    new Date(selected.endDate)
                  )
                )}
                )
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Broj gostiju</dt>
              <dd>{selected.numberOfGuests}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Email</dt>
              <dd>
                <a className="underline" href={`mailto:${selected.guestEmail}`}>
                  {selected.guestEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Telefon</dt>
              <dd>
                <a
                  className="underline"
                  href={`tel:${selected.guestPhoneNumber}`}
                >
                  {selected.guestPhoneNumber}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">
                Ukupna cijena
              </dt>
              <dd>{selected.totalPrice}€</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default ReservationsCalendar;
