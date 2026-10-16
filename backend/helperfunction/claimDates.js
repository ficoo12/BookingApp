const Apartment = require("../apartments/apartments.model");

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
