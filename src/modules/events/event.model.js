const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    genre: [String],
    artists: [String],
    date: Date,
    venueId: Number,
    images: [String],
    createdBy: { type: Number, required: true } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
