const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "booking-service" },
  transports: [
    // Write all logs with importance of level "error" or less to -> error.log
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Write all logs to -> combined.log
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// If we are not in production then log to the "console" with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest })`
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
