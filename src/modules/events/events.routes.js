const express = require("express");
const router = express.Router();
const authMiddleware = require("../auth/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = require("./events.controller");

router.get("/", getEvents);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createEvent);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteEvent);

module.exports = router;
