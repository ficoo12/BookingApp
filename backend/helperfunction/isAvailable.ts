// A booked stay, as stored on the apartment. Mongoose gives Dates, while
// tests and other callers may pass ISO strings.
export interface BookedPeriod {
  startDate: Date | string;
  endDate: Date | string;
}

export interface ApartmentWithBookings {
  bookedDates: BookedPeriod[];
}

// True when the stay [startDate, endDate) overlaps none of the apartment's
// bookings. Stays are half-open, so a checkout day can be the next guest's
// check-in day.
export function isAvailable(
  apartment: ApartmentWithBookings,
  startDate: Date | string,
  endDate: Date | string
): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return !apartment.bookedDates.some(
    (booking) => new Date(booking.startDate) < end && new Date(booking.endDate) > start
  );
}
