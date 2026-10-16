const mongoose = require("mongoose");
const Reservations = require("./reservations.model");
const Apartment = require("../apartments/apartments.model");
const PriceList = require("../priceList/pricelist.model");
const {
  calculateTotalPrice,
} = require("../helperfunction/calculateTotalPrice");
const removeBookedPeriod = require("../helperfunction/removeBookedPeriod");
const { isAvailable } = require("../helperfunction/isAvailable");
const parseCalendarDate = require("../helperfunction/parseCalendarDate");
const claimDates = require("../helperfunction/claimDates");

const addReservation = async (req, res) => {
  try {
    const {
      apartmentId,
      guestName,
      guestEmail,
      guestPhoneNumber,
      numberOfGuests,
      startDate,
      endDate,
    } = req.body;

    if (
      !apartmentId ||
      !guestName ||
      !guestEmail ||
      !guestPhoneNumber ||
      !numberOfGuests ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!mongoose.isValidObjectId(apartmentId)) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    const parsedStart = parseCalendarDate(startDate);
    const parsedEnd = parseCalendarDate(endDate);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (parsedEnd <= parsedStart) {
      return res
        .status(400)
        .json({ error: "Check-out must be after check-in" });
    }

    const guestCount = Number(numberOfGuests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({ error: "Invalid number of guests" });
    }

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment)
      return res.status(404).json({ error: "Apartment not found" });

    if (guestCount > apartment.guests) {
      return res
        .status(400)
        .json({ error: "Too many guests for this apartment" });
    }

    if (!apartment.available || !isAvailable(apartment, parsedStart, parsedEnd)) {
      return res.status(400).json({ error: "Apartment not available" });
    }

    if (!apartment.priceList_id) {
      return res
        .status(400)
        .json({ error: "Apartment has no price list assigned" });
    }

    const priceList = await PriceList.findById(apartment.priceList_id);

    if (!priceList) {
      return res.status(400).json({ error: "Price list not found" });
    }

    let totalPrice = calculateTotalPrice(priceList, parsedStart, parsedEnd);

    if (totalPrice === null) {
      return res.status(400).json({
        error: "No price period covers the selected dates",
      });
    }

    // isAvailable above answers the common case early. claimDates is the
    // guarantee: it re-checks and blocks the dates in one atomic update, so
    // concurrent requests for the same nights cannot both get through.
    const claimed = await claimDates(apartmentId, parsedStart, parsedEnd);

    if (!claimed) {
      return res.status(400).json({ error: "Apartment not available" });
    }

    let newReservation;
    try {
      newReservation = await Reservations.create({
        apartment: apartmentId,
        guestName,
        guestEmail,
        guestPhoneNumber,
        startDate: parsedStart,
        endDate: parsedEnd,
        numberOfGuests: guestCount,
        totalPrice,
      });
    } catch (error) {
      // Keep bookedDates in sync with the reservations collection.
      await removeBookedPeriod({
        apartment: apartmentId,
        startDate: parsedStart,
        endDate: parsedEnd,
      });
      throw error;
    }

    res
      .status(201)
      .json({ message: "Booking successful!", reservation: newReservation });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Booking failed due to server error" });
  }
};

const allReservations = async (req, res) => {
  try {
    const reservations = await Reservations.find().populate(
      "apartment",
      "name"
    );
    res.status(200).send(reservations);
  } catch (error) {
    console.error("Error fetching reservations", error);
    res.status(500).send({ message: "Failed to fetch reservations" });
  }
};

const getSingleReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservations.findById(id);
    if (!reservation) {
      res.status(404).send({
        message: "Reservation not Found!",
      });
      return;
    }
    res.status(200).send(reservation);
  } catch (error) {
    console.error("Error fetching reservation", error);
    res.status(500).send({ message: "Failed to fetch reservation" });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(404).send({ message: "reservation is not found" });
      return;
    }

    const reservation = await Reservations.findByIdAndDelete(id);

    if (!reservation) {
      res.status(404).send({ message: "reservation is not found" });
      return;
    }

    await removeBookedPeriod(reservation);

    res.status(200).send({
      message: "Reservation deleted successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error deleting a reservation", error);
    res.status(500).send({ message: "Failed to delete reservation" });
  }
};

module.exports = {
  addReservation,
  allReservations,
  getSingleReservation,
  deleteReservation,
};
