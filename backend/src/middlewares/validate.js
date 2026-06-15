/**
 * Validation middleware factory using Zod schemas.
 * Validates req.body, req.query, or req.params against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} [source='body'] - Which part of the request to validate
 * @returns {Function} Express middleware
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // Forward Zod error — errorHandler will format it
      return next(result.error);
    }

    // Replace with parsed (and potentially transformed/coerced) data
    req[source] = result.data;
    next();
  };
}

module.exports = validate;
