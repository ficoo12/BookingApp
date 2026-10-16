import { useEffect, useState } from "react";
import { BASE_URL } from "../utility/config";

export function useAvailableApartments({
  checkIn,
  checkOut,
  guests,
  isSearchActive,
}) {
  const [apartments, setApartments] = useState([]);

  // Fetching depends on the URL, not on the button click.
  // That's why results come back when the user returns to this route.
  useEffect(() => {
    if (!isSearchActive) return;

    const controller = new AbortController();

    const fetchApartments = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/apartments/available?startDate=${checkIn}&endDate=${checkOut}&guests=${guests}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch apartments");
        }

        const data = await response.json();
        setApartments(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching apartments:", error);
        }
      }
    };

    fetchApartments();

    return () => controller.abort();
  }, [checkIn, checkOut, guests, isSearchActive]);

  return apartments;
}
