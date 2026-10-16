import { useEffect, useState } from "react";
import { BASE_URL } from "../utility/config";

/**
 * Loads one apartment. GET /api/apartments/:id answers with an array,
 * so this unwraps the first element. `null` while loading.
 */
export function useApartment(id) {
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchApartment = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/apartments/${id}`, {
          signal: controller.signal,
        });
        const apartmentData = await response.json();
        setApartment(apartmentData[0] ?? null);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching apartment:", error);
        }
      }
    };

    fetchApartment();

    return () => controller.abort();
  }, [id]);

  return apartment;
}
