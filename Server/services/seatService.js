const Seat = require("../models/Seat");
const Booking = require("../models/Booking");
const mongoose = require("mongoose"); // For sessions
const redis = require("../config/redis");
const AppError = require("../utils/appError");

// Fenerate consistent Redis keys
const getRedisKey = (eventId, seatId) => `lock:event:${eventId}:seat:${seatId}`;

/**
 * Fetches permanent state from Mongo and overlays temporary state from Redis.
 * Optimized with MGET for performance.
 */
exports.getEventSeats = async (eventId) => {
  // Fetch all physical seats from MongoDB (Sorted by row/number)
  const seats = await Seat.find({ event: eventId })
    .sort({ row: 1, number: 1 })
    .lean(); // converts Mongoose docs to plain JS objects for speed

  if (!seats.length) return [];

  // Redis Keys for MGET
  const redisKeys = seats.map((seat) =>
    getRedisKey(eventId, seat._id.toString())
  );

  // Fetch ALL locks in ONE call
  const locks = await redis.mget(redisKeys);

  // Merge Data
  const mergedSeats = seats.map((seat, index) => {
    const lockedByUserId = locks[index];

    // A seat is "locked" if Redis has a lock OR Mongo says it's already booked
    if (lockedByUserId) {
      return { ...seat, status: "locked", isTemporarilyHeld: true };
    }

    return seat;
  });

  return mergedSeats;
};

exports.lockSeat = async (eventId, seatId, userId) => {
  const event = await Event.findById(eventId).select("status");
  if (!event || event.status !== "active") {
    throw new AppError("This event is not accepting bookings.", 400);
  }

  const key = getRedisKey(eventId, seatId);

  // Validating -> Does the seat exist and is it physically available?
  // Checking MongoDB first to ensure we aren't locking a booked seat.
  const seat = await Seat.findOne({ _id: seatId, event: eventId });
  if (!seat) throw new AppError("Seat not found", 404);
  if (seat.status === "booked")
    throw new AppError("Seat is already permanently booked", 400);

  // Atomic Lock in Redis
  // NX: Only set if Not Exists to prevent double booking
  // EX: Expire after 600 seconds -> 10 mins
  const result = await redis.set(key, userId, "NX", "EX", 600);

  if (!result) {
    throw new AppError("Seat is currently held by another user", 409); // 409 Conflict
  }

  return { seatId, status: "locked", lockedBy: userId };
};

exports.releaseSeat = async (eventId, seatId, userId) => {
  const key = getRedisKey(eventId, seatId);

  const currentHolder = await redis.get(key);

  // Ensuring the user releasing the lock is the one who holds it
  if (currentHolder === userId) {
    await redis.del(key);
    return true;
  }

  // Lock belonged to someone else or expired
  return false;
};

/**
 * Moves seats from "Redis Lock" to "MongoDB Booked".
 * Using MongoDB Transaction for safety.
 */
exports.bookSeats = async (eventId, userId, seatIds, totalAmount) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lockPromises = seatIds.map((id) =>
      redis.get(getRedisKey(eventId, id))
    );
    const locks = await Promise.all(lockPromises);

    const allLockedByUser = locks.every(
      (lockUser) => lockUser === userId.toString()
    );
    if (!allLockedByUser) {
      throw new AppError(
        "One or more seats have expired or are held by others.",
        400
      );
    }

    // Updating Seats in MongoDB to 'booked'
    const updateResult = await Seat.updateMany(
      {
        _id: { $in: seatIds },
        status: { $ne: "booked" },
      },
      {
        $set: {
          status: "booked",
          bookedBy: userId,
          lockedBy: null,
          lockedAt: null,
        },
      },
      { session }
    );
    if (updateResult.modifiedCount !== seatIds.length) {
      throw new AppError(
        "One or more seats were already booked by another user.",
        409
      );
    }

    // Creating Booking Record
    const booking = await Booking.create(
      [
        {
          event: eventId,
          user: userId,
          seats: seatIds,
          totalAmount,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Cleaning Redis up
    const deleteKeys = seatIds.map((id) => getRedisKey(eventId, id));
    await redis.del(deleteKeys);

    return booking[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
