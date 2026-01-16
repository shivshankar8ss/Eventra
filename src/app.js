const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const eventRoutes = require("./modules/events/events.routes");
const rateLimiter = require("./middlewares/rateLimiter.middleware");
const bookingRoutes = require("./modules/bookings/bookings.routes");
const paymentRoutes = require("./modules/payments/payments.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Eventra API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use(rateLimiter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
module.exports = app;
