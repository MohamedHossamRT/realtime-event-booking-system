const EventService = require("../services/eventService");
const catchAsync = require("../utils/catchAsync");

exports.createEvent = catchAsync(async (req, res, next) => {
  const event = await EventService.createEvent(req.body);

  res.status(201).json({
    status: "success",
    data: { event },
  });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const events = await EventService.getAllEvents();

  res.status(200).json({
    status: "success",
    results: events.length,
    data: { events },
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await EventService.getEventById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { event },
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const event = await EventService.updateEvent(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { event },
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  await EventService.deleteEvent(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
