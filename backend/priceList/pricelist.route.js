const express = require("express");
const {
  createPriceList,
  getAllPriceLists,
  getSinglePriceList,
  updatePriceList,
  deletePriceList,
  quotePriceList,
} = require("./pricelist.controller");
const verifyToken = require("../middleware/verifyToken.js");
const router = express.Router();

router.post("/", verifyToken, createPriceList);
router.get("/", verifyToken, getAllPriceLists);
router.get("/:id", verifyToken, getSinglePriceList);
router.patch("/:id", verifyToken, updatePriceList);
router.delete("/:id", verifyToken, deletePriceList);
router.post("/:id/quote", quotePriceList);

module.exports = router;
