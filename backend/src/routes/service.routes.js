const { Router } = require('express');
const serviceController = require('../controllers/service.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createServiceSchema,
  updateServiceSchema,
} = require('../validators/schemas');

const router = Router();

// Public routes
router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getById);

// Admin-only routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createServiceSchema),
  serviceController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateServiceSchema),
  serviceController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  serviceController.remove
);

module.exports = router;
