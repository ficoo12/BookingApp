import { calculateTotalPrice, type PriceList } from "../../helperfunction/calculateTotalPrice";
import standardRate from "../../../seed/standard-rate.json";

// "2030-06-10" → a Date at UTC midnight, the format the API stores.
const utc = (day: string): Date => new Date(`${day}T00:00:00.000Z`);

// Jun 1-30 @ 100, Jul 1-Aug 31 @ 150, no period Sep 1-14, Sep 15-30 @ 80.
// The gap is deliberate, to test nights that have no price.
const priceList: PriceList = {
  periods: [
    { startDate: utc("2030-06-01"), endDate: utc("2030-06-30"), pricePerNight: 100 },
    { startDate: utc("2030-07-01"), endDate: utc("2030-08-31"), pricePerNight: 150 },
    { startDate: utc("2030-09-15"), endDate: utc("2030-09-30"), pricePerNight: 80 },
  ],
};

// Shorthand: price a stay against the fixture above.
const quote = (checkIn: string, checkOut: string) =>
  calculateTotalPrice(priceList, utc(checkIn), utc(checkOut));

describe("calculateTotalPrice", () => {
  test("prices one night", () => {
    expect(quote("2030-06-10", "2030-06-11")).toBe(100);
  });

  describe("normal pricing and period boundaries", () => {
    test.each([
      // Normal pricing
      { name: "three nights in one period",             checkIn: "2030-06-10", checkOut: "2030-06-13", price: 300 },
      { name: "the whole of June",                      checkIn: "2030-06-01", checkOut: "2030-07-01", price: 3000 },
      { name: "a stay across a rate change",            checkIn: "2030-06-30", checkOut: "2030-07-02", price: 100 + 150 },
      { name: "a longer stay across a rate change",     checkIn: "2030-06-28", checkOut: "2030-07-03", price: 3 * 100 + 2 * 150 },

      // Boundaries: nights are [check-in, checkout), period bounds are inclusive
      { name: "a stay without charging the checkout night", checkIn: "2030-06-29", checkOut: "2030-07-01", price: 200 },
      { name: "a night on a period's first day",        checkIn: "2030-07-01", checkOut: "2030-07-02", price: 150 },
      { name: "a night on a period's last day",         checkIn: "2030-08-31", checkOut: "2030-09-01", price: 150 },
      { name: "the first day of the first period",      checkIn: "2030-06-01", checkOut: "2030-06-02", price: 100 },
      { name: "the last day of the last period",        checkIn: "2030-09-30", checkOut: "2030-10-01", price: 80 },
    ])("prices $name: $price", ({ checkIn, checkOut, price }) => {
      expect(quote(checkIn, checkOut)).toBe(price);
    });
  });

  describe("when a night has no price", () => {
    test.each([
      { name: "runs into the gap",                 checkIn: "2030-08-31", checkOut: "2030-09-02" },
      { name: "starts in the gap",                 checkIn: "2030-09-14", checkOut: "2030-09-16" },
      { name: "lies entirely inside the gap",      checkIn: "2030-09-05", checkOut: "2030-09-08" },
      { name: "has a night before the first period", checkIn: "2030-05-31", checkOut: "2030-06-02" },
      { name: "has a night after the last period", checkIn: "2030-09-30", checkOut: "2030-10-02" },
    ])("returns null when the stay $name", ({ checkIn, checkOut }) => {
      expect(quote(checkIn, checkOut)).toBeNull();
    });

    test("returns null for a price list with no periods", () => {
      expect(calculateTotalPrice({ periods: [] }, utc("2030-06-10"), utc("2030-06-11"))).toBeNull();
    });
  });

  // The controllers reject these stays before calling the function; the tests
  // record what it does, so any change to that is deliberate.
  describe("unusual input", () => {
    test("returns 0 when checkout equals check-in", () => {
      expect(quote("2030-06-10", "2030-06-10")).toBe(0);
    });

    test("returns 0 when checkout is before check-in", () => {
      expect(quote("2030-06-12", "2030-06-10")).toBe(0);
    });

    test("uses the first matching period when periods overlap", () => {
      const overlapping: PriceList = {
        periods: [
          { startDate: utc("2030-06-01"), endDate: utc("2030-06-30"), pricePerNight: 100 },
          { startDate: utc("2030-06-10"), endDate: utc("2030-06-20"), pricePerNight: 200 },
        ],
      };
      expect(calculateTotalPrice(overlapping, utc("2030-06-10"), utc("2030-06-11"))).toBe(100);
    });
  });

  describe("inputs and real data", () => {
    // Strings used to price at 0: a Date compared with a raw string is never
    // smaller, so the loop never ran.
    test("prices strings the same as Dates", () => {
      expect(calculateTotalPrice(priceList, "2030-06-10", "2030-06-13")).toBe(300);
      expect(calculateTotalPrice(priceList, "2030-06-10T00:00:00.000Z", "2030-06-13T00:00:00.000Z")).toBe(300);
    });

    test("does not change the start date passed in", () => {
      const checkIn = utc("2030-06-10");
      calculateTotalPrice(priceList, checkIn, utc("2030-06-13"));
      expect(checkIn).toEqual(utc("2030-06-10"));
    });

    // seed/standard-rate.json: Sep 14-30 2026 @ 100, Oct 1 2026-May 31 2027 @ 70.
    test("prices the seed price list across its Oct 1 rate change", () => {
      expect(calculateTotalPrice(standardRate, utc("2026-09-28"), utc("2026-10-03"))).toBe(3 * 100 + 2 * 70);
    });
  });

  // Each case puts a rate change right after a daylight-saving clock change.
  // `npm test` runs in your time zone (Zagreb covers the Europe case);
  // `npm run test:tz` also runs under New York for the US case.
  describe("server time zone", () => {
    test.each([
      {
        clocks: "Europe", // clocks change on Mar 31 2030
        periods: [
          { startDate: utc("2030-03-01"), endDate: utc("2030-03-31"), pricePerNight: 60 },
          { startDate: utc("2030-04-01"), endDate: utc("2030-04-30"), pricePerNight: 90 },
        ],
        checkIn: "2030-03-29",
        checkOut: "2030-04-02",
      },
      {
        clocks: "US", // clocks change on Mar 10 2030
        periods: [
          { startDate: utc("2030-03-01"), endDate: utc("2030-03-10"), pricePerNight: 60 },
          { startDate: utc("2030-03-11"), endDate: utc("2030-03-31"), pricePerNight: 90 },
        ],
        checkIn: "2030-03-08",
        checkOut: "2030-03-12",
      },
    ])("gives the same total across a $clocks clock change", ({ periods, checkIn, checkOut }) => {
      expect(calculateTotalPrice({ periods }, utc(checkIn), utc(checkOut))).toBe(3 * 60 + 90);
    });
  });
});
