require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

module.exports = { storage };

const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];
const envOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: [...defaultOrigins, ...envOrigins],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

const port = process.env.PORT || 8080;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const apartmentsRouter = require("./apartments/apartments.route");
const reservationsRoutes = require("./reservations/reservations.route");
const loginoutRoutes = require("./login-out/user.route");
const contactRoutes = require("./contact/contact.route");
const priceListRoutes = require("./priceList/pricelist.route");

app.use("/api/apartments", apartmentsRouter);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/user", loginoutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/pricelist", priceListRoutes);

main()
  .then(() => console.log("Mongodb connect successfully!"))
  .catch((err) => console.log(err));

//process.env.DB_URL
async function main() {
  await mongoose.connect(process.env.DB_URL);

  app.use("/", (req, res) => {
    res.send("DB server is working");
  });
}

app.listen(port, () => {
  console.log(`Pokrenuta je express aplikacija na portu ${port}`);
});
