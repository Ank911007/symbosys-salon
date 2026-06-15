

const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/salons', adminController.getAllSalons);
router.post('/salons', adminController.registerSalon);
router.put('/salons/:id', adminController.updateSalon);
router.delete('/salons/:id', adminController.deleteSalon);

module.exports = router;
