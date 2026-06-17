const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication endpoints.
 * Prevents brute-force attacks on login, register, and OTP verification.
 * 
 * Limits: 10 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

/**
 * Rate limiter for OTP-related endpoints.
 * Stricter: 5 requests per 15-minute window per IP.
 */
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 15 minutes.',
  },
});

/**
 * Rate limiter for review submission.
 * Prevents spam: 3 reviews per hour per IP.
 */
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many reviews submitted. Please try again later.',
  },
});

/**
 * General API rate limiter.
 * Prevents abuse: 100 requests per minute per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});

module.exports = { authLimiter, otpLimiter, reviewLimiter, apiLimiter };
