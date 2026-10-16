import { useEffect, useState } from "react";
import { BASE_URL } from "../utility/config";

/**
 * Asks the server for the stay's total. Pricing happens only on the server,
 * and reading price lists needs a token, so the guest app uses the public
 * quote endpoint. `checkIn`/`checkOut` are "yyyy-MM-dd" calendar dates.
 */
export function usePriceQuote(priceListId, checkIn, checkOut) {
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    if (!priceListId) {
      return;
    }

    const controller = new AbortController();

    const getTheTotalPrice = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/priceList/${priceListId}/quote`,
          {
            method: "POST",
            body: JSON.stringify({ startDate: checkIn, endDate: checkOut }),
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        );

        if (response.ok) {
          const totalPriceResponse = await response.json();
          setTotalPrice(totalPriceResponse.totalPrice);
        } else {
          console.error(response.body);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching price quote:", error);
        }
      }
    };

    getTheTotalPrice();

    return () => controller.abort();
  }, [priceListId, checkIn, checkOut]);

  return totalPrice;
}
