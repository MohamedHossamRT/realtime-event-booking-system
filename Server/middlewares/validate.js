const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const validate = (schema) =>
  catchAsync(async (req, res, next) => {
    // Check Request Body, Query, or Params against the Zod schema
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      // Format Zod errors into a readable string
      const errorMessage = result.error.errors.map((e) => e.message).join(". ");
      return next(new AppError(`Validation Error: ${errorMessage}`, 400));
    }

    // Replacing body, query and parms with the strictly validated data
    // For striping out any extra fields the hacker might have added
    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query;
    if (result.data.params) req.params = result.data.params;

    next();
  });

module.exports = validate;
