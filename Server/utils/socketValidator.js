const logger = require("./logger");

/**
 * Wraps a socket event handler with Zod validation.
 * @param {Object} schema - The Zod schema to validate against
 * @param {Function} handler - The actual business logic function (socket, data) => void
 */
const validateSocket = (schema, handler) => {
  return async (data, ack) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errorMessage = result.error.errors.map((e) => e.message).join(", ");
      logger.warn(`Socket Validation Error: ${errorMessage}`);

      if (typeof ack === "function") {
        return ack({ status: "error", message: errorMessage });
      }

      return;
    }

    await handler(result.data);
  };
};

module.exports = validateSocket;
