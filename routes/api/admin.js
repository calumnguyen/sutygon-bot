const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const nodemailer = require("nodemailer");
const User = require("../../models/User");

// @route   GET api/admin/all_inactive_users
// @desc    Verify token and get User
// @access  Private
router.get("/get_all_admins", auth, async (req, res) => {
  try {
    const user = await User.find({
      systemRole: "Admin",
      showOwner:true
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server Error" });
  }
});

// // @route   GET api/admin/all_inactive_users
// // @desc    Verify token and get User
// // @access  Private
// router.get("/all_inactive_users", auth, async (req, res) => {
//   try {
//     const user = await User.find({
//       accountStatus: "inactive",
//       systemRole: "Admin",
//     });
//     return res.json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ msg: "Server Error" });
//   }
// });

// // @route   GET api/admin/all_active_users
// // @desc    Verify token and get User
// // @access  Private
// router.get("/all_active_users", auth, async (req, res) => {
//   try {
//     const user = await User.find({
//       accountStatus: "active",
//       systemRole: "Admin",
//     });
//     return res.json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ msg: "Server Error" });
//   }
// });
// @route   GET api/admin/activate_user
// @desc    Verify token and get User
// @access  Private
router.post("/update_account_status", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.userId, {
      accountStatus: req.body.status,
    });
    if (req.body.status == "active") {
      const smtpTrans = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "sutygonbot@gmail.com",
          pass: "sutygon123",
        },
      }); // Specify what the email will look like
      const mailOpts = {
        from: "Sutygon-bot", // This is ignored by Gmail
        to: user.email,
        subject: "Activate Account Status",
        html: `
        <div>
        <h4>Your Account is activated now you can login</h4>
        <a href="https://www.sutygon.app/login">Login here</a>
        </div>`,
      };

      // Attempt to send the email
      smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
          return res.status(400).json({ errors: error });
          // res.status(500).send('Failed to Reset Email: ' + error);
        } else {
          return res.status(200).json({
            msg: `Account Status Updated Successfully `,
            status: 200,
          });
        }
      });
    } else {
      return res.json({ msg: "Account Status Updated Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server Error" });
  }
});

// // @route   GET api/admin/deactivate_user
// // @desc    Verify token and get User
// // @access  Private
// router.post("/deactivate_user", auth, async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.body.userId, {
//       accountStatus: "inactive",
//     });
//     return res.json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ msg: "Server Error" });
//   }
// });
module.exports = router;
