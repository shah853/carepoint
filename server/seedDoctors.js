
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const connectDB = require('./config/db');
const Doctor = require('./models/doctor');

const doctors = [
  ['Ayesha Khan', 'ayesha.khan@carepoint.example', '+92 300 555 0101', 'Cardiology', 'MBBS, FCPS (Cardiology)', 14, 'Heart Care', true, 'female'],
  ['Muhammad Shah', 'muhammad.shah@carepoint.example', '+92 301 555 0102', 'Dermatology', 'MBBS, FCPS (Dermatology)', 11, 'Skin Care', true, 'male'],
  ['Sara Ahmed', 'sara.ahmed@carepoint.example', '+92 302 555 0103', 'Neurology', 'MBBS, FCPS (Neurology)', 16, 'Neurosciences', true, 'female'],
  ['Usman Khan', 'usman.khan@carepoint.example', '+92 303 555 0104', 'Pediatrics', 'MBBS, DCH', 9, 'Child Health', true, 'male'],
  ['Maryam Ali', 'maryam.ali@carepoint.example', '+92 304 555 0105', 'Orthopedics', 'MBBS, FCPS (Orthopedics)', 18, 'Bone and Joint Care', true, 'female'],
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

const doctorImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1580281657527-47f249e8f7df?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1638202993928-7d113b8f8c7d?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=85',
];

const seededDoctors = doctors.map(
  (
    [
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      department,
      available,
      gender,
    ],
    index
  ) => ({
    name,
    email,
    phone,
    specialization,
    qualification,
    experience,
    department,
    available,
    gender,
    image: doctorImages[index],
  })
);

const seedDoctors = async () => {
  try {
    await connectDB();

    await Doctor.deleteMany({});

    const insertedDoctors = await Doctor.insertMany(seededDoctors);

    const totalDoctors = await Doctor.countDocuments();
    const uniqueImages = new Set(
      insertedDoctors.map((doctor) => doctor.image)
    );

    console.log(`Doctors added: ${insertedDoctors.length}`);
    console.log(`Total doctors: ${totalDoctors}`);
    console.log(`Unique images: ${uniqueImages.size}`);

    if (totalDoctors !== 20) {
      throw new Error(`Expected 20 doctors, found ${totalDoctors}`);
    }

    if (uniqueImages.size !== 20) {
      throw new Error(
        `Expected 20 unique images, found ${uniqueImages.size}`
      );
    }

    console.log('Doctors seed completed successfully.');
  } catch (error) {
    console.error('Doctors seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedDoctors();
