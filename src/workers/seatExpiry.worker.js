const redis = require("../config/redis");
const pool = require("../config/postgress");
(async () => {
  const sub = redis.duplicate();
  await sub.psubscribe("__keyevent@0__:expired");

  sub.on("pmessage", async (_, __, expiredKey) => {
    if (!expiredKey.startsWith("hold:booking:")) return;

    const bookingId = expiredKey.split(":")[2];

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `SELECT event_id, seat_number, status 
         FROM bookings WHERE id=$1`,
        [bookingId]
      );

      if (!result.rows.length) return;
      if (result.rows[0].status !== "HELD") return;

      const { event_id, seat_number } = result.rows[0];
      await client.query(
        `UPDATE seats 
         SET is_booked=false 
         WHERE event_id=$1 AND seat_number=$2`,
        [event_id, seat_number]
      );
      await client.query(
        `UPDATE bookings 
         SET status='EXPIRED' 
         WHERE id=$1`,
        [bookingId]
      );
      await client.query("COMMIT");
      console.log(`Seat released for booking ${bookingId}`);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
    } finally {
      client.release();
    }
  });
})();
