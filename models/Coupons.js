const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponsSchema = new mongoose.Schema(
  {
    discount_amount: {
      type: String,
      required: true,
    },
    max_payout: {
      // only if percentage
      type: String,
    },
    min_requirement: {
      // min amount
      type: String,
    },
    number_of_use: {
      type: Number,
    },
    note: {
      type: String,
    },

    code: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },

    eligibility: {
      type: String,
      default: "all",
      enum: ["all", "only", "exclude", "each"],
    },
    eligible_products: [{ type: Schema.Types.ObjectId, ref: "product" }],
    used_customers: [{ type: Schema.Types.ObjectId, ref: "user" }],

    coupon_status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
  },
  { timestamps: true }
);

module.exports = Coupons = mongoose.model("coupons", CouponsSchema);
