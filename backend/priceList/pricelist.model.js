const mongoose = require("mongoose");

const priceListSchema = new mongoose.Schema(
  {
    priceListName: {
      type: String,
      required: true,
    },

    periods: [
      {
        startDate: {
          type: Date,
          required: true,
        },

        endDate: {
          type: Date,
          required: true,
        },

        pricePerNight: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PriceList = mongoose.model("PriceList", priceListSchema);
module.exports = PriceList;
