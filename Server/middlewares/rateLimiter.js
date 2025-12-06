const rateLimit = require("express-rate-limit");
const AppError = require("../utils/appError");

exports.loginLimiter = rateLimit({
  max: 10, // Allow 10 attempts
  windowMs: 15 * 60 * 1000, // Per 15 minutes
  message:
    "Too many login attempts from this IP, please try again in 15 minutes!",
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
