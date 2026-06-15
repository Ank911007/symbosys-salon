const prisma = require('../config/prisma');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { hashPassword } = require('../utils/password');
const { adminRegisterSalonSchema } = require('../validators/schemas');

/**
 * GET /api/admin/salons
 * Retrieve all salons along with their owner details
 */
const getAllSalons = catchAsync(async (req, res) => {
  const salons = await prisma.salon.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      isOpen: true,
      createdAt: true,
      salonAddress: { select: { address: true } },
      owner: { select: { name: true, email: true, phone: true } },
      _count: { select: { services: true, stylists: true, appointments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ success: true, data: salons });
});

/**
 * POST /api/admin/salons
 * Register a new salon and an owner simultaneously
 */
const registerSalon = catchAsync(async (req, res) => {
  const data = adminRegisterSalonSchema.parse(req.body);

  // Check if owner email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.ownerEmail },
  });

  if (existingUser) {
    throw ApiError.conflict('A user with this email already exists.');
  }

  const passwordHash = await hashPassword(data.ownerPassword);

  // Execute in a transaction to ensure both user and salon are created
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the Owner user
    const owner = await tx.user.create({
      data: {
        name: data.ownerName,
        email: data.ownerEmail,
        passwordHash,
        phone: data.ownerPhone,
        role: 'SALON_OWNER',
      },
    });

    // 2. Create the Salon
    const salon = await tx.salon.create({
      data: {
        name: data.salonName,
        category: data.salonCategory,
        ownerId: owner.id,
        openTime: '09:00',
        closeTime: '21:00',
        isOpen: true,
      },
    });

    // 3. Create the SalonAddress
    await tx.salonAddress.create({
      data: {
        address: data.salonAddress,
        // Defaulting to Ranchi, India coordinates so they show up on the search map
        lat: 23.3441,
        lng: 85.3096,
        salonId: salon.id,
      },
    });

    return { owner, salon };
  });

  res.status(201).json({
    success: true,
    message: 'Salon and Owner registered successfully.',
    data: {
      salon: result.salon,
      owner: {
        id: result.owner.id,
        name: result.owner.name,
        email: result.owner.email,
      },
    },
  });
});

/**
 * DELETE /api/admin/salons/:id
 * Delete a salon (and associated data via Prisma Cascade/SetNull, though Owner user remains)
 */
const deleteSalon = catchAsync(async (req, res) => {
  const salonExists = await prisma.salon.findUnique({
    where: { id: req.params.id },
  });

  if (!salonExists) {
    throw ApiError.notFound('Salon not found.');
  }

  await prisma.salon.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: 'Salon deleted successfully.',
  });
});

/**
 * PUT /api/admin/salons/:id
 * Update salon details and owner credentials
 */
const updateSalon = catchAsync(async (req, res) => {
  const { adminUpdateSalonSchema } = require('../validators/schemas');
  const data = adminUpdateSalonSchema.parse(req.body);

  const salon = await prisma.salon.findUnique({
    where: { id: req.params.id },
    select: { id: true, ownerId: true }
  });

  if (!salon) {
    throw ApiError.notFound('Salon not found.');
  }

  // Update inside a transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Update Salon
    const updatedSalon = await tx.salon.update({
      where: { id: req.params.id },
      data: {
        ...(data.salonName && { name: data.salonName }),
        ...(data.salonCategory && { category: data.salonCategory }),
      }
    });

    // 2. Update SalonAddress if address is provided
    if (data.salonAddress) {
      await tx.salonAddress.upsert({
        where: { salonId: req.params.id },
        update: { address: data.salonAddress },
        create: {
          address: data.salonAddress,
          lat: 23.3441,
          lng: 85.3096,
          salonId: req.params.id,
        },
      });
    }

    // 3. Update Owner (if exists)
    let updatedOwner = null;
    if (salon.ownerId) {
      const ownerData = {
        ...(data.ownerName && { name: data.ownerName }),
        ...(data.ownerPhone && { phone: data.ownerPhone }),
      };

      if (data.ownerPassword && data.ownerPassword.trim() !== '') {
        ownerData.passwordHash = await hashPassword(data.ownerPassword);
      }

      updatedOwner = await tx.user.update({
        where: { id: salon.ownerId },
        data: ownerData
      });
    }

    return { salon: updatedSalon, owner: updatedOwner };
  });

  res.status(200).json({
    success: true,
    message: 'Salon updated successfully.',
    data: {
      salon: result.salon,
      owner: result.owner ? {
        id: result.owner.id,
        name: result.owner.name,
        email: result.owner.email,
        phone: result.owner.phone
      } : null
    }
  });
});

module.exports = {
  getAllSalons,
  registerSalon,
  deleteSalon,
  updateSalon,
};
