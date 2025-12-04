const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/errorHandler");
const logger = require("./utils/logger");

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
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// API Routes
// app.use('/api/v1/events', eventRouter);

// Globale Error Handling Middleware
app.use(errorHandler);

module.exports = app;
