const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const Doctor = require('./models/doctor');

const doctors = [
  ['Ayesha', 'ayesha.rahman@carepoint.example', '+92 300 555 0101', 'Cardiology', 'MBBS, FCPS (Cardiology)', 14, 'Heart Care', true, 'female'],
  ['Muhammad shah', 'hamza.malik@carepoint.example', '+92 301 555 0102', 'Dermatology', 'MBBS, FCPS (Dermatology)', 11, 'Skin Care', true, 'male'],
  ['Sara Ahmed', 'sara.ahmed@carepoint.example', '+92 302 555 0103', 'Neurology', 'MBBS, FCPS (Neurology)', 16, 'Neurosciences', true, 'female'],
  ['Usman Shah', 'usman.shah@carepoint.example', '+92 303 555 0104', 'Pediatrics', 'MBBS, DCH', 9, 'Child Health', true, 'male'],
  ['Maryam Khan', 'maryam.khan@carepoint.example', '+92 304 555 0105', 'Orthopedics', 'MBBS, FCPS (Orthopedics)', 18, 'Bone and Joint Care', true, 'female'],
  ['Bilal Ahmed', 'bilal.ahmed@carepoint.example', '+92 305 555 0106', 'General Medicine', 'MBBS, MRCP', 12, 'General Medicine', true, 'male'],
  ['Fatima Noor', 'fatima.noor@carepoint.example', '+92 306 555 0107', 'Gynecology', 'MBBS, FCPS (Gynecology)', 13, 'Women Health', true, 'female'],
  ['Omar Siddiqui', 'omar.siddiqui@carepoint.example', '+92 307 555 0108', 'ENT', 'MBBS, FCPS (ENT)', 10, 'ENT Care', true, 'male'],
  ['Hina Tariq', 'hina.tariq@carepoint.example', '+92 308 555 0109', 'Ophthalmology', 'MBBS, FCPS (Ophthalmology)', 15, 'Eye Care', true, 'female'],
  ['Zain Iqbal', 'zain.iqbal@carepoint.example', '+92 309 555 0110', 'Psychiatry', 'MBBS, FCPS (Psychiatry)', 8, 'Mental Health', true, 'male'],
  ['Nadia Qureshi', 'nadia.qureshi@carepoint.example', '+92 310 555 0111', 'Urology', 'MBBS, FCPS (Urology)', 17, 'Urology', true, 'female'],
  ['Taha Aslam', 'taha.aslam@carepoint.example', '+92 311 555 0112', 'Dentistry', 'BDS, FCPS (Dentistry)', 7, 'Dental Care', true, 'male'],
  ['Maha Saleem', 'maha.saleem@carepoint.example', '+92 312 555 0113', 'Endocrinology', 'MBBS, FCPS (Medicine), Fellowship Endocrinology', 12, 'Diabetes and Hormones', true, 'female'],
  ['Raza Hussain', 'raza.hussain@carepoint.example', '+92 313 555 0114', 'Gastroenterology', 'MBBS, FCPS (Gastroenterology)', 19, 'Digestive Health', true, 'male'],
  ['Iqra Javed', 'iqra.javed@carepoint.example', '+92 314 555 0115', 'Pulmonology', 'MBBS, FCPS (Pulmonology)', 10, 'Respiratory Care', true, 'female'],
  ['Farhan Yousaf', 'farhan.yousaf@carepoint.example', '+92 315 555 0116', 'Nephrology', 'MBBS, FCPS (Nephrology)', 14, 'Kidney Care', true, 'male'],
  ['Sana Rauf', 'sana.rauf@carepoint.example', '+92 316 555 0117', 'Oncology', 'MBBS, FCPS (Medicine), Fellowship Oncology', 20, 'Cancer Care', false, 'female'],
  ['Kashif Mehmood', 'kashif.mehmood@carepoint.example', '+92 317 555 0118', 'Radiology', 'MBBS, FCPS (Radiology)', 13, 'Diagnostic Imaging', true, 'male'],
  ['Anum Waheed', 'anum.waheed@carepoint.example', '+92 318 555 0119', 'Rheumatology', 'MBBS, FCPS (Medicine), Fellowship Rheumatology', 9, 'Autoimmune Care', true, 'female'],
  ['Danish Latif', 'danish.latif@carepoint.example', '+92 319 555 0120', 'Infectious Disease', 'MBBS, FCPS (Medicine)', 11, 'Infectious Disease', true, 'male'],
];

const genderImageIndexes = { female: 0, male: 0 };

const seededDoctors = doctors.map(([name, email, phone, specialization, qualification, experience, department, available, gender]) => {
  genderImageIndexes[gender] += 1;

  return {
    name,
    email,
    phone,
    specialization,
    qualification,
    experience,
    department,
    available,
    image: `https://randomuser.me/api/portraits/${gender === 'female' ? 'women' : 'men'}/${genderImageIndexes[gender]}.jpg`,
  };
});

const seedDoctors = async () => {
  await connectDB();
  let added = 0;
  let updated = 0;

  try {
    for (const doctor of seededDoctors) {
      const result = await Doctor.updateOne(
        { email: doctor.email },
        { $set: doctor },
        { upsert: true }
      );
      if (result.upsertedCount) added += 1;
      else if (result.modifiedCount) updated += 1;
    }

    const total = await Doctor.countDocuments();
    console.log(`Doctors seed complete: ${added} added, ${updated} updated, ${total} total`);
  } catch (error) {
    console.error('Doctors seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDoctors();
