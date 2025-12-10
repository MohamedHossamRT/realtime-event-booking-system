const Event = require("../models/Event");
const Seat = require("../models/Seat");
const AppError = require("../utils/appError");

/**
 * Creates an event and generates the physical seat documents.
 * @param {Object} eventData - The raw body from the controller
 */
exports.createEvent = async (eventData) => {
  // Create the Event Record
  const event = await Event.create({
    title: eventData.title,
    venue: eventData.venue,
    date: eventData.date,
    venueConfig: eventData.venueConfig,
  });

  // Generate Seat Grid
  const seats = [];
  const { rows, cols, price } = eventData.venueConfig;
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (rows > 26) {
    await Event.findByIdAndDelete(event._id);
    throw new AppError("Max rows limit is 26 (A-Z)", 400);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push({
        event: event._id,
        row: rowLabels[r],
        number: c,
        label: `${rowLabels[r]}${c}`,
        price: price,
        status: "available",
      });
    }
  }

  // Bulk Insert for Performance
  await Seat.insertMany(seats);

  return event;
};

exports.getAllEvents = async () => {
  const events = await Event.aggregate([
    // getting active events
    { $match: { status: "active" } },

    // 2. Joining with Seats to count available ones
    // More optimal than fetching all seats and filtering
    {
      $lookup: {
        from: "seats", // seats collection
        let: { eventId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$event", "$$eventId"] },
              status: "available", // Only count available
            },
          },
          { $count: "count" },
        ],
        as: "availableSeatsCount",
      },
    },

    // Flattening the count (Lookup returns an array)
    {
      $addFields: {
        availableSeats: {
          $ifNull: [{ $arrayElemAt: ["$availableSeatsCount.count", 0] }, 0],
        },
      },
    },

    // Removing the temp array
    { $project: { availableSeatsCount: 0 } },

    { $sort: { date: 1 } },
  ]);

  return events;
};

exports.getEventById = async (id) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new AppError("No event found with that ID", 404);
  }
  return event;
};

exports.updateEvent = async (id, updateData) => {
  // Prevent changing Venue Configuration
  if (updateData.venueConfig) {
    throw new AppError(
      "Cannot update venue configuration (rows/cols) after event creation. Please delete and recreate the event if the layout changed.",
      400
    );
  }

  // Update
  const event = await Event.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    throw new AppError("No event found with that ID", 404);
  }

  return event;
};

exports.deleteEvent = async (id) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new AppError("No event found with that ID", 404);
  }

  // Cascading Delete
  await Seat.deleteMany({ event: id });
  await Event.findByIdAndDelete(id);

  return;
};
