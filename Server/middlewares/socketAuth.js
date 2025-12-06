const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

// Standard HTTP headers don't exist in WebSockets in the same way,
// So this is a specialized middleware to intercept the "Handshake"
// And validate the JWT before allowing the connection.

const socketAuth = async (socket, next) => {
  try {
    // Getting token from handshake auth object
    // Client sends: io({ auth: { token: "Bearer ..." } })
    const token = socket.handshake.auth.token?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attaching the user to Socket
    const user = await User.findById(decoded.id)
      .select("_id name email role")
      .lean();

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attaching also to the socket instance so that it can be used in events later
    socket.data.user = user;

    // Initializing a set to track locks held by this specific socket session
    // So that an auto-release lock happens if they close the tab
    socket.data.heldSeats = new Set();

    next();
  } catch (err) {
    logger.warn(`Socket Auth Failed: ${err.message}`);
    next(new Error("Authentication error: Invalid token"));
  }
};

module.exports = socketAuth;
