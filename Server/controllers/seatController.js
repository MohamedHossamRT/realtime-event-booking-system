const SeatService = require("../services/seatService");
const catchAsync = require("../utils/catchAsync");

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

  res.status(201).json({
    status: "success",
    data: { booking },
  });
});
