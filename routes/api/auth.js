const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const gravatar = require("gravatar");
const nodemailer = require("nodemailer");

const User = require("../../models/User");
const config = require("config");

// @route   GET api/auth
// @desc    Verify token and get User
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server Error" });
  }
});

// @route   POST api/auth
// @desc    Authenticate User and get Token
// @access  Public
router.post(
  "/",
  [
    check("username", "Username Required").exists(),
    check("password", "Password Required").exists(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // check for existing user
      let user = await User.findOne(
        username.includes("@") ? { email: username } : { username: username }
      );

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User does not exists" }] });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordEntered = await bcrypt.hash(password, salt);

      // check if user is active or not...
      if (user.accountStatus !== "active") {
        return res.status(403).json({
          errors: [
            {
              msg: `Sorry! User is not activated. Inactivated on ${moment(
                user.inactivated_date
              ).format("DD-MMM-YYYY")}`,
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid Password" }] });
      }

      const payload = {
        user: {
          id: user._id,
          name: user.username,
        },
      };

      jwt.sign(
        payload,

        config.get("jwtSecret"),
        { expiresIn: "1d" },

        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

router.post(
  "/send_email",
  [check("email", "email Required").exists()],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      // check for existing user
      let userCheck = await User.findOne({ email });

      if (userCheck) {
        return res.status(400).json({ errors: "Email already exist" });
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
       const salt = await bcrypt.genSalt(10);

      const Hashpassword = await bcrypt.hash(password, salt);

      const code = Math.random().toString().substr(2, 4);
      const randUsername =
        email.split("@")[0] + Math.random().toString(16).substring(10);
      const newUser = await User.create({
        username: randUsername,
        email: email,
        password: Hashpassword,
        verificationCode: code,
        systemRole: "Admin",
        avatar: avatar,
        accountStatus: "inactive",
      });
      if (newUser) {
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
          to: req.body.email,
          subject: "Verify  Email",
          html: `
        <div>
        <h4>Verify Email Address</h4>
        <p>Enter 4 digit code  <h2>${code}</h2></p>

        </div>`,
        };

        // Attempt to send the email
        smtpTrans.sendMail(mailOpts, (error, response) => {
          if (error) {
            return res.status(400).json({ errors: error });
            // res.status(500).send('Failed to Reset Email: ' + error);
          } else {
            return res.status(200).json({
              message: `Email sent to you Check Your Mail Box `,
              status: 200,
            });
          }
        });
      } else {
        return res.status(500).json({ errors: "Server error" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ errors: "Server error" });
    }
  }
);

router.post(
  "/check_verification_code",
  [check("code", "code Required").exists()],
  async (req, res) => {
    try {
      let userExist = await User.findOne({ verificationCode: req.body.code });

      if (userExist) {
        return res.status(200).json({ userExist,mesg:'Your Email is verified' });
      } else {
        return res
          .status(400)
          .json({ errors: "sorry code is invalid please try again" });
      }
    } catch (err) {
      res.status(500).json({ errors: "Server error" });
    }
  }
);

router.post(
  "/signup_update",
  [
    check("firstname", "First Name is Required").not().isEmpty(),
    check("lastname", "Last Name is Required").not().isEmpty(),
    check("phone", "Please Enter Contact Number").not().isEmpty(),
    check("gender", "Please select your Gender").not().isEmpty(),
    check("dob", "Please select your dob").not().isEmpty(),
    check("company", "First Name is Required").not().isEmpty(),
    check("companyaddress", "Last Name is Required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      let body = JSON.parse(JSON.stringify(req.body));
      const updatedData = {
        first_name: body.firstname,
        last_name: body.lastname,
        fullname: `${body.firstname} ${body.lastname}`,
        contactnumber: body.phone,
        gender: body.gender,
        birthday: body.dob,
        company_name: body.company,
        company_address: body.companyaddress,
      };

      const result = await User.findByIdAndUpdate(req.body.id, updatedData, {
        new: true,
      });
      res.status(200).json({ msg: "User Added Successfully" });
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
);
module.exports = router;
