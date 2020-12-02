const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const RentedProduct = require('../../models/RentedProducts')
const Customer = require('../../models/Customer')
const { check, validationResult } = require('express-validator')
const shortid = require('shortid')

// @route   POST api/rentedproducts/add
// @desc    Add New Rented Product
// @access  private
router.post(
  '/add',
  [
    check('orderNumber', 'Order Number Required').not().isEmpty(),
    check('rentDate', 'Delivery Date Required').not().isEmpty(),
    check('returnDate', 'Return Date Required').not().isEmpty(),
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
      })
      await rentedProduct.save()

      res.json({ msg: 'Order Added Successfully' })
    } catch (err) {
      console.log(err)
      res.status(500).send('Server error')
    }
  }
)

// @route  POST api/rentedproducts/:id
// @desc   Update RentedProduct
// @access Private
router.post(
  '/:id',
  [check('status', 'Status Required').not().isEmpty()],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      await RentedProduct.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: req.body.status,
          },
        }
      )
      res.json({ msg: 'Order Completed Successfully' })
    } catch (err) {
      console.error(err.message)
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
    }
  }
)

// @route   GET api/products
// @desc    Get all RentedProduct
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const rentedProducts = await RentedProduct.find()
      .populate('customer')
      .populate('product')
      .populate('user')
    res.json(rentedProducts)
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error!')
  }
})

// @route  DELETE api/rentedproducts/:id
// @desc   Delete a Product
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const rentedProduct = await RentedProduct.findById(req.params.id)

    if (!rentedProduct) {
      return res.status(404).json({ msg: 'No Order found' })
    }

    await rentedProduct.remove()

    res.json({ msg: 'Order Cancelled' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No Order found' })
    }
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route  GET api/rentproducts/search
// @desc   Get Cutomer (Search for Customer by number)
// @access Private
router.get(
  '/search',
  //  auth,
  async (req, res) => {
    try {
      const result = await Customer.find({
        contactnumber: { $eq: req.query.number },
      })
      if (!result) {
        return res.status(404).json({ msg: 'No Customer found' })
      }
      return res.json(result)
    } catch (err) {
      console.error(err.message)
      // Check if id is not valid
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'No Customer found' })
      }
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
    }
  }
)

// @route  GET api/nvoices/getLastRecord
// @desc   Get Last Enter Record
// @access Private
router.get('/getLastRecord', auth, async (req, res) => {
  try {
    const rentInvoice = await RentedProduct.find({}).sort({ _id: -1 }).limit(1)
    if (!rentInvoice) {
      return res.status(404).json({ msg: 'No Invoice found' })
    }

    res.json(rentInvoice)
  } catch (err) {
    console.error(err.message)
    // Check if id is not valid
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No Invoice found' })
    }
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route  POST api/rentproducts/searchstatus
// @desc   Search orders by status.
// @access Private
router.get('/searchstatus', auth, async (req, res) => {
  try {
    const result = await RentedProduct.find({
      status: { $in: req.body.statusArray },
    })
      .select('orderNumber customerContactNumber status')
      .populate('customer', 'name')
      .lean()

    if (result.length < 1) {
      return res.status(404).json({ msg: 'No Orders found' })
    }

    return res.status(200).json({ result, size: result.length })
  } catch (err) {
    console.error(err.message)
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route  GET api/rentproducts/:id
// @desc   Get order by id.
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const rentedProducts = await RentedProduct.findById(req.params.id)
      .populate('customer', 'name')
      .populate('product')
      .populate('user', 'username')
      .lean()

    res.json(rentedProducts)
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error!')
  }
})

module.exports = router
