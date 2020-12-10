const express = require('express')
const router = express.Router()
const _ = require('lodash')
const auth = require('../../middleware/auth')
const alterNotes = require('../../models/alterNotes')
const rentedProducts = require('../../models/RentedProducts')
const Product = require('../../models/Product')

// @route   POST api/alternotes
// @desc    Create alteration note
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { order_id, note, alter_request } = req.body

    const alterNote = await alterNotes.create({
      order_id,
      note,
      alter_request: alter_request,
      emp_name: req.user.name,
    })

    if (!alterNote) {
      return res.status(400).json({ msg: 'Unable to create alteration note.' })
    }

    return res.status(200).json({ msg: 'Alteration note created.' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: 'Server Error' })
  }
})

// @route   GET api/alternotes
// @desc    get alteration notes
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // find all alteration notes.
    const alterationNotes = await alterNotes.find().lean()

    // Outcome arrays.
    let alterationNotesWithProds = []

    if (!alterationNotes.length) {
      return res.status(400).json({ msg: 'Alteration request not found.' })
    }

    for (alteration of alterationNotes) {
      let eachProdColorArr = []
      let eachProdSizeArr = []

      // Each product details of single order is pushed into it.
      let singleProdDetailsArr = []

      // check if order consists of order_id else ignore it.
      if (alteration.order_id) {
        // Get barcodes array from that order document.
        let rentProds = await rentedProducts
          .findOne({
            orderNumber: alteration.order_id,
          })
          .select('barcodes')

        // Check if the order document contains barcode array.
        if (rentProds) {
          // Traverse through each barcode.
          for (bcode of rentProds.barcodes) {
            // for each new barcode we will empty the eachProdColorArr for traversing of the latest barcode's colors array...
            eachProdColorArr.length = 0

            // for each new barcode we will empty the eachProdSizeArr for traversing of the latest barcode's color's sizes array...
            eachProdSizeArr.length = 0

            // Find product document through barcode. (colors => sizes => barcodes)
            let singleProduct = await Product.findOne(
              {
                'color.sizes.barcodes': {
                  $elemMatch: { barcode: parseInt(bcode) },
                },
              },
              { color: 1, name: 1 }
            )

            // To avoid nulls if no product is found with the barcode...
            if (singleProduct) {
              // Get colours for each barcode.
              singleProduct.color.forEach((clr) => {
                // Push in color array for traversing it later.
                eachProdColorArr.push(clr)
              })

              // Now traverse through each color.
              eachProdColorArr.forEach((prodclr) => {
                // Traverse through sizes array.
                prodclr.sizes.forEach((psize) => {
                  // Traverse through each barcode inside the barcode array inside the sizes array...
                  for (barcode of psize.barcodes) {
                    // If barcode is matched.
                    if (barcode.barcode === bcode) {
                      // Updating details of single product..
                      // Created new object to avoid references.
                      let singleProdDetails = new Object()
                      singleProdDetails.name = singleProduct.name
                      singleProdDetails.colorname = prodclr.colorname
                      singleProdDetails.size = psize.size

                      // Save each product's info object inside this array. (name, color,size)
                      singleProdDetailsArr.push(singleProdDetails)
                    }
                  }
                })
              })
            }
          }
        }

        // Set products(singleProdDetailsArr) array to the current alteration...
        alteration = { ...alteration, products: singleProdDetailsArr }

        // Then push it to the final array of alterations.
        alterationNotesWithProds.push(alteration)
      } else {
        // Simply push to array because this alteration contains no (order_id).
        alterationNotesWithProds.push(alteration)
      }
    }

    return res.status(200).json({
      msg: 'Alteration requests found.',
      data: alterationNotesWithProds,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: 'Server Error' })
  }
})

// @route   PUT api/alternotes/:id/done
// @desc    mark alteration as done.
// @access  Private
router.put('/:id/done', auth, async (req, res) => {
  try {
    await alterNotes.updateOne(
      { _id: req.params.id },
      {
        $set: {
          done: true,
        },
      }
    )

    return res.status(200).json({ msg: 'Alteration marked as done.' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: 'Server Error' })
  }
})

module.exports = router
