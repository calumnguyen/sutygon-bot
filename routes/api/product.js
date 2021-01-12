const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Product = require("../../models/Product");
const { check, validationResult } = require("express-validator");
var multer = require("multer");
var cloudinary = require("cloudinary");
const config = require("config");
const pagination_limit=10

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
  upload.single("image"),
  async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    const image = req.file.path;
    try {
      cloudinary.uploader.upload(image, async function (result) {
        const productBody = {
          name: body.name,
          productId: body.productId,
          tags: body.tags,
          image: result.secure_url,
          color: JSON.parse(req.body.color),
        };
        let product = new Product(productBody);
        await product.save();
        res.status(200).json({ product, msg: "Product Added Successfully" });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

// @route  POST api/products/barcode_update/:id
// @desc   Update a Product for Barcode
// @access Private
router.post("/barcode_update/:id", auth, async (req, res) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          color: body.color,
        },
      }
    );
    res.json({ msg: "Product Updated Successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});
// @route  POST api/products/index_update/:id
// @desc   Update a Product after renting
// @access Private
router.post("/index_update/:id", auth, async (req, res) => {
  try {
    const body = req.body; // req.body = [Object: null prototype] { title: 'product' }
    let singleProduct = await Product.findOne(
      {
        "color.sizes.barcodes": {
          $elemMatch: { barcode: parseInt(body.barcode) },
        },
      },
      { color: 1, name: 1, productId: 1 }
    );
    // To avoid nulls if no product is found with the barcode...
    let eachProdColorArr = [];

    if (singleProduct) {
      // Get colours for each barcode.
      singleProduct.color.forEach((clr) => {
        // Push in color array for traversing it later.
        eachProdColorArr.push(clr);
      });
      console.log(eachProdColorArr);
      // Now traverse through each color.
      eachProdColorArr.forEach((prodclr) => {
        // Traverse through sizes array.
        prodclr.sizes.forEach((psize) => {
          // Traverse through each barcode inside the barcode array inside the sizes array...
          for (barcode of psize.barcodes) {
            // If barcode is matched.
            if (barcode.barcode == body.barcode) {
              barcode.isRented = !barcode.isRented;
              singleProduct.save();
            }
          }
        });
      });
    }
    res.json({ msg: "Product Updated Successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  POST api/products/changeStatus/:id
// @desc   changeStatus
// @access Private
router.post("/changeStatus/:id/:status", auth, async (req, res) => {
  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          disabled: req.params.status,
        },
      }
    );
    res.json({ msg: "Product Status changed Successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  POST api/products/item_delete/:id
// @desc   Update a Product to Delete Item
// @access Private
router.post("/item_delete/:id", auth, async (req, res) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    const product = await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          color: body.color,
        },
      }
    );
    res.json({ msg: "Item Deleted Successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  POST api/products/:id
// @desc   Update a Product
// @access Private
router.post("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

    if (req.file === undefined) {
      await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            name: body.name,
            tags: body.tags,
            image: body.image,
            color: JSON.parse(body.color),
          },
        }
      );
      res.json({ msg: "Product Updated Successfully" });
    } else {
      const image = req.file.path;
      cloudinary.uploader.upload(image, async function (result) {
        await Product.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: body.name,
              tags: body.tags,
              image: result.secure_url,
              color: JSON.parse(body.color),
            },
          }
        );
        res.json({ msg: "Product Updated Successfully" });
      });
    }
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route   GET api/products
// @desc    Get all products
// @access  Private
router.get(
  "/:page",
  auth,

  async (req, res) => {
    try {
      var page = req.params.page ? parseInt(req.params.page) : 1;
      var skip = (page - 1) * pagination_limit;
      const products = await Product.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(pagination_limit);
      const total = await Product.count({});
      res.status(200).json({ products: products, total: total });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

// router.get(
//   '/',
//   auth,

//   async (req, res) => {
//     try {
//       const products = await Product.find().sort({ date: -1 })
//       res.status(200).json(products)
//     } catch (err) {
//       console.log(err)
//       res.status(500).send('Server Error!')
//     }
//   }
// )

// @route   GET api/products/search/search val
// @desc    Search products
// @access  Private
router.get(
  "/search/:val",
  auth,

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
        ],
      });
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

// @route  GET api/products/:id
// @desc   Get Product by id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "No Product found" });
    }

    res.json(product);
  } catch (err) {
    // Check if id is not valid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Product found" });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  GET api/products/:name
// @desc   Get Product (Search for product by name)
// @access Private
router.get("/:name", auth, async (req, res) => {
  try {
    const product = await Product.findOne({ name: { $eq: req.params.name } });

    if (!product) {
      return res.status(404).json({ msg: "No Products found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err.message);
    // Check if id is not valid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Product found" });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  DELETE api/products/:id
// @desc   Delete a Product
// @access Private
router.delete(
  "/:id",

  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ msg: "No Product found" });
      }

      await product.remove();

      res.status(200).json({ msg: "Product Successfully Removed" });
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "No Product found" });
      }
      res
        .status(500)
        .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
    }
  }
);

// @route   GET api/products/search/search val
// @desc    Search products
// @access  Private
router.get(
  "/searchBarcode/:val",
  auth,

  async (req, res) => {
    try {
      const search = req.params.val;
      const products = await Product.find({
        $or: [{ "color.sizes..barcodes..barcode": search }],
      });

      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

module.exports = router;
