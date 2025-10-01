const { default: mongoose } = require("mongoose");

const reservationsSchema = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: true,
  },
  guestName: {
    type: String,
    required: true,
  },
  guestEmail: {
    type: String,
    required: true,
  },
  guestPhoneNumber: {
    type: String,
    required: true,
  },
  numberOfGuests: { type: Number, required: true },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const Reservations = mongoose.model("reservations", reservationsSchema);
module.exports = Reservations;
