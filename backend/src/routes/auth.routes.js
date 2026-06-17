const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/schemas');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

module.exports = router;
