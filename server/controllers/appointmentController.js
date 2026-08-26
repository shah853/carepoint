const Appointment = require('../models/Appointment');
const Doctor = require('../models/doctor');
const mongoose = require('mongoose');

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

const createAppointment = async (req, res) => {
  try {
    const userId = getUserId(req);

    const { doctor, date, time, reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
      });
    }

    if (!doctor || !date || !time || !reason) {
      return res.status(400).json({
        message: 'All appointment fields are required',
      });
    }

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(doctor)) {
      return res.status(400).json({ message: 'Invalid user or doctor ID' });
    }

    const appointmentDate = new Date(date);
    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'A valid appointment date is required' });
    }

    if (appointmentDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ message: 'Appointment date cannot be in the past' });
    }

    const doctorExists = await Doctor.findById(doctor).select('_id available');
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!doctorExists.available) {
      return res.status(400).json({ message: 'Doctor is currently unavailable' });
    }

    if (typeof reason !== 'string' || reason.trim().length < 3) {
      return res.status(400).json({ message: 'Reason must be at least 3 characters' });
    }

    if (!/^((0?[1-9]|1[0-2]):[0-5][0-9] ?(AM|PM)|([01][0-9]|2[0-3]):[0-5][0-9])$/i.test(time)) {
      return res.status(400).json({ message: 'A valid appointment time is required' });
    }

    const appointment = await Appointment.create({
      user: userId,
      doctor,
      date: appointmentDate,
      time,
      reason: reason.trim(),
      status: 'pending',
    });

    const result = await Appointment.findById(
      appointment._id
    )
      .populate('doctor', 'name specialization image')
      .populate('user', 'name email');

    res.status(201).json(result);
  } catch (error) {
    console.error('Create appointment error:', error);

    res.status(500).json({
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
      });
    }

    const appointments = await Appointment.find({
      user: userId,
    })
      .populate('doctor', 'name specialization image')
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);

    res.status(500).json({
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: userId,
    }).populate(
      'doctor',
      'name specialization image'
    );

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found',
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);

    res.status(500).json({
      message: 'Failed to fetch appointment',
      error: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found',
      });
    }

    appointment.status = 'cancelled';

    await appointment.save();

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);

    res.status(500).json({
      message: 'Failed to cancel appointment',
      error: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'User authentication failed',
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);

    res.status(500).json({
      message: 'Failed to delete appointment',
      error: error.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name specialization image')
      .populate('user', 'name email')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid appointment status' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('doctor', 'name specialization image')
      .populate('user', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      message: 'Failed to update appointment',
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};