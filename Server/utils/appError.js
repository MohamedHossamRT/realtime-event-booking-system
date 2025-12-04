class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // If code is 4xx, it's a 'fail'. If 5xx, it's an 'error'.
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Operational errors are predicted.
    // Programming errors (bugs) are not.
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
