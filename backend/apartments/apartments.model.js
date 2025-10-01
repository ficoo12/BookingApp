const { default: mongoose } = require("mongoose");

const apartmentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: [Number],
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    pictures: {
      type: [String],
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: String,
      required: true,
    },
    bookedDates: [
      {
        startDate: Date,
        endDate: Date,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Apartments = mongoose.model("Apartment", apartmentsSchema);

module.exports = Apartments;
