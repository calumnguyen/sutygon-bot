const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Product");
const { check, validationResult } = require("express-validator");
const Inventory = require("../../models/Inventory");

// @route   POST api/products/add
// @desc    Add New Product
// @access  private
router.post(
    "/add",
    [
        check("name", "Product Name Required").not().isEmpty(),
        check("image", "Product Image Required").not().isEmpty(),
        check("color", "Product Color Required").not().isEmpty(),
        check("size", "Product Size Required").not().isEmpty(),
        check("fabric", "Product fabric Required").not().isEmpty(),
        check("availableQuantity", "Available Quantity Required").not().isEmpty(),
        check("rentedQuantity", "Rented Quantity Required").not().isEmpty(),

    ],
    auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array() });
        }

        try {
            let product = new Product(req.body);
            await product.save();
            res.json({ msg: "Product Added Successfully" });
        } catch (err) {
            console.log(err);
            res
                .status(500)
                .send("Server error");
        }
    }
);

// @route  POST api/products/:id
// @desc   Update a Product
// @access Private
router.post(
    "/:id",
    [
        check("availableQuantity", "Available Quantity Required").not().isEmpty(),
    ],
    auth,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({ errors: errors.array() });
            }
            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                                    availableQuantity: req.body.availableQuantity,
                    rentedQuantity: req.body.rentedQuantity,

                }
            });
            res
                .json({ msg: "Product Updated Successfully" });
        } catch (err) {
            console.error(err.message);
            res
                .status(500)
                .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
        }
    }
);

// @route   GET api/products
// @desc    Get all products
// @access  Private
router.get("/", auth,

    async (req, res) => {
        try {
            const products = await Product.find();
            res
                .status(200)
                .json(products);
        } catch (err) {
            console.log(err);
            res
                .status(500)
                .send("Server Error!");
        }
    });

// @route  GET api/products/:id
// @desc   Get Product by id
// @access Private
router.get("/:id",auth,
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res
                    .status(404)
                    .json({ msg: "No Product found" });
            }

            res.json(product);
        } catch (err) {
            console.error(err.message);
            // Check if id is not valid
            if (err.kind === "ObjectId") {
                return res
                    .status(404)
                    .json({ msg: "No Product found" });
            }
            res
                .status(500)
                .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
        }
    });



// @route  GET api/products/:name
// @desc   Get Product (Search for product by name)
// @access Private
router.get("/:name",
    auth,
    async (req, res) => {
        try {
            const product = await Product.findOne({ name: { $eq: req.params.name } });

            if (!product) {
                return res
                    .status(404)
                    .json({ msg: "No Products found" });
            }
            res
                .status(200)
                .json(product);

        } catch (err) {
            console.error(err.message);
            // Check if id is not valid
            if (err.kind === "ObjectId") {
                return res
                    .status(404)
                    .json({ msg: "No Product found" });
            }
            res
                .status(500)
                .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
        }
    });

// @route  DELETE api/products/:id
// @desc   Delete a Product
// @access Private
router.delete("/:id",
    
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res
                    .status(404)
                    .json({ msg: "No Product found" });
            }

            await product.remove();

            res
                .status(200)
                .json({ msg: "Product Successfully Removed" });
        } catch (err) {
            console.error(err.message);
            if (err.kind === "ObjectId") {
                return res
                    .status(404)
                    .json({ msg: "No Product found" });
            }
            res
                .status(500)
                .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
        }
    });

module.exports = router;
