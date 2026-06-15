const { Router } = require('express');
const salonController = require('../controllers/salon.controller');
const { authenticate } = require('../middlewares/auth');
const cacheHeaders = require('../middlewares/cacheHeaders');

const router = Router();

// Public routes (caching enabled for GET requests)
router.use(cacheHeaders(300));
router.get('/nearby', salonController.getNearbySalons);
router.get('/reviews/recent', salonController.getRecentReviews);
router.get('/', salonController.getAllSalons);
router.get('/:id', salonController.getSalonById);
router.get('/:id/services', salonController.getSalonServices);

// Public routes (Guest Reviews Allowed)
router.post('/:id/reviews', salonController.addReview);

module.exports = router;
