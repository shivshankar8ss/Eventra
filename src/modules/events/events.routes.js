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

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Event created
 */


router.get("/", getEvents);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), createEvent);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteEvent);

module.exports = router;
