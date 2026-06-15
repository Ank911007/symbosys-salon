const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');

/**
 * Authentication middleware — verifies JWT from Authorization header.
 * Attaches decoded user payload to req.user.
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token is missing or invalid.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const prisma = require('../config/prisma');

    if (decoded.type === 'customer') {
      const customer = await prisma.customer.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, phone: true },
      });

      if (!customer) {
        return next(ApiError.unauthorized('User account no longer exists. Please register again.'));
      }

      req.user = {
        id: customer.id,
        email: customer.email,
        role: 'CUSTOMER',
        name: customer.name,
      };

      return next();
    }

    // Verify the user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) {
      return next(ApiError.unauthorized('User account no longer exists. Please register again.'));
    }

    // Attach the fresh DB user data (not just the JWT payload)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err) {
    next(err); // Will be caught by errorHandler (JWT errors)
  }
}

/**
 * Authorization middleware factory — restricts access to specified roles.
 * Must be used AFTER authenticate middleware.
 *
 * @param  {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(
        'You do not have permission to perform this action.'
      ));
    }

    next();
  };
}

/**
 * Authentication middleware for customers — verifies JWT from Authorization header.
 * Looks up the customers table. Attaches decoded customer to req.customer.
 */
async function authenticateCustomer(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token is missing or invalid.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    if (decoded.type !== 'customer') {
      return next(ApiError.unauthorized('Invalid token type.'));
    }

    const prisma = require('../config/prisma');
    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: { id: true, phone: true, name: true, email: true, gender: true },
    });

    if (!customer) {
      return next(ApiError.unauthorized('Customer account not found.'));
    }

    req.customer = customer;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware to verify temporary tokens (post-OTP, pre-profile).
 * Attaches decoded phone to req.verifiedPhone.
 */
async function authenticateTempToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Temp token is missing.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    if (decoded.type !== 'temp') {
      return next(ApiError.unauthorized('Invalid token type. OTP verification required.'));
    }

    req.verifiedPhone = decoded.phone;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticate, authorize, authenticateCustomer, authenticateTempToken };
