const pool = require("../../config/postgress");
const redis = require("../../config/redis");
const emailQueue = require("../../queues/email.queue");


exports.pay = async (req, res) => {
  const { bookingId } = req.body;
  const userId = req.user.id;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `SELECT id, user_id, status
       FROM bookings
       WHERE id=$1
       FOR UPDATE`,
      [bookingId]
    );

    if (!result.rows.length) {
      throw new Error("Booking not found");
    }
    const booking = result.rows[0];

    if (booking.user_id !== userId) {
      throw new Error("Unauthorized");
    }

    if (booking.status !== "HELD") {
      throw new Error("Booking is not in HELD state");
    }
    await client.query(
      `UPDATE bookings
       SET status='CONFIRMED'
       WHERE id=$1`,
      [bookingId]
    );
    await client.query("COMMIT");
    const holdKey = `hold:booking:${bookingId}`;
    await redis.del(holdKey);
    res.json({ message: "Payment successful. Booking confirmed." });
    await emailQueue.add("booking-confirmation", {
    to: req.user.email,
    subject: "Booking Confirmed",
    text: `Your booking #${bookingId} is confirmed.`,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};
