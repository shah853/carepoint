const Doctor = require('../models/doctor');
const mongoose = require('mongoose');

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found',
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      department,
      available,
    } = req.body;

    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({
        message: 'Doctor with this email already exists',
      });
    }

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      department,
      available,
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found',
      });
    }

    Object.assign(doctor, req.body);

    const updatedDoctor = await doctor.save();

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found',
      });
    }

    await doctor.deleteOne();

    res.json({
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};