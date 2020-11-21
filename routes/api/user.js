const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const moment = require('moment')
const cron = require('node-cron')

const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
var multer = require('multer')
var upload = multer({ dest: 'client/public/uploads/user' })
const { isAdmin } = require('../../middleware/isAdmin')

// const { weekly, biWeekly, monthly } = require('../../helpers/timePeriod')

const FILE_PATH = 'client/public/uploads/user'

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILE_PATH)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.originalname)
  },
})

var upload = multer({ storage: storage })

// @route   POST /api/users/add
// @desc    Add new user
// @access  Private

router.post(
  '/add',
  upload.single('avatar'),
  auth,
  isAdmin,
  [
    check('username', 'User Name is Required').not().isEmpty(),
    check('fullname', 'Full Name is Required').not().isEmpty(),
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('contactnumber', 'Please Enter Contact Number').not().isEmpty(),
    check('gender', 'Please select your Gender').not().isEmpty(),
    check(
      'password',
      'Please Enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const body = JSON.parse(JSON.stringify(req.body))

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(body.password, salt)

    try {
      // check if there is any record with same email and username
      const userByEmail = await User.findOne({ email: body.email })
      const userByUsername = await User.findOne({ username: body.username })
      if (userByEmail) {
        return res
          .status(422)
          .json({ errors: [{ msg: 'User with this Email already exists' }] })
      }
      if (userByUsername) {
        return res
          .status(500)
          .json({ errors: [{ msg: 'User with this Username already exists' }] })
      }

      // save user record
      // const { avatar } = file.path;
      const avatar = gravatar.url(body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })
      let userBody

      if (req.file === undefined) {
        userBody = {
          username: body.username,
          fullname: body.username,
          email: body.email,
          password: password,
          gender: body.gender,
          contactnumber: body.contactnumber,
          type: body.type,
          avatar: avatar,
        }
      } else {
        userBody = {
          ...req.body,
          password,
          avatar: `/uploads/user/${req.file.originalname}`,
        }
      }
      // if (req.file == undefined) {
      //   userBody = {
      //     username: body.username,
      //     fullname: body.fullname,
      //     email: body.email,
      //     password: password,
      //     gender: body.gender,
      //     contactnumber: body.contactnumber,
      //     type: body.type,
      //     avatar: avatar,
      //     sections: body.sections,
      //   }
      // } else {
      //   userBody = {
      //     username: body.username,
      //     fullname: body.fullname,
      //     email: body.email,
      //     password: password,
      //     gender: body.gender,
      //     contactnumber: body.contactnumber,
      //     type: body.type,
      //     sections: body.sections,
      //     avatar: `/uploads/user/${req.file.originalname}`,
      //   }
      // }

      let user = new User(userBody)
      await user.save()

      res.status(200).json({ user, msg: 'User Added Successfully' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: err })
    }
  }
)

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error!')
  }
})

// // @route   GET api/users/:status
// // @desc    Get all users
// // @access  Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const users = await User.find()
//     res.json(users)
//   } catch (err) {
//     console.log(err)
//     res.status(500).send('Server Error!')
//   }
// })

// @route   GET api/users/search/sarchval
// @desc    Search user
// @access  Private
router.get('/search/:val', auth, async (req, res) => {
  try {
    const search = req.params.val
    // const users = await User.find({username: /search/, contactnumber: /search/, email: /search/, gender: /search/, accountStatus: /search/});
    // const users = await User.find({username: {$regex: search}, contactnumber: {$regex: search}, email: {$regex: search}, accountStatus: {$regex: search} });
    const users = await User.find({
      $or: [
        { username: search },
        { contactnumber: search },
        { email: search },
        { gender: search },
        { accountStatus: search },
      ],
    })
    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error!')
  }
})

