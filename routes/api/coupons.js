const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Coupons");
const { check, validationResult } = require("express-validator");
var multer = require("multer");
var cloudinary = require("cloudinary");
const config = require("config");

const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are accepted!"), false);
  }
  cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });
cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

// multer configuration
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage, fileFilter: imageFilter });

// @route   POST api/Coupon/add
// @desc    Add New Coupon
// @access  private
router.post(
  "/add",
  [
    check("name", "Coupon Name Required").not().isEmpty(),
    check("image", "Coupon Image Required").not().isEmpty(),
    check("color", "Coupon Color Required").isArray().not().isEmpty(),
  ],
  auth,
  upload.single("image"),
  async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    const image = req.file.path;
    try {
      cloudinary.uploader.upload(image, async function (result) {
        const CouponBody = {
          name: body.name,
          productId: body.productId,
          tags: body.tags,
          image: result.secure_url,
          color: JSON.parse(req.body.color),
        };
        let coupon = new Coupon(CouponBody);
        await coupon.save();
        res.status(200).json({ product, msg: "Coupon Added Successfully" });
      });
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
router.post("/:id", auth, upload.single("image"), async (req, res) => {
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
