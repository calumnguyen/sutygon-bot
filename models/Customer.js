const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CutomerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  contactnumber: {
    type: String,
  },
  online_account: {
    type: String,
  },
  membership: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
  },
  company_address: {
    type: String,
  },
  birthday: {
    type: Date,
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
