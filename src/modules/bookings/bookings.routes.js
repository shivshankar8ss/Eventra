const express = require("express");
const router = express.Router();

const auth = require("../auth/auth.middleware");
const controller = require("./bookings.controller");

/**
 * @swagger
 * /api/bookings/book:
 *   post:
 *     summary: Book a seat
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: number
 *               seatNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seat booked
 */


router.post("/book", auth, controller.bookSeat);

module.exports = router;
