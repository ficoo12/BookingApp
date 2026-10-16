const Apartment = require("../apartments/apartments.model");

// Returns the query so the caller's `await` actually executes it.
const removeBookedPeriod = (reservation) => {
  return Apartment.updateOne(
    { _id: reservation.apartment },
    {
      $pull: {
        bookedDates: {
          startDate: reservation.startDate,
          endDate: reservation.endDate,
        },
      },
    }
  );
};

module.exports = removeBookedPeriod;
