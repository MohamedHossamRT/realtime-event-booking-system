const Redis = require("ioredis");
const logger = require("../utils/logger");

const getRedisConfig = () => {
  // Connection via Full URL
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  // Connection via components
  const isProduction = process.env.NODE_ENV === "production";

  return {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,

    tls: isProduction
      ? {
          rejectUnauthorized: false,
        }
      : undefined,

    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: null,
  };
};

const redis = new Redis(getRedisConfig());

redis.on("connect", () => {
  logger.info("Redis Client Connected to Cloud");
});

redis.on("error", (err) => {
  logger.error("Redis Client Error", { error: err.message });
});

module.exports = redis;
