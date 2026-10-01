const express = require('express');
const {
	getAllAppointments,
	getAllOrders,
	getDashboardStats,
	updateAppointmentStatus,
	updateOrderStatus,
	updatePaymentStatus,
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(protect, admin);
router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/payment', updatePaymentStatus);
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

module.exports = router;
