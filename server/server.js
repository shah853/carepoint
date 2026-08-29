const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const connectDB = require('./config/db');
const { isDatabaseReady } = connectDB;
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow all origins to fix deployment crash

app.use('/api', (req, res, next) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      message: 'Database connection is unavailable.',
    });
  }

  return next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '..', 'client', 'dist');

  app.use(express.static(clientBuildPath));

  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
      if (err) {
        next(err);
      }
    });
  });
} else {
  app.get('/', (req, res) => {
    res.send('CarePoint API running');
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

const connectWithRetry = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB is unavailable. Retrying in 10 seconds.');
    setTimeout(connectWithRetry, 10000);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  connectWithRetry();
});