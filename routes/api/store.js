const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Store = require("../../models/Store");
const { check, validationResult } = require("express-validator");

// @route   POST api/shop/add
// @desc    Add New shop
// @access  private
router.post("/add", auth, async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  try {
    const ShopBody = {
      name: body.name,
      address: body.address,
      slug: body.slug,
      createdBy: req.user.id,
      officialEmail: body.officialEmail ? body.officialEmail : "",
      phone: body.phone ? body.phone : "",
    };
    let shop = new Store(ShopBody);
    await shop.save();
    res.status(200).json({ shop, msg: "Store Added Successfully" });
  } catch (err) {
    if (err.message.includes("slug_1")) {
      return res
        .status(500)
        .json({ msg: "This Store Slug already exist", status: 0 });
    }
    res.status(500).send("Server error");
  }
});

// @route  POST api/shop/:id
// @desc   Update a shop
// @access Private
router.post("/:id", auth, async (req, res) => {
  try {
    
    await Store.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    res.status(200).json({ msg: "Store Updated Successfully" });
  } catch (err) {
    if (err.message.includes("slug_1")) {
      return res
        .status(500)
        .json({ msg: "This Store Slug already exist", status: 0 });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route   POST api/shop
// @desc    Post all Shop
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    let query = { createdBy: req.user.id };
    var limit = 10;
    var page = req.body.currentPage ? parseInt(req.body.currentPage) : 1;
    var skip = (page - 1) * limit;
    const stores = await Store.find(query).skip(skip).limit(limit);
    // const total = await Store.count(query);
    res.status(200).json({ stores: stores, total: 0 });
  } catch (err) {
    res.status(500).send("Server Error!");
  }
});

// @route  GET api/shop/:id
// @desc   Get Shop by id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const shop = await Store.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ msg: "No Store found" });
    }

    res.json(shop);
  } catch (err) {
    // Check if id is not valid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Store found" });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  DELETE api/shop/:id
// @desc   Delete a Shop
// @access Private
router.delete(
  "/:id",

  async (req, res) => {
    try {
      const shop = await Store.findById(req.params.id);

      if (!shop) {
        return res.status(404).json({ msg: "No Store found" });
      }

      await shop.remove();

      res.status(200).json({ msg: "Store Successfully Removed" });
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "No Store found" });
      }
      res
        .status(500)
        .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
    }
  }
);

module.exports = router;
