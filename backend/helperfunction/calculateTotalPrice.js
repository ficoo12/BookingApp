//this function is created as a helper function to calculate totalPrice so that client can fetch it whenever it is needed and to use it in controller functions
//this way calculation never needs to be done on the frontend and priceList endpoint can continue sending data only when token is present in the request

function calculateTotalPrice(priceList, startDate, endDate) {
  let totalPrice = 0;

  for (
    let night = new Date(startDate);
    night < endDate;
    night.setDate(night.getDate() + 1)
  ) {
    const period = priceList.periods.find(
      (period) =>
        night >= new Date(period.startDate) && night <= new Date(period.endDate)
    );

    if (!period) return null;

    totalPrice += period.pricePerNight;
  }
  return totalPrice;
}
module.exports = {
  calculateTotalPrice,
};
