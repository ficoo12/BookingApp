const PriceList = require("./pricelist.model");
const {
  calculateTotalPrice,
} = require("../helperfunction/calculateTotalPrice");

const createPriceList = async (req, res) => {
  try {
    const { priceListName, periods } = req.body;
    const priceList = new PriceList({
      priceListName,
      periods,
    });

    const savedPriceList = await priceList.save();

    res.status(200).json(savedPriceList);
  } catch (error) {
    res.status(500).json({
      message: "Error creating price list",
      error: error.message,
    });
  }
};

const getAllPriceLists = async (req, res) => {
  try {
    const priceLists = await PriceList.find().sort({ createdAt: -1 });

    res.status(200).send(priceLists);
  } catch (error) {
    console.error("Error fetching price lists", error);
    res.status(500).send({ message: "Failed to fetch price lists" });
  }
};

const getSinglePriceList = async (req, res) => {
  try {
    const { id } = req.params;
    const priceList = await PriceList.findById(id);

    if (!priceList) {
      res.status(404).send({ message: "Price list not found!" });
      return;
    }

    res.status(200).send(priceList);
  } catch (error) {
    console.error("Error fetching price list", error);
    res.status(500).send({ message: "Failed to fetch price list" });
  }
};

const updatePriceList = async (req, res) => {
  try {
    const { id } = req.params;
    const { priceListName, periods } = req.body;

    const updatedPriceList = await PriceList.findByIdAndUpdate(
      id,
      { priceListName, periods },
      { new: true }
    );

    if (!updatedPriceList) {
      res.status(404).send({ message: "Price list not found!" });
      return;
    }

    res.status(200).send({
      message: "Price list updated successfully",
      priceList: updatedPriceList,
    });
  } catch (error) {
    console.error("Error updating price list", error);
    res.status(500).json({
      message: "Error updating price list",
      error: error.message,
    });
  }
};

const deletePriceList = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPriceList = await PriceList.findByIdAndDelete(id);

    if (!deletedPriceList) {
      res.status(404).send({ message: "Price list not found!" });
      return;
    }

    res.status(200).send({
      message: "Price list deleted successfully",
      priceList: deletedPriceList,
    });
  } catch (error) {
    console.error("Error deleting price list", error);
    res.status(500).json({
      message: "Error deleting price list",
      error: error.message,
    });
  }
};

const quotePriceList = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const priceList = await PriceList.findById(id);

    if (!priceList) {
      return res.status(404).json({ error: "Price list not found" });
    }

    const totalPrice = calculateTotalPrice(priceList, parsedStart, parsedEnd);

    if (totalPrice === null) {
      return res
        .status(400)
        .json({ error: "No price period covers the selected dates" });
    }

    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error("Error calculating price list quote", error);
    res.status(500).json({ error: "Failed to calculate total price" });
  }
};

module.exports = {
  createPriceList,
  getAllPriceLists,
  getSinglePriceList,
  updatePriceList,
  deletePriceList,
  quotePriceList,
};
