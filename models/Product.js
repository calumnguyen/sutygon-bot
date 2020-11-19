const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
  productId:{
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
    required:true
  },
  tags:{
    type:String
  },
  disabled: {
  type:String,
    default:false
  },
  color: [
    {
      colorname: {
        type: String,

      },
      sizes: {
        type: Array,
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now,
  },

},
);

module.exports = Product = mongoose.model("product", ProductSchema);
