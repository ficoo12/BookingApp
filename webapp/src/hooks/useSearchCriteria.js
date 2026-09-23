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
 * Dates and guest count live in the URL (?checkIn=&checkOut=&guests=),
 * not in any single component's state.
 *
 * That's why they survive component unmounts, back/forward navigation,
 * page refreshes and link sharing.
 */
export function useSearchCriteria() {
  const [searchParams, setSearchParams] = useSearchParams();

  const criteria = useMemo(() => {
    const today = startOfDay(new Date());

    const startDate = parseDate(searchParams.get("checkIn"), today);

    // At least one night, otherwise totalNights is 0 and the price comes out as 0.
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

  // Ready-made query string for links between routes.
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
