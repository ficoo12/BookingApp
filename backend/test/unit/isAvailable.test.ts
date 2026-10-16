import { isAvailable, type ApartmentWithBookings } from "../../helperfunction/isAvailable";

const utc = (day: string): Date => new Date(`${day}T00:00:00.000Z`);

const apartmentWithBookings = (...bookings: [string, string][]): ApartmentWithBookings => ({
  bookedDates: bookings.map(([startDate, endDate]) => ({startDate: utc(startDate), endDate: utc(endDate),})),
});

describe("isAvailable", () => {
  test("an apartment with no bookings is available", () => {
    const apartment = apartmentWithBookings();

    const result = isAvailable(apartment, utc("2030-06-10"), utc("2030-06-15")); expect(result).toBe(true);
  })
})


describe("agains one booking from Jun 10 to Jun 15", () => {
  const apartment = apartmentWithBookings(["2030-06-10", "2030-06-15"]);

  test("a stay that checks out on the booking's check-in day is available", () => {expect(isAvailable(apartment, utc("2030-06-05"), utc("2030-06-10"))).toBe(true);});
  test("a stay that overlaps the booking's start is taken", () => {
    expect(isAvailable(apartment, utc("2030-06-08"), utc("2030-06-11"))).toBe(false);
  });

  test.each([
    // Clearly apart from the booking
    { name: "ends well before the booking",          checkIn: "2030-06-01", checkOut: "2030-06-05", available: true },
    { name: "starts well after the booking",         checkIn: "2030-06-20", checkOut: "2030-06-25", available: true },

    // Overlaps
    { name: "overlaps the booking's end",            checkIn: "2030-06-14", checkOut: "2030-06-18", available: false },
    { name: "lies inside the booking",               checkIn: "2030-06-11", checkOut: "2030-06-13", available: false },
    { name: "contains the whole booking",            checkIn: "2030-06-09", checkOut: "2030-06-16", available: false },
    { name: "has exactly the same dates",            checkIn: "2030-06-10", checkOut: "2030-06-15", available: false },
    { name: "shares only the last night (Jun 14)",   checkIn: "2030-06-14", checkOut: "2030-06-15", available: false },

    // Boundaries: stays are half-open, so checkout day = next check-in day
    { name: "checks in on the booking's checkout day", checkIn: "2030-06-15", checkOut: "2030-06-20", available: true },
    { name: "is one night ending at the check-in",     checkIn: "2030-06-09", checkOut: "2030-06-10", available: true },
    { name: "is one night starting at the checkout",   checkIn: "2030-06-15", checkOut: "2030-06-16", available: true },
  ])("a stay that $name → available: $available", ({ checkIn, checkOut, available }) => {
    expect(isAvailable(apartment, utc(checkIn), utc(checkOut))).toBe(available);
  });
})

test("one overlapping booking among several makes it unavailable", () => {
  const apartment = apartmentWithBookings(
    ["2030-06-01", "2030-06-03"],
    ["2030-06-12", "2030-06-14"],
    ["2030-06-20", "2030-06-22"]
  );
  expect(isAvailable(apartment, utc("2030-06-10"), utc("2030-06-13"))).toBe(false);
});

test("a stay that exactly fills the gap between two bookings is available", () => {
  const apartment = apartmentWithBookings(["2030-06-05", "2030-06-10"], ["2030-06-15", "2030-06-20"]);
  expect(isAvailable(apartment, utc("2030-06-10"), utc("2030-06-15"))).toBe(true);
});

test("accepts ISO strings as well as Dates", () => {
  const apartment = apartmentWithBookings(["2030-06-10", "2030-06-15"]);
  expect(isAvailable(apartment, "2030-06-15T00:00:00.000Z", "2030-06-18T00:00:00.000Z")).toBe(true);
  expect(isAvailable(apartment, "2030-06-14T00:00:00.000Z", "2030-06-18T00:00:00.000Z")).toBe(false);
});