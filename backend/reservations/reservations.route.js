const express = require("express");
const {
  addReservation,
  allReservations,
  getSingleReservation,
  deleteReservation,
} = require("./reservations.controller.js");
const verifyToken = require("../middleware/verifyToken.js");

const router = express.Router();

router.post("/", addReservation);

router.get("/", verifyToken, allReservations);

router.get("/:id", verifyToken, getSingleReservation);

router.delete("/:id", verifyToken, deleteReservation);

module.exports = router;
