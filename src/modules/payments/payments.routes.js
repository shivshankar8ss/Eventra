const express = require("express");
const router = express.Router();
const auth = require("../auth/auth.middleware");
const controller = require("./payments.controller")

/**
 * @swagger
 * /api/payments/pay:
 *   post:
 *     summary: Confirm payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Booking confirmed
 */


router.post("/pay",auth, controller.pay);
module.exports = router;