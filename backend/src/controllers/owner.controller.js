const prisma = require('../config/prisma');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// ─── Helper: Resolve the owner's salon ─────────────────────────────────────

async function getOwnerSalon(userId) {
  const salon = await prisma.salon.findFirst({
    where: { ownerId: userId },
  });
  if (!salon) {
    throw ApiError.notFound('No salon linked to your account. Please contact support.');
  }
  return salon;
}

// ─── GET /api/owner/salon ──────────────────────────────────────────────────

const getSalon = catchAsync(async (req, res) => {
  const salon = await prisma.salon.findFirst({
    where: { ownerId: req.user.id },
    select: {
      id: true,
      name: true,
      category: true,
      openTime: true,
      closeTime: true,
      isOpen: true,
      rating: true,
      totalReviews: true,
      salonAddress: true,
      services: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, price: true, duration: true, isActive: true }
      },
      stylists: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, bio: true }
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          isApproved: true,
          createdAt: true,
          customers: { select: { name: true, email: true } }
        }
      },
      _count: {
        select: { appointments: true, reviews: true, services: true, stylists: true },
      },
    },
  });

  if (!salon) {
    throw ApiError.notFound('No salon linked to your account.');
  }

  res.status(200).json({ success: true, data: salon });
});

// ─── PATCH /api/owner/salon ────────────────────────────────────────────────

const updateSalon = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const { updateSalonSchema } = require('../validators/schemas');
  const validated = updateSalonSchema.parse(req.body);

  // Separate salonAddress data from salon data
  const { salonAddress: addressData, ...salonData } = validated;

  const updated = await prisma.$transaction(async (tx) => {
    const updatedSalon = await tx.salon.update({
      where: { id: salon.id },
      data: salonData,
    });

    // Update or create salonAddress if address data is provided
    if (addressData && Object.keys(addressData).length > 0) {
      await tx.salonAddress.upsert({
        where: { salonId: salon.id },
        update: addressData,
        create: {
          address: addressData.address || 'Update your address',
          lat: addressData.lat || 0,
          lng: addressData.lng || 0,
          salonId: salon.id,
        },
      });
    }

    return updatedSalon;
  });

  res.status(200).json({ success: true, data: updated, message: 'Salon updated successfully.' });
});

// ─── Services CRUD ─────────────────────────────────────────────────────────

const getServices = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const services = await prisma.service.findMany({
    where: { salonId: salon.id },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, data: services });
});

const addService = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const { createServiceSchema } = require('../validators/schemas');
  const validated = createServiceSchema.parse(req.body);

  const service = await prisma.service.create({
    data: { ...validated, salonId: salon.id },
  });

  res.status(201).json({ success: true, data: service, message: 'Service added.' });
});

const updateService = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  // Verify service belongs to this salon
  const existing = await prisma.service.findFirst({
    where: { id: req.params.serviceId, salonId: salon.id },
  });
  if (!existing) throw ApiError.notFound('Service not found in your salon.');

  const { updateServiceSchema } = require('../validators/schemas');
  const validated = updateServiceSchema.parse(req.body);

  const service = await prisma.service.update({
    where: { id: req.params.serviceId },
    data: validated,
  });

  res.status(200).json({ success: true, data: service, message: 'Service updated.' });
});

const deleteService = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const existing = await prisma.service.findFirst({
    where: { id: req.params.serviceId, salonId: salon.id },
  });
  if (!existing) throw ApiError.notFound('Service not found in your salon.');

  await prisma.service.delete({ where: { id: req.params.serviceId } });
  res.status(200).json({ success: true, message: 'Service deleted.' });
});

// ─── Stylists CRUD ─────────────────────────────────────────────────────────

const getStylists = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const stylists = await prisma.stylist.findMany({
    where: { salonId: salon.id },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, data: stylists });
});

const addStylist = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const { name, bio } = req.body;
  if (!name || name.length < 2) {
    throw ApiError.badRequest('Stylist name must be at least 2 characters.');
  }

  const stylist = await prisma.stylist.create({
    data: { name, bio: bio || null, salonId: salon.id },
  });

  res.status(201).json({ success: true, data: stylist, message: 'Stylist added.' });
});

const deleteStylist = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const existing = await prisma.stylist.findFirst({
    where: { id: req.params.stylistId, salonId: salon.id },
  });
  if (!existing) throw ApiError.notFound('Stylist not found in your salon.');

  await prisma.stylist.delete({ where: { id: req.params.stylistId } });
  res.status(200).json({ success: true, message: 'Stylist removed.' });
});

// ─── Appointments ──────────────────────────────────────────────────────────

const getAppointments = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);
  const { status, page = 1, limit = 50 } = req.query;

  const where = { salonId: salon.id };
  if (status) where.status = status.toUpperCase();

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const appointments = await prisma.appointment.findMany({
    where,
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      notes: true,
      service: { select: { name: true, duration: true, price: true } },
      customers: { select: { name: true, email: true, phone: true } },
      stylist: { select: { name: true } },
    },
    orderBy: { startTime: 'desc' },
    skip,
    take,
  });

  res.status(200).json({ success: true, data: appointments });
});

const updateAppointmentStatus = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const appointment = await prisma.appointment.findFirst({
    where: { id: req.params.id, salonId: salon.id },
  });

  if (!appointment) throw ApiError.notFound('Appointment not found.');

  if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) {
    throw ApiError.badRequest(`Cannot update an appointment that is already ${appointment.status.toLowerCase()}.`);
  }

  const { updateAppointmentStatusSchema } = require('../validators/schemas');
  const { status } = updateAppointmentStatusSchema.parse(req.body);

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status },
    include: {
      service: { select: { name: true, duration: true, price: true } },
      customers: { select: { name: true, email: true, phone: true } },
    },
  });

  res.status(200).json({ success: true, data: updated, message: 'Appointment status updated.' });
});

// ─── Reviews ───────────────────────────────────────────────────────────────

const getReviews = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);

  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const reviews = await prisma.review.findMany({
    where: { salonId: salon.id },
    select: {
      id: true,
      rating: true,
      comment: true,
      isApproved: true,
      createdAt: true,
      customers: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  res.status(200).json({ success: true, data: reviews });
});

const updateReviewApproval = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user.id);
  const { isApproved } = req.body;

  if (typeof isApproved !== 'boolean') {
    throw ApiError.badRequest('isApproved must be a boolean');
  }

  const review = await prisma.review.findFirst({
    where: { id: req.params.id, salonId: salon.id },
  });

  if (!review) throw ApiError.notFound('Review not found.');

  const updatedReview = await prisma.review.update({
    where: { id: req.params.id },
    data: { isApproved },
    include: { customers: { select: { name: true, email: true } } },
  });

  // Re-aggregate the average rating (only for APPROVED reviews)
  const agg = await prisma.review.aggregate({
    where: { salonId: salon.id, isApproved: true },
    _avg: { rating: true },
    _count: { id: true }
  });

  // Update the salon record with the new average rating
  await prisma.salon.update({
    where: { id: salon.id },
    data: { rating: agg._avg.rating || 0, totalReviews: agg._count.id }
  });

  res.status(200).json({ success: true, data: updatedReview, message: 'Review approval status updated.' });
});

// ─── Exports ───────────────────────────────────────────────────────────────

module.exports = {
  getSalon,
  updateSalon,
  getServices,
  addService,
  updateService,
  deleteService,
  getStylists,
  addStylist,
  deleteStylist,
  getAppointments,
  updateAppointmentStatus,
  getReviews,
  updateReviewApproval,
};
