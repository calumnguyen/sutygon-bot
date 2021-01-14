const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    contactnumber: {
      type: String,
      required: true,
    },
    block_account: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = Coupons = mongoose.model("coupons", CouponsSchema);
