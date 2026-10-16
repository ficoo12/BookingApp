const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

// Stay dates are calendar days, stored as UTC midnight:
// "2030-06-10" -> 2030-06-10T00:00:00.000Z. The admin price-list form stores
// period bounds the same way, so nights and periods line up exactly.
//
// Full timestamps are still accepted from clients that send the browser's
// local midnight as an ISO string (webapp builds from before this change).
// Rounding to the nearest UTC midnight recovers the intended day for every
// offset from UTC-11 to UTC+12.
//
// Returns an Invalid Date for anything else, so callers keep their isNaN check.
const parseCalendarDate = (value) => {
  if (typeof value !== "string") return new Date(NaN);

  if (DATE_ONLY.test(value)) {
    const date = new Date(`${value}T00:00:00.000Z`);
    // Rejects impossible days such as 2030-02-30 instead of rolling them over.
    const isRealDay = !isNaN(date.getTime()) && date.toISOString().startsWith(value);
    return isRealDay ? date : new Date(NaN);
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) return date;
  return new Date(Math.round(date.getTime() / DAY_MS) * DAY_MS);
};

module.exports = parseCalendarDate;
