const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /api/auth/register
 */
const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: { user, token },
  });
});

/**
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: { user, token },
  });
});

module.exports = { register, login };