// @route   GET /api/users/id
// @desc    Get User by Id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ msg: 'No user found' })
    }

    res.status(200).json(user)
  } catch (err) {
    console.error(err.message)
    // Check if id is not valid
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No User found' })
    }
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route  PUT api/users/:id
// @desc   Update a user
// @access Private
router.post(
  '/:id',
  upload.single('avatar'),
  [
    check('username', 'User Name is Required').not().isEmpty(),
    check('fullname', 'Full Name is Required').not().isEmpty(),
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('contactnumber', 'Please Enter Contact Number').not().isEmpty(),
    check('gender', 'Please select your Gender').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const body = JSON.parse(JSON.stringify(req.body))

    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      // check if there is any record with same email and username of not this user
      const userByEmail = await User.findOne({
        _id: { $ne: req.params.id },
        email: body.email,
      })
      const userByUsername = await User.findOne({
        _id: { $ne: req.params.id },
        username: body.username,
      })
      if (userByEmail) {
        return res
          .status(422)
          .json({ errors: [{ msg: 'User with this Email already exists' }] })
      }
      if (userByUsername) {
        return res
          .status(500)
          .json({ errors: [{ msg: 'User with this Username already exists' }] })
      }

      // find user through req.params.id
      var user = await User.findById(req.params.id).select('salary')
      console.log(user)

      // if (!user.salary.period) {
      //   console.log('no period set.')

      //   var salary
      //   if (req.body.salary) {
      //     if (!(req.body.code === process.env.salarySecretCode)) {
      //       return res
      //         .status(400)
      //         .json({ errors: [{ msg: 'Wrong Authorization code.' }] })
      //     }

      //     salary = {
      //       ...req.body.salary,
      //     }
      //     // At starting date is null..

      //     // Period : Weekly
      //     if (salary.period === 'weekly') {
      //       const nextMonday = moment().startOf('isoWeek').add(1, 'week')
      //       salary = {
      //         ...req.body.salary,
      //         effective_date: nextMonday,
      //       }
      //     }

      //     // Period : bi-weekly
      //     if (salary.period === 'bi-weekly') {
      //       const nextMonday = moment().startOf('isoWeek').add(1, 'week')

      //       // create new instance
      //       let secondMonday = nextMonday.clone()
      //       secondMonday.startOf('isoWeek').add(1, 'week')

      //       // create new instance
      //       let thirdMonday = secondMonday.clone()
      //       thirdMonday.startOf('isoWeek').add(1, 'week')

      //       salary = {
      //         ...req.body.salary,
      //         effective_date: [nextMonday, thirdMonday],
      //       }
      //       console.log('bi-weekly', [nextMonday, thirdMonday])
      //     }

      //     // Period : monthly
      //     if (salary.period === 'monthly') {
      //       // grabbed the last monday of the month using momentjs..
      //       salary = {
      //         ...req.body.salary,
      //         effective_date: moment().endOf('month').startOf('isoweek'),
      //       }
      //     }
      //   }
      // } else {
      //   // now check if period is weekly
      //   let salary_period = user.salary.period

      //   // apply cron job here.. in every if else depending on the given period in the req.body
      //   if (salary_period === 'weekly') {
      //     // check how many days are left in the effective date.
      //     console.log(
      //       `your changes will be working after the completion of the next effective date.${user.salary.effective_date}`
      //     )

      //     // apply cron-job
      //   }
      //   if (salary_period === 'bi-weekly') {
      //     // check how many days are left in the effective date.
      //     console.log(
      //       `your changes will be working after the completion of the next effective date.${user.salary.effective_date[1]}`
      //     )

      //     // apply cron-job
      //   }
      //   if (salary_period === 'monthly') {
      //     // check how many days are left in the effective date.
      //     console.log(
      //       `your changes will be working after the completion of the next effective date.${user.salary.effective_date}`
      //     )

      //     // apply cron-job
      //   }
      // }

      //====================================//
      // check if salary is there in req.body.
      var salary
      if (req.body.salary) {
        if (!(req.body.code === process.env.salarySecretCode)) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Wrong Authorization code.' }] })
        }

        if (!user.salary.period) {
          // then check if salary is already set there in db.
          // if no salary is set then set salary.

          salary = {
            ...req.body.salary,
          }
          // At starting date is null..

          // Period : Weekly
          if (salary.period === 'weekly') {
            const nextMonday = moment().startOf('isoWeek').add(1, 'week')
            salary = {
              ...req.body.salary,
              effective_date: nextMonday,
            }
          }

          // Period : bi-weekly
          if (salary.period === 'bi-weekly') {
            const nextMonday = moment().startOf('isoWeek').add(1, 'week')

            // create new instance
            let secondMonday = nextMonday.clone()
            secondMonday.startOf('isoWeek').add(1, 'week')

            // create new instance
            let thirdMonday = secondMonday.clone()
            thirdMonday.startOf('isoWeek').add(1, 'week')

            salary = {
              ...req.body.salary,
              effective_date: [nextMonday, thirdMonday],
            }
            console.log('bi-weekly', [nextMonday, thirdMonday])
          }

          // Period : monthly
          if (salary.period === 'monthly') {
            // grabbed the last monday of the month using momentjs..
            salary = {
              ...req.body.salary,
              effective_date: moment().endOf('month').startOf('isoweek'),
            }
          }
        } else {
          // set the existing salary object again to the salary field in db until the cron-job runs...

          // check if the salary period in req.body.salary is equal to the period in db
          // if it is then no change
          // else cron-job

          salary = {
            ...user.salary,
          }

          if (req.body.salary.period !== salary.period) {
            // apply cron job here.. in every if else depending on the given period in the req.body

            console.log('apply cron job')

            if (req.body.salary.period === 'weekly') {
              // check how many days are left in the effective date.
              console.log(
                `your new changes of ${req.body.salary.period} will be working after the completion of the next effective date.${user.salary.effective_date}`
              )

              cron.schedule('* * * * *', () => {
                console.log('period updated!')
              })

              // apply cron-job
            }
            if (req.body.salary.period === 'bi-weekly') {
              // check how many days are left in the effective date.
              console.log(
                `your new changes of ${req.body.salary.period} will be working after the completion of the next effective date.${user.salary.effective_date[1]}`
              )

              // apply cron-job
            }
            if (req.body.salary.period === 'monthly') {
              // check how many days are left in the effective date.
              console.log(
                `your new changes of ${req.body.salary.period} will be working after the completion of the next effective date.${user.salary.effective_date}`
              )
            }
          }
        }
      }

      const avatar = gravatar.url(body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      // It will update any number of requested fields both by Employee and Admin...
      let fieldsToUpdate
      if (req.file == undefined) {
        fieldsToUpdate = { ...req.body, avatar }
      } else {
        fieldsToUpdate = {
          ...req.body,
          avatar: `/uploads/user/${req.file.originalname}`,
        }
      }

      //check if the accountStatus is set to 'inactivated'..
      let inactivated_date
      if (req.body.accountStatus && req.body.accountStatus === 'inactive') {
        inactivated_date = Date.now()
      }

      await User.findByIdAndUpdate(
        req.params.id,
        { $set: { ...req.body, avatar, inactivated_date, salary } },
        { new: true }
      )

      res.status(200).json({ msg: 'User Updated Successfully' })
    } catch (err) {
      console.log(err)
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
    }
  }
)

