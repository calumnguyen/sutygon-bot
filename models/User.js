const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  contactnumber: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  salary: {
<<<<<<< HEAD
    base_rate: { type: Number },
    period: { type: String, enum: ['weekly', 'bi-weekly', 'monthly'] },
    effective_date: { type: [Date] },
=======
    amount: { type: Number },
    next_pay_day: { type: String },
    pay_rise: { type: Number },
>>>>>>> 9af3125294361bf3e3e4e1cc5efdf2480a6b7dac
  },
  password: {
    type: String,
    requried: true,
  },
  accountStatus: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive'],
  },
  inactivated_date: {
    type: Date,
  },
  avatar: {
    type: String,
  },
  type: {
    type: String,
    default: 'Employee',
  },
  sections: {
    type: [String],
    enum: [
      'Inventory',
      'Barcode',
      'Customers',
      'Rent a product',
      'Report',
      'Return a product',
      'Orders',
      'Appointments',
      'Calender',
    ],
  },
  //Until the password is not changed, this value will be false on default.
  isPasswordChanged: {
    type: Boolean,
    default: false,
  },
  birthday: {
    type: Date,
  },
  address: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = User = mongoose.model('user', UserSchema)
