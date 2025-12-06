const SeatService = require("../services/seatService");
const logger = require("../utils/logger");

module.exports = (io, socket) => {
  const user = socket.data.user;

  socket.on("join_event", (eventId) => {
    socket.join(eventId);
    logger.info(`User ${user.name} joined room: ${eventId}`);
  });

  socket.on("leave_event", (eventId) => {
    socket.leave(eventId);
  });

  socket.on("request_lock", async ({ eventId, seatId }) => {
    try {
      await SeatService.lockSeat(eventId, seatId, user._id.toString());

      // Track the seat locally for cleanup on disconnect
      socket.data.heldSeats.add(`${eventId}:${seatId}`);

      // Emitting to everyone in the room so their UI updates instantly
      io.to(eventId).emit("seat_locked", {
        seatId,
        lockedBy: user._id,
      });
    } catch (error) {
      // Send error ONLY to the user who requested it
      socket.emit("lock_failed", {
        seatId,
        message: error.message,
      });
    }
  });

  socket.on("release_lock", async ({ eventId, seatId }) => {
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
  });

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
