const express = require("express");
const { register, login } = require("./auth.controller");
const authMiddleware = require("./auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

module.exports = router;
