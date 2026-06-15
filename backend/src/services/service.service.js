const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

/**
 * Get all active services with optional pagination.
 * @param {{ page?: number, limit?: number }} options
 * @returns {Promise<{ services: object[], total: number, page: number, limit: number }>}
 */
async function getAllServices({ page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const where = { isActive: true };

  const services = await prisma.service.findMany({
    where,
    orderBy: { name: 'asc' },
    skip,
    take: limit,
  });

  const allActive = await prisma.service.findMany({ where, select: { id: true } });
  const total = allActive.length;

  return { services, total, page, limit };
}

/**
 * Get a single service by ID.
 * @param {string} serviceId
 * @returns {Promise<object>}
 */
async function getServiceById(serviceId) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw ApiError.notFound('Service not found.');
  }

  return service;
}

/**
 * Create a new service (Admin only).
 * @param {{ name: string, description?: string, duration: number, price: number }} data
 * @returns {Promise<object>}
 */
async function createService(data) {
  return prisma.service.create({ data });
}

/**
 * Update an existing service (Admin only).
 * @param {string} serviceId
 * @param {object} data
 * @returns {Promise<object>}
 */
async function updateService(serviceId, data) {
  await getServiceById(serviceId); // Throws 404 if not found
  return prisma.service.update({ where: { id: serviceId }, data });
}

/**
 * Soft-delete a service by marking it inactive (Admin only).
 * @param {string} serviceId
 * @returns {Promise<object>}
 */
async function deleteService(serviceId) {
  await getServiceById(serviceId); // Throws 404 if not found
  return prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
