const { Router } = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const serviceRoutes = require('./service.routes');
const appointmentRoutes = require('./appointment.routes');
const salonRoutes = require('./salon.routes');
const ownerRoutes = require('./owner.routes');
const adminRoutes = require('./admin.routes');
const customerRoutes = require('./customer.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/salons', salonRoutes);
router.use('/owner', ownerRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);

module.exports = router;
