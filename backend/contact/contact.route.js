const express = require("express");
const { addContact, allContacts } = require("./contact.controller.js");

const router = express.Router();

router.post("/", addContact);

router.get("/", allContacts);

module.exports = router;
