const { Router } = require('express');
const ownerController = require('../controllers/owner.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

// All owner routes require SALON_OWNER role
router.use(authenticate, authorize('SALON_OWNER'));

// Salon overview
router.get('/salon', ownerController.getSalon);
router.patch('/salon', ownerController.updateSalon);

// Services
router.get('/salon/services', ownerController.getServices);
router.post('/salon/services', ownerController.addService);
router.patch('/salon/services/:serviceId', ownerController.updateService);
router.delete('/salon/services/:serviceId', ownerController.deleteService);

// Stylists
router.get('/salon/stylists', ownerController.getStylists);
router.post('/salon/stylists', ownerController.addStylist);
router.delete('/salon/stylists/:stylistId', ownerController.deleteStylist);

// Appointments
router.get('/salon/appointments', ownerController.getAppointments);
router.patch('/salon/appointments/:id/status', ownerController.updateAppointmentStatus);

// Reviews
router.get('/salon/reviews', ownerController.getReviews);
router.patch('/salon/reviews/:id/approval', ownerController.updateReviewApproval);

module.exports = router;
