const { Router } = require('express');
const customerController = require('../controllers/customer.controller');
const validate = require('../middlewares/validate');
const { authenticateCustomer, authenticateTempToken } = require('../middlewares/auth');
const { checkPhoneSchema, verifyOtpSchema, completeProfileSchema } = require('../validators/schemas');

const router = Router();

// Public routes (no auth required)
router.post('/check-phone', validate(checkPhoneSchema), customerController.checkPhone);
router.post('/verify-otp', validate(verifyOtpSchema), customerController.verifyOtp);

// Requires temp token (OTP verified)
router.post('/complete-profile', authenticateTempToken, validate(completeProfileSchema), customerController.completeProfile);

// Requires full customer auth
router.get('/me', authenticateCustomer, customerController.getMe);

module.exports = router;
