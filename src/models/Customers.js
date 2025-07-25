const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  nameOfLocation: String,
  date: Date,
  loginHour: String,
  name: String,
  age: Number,
  gender: String,
  email: String,
  phoneNumber: String,
  brandDevice: String,
  digitalInterest: String,
  locationType: String,
  createdAt: { type: Date, default: Date.now }
});

const Customers = mongoose.model('customers', customerSchema);

module.exports = Customers;