const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorHandler");
const logger = require("./utils/logger");
const AppError = require("./utils/appError");

const app = express();

// Middlewares
app.use(helmet()); // Security Headers

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); // Limiting body size for (DoS protection)

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

const authRouter = require("./routes/authRoutes");
const eventRouter = require("./routes/eventRoutes");
const bookingRouter = require("./routes/bookingRoutes");

// API Routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/bookings", bookingRouter);

// Unhandled Routes (404)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Globale Error Handling Middleware
app.use(errorHandler);

module.exports = app;
