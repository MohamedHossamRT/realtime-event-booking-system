const Redis = require("ioredis");
const logger = require("../utils/logger");

const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000); // 50ms, 100ms... up to 2 seconds max
    return delay;
  },
  // Don't crash if Redis is down initially
  lazyConnect: true,
};

const redis = new Redis(redisOptions);

redis.on("connect", () => {
  logger.info("Redis Client Connected");
});

redis.on("error", (err) => {
  // Log error but DO NOT crash the app.
  // The Seat Service handles failed locks gracefully.
  logger.error("Redis Client Error", { error: err.message });
});

module.exports = redis;
