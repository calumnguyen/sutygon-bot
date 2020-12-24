const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
  },
  disabled: {
    type: String,
    default: false,
  },
  color: [
    {
      colorname: {
        type: String,
      },
      sizes: [
        {
          _id: false,
          id: String,
          size: String,
          price: String,
          qty: String,
          barcodes: [
            {
              barcode: Number,
              isLost: { type: Boolean, default: false },
              isRented: { type: Boolean, default: false },

            },
          ],
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
} ,{ autoIndex: false }
)

module.exports = Product = mongoose.model('product', ProductSchema)
