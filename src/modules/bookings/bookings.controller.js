const pool = require("../../config/postgress");
const { acquireLock, releaseLock } = require("../../utils/redisLock");

exports.bookSeat = async (req, res) => {
  const { eventId, seatNumber } = req.body;
  const userId = req.user.id;

  const lockKey = `lock:event:${eventId}:seat:${seatNumber}`;
  const lockAcquired = await acquireLock(lockKey, 600);
  if (!lockAcquired) {
    return res.status(409).json({
      message: "Seat is currently being booked by another user"
    });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const seatResult = await client.query(
      `SELECT * FROM seats 
       WHERE event_id=$1 AND seat_number=$2 
       FOR UPDATE`,
      [eventId, seatNumber]
    );
    if (seatResult.rows.length === 0) {
      throw new Error("Seat does not exist");
    }
    if (seatResult.rows[0].is_booked) {
      throw new Error("Seat already booked");
    }
    await client.query(
      `UPDATE seats 
       SET is_booked=true 
       WHERE event_id=$1 AND seat_number=$2`,
      [eventId, seatNumber]
    );
    await client.query(
      `INSERT INTO bookings (user_id, event_id, seat_number)
       VALUES ($1, $2, $3)`,
      [userId, eventId, seatNumber]
    );
    await client.query("COMMIT");
    res.status(201).json({ message: "Seat booked successfully" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
    await releaseLock(lockKey);
  }
};
