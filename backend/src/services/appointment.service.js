const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

/**
 * Book a new appointment.
 * Validates that the service exists and checks for time conflicts.
 *
 * @param {{ userId: string, serviceId: string, startTime: Date, notes?: string }} data
 * @returns {Promise<object>}
 */
async function bookAppointment({ userId, serviceId, startTime, notes, customerName, customerPhone, customerEmail }) {
  // Verify service exists
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service || !service.isActive) {
    throw ApiError.notFound('Service not found or is no longer available.');
  }

  // Calculate end time based on service duration
  const start = new Date(startTime);
  const end = new Date(start.getTime() + service.duration * 60 * 1000);

  // Check for overlapping appointments for this user
  const conflict = await prisma.appointment.findFirst({
    where: {
      customer_id: userId,
      status: { notIn: ['CANCELLED'] },
      OR: [
        {
          startTime: { lt: end },
          endTime: { gt: start },
        },
      ],
    },
  });

  if (conflict) {
    throw ApiError.conflict(
      'You already have an appointment during this time slot.'
    );
  }

  const appointment = await prisma.appointment.create({
    data: {
      customer_id: userId,
      salonId: service.salonId,
      serviceId,
      startTime: start,
      endTime: end,
      notes: notes || null,
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      customerEmail: customerEmail || null,
    },
    include: {
      service: { select: { name: true, duration: true, price: true } },
    },
  });

  return appointment;
}

/**
 * Get appointments — filtered by user for customers, all for admin/stylist.
 *
 * @param {{ userId: string, role: string, page?: number, limit?: number, status?: string }} options
 * @returns {Promise<{ appointments: object[], total: number, page: number, limit: number }>}
 */
async function getAppointments({ userId, role, page = 1, limit = 20, status }) {
  const skip = (page - 1) * limit;

  const where = {};

  // Customers can only see their own appointments
  if (role === 'CUSTOMER') {
    where.customer_id = userId;
  }

  // Optional status filter
  if (status) {
    where.status = status.toUpperCase();
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      service: { select: { name: true, duration: true, price: true } },
      customers: { select: { id: true, name: true, email: true } },
    },
    orderBy: { startTime: 'desc' },
    skip,
    take: limit,
  });

  const total = await prisma.appointment.count({ where });

  return { appointments, total, page, limit };
}

/**
 * Get a single appointment by ID.
 * @param {string} appointmentId
 * @param {string} userId
 * @param {string} role
 * @returns {Promise<object>}
 */
async function getAppointmentById(appointmentId, userId, role) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      service: true,
      customers: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!appointment) {
    throw ApiError.notFound('Appointment not found.');
  }

  // Customers can only view their own appointments
  if (role === 'CUSTOMER' && appointment.customer_id !== userId) {
    throw ApiError.forbidden('You cannot view this appointment.');
  }

  return appointment;
}

/**
 * Update the status of an appointment.
 * @param {string} appointmentId
 * @param {string} status - New status
 * @param {string} userId
 * @param {string} role
 * @returns {Promise<object>}
 */
async function updateAppointmentStatus(appointmentId, status, userId, role) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw ApiError.notFound('Appointment not found.');
  }

  // Customers can only cancel their own appointments
  if (role === 'CUSTOMER') {
    if (appointment.customer_id !== userId) {
      throw ApiError.forbidden('You cannot modify this appointment.');
    }
    if (status !== 'CANCELLED') {
      throw ApiError.forbidden('Customers can only cancel appointments.');
    }
  }

  // Prevent modifying completed or cancelled appointments
  if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) {
    throw ApiError.badRequest(
      `Cannot update an appointment that is already ${appointment.status.toLowerCase()}.`
    );
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: {
      service: { select: { name: true, duration: true, price: true } },
      customers: { select: { id: true, name: true, email: true } },
    },
  });
}

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};
