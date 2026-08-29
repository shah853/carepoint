const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

dns.setServers(['8.8.8.8', '1.1.1.1']);

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI or MONGODB_URI is missing from .env');
  }

  mongoose.set('bufferCommands', false);

  connectionPromise = mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })
    .then(() => {
      console.log('MongoDB connected successfully');
      return true;
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message);
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

mongoose.connection.on('disconnected', () => {
  connectionPromise = null;
});

module.exports = connectDB;
module.exports.isDatabaseReady = () => mongoose.connection.readyState === 1;