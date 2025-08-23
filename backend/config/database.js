const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection error:', err);
    process.exit(1);
  }
};

const closeDB = async () => { await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
};

module.exports = { connectDB, closeDB };