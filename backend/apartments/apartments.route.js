const express = require("express");
const multer = require("multer");
const { storage } = require("../index.js");
const verifyToken = require("../middleware/verifyToken.js");
const upload = multer({ storage: storage });
const {
  createApartments,
  getAllApartments,
  getSingleAparment,
  updateApartment,
  deleteAparment,
  availableApartments,
} = require("./apartments.controller.js");

const router = express.Router();

router.post("/", verifyToken, upload.array("pictures", 12), createApartments);

router.get("/", verifyToken, getAllApartments);

router.get("/available", availableApartments);

router.get("/:id", getSingleAparment);

router.patch(
  "/:id",
  verifyToken,
  upload.array("pictures", 12),
  updateApartment
);

router.delete("/:id", verifyToken, deleteAparment);

module.exports = router;
