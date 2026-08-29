const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

dns.setServers(['8.8.8.8', '1.1.1.1']);

let connectionPromise;

const connectDB = async () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is missing from .env');
    }

    mongoose.set('bufferCommands', false);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    return false;
  }
  })();

  return connectionPromise;
};

module.exports = connectDB;
module.exports.isDatabaseReady = () => mongoose.connection.readyState === 1;