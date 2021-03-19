const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  logo: {
    type: String,
    // required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  officialEmail: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "off",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = Shop = mongoose.model("store", StoreSchema);
