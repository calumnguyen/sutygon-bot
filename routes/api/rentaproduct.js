const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const RentedProduct = require("../../models/RentedProducts");
const Customer = require("../../models/Customer");
const Product = require("../../models/Product");
const { check, validationResult } = require("express-validator");

// @route   POST api/rentedproducts/add
// @desc    Add New Rented Product
// @access  private
router.post(
  "/add",
  [
    check("orderNumber", "Order Number Required").not().isEmpty(),
    check("rentDate", "Delivery Date Required").not().isEmpty(),
    check("returnDate", "Return Date Required").not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    try {
      var rentedProduct = new RentedProduct({
        barcodes: req.body.barcodes,
        orderNumber: req.body.orderNumber,
        customer: req.body.customer,
        customerContactNumber: req.body.customerContactNumber,
        rentDate: req.body.rentDate,
        returnDate: req.body.returnDate,
        total: req.body.total,
        insuranceAmt: req.body.insuranceAmt,
        leaveID: req.body.leaveID,
        user: req.user.id,
        authorization_logs: [
          {
            employee_id: req.user.id,
            employee_name: req.user.name,
            status: "pending",
            message: `Authorized order : ${req.body.orderNumber}. Status is now pending. `,
          },
        ],
      });
      await rentedProduct.save();

      res.json({ msg: "Order Added Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

// @route  POST api/rentedproducts/:id
// @desc   Update RentedProduct
// @access Private
router.post(
  "/:id",
  [check("status", "Status Required").not().isEmpty()],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      await RentedProduct.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: req.body.status,
          },
        }
      );
      res.json({ msg: "Order Completed Successfully" });
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
    }
  }
);

