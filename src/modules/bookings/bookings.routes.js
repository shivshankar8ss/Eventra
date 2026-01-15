const express = require("express");
const router = express.Router();

const auth = require("../auth/auth.middleware");
const controller = require("./bookings.controller");

router.post("/book", auth, controller.bookSeat);

module.exports = router;
