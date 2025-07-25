const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/db_test';

  try {
    await mongoose.connect(dbUri);
    console.log('Mongodb connected successfully');
  } catch (err) {
    console.error('Mongodb connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;