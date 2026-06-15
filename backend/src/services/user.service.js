const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

/**
 * Get a user by ID (excludes passwordHash).
 * @param {string} userId
 * @returns {Promise<object>}
 */
async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  return user;
}

/**
 * Update a user's profile.
 * @param {string} userId
 * @param {{ name?: string, phone?: string }} data
 * @returns {Promise<object>}
 */
async function updateUser(userId, data) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

module.exports = { getUserById, updateUser };
