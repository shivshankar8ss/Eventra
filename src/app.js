const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const eventRoutes = require("./modules/events/events.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Eventra API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
module.exports = app;
