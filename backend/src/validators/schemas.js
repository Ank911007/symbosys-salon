const { z } = require('zod');

// ─── Auth Schemas ────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be at most 100 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must be at most 128 characters.'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'STYLIST', 'SALON_OWNER']).optional(),
  otp: z.string().optional(),
  salonName: z.string().optional(),
  salonAddress: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  website: z.string().optional(),
  image: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

// ─── User Schemas ────────────────────────────────────────────────────────────

const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100)
    .optional(),
  phone: z.string().optional(),
});

// ─── Service Schemas ─────────────────────────────────────────────────────────

const createServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required.').max(200),
  description: z.string().max(1000).optional(),
  duration: z
    .number()
    .int()
    .min(5, 'Duration must be at least 5 minutes.')
    .max(480, 'Duration must be at most 8 hours.'),
  price: z.number().min(0, 'Price cannot be negative.'),
});

const updateServiceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  duration: z.number().int().min(5).max(480).optional(),
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

// ─── Appointment Schemas ─────────────────────────────────────────────────────

const bookAppointmentSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID.'),
  startTime: z.string().datetime({ message: 'Invalid date/time format. Use ISO 8601.' }),
  notes: z.string().max(500).optional(),
  customerName: z.string().max(100).optional().nullable(),
  customerPhone: z.string().max(20).optional().nullable(),
  customerEmail: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
});

const updateAppointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], {
    errorMap: () => ({
      message: 'Status must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED.',
    }),
  }),
});

const createReviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(500, 'Comment must be under 500 characters').optional(),
});

// ─── Salon Owner Schemas ─────────────────────────────────────────────────────

const updateSalonSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  image: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isOpen: z.boolean().optional(),
  openTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be in HH:MM format').optional().nullable(),
  closeTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be in HH:MM format').optional().nullable(),
  closedDates: z.array(z.string()).optional(),
  salonAddress: z.object({
    address: z.string().min(1).max(500).optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
});

// ─── Admin Schemas ─────────────────────────────────────────────────────────────

const adminRegisterSalonSchema = z.object({
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters').max(100),
  ownerEmail: z.string().email('Invalid email address'),
  ownerPhone: z.string().optional(),
  ownerPassword: z.string().min(8, 'Password must be at least 8 characters'),
  salonName: z.string().min(2, 'Salon name must be at least 2 characters').max(200),
  salonAddress: z.string().min(5, 'Address must be at least 5 characters').max(500),
  salonCategory: z.string().max(100).optional(),
});

const adminUpdateSalonSchema = z.object({
  salonName: z.string().min(2, 'Salon name is required').optional(),
  salonAddress: z.string().min(5, 'Salon address must be at least 5 characters').optional(),
  salonCategory: z.string().min(2, 'Category is required').optional(),
  ownerName: z.string().min(2, 'Owner name is required').optional(),
  ownerPassword: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  ownerPhone: z.string().min(10, 'Valid phone number is required').optional(),
});

// ─── Customer Phone Auth Schemas ─────────────────────────────────────────────

const checkPhoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

const completeProfileSchema = z.object({
  phone: z.string().min(10).max(15),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  gender: z.enum(['male', 'female']).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  createServiceSchema,
  updateServiceSchema,
  bookAppointmentSchema,
  updateAppointmentStatusSchema,
  createReviewSchema,
  updateSalonSchema,
  adminRegisterSalonSchema,
  adminUpdateSalonSchema,
  checkPhoneSchema,
  verifyOtpSchema,
  completeProfileSchema,
};
