const prisma = require('../config/prisma');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/salons/nearby?lat=...&lng=...&radius=...
 */
const getNearbySalons = catchAsync(async (req, res) => {
  const { lat, lng, radius = 50 } = req.query;

  const salons = await prisma.salon.findMany({
    where: { isOpen: true },
    select: {
      id: true,
      name: true,
      category: true,
      image: true,
      rating: true,
      totalReviews: true,
      salonAddress: {
        select: {
          address: true,
          lat: true,
          lng: true
        }
      },
      services: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true
        }
      },
      reviews: {
        where: { isApproved: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          customers: { select: { name: true } }
        }
      }
    }
  });

  // Calculate distance manually since Prisma doesn't have native PostGIS queries built-in
  // without raw SQL. For MVP, memory computation is fine for thousands of rows.
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const nearbySalons = lat && lng 
    ? salons.map(salon => {
        const addr = salon.salonAddress;
        const hasLocation = addr && (addr.lat !== 0 || addr.lng !== 0);
        return {
          ...salon,
          distance: hasLocation ? calculateDistance(parseFloat(lat), parseFloat(lng), addr.lat, addr.lng) : 0,
          hasLocation
        };
      }).filter(s => !s.hasLocation || s.distance <= parseFloat(radius)).sort((a, b) => a.distance - b.distance).slice(0, 50)
    : salons.slice(0, 50);

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
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const salons = await prisma.salon.findMany({
    where: { isOpen: true },
    select: {
      id: true,
      name: true,
      category: true,
      image: true,
      rating: true,
      totalReviews: true,
      salonAddress: {
        select: { address: true, lat: true, lng: true }
      },
      services: {
        select: { id: true, name: true, price: true }
      },
      stylists: {
        select: { id: true, name: true }
      },
      reviews: {
        where: { isApproved: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          customers: { select: { name: true } }
        }
      }
    },
    skip,
    take,
  });
  res.status(200).json({ success: true, data: salons });
});

/**
 * GET /api/salons/:id
 */
const getSalonById = catchAsync(async (req, res) => {
  const salon = await prisma.salon.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      features: true,
      image: true,
      website: true,
      rating: true,
      totalReviews: true,
      isOpen: true,
      openTime: true,
      closeTime: true,
      closedDates: true,
      salonAddress: true, // gets all address fields
      services: {
        where: { isActive: true },
        select: { id: true, name: true, description: true, duration: true, price: true }
      },
      stylists: {
        select: { id: true, name: true, bio: true }
      },
      reviews: { 
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          customers: { select: { name: true } }
        }
      }
    }
  });

  if (!salon) throw ApiError.notFound('Salon not found');
  res.status(200).json({ success: true, data: salon });
});

/**
 * GET /api/salons/:id/services
 */
const getSalonServices = catchAsync(async (req, res) => {
  const services = await prisma.service.findMany({
    where: { salonId: req.params.id, isActive: true }
  });
  res.status(200).json({ success: true, data: services });
});

/**
 * POST /api/salons/:id/reviews
 */
const addReview = catchAsync(async (req, res) => {
  const salonId = req.params.id;

  // Validate request body
  const { createReviewSchema } = require('../validators/schemas');
  const { name, email, phone, rating, comment } = createReviewSchema.parse(req.body);

  // Execute atomic transaction to add review and update salon's rating
  const review = await prisma.$transaction(async (tx) => {
    
    // 0. Upsert the Guest User
    const customer = await tx.customer.upsert({
      where: { phone }, // Assuming phone is unique for Customer
      update: { name, email }, // Update their details if they exist
      create: {
        email,
        name,
        phone,
      }
    });

    const customerId = customer.id;

    // 1. Create the new review (default isApproved is false)
    const newReview = await tx.review.create({
      data: { rating, comment, salonId, customer_id: customerId }
    });

    // 2. Aggregate the new average rating (Only calculate from APPROVED reviews)
    const agg = await tx.review.aggregate({
      where: { salonId, isApproved: true },
      _avg: { rating: true },
      _count: { id: true }
    });

    // 3. Update the salon record
    await tx.salon.update({
      where: { id: salonId },
      data: { rating: agg._avg.rating || 0, totalReviews: agg._count.id }
    });

    return newReview;
  });

  res.status(201).json({ success: true, data: review, message: 'Review successfully submitted.' });
});

/**
 * GET /api/salons/reviews/recent
 */
const getRecentReviews = catchAsync(async (req, res) => {
  const reviews = await prisma.review.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    where: {
      comment: { not: null },
      isApproved: true
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      customers: { select: { name: true } },
      salon: { select: { name: true, id: true, image: true } }
    }
  });
  res.status(200).json({ success: true, data: reviews });
});

module.exports = {
  getNearbySalons,
  getRecentReviews,
  getAllSalons,
  getSalonById,
  getSalonServices,
  addReview
};
