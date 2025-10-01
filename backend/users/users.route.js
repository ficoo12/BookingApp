const express = require("express");
const { createUser, getAllUsers } = require("./users.controller.js");
const verifyToken = require("../middleware/verifyToken.js");
const router = express.Router();

router
  .route("/")
  .get(getAllUsers)
  .put((req, res, next) => {
    res.set({ Allow: "POST, GET" });
    res.status(405).send({ Allow: "POST, GET" });
  })
  .patch((req, res, next) => {
    res.set({ Allow: "POST, GET" });
    res.status(405).send({ Allow: "POST, GET" });
  })
  .post(createUser)
  .delete((req, res, next) => {
    res.set({ Allow: "POST, GET" });
    res.status(405).send({ Allow: "POST, GET" });
  });

module.exports = router;
