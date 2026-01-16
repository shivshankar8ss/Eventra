const express = require("express");
const router = express.Router();
const auth = require("../auth/auth.middleware");
const controller = require("./payments.controller")

router.post("/pay",auth, controller.pay);
module.exports = router;