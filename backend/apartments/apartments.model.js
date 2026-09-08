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
    priceList_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PriceList",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
