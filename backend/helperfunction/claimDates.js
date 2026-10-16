const Apartment = require("../apartments/apartments.model");

// Pushes [startDate, endDate) onto the apartment's bookedDates only when no
// existing booking overlaps it, using the same half-open test as
// isAvailable.js. The check and the push are one single-document update, so
// two requests racing for the same nights cannot both succeed.
const claimDates = async (apartmentId, startDate, endDate) => {
  const { modifiedCount } = await Apartment.updateOne(
    {
      _id: apartmentId,
      bookedDates: {
        $not: {
          $elemMatch: { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
        },
      },
    },
    { $push: { bookedDates: { startDate, endDate } } }
  );

  return modifiedCount === 1;
};

module.exports = claimDates;
