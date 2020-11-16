const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

const RentedProductSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    customerContactNumber: {
      type: String,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
    },
    barcodes: {
      type: Array,
    },
    // products id array banao:
    rentDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      default: 'New',
    },

    insuranceAmt: {
      type: String,
    },

    total: {
      type: String,
    },
    leaveID: {
      type: Boolean,
    },
  },
  { timestamps: true }
)

module.exports = RentedProduct = mongoose.model('orders', RentedProductSchema)
