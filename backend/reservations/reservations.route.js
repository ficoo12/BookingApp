const express = require("express");
const {
  addReservation,
  allReservations,
  getSingleReservation,
  deleteReservation,
} = require("./reservations.controller.js");

const router = express.Router();

router.post("/", addReservation);

router.get("/", allReservations);

router.get("/:id", getSingleReservation);

router.delete("/:id", deleteReservation);

module.exports = router;