// @route   GET api/rentedproducts
// @desc    Get all RentedProduct
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let rentedProducts = await RentedProduct.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $lookup: {
          from: "alternotes",
          localField: "_id",
          foreignField: "order",
          as: "notes",
        },
      },
      {
        $project: {
          orderNumber: "$orderNumber",
          status: "$status",
          reservedStatus: '$reservedStatus',
          readyForPickUp: "$readyForPickUp",
          pickedUpStatus:"$pickedUpStatus",
          customer: {
            _id: "$customer._id",
            name: "$customer.name",
            contactnumber: "$customer.contactnumber",
          },
          notes: "$notes",
          total_notes: {
            $size: "$notes",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.status(200).json(rentedProducts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

// @route  DELETE api/rentedproducts/:id
// @desc   Delete a Product
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const rentedProduct = await RentedProduct.findById(req.params.id);

    if (!rentedProduct) {
      return res.status(404).json({ msg: "No Order found" });
    }

    await rentedProduct.remove();

    res.json({ msg: "Order Cancelled" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Order found" });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  GET api/rentproducts/search
// @desc   Get Cutomer (Search for Customer by number)
// @access Private
router.get(
  "/search",
   auth,
  async (req, res) => {
    try {
      const result = await Customer.find({
        contactnumber: { $eq: req.query.number },
      });
      if (!result) {
        return res.status(404).json({ msg: "No Customer found" });
      }
      return res.json(result);
    } catch (err) {
      console.error(err.message);
      // Check if id is not valid
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "No Customer found" });
      }
      res
        .status(500)
        .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
    }
  }
);


// @route  GET api/nvoices/getLastRecord
// @desc   Get Last Enter Record
// @access Private
router.get("/getLastRecord", auth, async (req, res) => {
  try {
    const rentInvoice = await RentedProduct.find({}).sort({ _id: -1 }).limit(1);
    if (!rentInvoice) {
      return res.status(404).json({ msg: "No Invoice found" });
    }

    res.json(rentInvoice);
  } catch (err) {
    console.error(err.message);
    // Check if id is not valid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Invoice found" });
    }
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  POST api/rentproducts/searchstatus
// @desc   Search orders by status.
// @access Private
router.put("/searchstatus", auth, async (req, res) => {
  try {
    let result;
    if (req.body.status.includes("pickup")) {
      result = await RentedProduct.aggregate([
        {
          $match: {
            $or: [
              { status: { $in: req.body.status } },
              { pickedUpStatus: false, readyForPickUp: true },
            ],
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $lookup: {
            from: "alternotes",
            localField: "_id",
            foreignField: "order",
            as: "notes",
          },
        },
        {
          $project: {
            orderNumber: "$orderNumber",
            status: "$status",
             reservedStatus:'$reservedStatus',
            customerContactNumber: "$customerContactNumber",
            readyForPickUp: "$readyForPickUp",
             pickedUpStatus:"$pickedUpStatus",
            customer: {
              _id: "$customer._id",
              name: "$customer.name",
              contactnumber: "$customer.contactnumber",
            },
            notes: "$notes",
            total_notes: {
              $size: "$notes",
            },
          },
        },
      ]);
    } else if (req.body.status.includes("return")) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      result = await RentedProduct.aggregate([
        {
          $match: {
            $or: [
              { status: { $in: req.body.status } },
              {
                returnDate: {
                  $gte: today,
                  $lt: tomorrow,
                },
                returnStatus: false,
              },
            ],
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $lookup: {
            from: "alternotes",
            localField: "_id",
            foreignField: "order",
            as: "notes",
          },
        },
        {
          $project: {
            orderNumber: "$orderNumber",
            status: "$status",
             reservedStatus:'$reservedStatus',
            customerContactNumber: "$customerContactNumber",
            readyForPickUp: "$readyForPickUp",
             pickedUpStatus:"$pickedUpStatus",
            customer: {
              _id: "$customer._id",
              name: "$customer.name",
              contactnumber: "$customer.contactnumber",
            },
            notes: "$notes",
            total_notes: {
              $size: "$notes",
            },
          },
        },
      ]);
    } else {
      result = await RentedProduct.aggregate([
        {
          $match: {
            status: { $in: req.body.status },
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $lookup: {
            from: "alternotes",
            localField: "_id",
            foreignField: "order",
            as: "notes",
          },
        },
        {
          $project: {
            orderNumber: "$orderNumber",
            status: "$status",
             reservedStatus:'$reservedStatus',
            customerContactNumber: "$customerContactNumber",
            readyForPickUp: "$readyForPickUp",
             pickedUpStatus:"$pickedUpStatus",
            customer: {
              _id: "$customer._id",
              name: "$customer.name",
              contactnumber: "$customer.contactnumber",
            },
            notes: "$notes",
            total_notes: {
              $size: "$notes",
            },
          },
        },
      ]);
    }

    if (result.length < 1) {
      return res.status(404).json({ errors: [{ msg: "No orders found." }] });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server Error: Something went wrong" }] });
  }
});

// @route  GET api/rentedproducts/:id
// @desc   Get order by id.
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const rentedProducts = await RentedProduct.findById(req.params.id)
      .populate("customer", "name")
      .populate("product")
      .populate("user", "username")
      .lean();

    res.json(rentedProducts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

// @route  POST api/rentedproducts/:id/status/ready
// @desc   Make status ready.
// @access Private
router.post("/:id/status/ready", auth, async (req, res) => {
  try {
    readyLog = {
      employee_id: req.user.id,
      employee_name: req.user.name,
      status: "ready",
      message: `Authorized for Ready. Status is now "Ready".`,
    };

    const rentedProducts = await RentedProduct.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { authorization_logs: readyLog },
        status: "ready",
        readyForPickUp: true,
      },
      { new: true }
    )
      .select(
        "readyForPickUp pickedUpStatus returnStatus status authorization_logs"
      )
      .lean();

    return res.status(200).json(rentedProducts);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error!");
  }
});

// @route  POST api/rentedproducts/:id/status/active
// @desc   Make status active.
// @access Private
router.post("/:id/status/active", auth, async (req, res) => {
  try {
    pickUpLog = {
      employee_id: req.user.id,
      employee_name: req.user.name,
      status: "active",
      message: `Authorized for Pickup. Status is now "Active".`,
    };

    const rentedProducts = await RentedProduct.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { authorization_logs: pickUpLog },
        status: "active",
        pickedUpStatus: true,
      },
      { new: true }
    )
      .select(
        "readyForPickUp pickedUpStatus returnStatus status authorization_logs"
      )
      .lean();

    return res.status(200).json(rentedProducts);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error!");
  }
});

// @route  POST /api/rentedproducts/:id/status/cancel
// @desc   Make status active.
// @access Private
router.post("/:id/status/cancel", auth, async (req, res) => {
  try {
    pickUpLog = {
      employee_id: req.user.id,
      employee_name: req.user.name,
      status: "cancelled",
      message: `Order cancelled.`,
    }
    const { barcodes } = await RentedProduct.findById(req.params.id).select(
      'barcodes'
    )
    
    const rentedProducts = await RentedProduct.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { authorization_logs: pickUpLog },
        status: "cancelled",
        readyForPickUp: false,
        pickedUpStatus: false,
      },
      { new: true }
    )
      .select(
        "readyForPickUp pickedUpStatus returnStatus status authorization_logs"
      )
      .lean();

    return res.status(200).json(rentedProducts);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error!");
  }
});

// @route  GET api/rentedproducts/:id/authlogs
// @desc   get authorization logs.
// @access Private
router.get("/:id/authlogs", auth, async (req, res) => {
  try {
    const authLogs = await RentedProduct.findById(req.params.id)
      .select("authorization_logs")
      .lean();

    return res.status(200).json(authLogs);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error!");
  }
});

// @route  GET api/rentedproducts/:id/orderitems
// @desc   get product items of order by id.
// @access Private
router.get("/:id/orderitems", auth, async (req, res) => {
  try {
    const { barcodes } = await RentedProduct.findById(req.params.id).select(
      "barcodes"
    );

    let eachProdColorArr = [];
    let eachProdSizeArr = [];
    let singleProdDetailsArr = [];

    // Traverse through each barcode.
    for (bcode of barcodes) {
      // for each new barcode we will empty the eachProdColorArr for traversing of the latest barcode's colors array...
      eachProdColorArr.length = 0;

      // for each new barcode we will empty the eachProdSizeArr for traversing of the latest barcode's color's sizes array...
      eachProdSizeArr.length = 0;

      // Find product document through barcode. (colors => sizes => barcodes)
      let singleProduct = await Product.findOne(
        {
          "color.sizes.barcodes": {
            $elemMatch: { barcode: parseInt(bcode) },
          },
        },
        { color: 1, name: 1, productId: 1 }
      );

      // To avoid nulls if no product is found with the barcode...
      if (singleProduct) {
        // Get colours for each barcode.
        singleProduct.color.forEach((clr) => {
          // Push in color array for traversing it later.
          eachProdColorArr.push(clr);
        });

        // Now traverse through each color.
        eachProdColorArr.forEach((prodclr) => {
          // Traverse through sizes array.
          prodclr.sizes.forEach((psize) => {
            // Traverse through each barcode inside the barcode array inside the sizes array...
            for (barcode of psize.barcodes) {
              // If barcode is matched.
              if (barcode.barcode == bcode) {
                // Updating details of single product..

                // Created new object to avoid references.
                let singleProdDetails = new Object();
                singleProdDetails.name = singleProduct.name;
                singleProdDetails.colorname = prodclr.colorname;
                singleProdDetails.size = psize.size;
                singleProdDetails.barcode = bcode;
                singleProdDetails.price = psize.price;
                singleProdDetails.productId = singleProduct.productId;

                // Save each product's info object inside this array. (name, color,size)
                singleProdDetailsArr.push(singleProdDetails);
              }
            }
          });
        });
      }
    }

    return res.status(200).json(singleProdDetailsArr);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error!");
  }
});

// @route  GET api/rentproducts/status/pickuptoday
// @desc   Get order whose pickup status is true.
// @access Private
router.get("/status/pickuptoday", auth, async (req, res) => {
  try {
    const result = await RentedProduct.find({
      readyForPickUp: true,
      pickedUpStatus: false,
    })
      .populate("customer", "name")
      .populate("product")
      .populate("user", "username")
      .lean();

    if (result.length < 1) {
      return res
        .status(404)
        .json({ errors: [{ msg: "No orders ready for pickup today." }] });
    }

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

router.get('/:barcode/findorderbybarcode', auth,async (req, res) => {
  try {
    const result = await RentedProduct.find({
      "barcodes": {$eq:(req.params.barcode)},
  }).populate('customer')
  .sort({ updatedAt: -1 })

  return res.status(200).json(result)

 } catch (err) {
    console.log(err)
    res.status(500).send('Server Error!')
  }
})


module.exports = router
