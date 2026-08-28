const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

connectDB();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    let isLocalDevelopmentOrigin = false;

    try {
      const parsedOrigin = origin ? new URL(origin) : null;
      isLocalDevelopmentOrigin =
        parsedOrigin &&
        ['localhost', '127.0.0.1'].includes(parsedOrigin.hostname);
    } catch {
      isLocalDevelopmentOrigin = false;
    }

    if (!origin || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('CarePoint API running');
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});