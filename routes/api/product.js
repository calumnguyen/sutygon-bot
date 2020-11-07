const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Product");
const { check, validationResult } = require("express-validator");
var multer = require('multer')
var upload = multer({ dest: 'client/public/uploads/products' })

const FILE_PATH = 'client/public/uploads/products';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FILE_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.split(' ').join('_'))
    }
})

var upload = multer({ storage: storage })

// @route   POST api/products/add
// @desc    Add New Product
// @access  private
router.post(
    "/add",
    [
        check("name", "Product Name Required").not().isEmpty(),
        check("image", "Product Image Required").not().isEmpty(),
        check("color", "Product Color Required").isArray().not().isEmpty(),
    ],
    auth,
    upload.single('image'),
    async (req, res) => {

        const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
        const image = req.file.originalname.split(' ').join('_')
        try {
            const productBody = {
                name: body.name,
                productId: body.productId,
                tags: body.tags,
                image: `/uploads/products/${image}`,
                color: JSON.parse(req.body.color),
            };

            let product = new Product(productBody);
            await product.save();
            res.json({ product, msg: "Product Added Successfully" });
        } catch (err) {
            console.log(err);
            res
                .status(500)
                .send("Server error");
        }
    }
);



// @route  POST api/products/barcode_update/:id
// @desc   Update a Product for Barcode
// @access Private
router.post(
    "/barcode_update/:id",
    auth,
    async (req, res) => {
        try {
            const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    color: body.color,
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
// @route  POST api/products/index_update/:id
// @desc   Update a Product after renting
// @access Private
router.post(
    "/index_update/:id",
    auth,
    async (req, res) => {
        try {
            const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    color: body.color,
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

// @route  POST api/products/changeStatus/:id
// @desc   changeStatus
// @access Private
router.post(
    "/changeStatus/:id/:status",
    auth,
    async (req, res) => {
        try {
await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    disabled: req.params.status,
                }
            });
            res.json({ msg: "Product Status changed Successfully" });
        } catch (err) {
            console.error(err.message);
            res
                .status(500)
                .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
        }
    }
);

// @route  POST api/products/item_delete/:id
// @desc   Update a Product to Delete Item
// @access Private
router.post(
    "/item_delete/:id",
    auth,
    async (req, res) => {
        try {
            const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
const product = await Product.updateOne({ _id: req.params.id }, {
                $set: {     
                    color: body.color,
                }
            });
            res
                .json({ msg: "Item Deleted Successfully" });
        } catch (err) {
            console.error(err.message);
            res
                .status(500)
                .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
        }
    }
);

// @route  POST api/products/:id
// @desc   Update a Product
// @access Private
router.post(
    "/:id",
    auth,
    upload.single('image'),
    async (req, res) => {
        try {
            let updatedImage = "";

            const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
            if (req.file === undefined) {
                updatedImage = body.image;
            }
            else {
                updatedImage = `/uploads/products/${req.file.originalname}`;
            }
            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    name: body.name,
                    tags: body.tags,
                    image: updatedImage,
                    color: JSON.parse(body.color),
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


// @route   GET api/products/search/search val
// @desc    Search products
// @access  Private
router.get("/search/:val", auth,

    async (req, res) => {
        try {
            const search = req.params.val;
            const products = await Product.find({
                $or: [
                    { name: search },
                    { color: search },
                    { size: search },
                    { fabric: search },
                    { availableQuantity: search },
                    { rentedQuantity: search },
                ]
            });
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
router.get("/:id", auth,
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



// @route   GET api/products/search/search val
// @desc    Search products
// @access  Private
router.get("/searchBarcode/:val", auth,

    async (req, res) => {
        try {
            const search = req.params.val;
            const products = await Product.find({
                $or: [
                    { 'color.sizes..barcodes..barcode': search },
                ]
            });

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

module.exports = router;
