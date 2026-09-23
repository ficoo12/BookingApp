const Apartment = require("../apartments/apartments.model");
const removeBookedPeriod = (reservation) => {
  Apartment.updateOne(
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
