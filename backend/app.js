const express = require("express");
const cors = require("cors");
const { uploadDir } = require("./upload");

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

app.use(express.json());
app.use("/uploads", express.static(uploadDir));

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

app.use("/", (req, res) => {
  res.send("DB server is working");
});

module.exports = app;
