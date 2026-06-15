const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate a signed JWT for a user (admin/salon owner).
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string} Signed JWT token
 */
function generateToken(payload) {
  return jwt.sign(
    { id: payload.id, name: payload.name, email: payload.email, role: payload.role, type: 'user' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

/**
 * Generate a signed JWT for a customer (phone-based auth).
 * @param {{ id: string, phone: string, name?: string }} payload
 * @returns {string} Signed JWT token
 */
function generateCustomerToken(payload) {
  return jwt.sign(
    { id: payload.id, phone: payload.phone, name: payload.name || null, type: 'customer' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

/**
 * Generate a temporary token for OTP-verified but not yet profiled customers.
 * @param {{ phone: string }} payload
 * @returns {string} Signed JWT token (short-lived)
 */
function generateTempToken(payload) {
  return jwt.sign(
    { phone: payload.phone, type: 'temp' },
    config.jwt.secret,
    { expiresIn: '15m' }
  );
}

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {jwt.JsonWebTokenError}
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { generateToken, generateCustomerToken, generateTempToken, verifyToken };
