const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CutomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactnumber: {
    type: String,
    required: true,
  },
  block_account: {
    type: Boolean,
    default: false,
  },
  // when a user dont have an online account, the value of membership will be 'null'.
  online_account: {
    exist: { type: String, enum: ['yes', 'no'], default: 'no' },
    membership: { type: String, enum: ['diamond', 'gold', null] },
    username: { type: String },
    email: {
      type: String,
      enum: ['verified', 'unverified'],
      default: 'unverified',
    },
    deactivate: {
      type: Boolean,
      default: false,
    },
    account_created: {
      type: Date,
    },
  },
  address: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  company_address: {
    type: String,
  },
  birthday: {
    type: Date,
    required: true,
  },
  noOfOrders: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Customer = mongoose.model('customer', CutomerSchema)
