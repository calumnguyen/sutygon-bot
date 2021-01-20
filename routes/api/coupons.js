const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Coupon = require("../../models/Coupons");
const { check, validationResult } = require("express-validator");

// @route   POST api/Coupon/add
// @desc    Add New Coupon
// @access  private
router.post(
  "/add",
  // [
  //   check("discount_amount", "Discount Amount  Required").not().isEmpty(),
  //   check("coupon_type", "Coupon Type Required").not().isEmpty(),
  //   check("note", "Note Color Required").isArray().not().isEmpty(),
  // ],
  auth,
  async (req, res) => {
    const { eligibility } = req.body;
    try {
      const CouponBody = {
        discount_amount: req.body.discount_amount,
        coupon_type: req.body.coupon_type,
        max_life: req.body.max_life,
        note: req.body.note,
        code: req.body.code,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        tags: req.body.tags,
        eligibility: req.body.eligibility,
      };
      if (req.body.min_requirement) {
        CouponBody["min_requirement"] = req.body.min_requirement;
      }

      if (
        req.body.coupon_type == "percentage" &&
        (req.body.max_payout == "" || req.body.max_payout == undefined)
      ) {
        return res.status(500).send("max payout is required");
      }
      if (req.body.coupon_type == "percentage" && req.body.max_payout) {
        CouponBody["max_payout"] = req.body.max_payout;
      }

      if (eligibility !== "all" && req.body.product_ids) {
        CouponBody["product_ids"] = req.body.product_ids;
      }
      if (eligibility !== "all" && req.body.product_tags) {
        CouponBody["product_tags"] = req.body.product_tags;
      }
      if (req.body.coupon_type == "amount") {
        delete CouponBody["max_payout"];
      }
      let coupon = new Coupon(CouponBody);
      await coupon.save();
      res.status(200).json({ coupon, msg: "Coupon Added Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

// @route  POST api/Coupon/changeStatus/:id
// @desc   changeStatus
// @access Private
router.post("/changeStatus/:id/:status", auth, async (req, res) => {
  try {
    await Coupon.updateOne(
      { _id: req.params.id },
      {
        $set: {
          disabled: req.params.status,
        },
      }
    );
    res.json({ msg: "Coupon Status changed Successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  POST api/Coupon/:id
// @desc   Update a Coupon
// @access Private
router.post("/:id", auth, async (req, res) => {
  try {
    await Coupon.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    res.json({ msg: "Coupon Updated Successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route   POST api/Coupon
// @desc    Post all Coupon
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    let query = {
      coupon_status: req.body.coupon_status,
    };
    console.log("query", query);
    var limit = 10;
    var page = req.body.currentPage ? parseInt(req.body.currentPage) : 1;
    var skip = (page - 1) * limit;
    const coupons = await Coupon.find(query).skip(skip).limit(limit);
    const total = await Coupon.count({});
    res.status(200).json({ coupons: coupons, total: total });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

// @route  GET api/coupon/:id
// @desc   Get Coupon by id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ msg: "No Coupon found" });
    }

    res.json(coupon);
  } catch (err) {
    // Check if id is not valid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Coupon found" });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  DELETE api/coupon/:id
// @desc   Delete a coupon
// @access Private
router.delete(
  "/:id",

  async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);

      if (!coupon) {
        return res.status(404).json({ msg: "No Coupon found" });
      }

      await coupon.remove();

      res.status(200).json({ msg: "Coupon Successfully Removed" });
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "No Coupon found" });
      }
      res
        .status(500)
        .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
    }
  }
);

module.exports = router;
