const salonService = require('../services/salon.service');
const reviewService = require('../services/review.service');
const catchAsync = require('../utils/catchAsync');
const { createReviewSchema } = require('../validators/schemas');

/**
 * GET /api/salons/nearby?lat=...&lng=...&radius=...
 */
const getNearbySalons = catchAsync(async (req, res) => {
  const { lat, lng, radius = 50 } = req.query;

  const nearbySalons = await salonService.getNearbySalons({ lat, lng, radius });

  res.status(200).json({
    success: true,
    data: nearbySalons,
  });
});

/**
 * GET /api/salons
 */
const getAllSalons = catchAsync(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const result = await salonService.getAllSalons({ page, limit });

  res.status(200).json({
    success: true,
    data: result.salons,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    },
  });
});

/**
 * GET /api/salons/:id
 */
const getSalonById = catchAsync(async (req, res) => {
  const salon = await salonService.getSalonById(req.params.id);

  res.status(200).json({ success: true, data: salon });
});

/**
 * GET /api/salons/:id/services
 */
const getSalonServices = catchAsync(async (req, res) => {
  const services = await salonService.getSalonServices(req.params.id);

  res.status(200).json({ success: true, data: services });
});

/**
 * POST /api/salons/:id/reviews
 */
const addReview = catchAsync(async (req, res) => {
  const salonId = req.params.id;
  const { name, email, phone, rating, comment } = createReviewSchema.parse(req.body);

  const review = await reviewService.addReview({ salonId, name, email, phone, rating, comment });

  res.status(201).json({ success: true, data: review, message: 'Review successfully submitted.' });
});

/**
 * GET /api/salons/reviews/recent
 */
const getRecentReviews = catchAsync(async (req, res) => {
  const reviews = await salonService.getRecentReviews();

  res.status(200).json({ success: true, data: reviews });
});

module.exports = {
  getNearbySalons,
  getRecentReviews,
  getAllSalons,
  getSalonById,
  getSalonServices,
  addReview,
};
