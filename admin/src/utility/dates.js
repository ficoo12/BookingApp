const DAY_MS = 24 * 60 * 60 * 1000;

// The API stores calendar dates (stay dates and price-period bounds) as UTC
// midnight. Reading one with the browser's time zone shows the previous day
// anywhere west of UTC, so always convert through these helpers.

// Rounding to the nearest UTC midnight also maps reservations saved by older
// webapp builds, which stored the guest's local midnight (e.g. 22:00Z), to
// the day the guest picked.
const toUtcMidnight = (value) =>
  new Date(Math.round(new Date(value).getTime() / DAY_MS) * DAY_MS);

// A Date at local midnight of the stored calendar day, for date-fns format()
// and react-big-calendar.
export function toLocalDay(value) {
  const day = toUtcMidnight(value);
  return new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
}

// "yyyy-MM-dd" for <input type="date">, which is also the format the API
// expects back.
export function toDateInputValue(value) {
  return toUtcMidnight(value).toISOString().slice(0, 10);
}
