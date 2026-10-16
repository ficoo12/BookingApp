
export interface PricePeriod {
  startDate: Date | string;
  endDate: Date | string;
  pricePerNight: number;
}

export interface PriceList {
  periods: PricePeriod[];
}


export function calculateTotalPrice(
  priceList: PriceList,
  startDate: Date | string,
  endDate: Date | string
): number | null {
  
  const end = new Date(endDate);
  let totalPrice = 0;

  
  for (let night = new Date(startDate); night < end; night.setUTCDate(night.getUTCDate() + 1)) {
    const period = priceList.periods.find(
      (period) => night >= new Date(period.startDate) && night <= new Date(period.endDate)
    );

    if (!period) return null;

    totalPrice += period.pricePerNight;
  }

  return totalPrice;
}
