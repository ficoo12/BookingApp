const Apartments = require("./apartments.model");

const createApartments = async (req, res) => {
  console.log("📩 Received data in backend:", req.body);
  console.log("🖼️ Uploaded files:", req.files);
  const filePaths = req.files.map((file) => file.path);
  const features = JSON.parse(req.body.features);
  try {
    const apartment = {
      ...req.body,
      user_id: req.user.sub,
      features: features,
      pictures: filePaths,
    };
    const newApartment = await Apartments(apartment);
    await newApartment.save();
    res.status(200).send({
      message: "Novi apartman je uspješno kreiran",
      apartment: newApartment,
    });
  } catch (error) {
    console.error("Error while adding apartment:", error);
    res.status(500).json({ message: "Failed to add apartment" });
  }
};

const getAllApartments = async (req, res) => {
  const user_id = req.user.sub;
  try {
    const apartments = await Apartments.find({ user_id }).sort({
      createdAt: -1,
    });
    res.status(200).send(apartments);
  } catch (error) {
    console.error("Error fetching apartments", error);
    res.status(500).send({ message: "Failed to fetch apartments" });
  }
};

const getSingleAparment = async (req, res) => {
  try {
    const _id = req.params.id;
    const apartment = await Apartments.find({ _id });
    if (!apartment.length) {
      res.status(404).send({ message: "Apartment not Found!" });
      return;
    }
    res.status(200).send(apartment);
  } catch (error) {
    console.error("Error fetching apartment", error);
    res.status(500).send({ message: "Failed to fetch apartment" });
  }
};

const isAvailable = (apartment, startDate, endDate) => {
  return !apartment.bookedDates.some(
    (booking) =>
      new Date(booking.startDate) <= new Date(endDate) &&
      new Date(booking.endDate) >= new Date(startDate)
  );
};
const availableApartments = async (req, res) => {
  try {
    const { startDate, endDate, guests } = req.query;

    if (!startDate || !endDate || !guests) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);
    const guestCount = parseInt(guests, 10);

    if (
      isNaN(parsedStart.getTime()) ||
      isNaN(parsedEnd.getTime()) ||
      isNaN(guestCount)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid date or guest parameters" });
    }

    const apartments = await Apartments.find({
      guests: { $gte: guestCount },
      available: true,
    });

    const availableApartments = apartments.filter((apartment) =>
      isAvailable(apartment, parsedStart, parsedEnd)
    );

    res.json(availableApartments);
  } catch (error) {
    console.error("Error fetching available apartments:", error);
    res.status(500).send({ message: "Failed to fetch available apartments" });
  }
};

const updateApartment = async (req, res) => {
  console.log("📩 Received data in backend:", req.body);
  console.log("🖼️ Uploaded files:", req.files);

  try {
    const user_id = req.user.sub;
    const _id = req.params.id;

    // Fetch the existing apartment
    const existingApartment = await Apartments.findOne({ _id, user_id });
    if (!existingApartment) {
      return res.status(404).send({ message: "Apartment not found!" });
    }

    // Retain previous images if no new images are uploaded
    const previousImages = req.body.pictures
      ? JSON.parse(req.body.pictures)
      : existingApartment.pictures;

    // If new files are uploaded, merge them with existing ones
    const newImages = req.files ? req.files.map((file) => file.path) : [];
    const updatedPictures = [...previousImages, ...newImages];

    // Parse features array from request
    const features = JSON.parse(req.body.features);

    // Update the apartment
    const updatedApartment = await Apartments.findByIdAndUpdate(
      { _id, user_id },
      {
        ...req.body,
        user_id: req.user.sub,
        features: features,
        pictures: updatedPictures, // Retain previous images if needed
      },
      { new: true }
    );

    res.status(200).send({
      message: "Apartment updated successfully",
      apartment: updatedApartment,
    });
  } catch (error) {
    console.error("Error updating apartment", error);
    res.status(500).send({ message: "Failed to update apartment" });
  }
};

const deleteAparment = async (req, res) => {
  try {
    const user_id = req.user.sub;
    const _id = req.params.id;
    const deleteApartment = await Apartments.findOneAndDelete({ _id, user_id });
    if (!deleteApartment) {
      res.status(404).send({ message: "Apartment is not found!" });
      return;
    }
    res.status(200).send({
      message: "Apartment deleted successfully",
      apartment: deleteApartment,
    });
  } catch (error) {
    console.error("Error deleting a apartment", error);
    res.status(500).send({ message: "Failed to delete a apartment" });
  }
};

module.exports = {
  getAllApartments,
  createApartments,
  getSingleAparment,
  updateApartment,
  deleteAparment,
  availableApartments,
};
