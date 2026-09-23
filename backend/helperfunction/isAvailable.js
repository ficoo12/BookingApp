const isAvailable = (apartment, startDate, endDate) => {
  return !apartment.bookedDates.some(
    (booking) =>
      new Date(booking.startDate) < new Date(endDate) &&
      new Date(booking.endDate) > new Date(startDate)
  );
};

module.exports = isAvailable;
