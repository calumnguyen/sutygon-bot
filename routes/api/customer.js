const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Customer = require('../../models/Customer')
const RentedProduct = require('../../models/RentedProducts')
const { check, validationResult } = require('express-validator')
const RentedProducts = require('../../models/RentedProducts')
const mongoose = require('mongoose')
const Invoice = require('../../models/Invoices')
const Product = require('../../models/Product')
var moment = require('moment')

// @route   POST api/customers/add
// @desc    Add New Customer
// @access  private
router.post(
  '/add',
  [
    check('name', 'Customer Name Required').not().isEmpty(),
    check('contactnumber', 'Contact Number Required').isLength({ min: 10 }),
    check('email', 'Email Required').not().isEmpty(),
    check('address', 'Address Required').not().isEmpty(),
    check('birthday', 'Enter birth date.').not().isEmpty(),
  ],
  auth,

  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    try {
      // Check if email already exist.
      let emailExist = await Customer.findOne({ email: req.body.email })
        .lean()
        .select('_id')

      if (emailExist) {
        console.log(emailExist)
        return res
          .status(409)
          .json({ errors: [{ msg: 'Email already exists' }] })
      }

      let customer = new Customer(req.body)
      await customer.save()
      res.status(200).json({ msg: 'Customer Added Successfully' })
    } catch (err) {
      console.log(err)
      res.status(500).send('Server error')
    }
  }
)

// @route  POST api/customers/:id
// @desc   Update a Customer
// @access Private
router.post('/:id', auth, async (req, res) => {
  try {
    const body = req.body // req.body = [Object: null prototype] { title: 'product' }

    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: body.orderNumber,
        },
      }
    )
    res.json({ msg: 'Product Updated Successfully' })
  } catch (err) {
    console.error(err.message)
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route    PUT api/customers/update/:id
//@desc      update customers.
router.put('/update/:id', auth, async (req, res) => {
  try {
    let { name, birthday, online_account } = req.body

    let { username } = { ...online_account }

    // now remove those key:items from the req.body with are not editable.
    if (name || birthday || username) {
      delete req.body['name']
      delete req.body['birthday']
      delete online_account['username']
    }

    let customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).lean()

    if (!customer) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'No customer found with this id.' }] })
    }

    return res.status(200).json({ msg: 'Customer updated successfully!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route   GET api/customers
// @desc    Get all customers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find()
    res.json(customers)
  } catch (err) {
    console.log(err)
    res.statu(500).send('Server Error!')
  }
})

// @route  GET api/customers/:id
// @desc   Get Customer by id
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({ msg: 'No Customer found' })
    }

    res.json(customer)
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
})

// @route  GET api/customer/:name
// @desc   Get Customer (Search for customer)
// @access Private
router.get('/search/:name', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({ name: { $eq: req.params.name } })

    if (!customer) {
      return status(404).json({ msg: 'No Customer found' })
    }

    res.json(customer)
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
})

//@route   GET api/customers/:contactnumber
//@desc    Get Customer through contact number
//@access  Private
router.get('/search/number/:contactnumber', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      contactnumber: { $eq: req.params.contactnumber },
    })

    if (!customer) {
      return status(404).json({ msg: 'No Customer found' })
    }

    res.json(customer)
  } catch (err) {
    console.error(err.message)

    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route  DELETE api/customers/:id
// @desc   Delete a Customer
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({ msg: 'No Customer found' })
    }

    await customer.remove()

    res.json({ msg: 'Customer Successfully Removed' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No Customer found' })
    }
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route  GET api/customers/insights
// @desc   Get customer insights
// @access Private

router.get('/:id/insights', auth, async (req, res) => {
  let { year } = { ...req.body }

  try {
    //get year
    var startDate = moment(year).format('YYYY-MM-DD')

    //make last date of the current year
    const lastDate = startDate.split('-')

    lastDate[1] = '12'
    lastDate[2] = '30'

    let endDate = lastDate.join('-')

    //converted to ObjectId because aggregator is type-sensitive.
    var customerId = mongoose.Types.ObjectId(req.params.id)

    let orders = await RentedProducts.aggregate([
      {
        $match: {
          $and: [
            { customer: customerId },
            {
              rentDate: {
                // get in range between $gte and $lte for the requested timeframe...
                $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              // double is used to convert string to number for performing addition.
              $toDouble: '$total',
            },
          },
          insuranceAmt: {
            $sum: {
              $toDouble: '$insuranceAmt',
            },
          },
          Total_spent: {
            $sum: {
              $subtract: [
                { $toDouble: '$total' },
                { $toDouble: '$insuranceAmt' },
              ],
            },
          },
          // tax: {
          //    total - (product + insurance)
          // },
          // Used to count the documents. It should be the direct child of
          // the $group because it is an object accumulator...

          // It will give the total number of orders
          total_orders: { $sum: 1 },
        },
      },
      // {
      //   // want total documents with the customer_id in invoice collection.
      //   $lookup: {
      //     from:""
      //   }
      // }
    ])

    let totalProducts = await RentedProducts.find({
      customer: customerId,
    }).select('barcodes')

    // console.log(totalProducts)

    var productAmount = 0

    totalProducts.forEach((prod) => {
      // console.log(prod.barcodes)
      prod.barcodes.forEach(async (bcode) => {
        // console.log(bcode)

        let singleProduct = await Product.findOne({
          'color.sizes.barcodes': { $elemMatch: { barcode: parseInt(bcode) } },
        })
        // .lean()

        // I set this check of null because whenever no barcode is matched, the returned value
        // will be null...
        if (singleProduct) {
          console.log(parseInt(singleProduct.color[0].sizes[0].price))

          productAmount += parseInt(singleProduct.color[0].sizes[0].price)
        }
      })
    })

    console.log(productAmount)

    // total orders gathered from Invoices collection.
    // const totalOrders = await Invoice.find({
    //   customer_id: req.params.id,
    //   createdAt: {
    //     // get in range between $gte and $lte for the requested timeframe...
    //     $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    //     $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
    //   },
    // }).countDocuments()

    return res.status(200).json({ msg: 'Insights found.', orders })
  } catch (error) {
    return res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong.' }] })
  }

  // total orders.

  // total discounts. (no)

  // total insurance

  // damage = missing

  // late fees. (no)
})

module.exports = router
