const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, phone?: string, role?: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
async function register({ name, email, password, phone, role, otp, salonName, salonAddress, lat, lng, website, image }) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw ApiError.conflict('A user with this email already exists.');
  }

  if (role === 'SALON_OWNER') {
    // TODO: Replace with real SMS/Email OTP service (e.g. Twilio, SendGrid)
    // In development, accept the hardcoded test OTP
    if (process.env.NODE_ENV === 'development') {
      if (!otp || otp !== '123456') {
        throw ApiError.badRequest('Invalid OTP. Please use 123456 for testing.');
      }
    } else {
      // In production, OTP must be verified against a real service
      if (!otp) {
        throw ApiError.badRequest('OTP verification is required.');
      }
      // TODO: Verify OTP against real service here
    }
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, phone, role: role || 'CUSTOMER' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  const token = generateToken(user);

  // Auto-create a salon + address for SALON_OWNER users
  if (user.role === 'SALON_OWNER') {
    await prisma.$transaction(async (tx) => {
      const salon = await tx.salon.create({
        data: {
          name: salonName || `${user.name}'s Salon`,
          website: website || null,
          image: image || null,
          ownerId: user.id,
          openTime: '09:00',
          closeTime: '21:00',
        },
      });

      await tx.salonAddress.create({
        data: {
          address: salonAddress || 'Update your address',
          lat: lat || 23.3441,
          lng: lng || 85.3096,
          salonId: salon.id,
        },
      });
    });
  }

  return { user, token };
}

/**
 * Authenticate a user and return a JWT.
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true
    }
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const token = generateToken(user);

  // Return user without passwordHash
  const { passwordHash, ...safeUser } = user;

  return { user: safeUser, token };
}

module.exports = { register, login };
