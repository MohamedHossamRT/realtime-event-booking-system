const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    row: { type: String, required: true }, // "A"
    number: { type: Number, required: true }, // 1
    label: { type: String, required: true }, // "A1"
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "locked", "booked"],
      default: "available",
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

// Compound Index Event + Status
seatSchema.index({ event: 1, status: 1 });

module.exports = mongoose.model("Seat", seatSchema);
