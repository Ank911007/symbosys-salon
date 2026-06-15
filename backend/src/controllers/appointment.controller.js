const appointmentService = require('../services/appointment.service');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /api/appointments
 */
const book = catchAsync(async (req, res) => {
  const appointment = await appointmentService.bookAppointment({
    userId: req.user.id,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully.',
    data: { appointment },
  });
});

/**
 * GET /api/appointments
 */
const getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const { status } = req.query;

  const result = await appointmentService.getAppointments({
    userId: req.user.id,
    role: req.user.role,
    page,
    limit,
    status,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/appointments/:id
 */
const getById = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(
    req.params.id,
    req.user.id,
    req.user.role
  );

  res.status(200).json({
    success: true,
    data: { appointment },
  });
});

/**
 * PATCH /api/appointments/:id/status
 */
const updateStatus = catchAsync(async (req, res) => {
  const appointment = await appointmentService.updateAppointmentStatus(
    req.params.id,
    req.body.status,
    req.user.id,
    req.user.role
  );

  res.status(200).json({
    success: true,
    message: 'Appointment status updated successfully.',
    data: { appointment },
  });
});

module.exports = { book, getAll, getById, updateStatus };
