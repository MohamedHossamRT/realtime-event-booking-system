require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const redis = require("./config/redis");
const logger = require("./utils/logger");

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", {
    error: err.name,
    message: err.message,
  });
  process.exit(1);
});

connectDB();
// redis.connect() is automatic with ioredis

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Store IO instance globally so that Controllers can access it
app.set("io", io);

// Socket Logic
io.on("connection", (socket) => {
  logger.info(`New Socket Connection: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Socket Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", {
    error: err.name,
    message: err.message,
  });
  server.close(() => {
    process.exit(1);
  });
});
