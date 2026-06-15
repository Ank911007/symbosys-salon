const { Router } = require('express');
const appointmentController = require('../controllers/appointment.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  bookAppointmentSchema,
  updateAppointmentStatusSchema,
} = require('../validators/schemas');

const router = Router();

// All appointment routes require authentication
router.use(authenticate);

router.post('/', validate(bookAppointmentSchema), appointmentController.book);
router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);

router.patch(
  '/:id/status',
  validate(updateAppointmentStatusSchema),
  appointmentController.updateStatus
);

module.exports = router;
