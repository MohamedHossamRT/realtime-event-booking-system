const z = require("zod");

exports.lockPayloadSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  seatId: z.string().min(1, "Seat ID is required"),
});

exports.joinRoomSchema = z.string().min(1, "Event ID is required");
