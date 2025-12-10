const SeatService = require("../services/seatService");
const logger = require("../utils/logger");
const validateSocket = require("../utils/socketValidator");
const {
  lockPayloadSchema,
  joinRoomSchema,
} = require("../validations/socketValidation");

module.exports = (io, socket) => {
  const user = socket.data.user;

  // Helper: To release all locks for this user (DRY principle)
  const releaseHeldSeats = async () => {
    if (socket.data.heldSeats.size > 0) {
      logger.info(
        `Releasing ${socket.data.heldSeats.size} locks for user ${user.name}`
      );

      for (const item of socket.data.heldSeats) {
        const [eventId, seatId] = item.split(":");

        // Release in Redis
        await SeatService.releaseSeat(eventId, seatId, user._id.toString());

        // Notify Room
        io.to(eventId).emit("seat_released", { seatId });
      }
      // Clear local set
      socket.data.heldSeats.clear();
    }
  };

  // EVENT: Join Room
  socket.on(
    "join_event",
    validateSocket(joinRoomSchema, (eventId) => {
      socket.join(eventId);
      logger.info(`User ${user.name} joined room: ${eventId}`);
    })
  );

  // EVENT: Leave Room
  // When user goes to another page, their locks are released
  socket.on(
    "leave_event",
    validateSocket(joinRoomSchema, async (eventId) => {
      await releaseHeldSeats();
      socket.leave(eventId);
    })
  );

  // EVENT: Request Lock
  socket.on(
    "request_lock",
    validateSocket(lockPayloadSchema, async ({ eventId, seatId }) => {
      try {
        await SeatService.lockSeat(eventId, seatId, user._id.toString());

        // Track the seat locally for cleanup on disconnect
        socket.data.heldSeats.add(`${eventId}:${seatId}`);

        // Emitting to everyone in the room so their UI updates instantly
        io.to(eventId).emit("seat_locked", {
          seatId,
          lockedBy: user._id,
        });

        // TIMEOUT SYNC
        // As redis expires silently. setting a timer to notify the UI is a better option.
        setTimeout(async () => {
          // Checking if this specific socket still holds the lock locally
          if (socket.data.heldSeats.has(`${eventId}:${seatId}`)) {
            logger.info(`Auto-releasing expired lock for ${seatId}`);

            // Force release in Redis (in case Redis timer drifted slightly)
            await SeatService.releaseSeat(eventId, seatId, user._id.toString());

            // Notifying everyone (including me) that it's free
            io.to(eventId).emit("seat_released", { seatId });

            // Remove from local tracking
            socket.data.heldSeats.delete(`${eventId}:${seatId}`);
          }
        }, 600000); // 10 minutes (600,000 ms)
      } catch (error) {
        // Send error ONLY to the user who requested it
        socket.emit("lock_failed", {
          seatId,
          message: error.message,
        });
      }
    })
  );

  socket.on(
    "release_lock",
    validateSocket(lockPayloadSchema, async ({ eventId, seatId }) => {
      try {
        const success = await SeatService.releaseSeat(
          eventId,
          seatId,
          user._id.toString()
        );

        if (success) {
          socket.data.heldSeats.delete(`${eventId}:${seatId}`);

          // Emitting to everyone that the seat is green again
          io.to(eventId).emit("seat_released", { seatId });
        }
      } catch (error) {
        logger.error(`Release Error: ${error.message}`);
      }
    })
  );

  socket.on("disconnect", async () => {
    // Auto-release all locks held by this connection
    if (socket.data.heldSeats.size > 0) {
      logger.info(
        `Cleaning up ${socket.data.heldSeats.size} locks for disconnected user ${user.name}`
      );

      for (const item of socket.data.heldSeats) {
        const [eventId, seatId] = item.split(":");

        // Attempting to release in Redis
        await SeatService.releaseSeat(eventId, seatId, user._id.toString());

        // Notifying others that these seats are free
        io.to(eventId).emit("seat_released", { seatId });
      }
    }
  });
};
