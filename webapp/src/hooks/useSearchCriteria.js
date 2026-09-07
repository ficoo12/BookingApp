import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { format, parse, isValid, addDays, startOfDay } from "date-fns";

const FMT = "yyyy-MM-dd";

const parseDate = (value, fallback) => {
  if (!value) return fallback;
  const parsed = parse(value, FMT, new Date());
  return isValid(parsed) ? parsed : fallback;
};

/**
 * Datumi i broj gostiju žive u URL-u (?checkIn=&checkOut=&guests=),
 * a ne u state-u pojedine komponente.
 *
 * Zato preživljavaju unmount komponente, back/forward navigaciju,
 * refresh stranice i dijeljenje linka.
 */
export function useSearchCriteria() {
  const [searchParams, setSearchParams] = useSearchParams();

  const criteria = useMemo(() => {
    const today = startOfDay(new Date());

    const startDate = parseDate(searchParams.get("checkIn"), today);

    // Barem jedna noć, inače je totalNights 0 i cijena ispadne 0.
    const fallbackEnd = addDays(startDate, 1);
    let endDate = parseDate(searchParams.get("checkOut"), fallbackEnd);
    if (endDate <= startDate) {
      endDate = fallbackEnd;
    }

    const parsedGuests = Number(searchParams.get("guests"));
    const guests =
      Number.isFinite(parsedGuests) && parsedGuests >= 1
        ? Math.floor(parsedGuests)
        : 1;

    return { startDate, endDate, guests };
  }, [searchParams]);

  const setCriteria = useCallback(
    (next, { replace = true } = {}) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next.startDate)
            params.set("checkIn", format(next.startDate, FMT));
          if (next.endDate) params.set("checkOut", format(next.endDate, FMT));
          if (next.guests != null) params.set("guests", String(next.guests));
          return params;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  // Gotov query string za linkove između ruta.
  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("checkIn", format(criteria.startDate, FMT));
    params.set("checkOut", format(criteria.endDate, FMT));
    params.set("guests", String(criteria.guests));
    return params.toString();
  }, [criteria]);

  return {
    ...criteria,
    setCriteria,
    query,
    isSearchActive: searchParams.has("checkIn"),
  };
}
