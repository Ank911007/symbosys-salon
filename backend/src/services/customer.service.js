const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { generateCustomerToken, generateTempToken } = require('../utils/jwt');

// In-memory OTP store for development. In production, use Redis or an SMS service.
const otpStore = new Map();

/**
 * Check if a phone number belongs to an existing customer.
 * - If existing: return JWT + customer data (no OTP needed).
 * - If new: generate and store OTP, return { isNew: true }.
 */
async function checkPhone({ phone }) {
  const existing = await prisma.customer.findUnique({ where: { phone } });

  if (existing) {
    // Existing customer — auto login, no OTP
    const token = generateCustomerToken(existing);
    return {
      isNew: false,
      customer: {
        id: existing.id,
        phone: existing.phone,
        name: existing.name,
        email: existing.email,
        gender: existing.gender,
      },
      token,
    };
  }

  // New phone — send OTP
  if (process.env.NODE_ENV === 'development') {
    // Development-only: use hardcoded OTP for testing
    const otp = '123456';
    otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
  } else {
    // Production: integrate real SMS service (e.g. Twilio, MSG91)
    // TODO: Replace with actual SMS OTP delivery
    throw ApiError.internal('OTP service not configured for production.');
  }

  return { isNew: true };
}

/**
 * Verify OTP for a new customer's phone number.
 * Returns a temporary token that allows profile completion.
 */
async function verifyOtp({ phone, otp }) {
  const stored = otpStore.get(phone);

  if (!stored) {
    throw ApiError.badRequest('No OTP was sent for this phone number. Please try again.');
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    throw ApiError.badRequest('OTP has expired. Please request a new one.');
  }

  if (stored.otp !== otp) {
    throw ApiError.badRequest('Invalid OTP. Please try again.');
  }

  // OTP verified — clean up and return temp token
  otpStore.delete(phone);
  const tempToken = generateTempToken({ phone });

  return { verified: true, tempToken };
}

/**
 * Complete a new customer's profile after OTP verification.
 * Creates the customer row and returns a full JWT.
 */
async function completeProfile({ phone, name, email, gender }) {
  // Check if customer already exists (race condition guard)
  const existing = await prisma.customer.findUnique({ where: { phone } });
  if (existing) {
    throw ApiError.conflict('An account with this phone number already exists.');
  }

  const customer = await prisma.customer.create({
    data: {
      phone,
      name,
      email: email || null,
      gender: gender || null,
    },
  });

  const token = generateCustomerToken(customer);

  return {
    customer: {
      id: customer.id,
      phone: customer.phone,
      name: customer.name,
      email: customer.email,
      gender: customer.gender,
    },
    token,
  };
}

/**
 * Get customer profile by ID.
 */
async function getCustomerById(id) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      id: true,
      phone: true,
      name: true,
      email: true,
      gender: true,
      createdAt: true,
    },
  });

  if (!customer) {
    throw ApiError.notFound('Customer not found.');
  }

  return customer;
}

module.exports = { checkPhone, verifyOtp, completeProfile, getCustomerById };
