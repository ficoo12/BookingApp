const Reservations = require("./reservations.model");
const Apartment = require("../apartments/apartments.model");
const PriceList = require("../priceList/pricelist.model");
const {
  calculateTotalPrice,
} = require("../helperfunction/calculateTotalPrice");

const isAvailable = (apartment, startDate, endDate) => {
  return !apartment.bookedDates.some(
    (booking) =>
      new Date(booking.startDate) <= new Date(endDate) &&
      new Date(booking.endDate) >= new Date(startDate)
  );
};

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

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment)
      return res.status(404).json({ error: "Apartment not found" });

    if (!isAvailable(apartment, parsedStart, parsedEnd)) {
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

    const newReservation = await Reservations.create({
      apartment: apartmentId,
      guestName,
      guestEmail,
      guestPhoneNumber,
      startDate: parsedStart,
      endDate: parsedEnd,
      numberOfGuests,
      totalPrice,
    });

    apartment.bookedDates.push({ startDate: parsedStart, endDate: parsedEnd });
    await apartment.save();

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
    const deleteReservation = await Reservation.findByIdAndDelete(id);
    if (!deleteReservation) {
      res.status(404).send({ message: "reservation is not found" });
      return;
    }
    res.status(200).send({
      message: "Apartment deleted successfully",
      reservation: deleteReservation,
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
