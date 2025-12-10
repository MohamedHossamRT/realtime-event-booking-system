const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "An event must have a title"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "An event must have a venue name"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "An event must have a date"],
    },
    status: {
      type: String,
      enum: ["draft", "active", "ended", "cancelled"],
      default: "active",
    },
    venueConfig: {
      rows: { type: Number, required: true, min: 1, max: 26 }, // (A-Z)
      cols: { type: Number, required: true, min: 1, max: 50 },
      price: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
