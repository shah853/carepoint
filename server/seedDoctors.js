const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

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
  ['Hassan Raza', 'hassan.raza@carepoint.example', '+92 320 555 0121', 'Cardiology', 'MBBS, FCPS (Cardiology), FACC', 15, 'Heart Care', true, 'male'],
  ['Mariam Siddiqui', 'mariam.siddiqui@carepoint.example', '+92 321 555 0122', 'Dermatology', 'MBBS, MCPS, FCPS (Dermatology)', 10, 'Skin Care', true, 'female'],
  ['Ahmed Farooq', 'ahmed.farooq@carepoint.example', '+92 322 555 0123', 'General Medicine', 'MBBS, MRCP (UK)', 13, 'General Medicine', true, 'male'],
  ['Laiba Nadeem', 'laiba.nadeem@carepoint.example', '+92 323 555 0124', 'Pediatrics', 'MBBS, FCPS (Pediatrics)', 9, 'Child Health', true, 'female'],
  ['Saad Mahmood', 'saad.mahmood@carepoint.example', '+92 324 555 0125', 'Neurology', 'MBBS, FCPS (Neurology)', 12, 'Neurosciences', true, 'male'],
  ['Mehwish Ali', 'mehwish.ali@carepoint.example', '+92 325 555 0126', 'Orthopedics', 'MBBS, FCPS (Orthopedic Surgery)', 16, 'Bone and Joint Care', true, 'female'],
  ['Hamza Rehman', 'hamza.rehman@carepoint.example', '+92 326 555 0127', 'Gynecology', 'MBBS, FCPS (Obstetrics and Gynecology)', 14, 'Women Health', true, 'male'],
  ['Eman Khalid', 'eman.khalid@carepoint.example', '+92 327 555 0128', 'ENT', 'MBBS, FCPS (Otolaryngology)', 8, 'ENT Care', true, 'female'],
  ['Faisal Iqbal', 'faisal.iqbal@carepoint.example', '+92 328 555 0129', 'Dentistry', 'BDS, MFDS, RDS', 11, 'Dental Care', true, 'male'],
  ['Rabia Aslam', 'rabia.aslam@carepoint.example', '+92 329 555 0130', 'Psychiatry', 'MBBS, FCPS (Psychiatry)', 10, 'Mental Health', true, 'female'],
  ['Kamil Yousaf', 'kamil.yousaf@carepoint.example', '+92 330 555 0131', 'Ophthalmology', 'MBBS, FCPS (Ophthalmology)', 13, 'Eye Care', true, 'male'],
];

const doctorImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1643297654415-8d3c9a4b7c2b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=80',
];

const seededDoctors = doctors.map(([name, email, phone, specialization, qualification, experience, department, available], index) => {
  return {
    name,
    email,
    phone,
    specialization,
    qualification,
    experience,
    department,
    available,
    image: doctorImages[index % doctorImages.length],
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
