const logger = require("../utils/logger");

exports.errorHandler = (err, req, res, next) => {
  // Default to 500 if unknown
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // Log the error for the developer
  logger.error(
    `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // Development: Send response to client
  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status: status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: No stack traces leaked
    res.status(statusCode).json({
      status: status,
      message: statusCode === 500 ? "Something went wrong!" : err.message,
    });
  }
};