// @route  POST api/users/changestatus/:id
// @desc   Change Account status (blocked/active)
// @access Private
router.post(auth, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const user = await User.findById(req.params.id)

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          accountStatus: 'block',
        },
      }
    )
    res.status(200).json({ msg: 'Status Updated Successfully' })
  } catch (err) {
    console.error(err.message)
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route   POST /api/users/updatePassword/:id
// @desc    Update Password
// @access  Public

router.post(
  '/updatepassword/:id',
  [check('currentpassword', 'Current Password Field Required').not().isEmpty()],

  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      const user = await User.findById(req.params.id)
      const isMacth = await bcrypt.compare(
        req.body.currentpassword,
        user.password
      )

      if (!isMacth) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] })
      }

      if (req.body.newpassword !== req.body.confirmpassword) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Confirm Password didn't match" }] })
      }
      const salt = await bcrypt.genSalt(10)

      newpass = await bcrypt.hash(req.body.newpassword, salt)

      await User.updateOne(
        { _id: req.params.id },
        {
          $set: {
            password: newpass,
          },
        }
      )
      res.json({ type: 'success', msg: 'Password Updated Successfully' })
    } catch (err) {
      console.error(err.message)
      res
        .status(500)
        .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
    }
  }
)

// @route  DELETE api/users/:id
// @desc   Delete a user
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Delete user Document
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ msg: 'No User found' })
    }
    await user.remove()

    res.status(200).json({ msg: `Account Removed successfully` })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No User found' })
    }
    res
      .status(500)
      .json({ errors: [{ msg: 'Server Error: Something went wrong' }] })
  }
})

// @route   GET api/users/forgetpassword/email
// @desc    Validate Email and Get Token
// @access  Private

router.get(
  '/forgetpassword/:email',
  [check('email', 'Please Enter a Valid Email').isEmail()],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { email } = req.params
    try {
      // check for existing user
      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Email' }] })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 300000 },
        (err, token) => {
          if (err) throw err

          if (token) {
            return res.status(200).json({ token: token })
          }
        }
      )
    } catch (err) {
      res.status(500).send('Server error')
    }
  }
)

// @route   POST api/users/resetpassword/reset_token
// @desc    Reset Password
// @access  Public

router.post('/resetpassword', async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  try {
    const user_id = jwt.verify(req.body.resetToken, process.env.jwtSecret)
    //  check for existing user
    let user = await User.findById(user_id.user.id)
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
    }
    const password = req.body.newpassword

    const salt = await bcrypt.genSalt(10)

    newpassword = await bcrypt.hash(req.body.newpassword, salt)

    const userID = user._id

    await User.updateOne(
      { _id: userID },
      {
        $set: {
          password: newpassword,
        },
      }
    )
    res.status(200).json({ msg: 'Password Updated Successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
