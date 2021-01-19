const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Coupons");
const { check, validationResult } = require("express-validator");

// @route   POST api/Coupon/add
// @desc    Add New Coupon
// @access  private
router.post(
  "/add",
  // [
  //   check("name", "Coupon Name Required").not().isEmpty(),
  //   check("image", "Coupon Image Required").not().isEmpty(),
  //   check("color", "Coupon Color Required").isArray().not().isEmpty(),
  // ],
  auth,
  async (req, res) => {
    try {
      const CouponBody = {
        discount_amount: body.discount_amount,
        max_payout: req.body.max_payout,
        min_requirement:req.body.min_requirement?req.body.min_requirement:'',
        payment_method: req.body.payment_method,
        number_of_use: req.body.number_of_use,
        note: req.body.note,
        code: req.body.code,
        start_date: body.start_date,
        end_date: body.end_date,
        tags: JSON.parse(req.body.tags),
        eligibility: req.body.eligibility,
        eligible_products: JSON.parse(req.body.eligible_products),
      };
      let coupon = new Coupon(CouponBody);
      await coupon.save();
      res.status(200).json({ product, msg: "Coupon Added Successfully" });
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
router.post("/:id", auth,  async (req, res) => {
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

// @route   GET api/Coupon
// @desc    Get all Coupon
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ date: -1 });
    res.status(200).json(coupons);
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

// @route  GET api/Coupon/:name
// @desc   Get Coupon (Search for Coupon by name)
// @access Private
router.get("/:name", auth, async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ name: { $eq: req.params.name } });

    if (!coupon) {
      return res.status(404).json({ msg: "No coupon found" });
    }
    res.status(200).json(coupon);
  } catch (err) {
    // Check if id is not valid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No coupon found" });
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
