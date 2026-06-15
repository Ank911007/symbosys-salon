const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/users/me
 */
const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * PATCH /api/users/me
 */
const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { user },
  });
});

module.exports = { getMe, updateMe };
