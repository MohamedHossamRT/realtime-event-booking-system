const SeatService = require("../services/seatService");
const catchAsync = require("../utils/catchAsync");
const Booking = require("../models/Booking");

exports.getSeats = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const seats = await SeatService.getEventSeats(eventId);

  res.status(200).json({
    status: "success",
    results: seats.length,
    data: { seats },
  });
});

exports.bookSeats = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const { seatIds, totalAmount } = req.body;
  const userId = req.user._id;

  if (!seatIds || seatIds.length === 0) {
    return next(new AppError("No seats selected", 400));
  }

  const booking = await SeatService.bookSeats(
    eventId,
    userId,
    seatIds,
    totalAmount
  );

  // Notifying all users in the event room that these seats are now BOOKED
  const io = req.app.get("io");
  if (io) {
    io.to(eventId).emit("seats_booked", { seatIds });
  }

  res.status(201).json({
    status: "success",
    data: { booking },
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: "event",
      select: "title date venueConfig.address",
    })
    .populate({
      path: "seats",
      select: "row number label price",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});
