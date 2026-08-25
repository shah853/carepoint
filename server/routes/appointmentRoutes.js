const express = require('express');

const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');

const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', protect, createAppointment);

router.get('/my', protect, getMyAppointments);
router.get('/all', protect, admin, getAllAppointments);

router.get('/:id', protect, getAppointmentById);

router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/status', protect, admin, updateAppointmentStatus);

router.delete('/:id', protect, deleteAppointment);

module.exports = router;