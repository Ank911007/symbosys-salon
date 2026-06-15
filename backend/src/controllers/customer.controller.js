const customerService = require('../services/customer.service');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /api/customer/check-phone
 * Check if phone exists → auto-login or trigger OTP flow.
 */
const checkPhone = catchAsync(async (req, res) => {
  const result = await customerService.checkPhone(req.body);

  if (result.isNew) {
    return res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number. (Test OTP: 123456)',
      data: { isNew: true },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Welcome back!',
    data: {
      isNew: false,
      customer: result.customer,
      token: result.token,
    },
  });
});

/**
 * POST /api/customer/verify-otp
 * Verify OTP for new customers.
 */
const verifyOtp = catchAsync(async (req, res) => {
  const result = await customerService.verifyOtp(req.body);

  res.status(200).json({
    success: true,
    message: 'Phone verified successfully.',
    data: {
      verified: true,
      tempToken: result.tempToken,
    },
  });
});

/**
 * POST /api/customer/complete-profile
 * Create customer account after OTP verification.
 */
const completeProfile = catchAsync(async (req, res) => {
  const result = await customerService.completeProfile(req.body);

  res.status(201).json({
    success: true,
    message: 'Profile created successfully!',
    data: {
      customer: result.customer,
      token: result.token,
    },
  });
});

/**
 * GET /api/customer/me
 * Get current customer's profile.
 */
const getMe = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.customer.id);

  res.status(200).json({
    success: true,
    data: { customer },
  });
});

module.exports = { checkPhone, verifyOtp, completeProfile, getMe };
