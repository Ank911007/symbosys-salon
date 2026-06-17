const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

// ─── Shared Select Shapes ───────────────────────────────────────────────────

const SALON_LIST_SELECT = {
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
    select: { id: true, name: true, price: true, duration: true }
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
};

const SALON_DETAIL_SELECT = {
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
  salonAddress: true,
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
};

// ─── Haversine Distance ─────────────────────────────────────────────────────

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Service Functions ──────────────────────────────────────────────────────

/**
 * Get nearby salons filtered by bounding box, then sorted by distance.
 */
async function getNearbySalons({ lat, lng, radius = 50 }) {
  const hasCoords = lat !== undefined && lng !== undefined;
  let where = { isOpen: true };

  // Use bounding-box pre-filter when coordinates are provided
  if (hasCoords) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseFloat(radius);

    // Approximate bounding box (1 degree latitude ≈ 111 km)
    const latDelta = radiusNum / 111.0;
    const lngDelta = radiusNum / (111.0 * Math.cos(latNum * (Math.PI / 180)));

    where = {
      isOpen: true,
      salonAddress: {
        lat: { gte: latNum - latDelta, lte: latNum + latDelta },
        lng: { gte: lngNum - lngDelta, lte: lngNum + lngDelta },
      },
    };
  }

  const salons = await prisma.salon.findMany({
    where,
    select: SALON_LIST_SELECT,
  });

  if (!hasCoords) {
    return salons.slice(0, 50);
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radiusNum = parseFloat(radius);

  return salons
    .map(salon => {
      const addr = salon.salonAddress;
      const hasLocation = addr && (addr.lat !== 0 || addr.lng !== 0);
      return {
        ...salon,
        distance: hasLocation ? calculateDistance(latNum, lngNum, addr.lat, addr.lng) : 0,
        hasLocation,
      };
    })
    .filter(s => !s.hasLocation || s.distance <= radiusNum)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 50);
}

/**
 * Get all salons with pagination, returning total count.
 */
async function getAllSalons({ page = 1, limit = 50 }) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const where = { isOpen: true };

  const [salons, total] = await Promise.all([
    prisma.salon.findMany({
      where,
      select: {
        ...SALON_LIST_SELECT,
        stylists: { select: { id: true, name: true } },
      },
      skip,
      take,
    }),
    prisma.salon.count({ where }),
  ]);

  return { salons, total, page: Number(page), limit: take };
}

/**
 * Get a single salon by ID with full details.
 */
async function getSalonById(id) {
  const salon = await prisma.salon.findUnique({
    where: { id },
    select: SALON_DETAIL_SELECT,
  });

  if (!salon) throw ApiError.notFound('Salon not found');
  return salon;
}

/**
 * Get active services for a salon.
 */
async function getSalonServices(salonId) {
  return prisma.service.findMany({
    where: { salonId, isActive: true },
  });
}

/**
 * Get recent approved reviews across all salons.
 */
async function getRecentReviews() {
  return prisma.review.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    where: {
      comment: { not: null },
      isApproved: true,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      customers: { select: { name: true } },
      salon: { select: { name: true, id: true, image: true } },
    },
  });
}

module.exports = {
  getNearbySalons,
  getAllSalons,
  getSalonById,
  getSalonServices,
  getRecentReviews,
};
