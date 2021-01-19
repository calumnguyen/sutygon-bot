const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponsSchema = new mongoose.Schema(
  {
    discount_amount: {
      type: Number,
      required: true,
    },
    max_payout: {
      // only if percentage
      type: Number,
    },
    min_requirement: {
      // min amount
      type: Number,
    },
    coupon_type: {
      type: String,
      default: "amount",
      enum: ["amount", "percentage"],
    },
    number_of_user_per_customer: {
      type: Number,
    },
    max_life: {
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
    tags: {
      type: String,
    },

    eligibility: {
      type: String,
      default: "all",
      enum: ["all", "only", "exclude", "each"],
    },
    // only,each eligible , exclude ineligible
    // products: [{ type: Schema.Types.ObjectId, ref: "product" }],
    product_ids: [String],
    product_tags: [String],
    used_customers: [
      {
        customer: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        usage: {
          default: 0,
          type: Number,
        },
      },
    ],
    usage: {
      default: 0,
      type: Number,
    },

    coupon_status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
  },
  { timestamps: true }
);

module.exports = Coupons = mongoose.model("coupons", CouponsSchema);
