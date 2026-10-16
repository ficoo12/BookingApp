// One-off migration: rewrites stored calendar dates to UTC midnight, the
// format the API now uses for stay dates and price-period bounds.
//
// Before, the webapp sent each date as the guest's local midnight (Jun 10 in
// Zagreb was saved as 2030-06-09T22:00:00.000Z), and seed/*.json used UTC+2
// day bounds. Pricing still works with those values, but an old booking then
// blocks a new guest from checking out on its check-in day, and the admin
// price-list form shows old seed periods ending a day late.
//
// Dry run by default: it prints what it would change and writes nothing.
// Run from backend/ (it reads DB_URL from .env):
//   node scripts/normalize-calendar-dates.js           # preview
//   node scripts/normalize-calendar-dates.js --apply   # write the changes
require("dotenv").config();
const mongoose = require("mongoose");
const Reservations = require("../reservations/reservations.model");
const Apartment = require("../apartments/apartments.model");
const PriceList = require("../priceList/pricelist.model");

const DAY_MS = 24 * 60 * 60 * 1000;

// A local midnight (stay dates, period starts) -> that day at UTC midnight.
// Correct for every offset from UTC-11 to UTC+12.
const roundToDay = (date) =>
  new Date(Math.round(date.getTime() / DAY_MS) * DAY_MS);

// Period ends not at midnight are the last millisecond of a local day, as in
// the old seed files (21:59:59.999Z for UTC+2) -> that day at UTC midnight.
const endToDay = (date) =>
  date.getTime() % DAY_MS === 0
    ? date
    : new Date(roundToDay(new Date(date.getTime() + 1)).getTime() - DAY_MS);

const same = (a, b) => a.getTime() === b.getTime();
const day = (date) => date.toISOString().slice(0, 16).replace("T", " ");

async function main() {
  const apply = process.argv.includes("--apply");
  await mongoose.connect(process.env.DB_URL);
  const changed = { reservations: 0, apartments: 0, priceLists: 0 };

  for (const reservation of await Reservations.find().lean()) {
    const startDate = roundToDay(reservation.startDate);
    const endDate = roundToDay(reservation.endDate);
    if (same(startDate, reservation.startDate) && same(endDate, reservation.endDate)) continue;

    changed.reservations++;
    console.log(
      `reservation ${reservation._id} (${reservation.guestName}): ` +
        `${day(reservation.startDate)} - ${day(reservation.endDate)}  ->  ` +
        `${day(startDate)} - ${day(endDate)}`
    );
    if (apply) await Reservations.updateOne({ _id: reservation._id }, { startDate, endDate });
  }

  for (const apartment of await Apartment.find().lean()) {
    const bookedDates = apartment.bookedDates.map((booking) => ({
      ...booking,
      startDate: roundToDay(booking.startDate),
      endDate: roundToDay(booking.endDate),
    }));
    const moved = bookedDates.filter(
      (booking, i) =>
        !same(booking.startDate, apartment.bookedDates[i].startDate) ||
        !same(booking.endDate, apartment.bookedDates[i].endDate)
    );
    if (moved.length === 0) continue;

    changed.apartments++;
    console.log(`apartment ${apartment._id} (${apartment.name}): ${moved.length} booked period(s)`);
    if (apply) await Apartment.updateOne({ _id: apartment._id }, { bookedDates });
  }

  for (const priceList of await PriceList.find().lean()) {
    const periods = priceList.periods.map((period) => ({
      ...period,
      startDate: roundToDay(period.startDate),
      endDate: endToDay(period.endDate),
    }));
    const moved = periods.filter(
      (period, i) =>
        !same(period.startDate, priceList.periods[i].startDate) ||
        !same(period.endDate, priceList.periods[i].endDate)
    );
    if (moved.length === 0) continue;

    changed.priceLists++;
    console.log(`price list ${priceList._id} (${priceList.priceListName}): ${moved.length} period(s)`);
    if (apply) await PriceList.updateOne({ _id: priceList._id }, { periods });
  }

  console.log(
    `\n${apply ? "Updated" : "Would update"}: ${changed.reservations} reservation(s), ` +
      `${changed.apartments} apartment(s), ${changed.priceLists} price list(s).`
  );
  if (!apply) console.log("Dry run: nothing was written. Re-run with --apply to save.");

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
