const serviceService = require('../services/service.service');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/services
 */
const getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const result = await serviceService.getAllServices({ page, limit });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/services/:id
 */
const getById = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);

  res.status(200).json({
    success: true,
    data: { service },
  });
});

/**
 * POST /api/services
 */
const create = catchAsync(async (req, res) => {
  const service = await serviceService.createService(req.body);

  res.status(201).json({
    success: true,
    message: 'Service created successfully.',
    data: { service },
  });
});

/**
 * PATCH /api/services/:id
 */
const update = catchAsync(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Service updated successfully.',
    data: { service },
  });
});

/**
 * DELETE /api/services/:id
 */
const remove = catchAsync(async (req, res) => {
  await serviceService.deleteService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully.',
  });
});

module.exports = { getAll, getById, create, update, remove };
