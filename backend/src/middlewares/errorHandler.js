const ApiError = require('../utils/ApiError');

/**
 * Global error handling middleware.
 * Catches all errors thrown or passed via next(err) and sends a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma known request errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
  }

  // Handle database connection timeouts and failures
  if (
    err.code === 'ETIMEDOUT' || 
    err.code === 'ECONNREFUSED' || 
    err.code === 'ECONNRESET' ||
    err.message?.includes('Connection terminated due to connection timeout') ||
    err.message?.includes('database host or connection string') ||
    err.message?.includes('fetch failed')
  ) {
    statusCode = 503;
    message = 'Service temporarily unavailable. The database is currently unreachable. Please try again later.';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired.';
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(statusCode).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Log unexpected errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Don't leak internal error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
