const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const gravatar = require("gravatar");
const nodemailer = require("nodemailer");
const Store = require("../../models/Store");
const User = require("../../models/User");
const config = require("config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
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
    check("slug", "slug Required").exists(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, password, slug } = req.body;

    try {
      const slugres = await Store.findOne({ slug: slug });
      if (!slugres) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Store does not exists" }] });
      }
      // check for existing user
      let user = await User.findOne(
        username.includes("@") ? { email: username } : { username: username }
      );

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User does not exists" }] });
      }

      if (
        slugres.createdBy.toString() == user._id.toString() ||
        slugres._id.toString() == (user.createdBy && user.createdBy.toString())
      ) {
        // const salt = await bcrypt.genSalt(10);
        // const passwordEntered = await bcrypt.hash(password, salt);

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
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Password" }] });
        }
        const payload = {
          user: {
            storeId: slugres._id,
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
            res.json({ token, slugres });
          }
        );
      } else {
        return res
          .status(400)
          .json({ errors: [{ msg: "Store is not belong to you" }] });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route   POST api/auth/admin
// @desc    Authenticate User and get Token
// @access  Public
router.post(
  "/admin",
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
      if (
        (user.systemRole == "Admin" && user.showOwner == true) ||
        user.systemRole === "superadmin"
      ) {
        const salt = await bcrypt.genSalt(10);
        // const passwordEntered = await bcrypt.hash(password, salt);

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
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Password" }] });
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
      } else {
        return res.status(400).json({
          errors: [
            { msg: "Sorry This is Login for Superadmin OR Store Owner" },
          ],
        });
      }
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
      const { email, password, username } = req.body;

      let usernameCheck = await User.findOne({ username });

      if (
        usernameCheck &&
        (usernameCheck.verificationCode == "" ||
          usernameCheck.verificationCode == undefined)
      ) {
        return res.status(400).json({ errors: "username already exist" });
      }
      // check for existing user
      let userCheck = await User.findOne({ email });

      if (
        userCheck &&
        (userCheck.verificationCode == "" ||
          userCheck.verificationCode == undefined)
      ) {
        return res.status(400).json({ errors: "Email already exist" });
      }

      if (userCheck && userCheck.verificationCode) {
        await User.findByIdAndDelete(userCheck._id);
        // return res
        // 	.status(200)
        // 	.json({
        // 		userCheck,
        // 		message: 'Your are Already Register Please Complete Your profile',
        // 	});
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const salt = await bcrypt.genSalt(10);

      const Hashpassword = await bcrypt.hash(password, salt);

      const code = Math.random().toString().substr(2, 4);
      const code1 = code.split("");
      // const randUsername =
      //   email.split("@")[0] + Math.random().toString(16).substring(10);
      const newUser = await User.create({
        username: username,
        email: email,
        password: Hashpassword,
        verificationCode: code,
        systemRole: "Admin",
        avatar: avatar,
        accountStatus: "inactive",
      });
      if (newUser) {
        const msg = {
          to: req.body.email,
          from: "supervisor@sutygon.com", // Use the email address or domain you verified above
          subject: "Verify Email",
          // text: 'and easy to do anywhere, even with Node.js',
          html: `        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
           <head> 
            <meta charset="UTF-8"> 
            <meta content="width=device-width, initial-scale=1" name="viewport"> 
            <meta name="x-apple-disable-message-reformatting"> 
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
            <meta content="telephone=no" name="format-detection"> 
            <title>New Template</title> 
            <!--[if (mso 16)]>
              <style type="text/css">
              a {text-decoration: none;}
              </style>
              <![endif]--> 
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
            <!--[if gte mso 9]>
          <xml>
              <o:OfficeDocumentSettings>
              <o:AllowPNG></o:AllowPNG>
              <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
          </xml>
          <![endif]--> 
            <!--[if !mso]><!-- --> 
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet"> 
            <!--<![endif]--> 
            <style type="text/css">
          .rollover div {
            font-size:0;
          }
          #outlook a {
            padding:0;
          }
          .es-button {
            mso-style-priority:100!important;
            text-decoration:none!important;
          }
          a[x-apple-data-detectors] {
            color:inherit!important;
            text-decoration:none!important;
            font-size:inherit!important;
            font-family:inherit!important;
            font-weight:inherit!important;
            line-height:inherit!important;
          }
          .es-desk-hidden {
            display:none;
            float:left;
            overflow:hidden;
            width:0;
            max-height:0;
            line-height:0;
            mso-hide:all;
          }
          @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120% } h2 { font-size:26px!important; text-align:center; line-height:120% } h3 { font-size:20px!important; text-align:center; line-height:120% } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
          </style> 
           </head> 
           <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"> 
            <div class="es-wrapper-color" style="background-color:#F6F6F6"> 
             <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                  <v:fill type="tile" color="#f6f6f6"></v:fill>
                </v:background>
              <![endif]--> 
             <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"> 
               <tr> 
                <td valign="top" style="padding:0;Margin:0"> 
                 <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
                   <tr> 
                    <td align="center" style="padding:0;Margin:0"> 
                     <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"> 
                         <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr> 
                            <td align="center" valign="top" style="padding:0;Margin:0;width:560px"> 
                             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                               <tr> 
                                <td align="center" style="padding:0;Margin:0;position:relative"><img class="adapt-img" src="https://ovloen.stripocdn.email/content/guids/bannerImgGuid/images/35211615151525635.png" alt title width="560" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table> 
                 <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"> 
                   <tr> 
                    <td align="center" style="padding:0;Margin:0"> 
                     <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"> 
                         <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr> 
                            <td valign="top" align="center" style="padding:0;Margin:0;width:560px"> 
                             <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                               <tr> 
                                <td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:36px;color:#F90195;font-size:24px">Sutygon-Bot Xin Chào Đón Bạn 🎊</p></td> 
                               </tr> 
                               <tr> 
                                <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">Chúng tôi đã nhận được yêu cầu mở tài khoản mới của quý khách. Để đảm bảo sự an toàn về bảo mật cho khách hàng của Sutygon-Bot, bạn hãy điền mã 4 chữ số này vào trong trang đăng ký thông tin nhé.</p></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table> 
                 <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"> 
                   <tr> 
                    <td align="center" style="padding:0;Margin:0"> 
                     <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"> 
                       <tr> 
                        <td class="esdev-adapt-off es-m-p10t es-m-p10b es-m-p20r es-m-p20l" align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:40px;padding-right:40px"> 
                         <table cellpadding="0" cellspacing="0" class="esdev-mso-table" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:520px"> 
                           <tr> 
                            <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"> 
                             <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                               <tr> 
                                <td class="es-m-p0r" align="center" style="padding:0;Margin:0;width:109px"> 
                                 <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                   <tr> 
                                    <td align="center" bgcolor="#f90195" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:81px;color:#FFFFFF;font-size:54px">${code1[0]}</p></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table></td> 
                            <td style="padding:0;Margin:0;width:20px"></td> 
                            <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"> 
                             <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                               <tr> 
                                <td align="center" style="padding:0;Margin:0;width:117px"> 
                                 <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                   <tr> 
                                    <td align="center" bgcolor="#f90195" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:81px;color:#FFFFFF;font-size:54px">${code1[1]}</p></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table></td> 
                            <td style="padding:0;Margin:0;width:20px"></td> 
                            <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"> 
                             <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                               <tr> 
                                <td align="center" style="padding:0;Margin:0;width:117px"> 
                                 <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                   <tr> 
                                    <td align="center" bgcolor="#f90195" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:81px;color:#FFFFFF;font-size:54px">${code1[2]}</p></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table></td> 
                            <td style="padding:0;Margin:0;width:20px"></td> 
                            <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0"> 
                             <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"> 
                               <tr> 
                                <td align="center" style="padding:0;Margin:0;width:117px"> 
                                 <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                                   <tr> 
                                    <td align="center" bgcolor="#f90195" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:81px;color:#FFFFFF;font-size:54px">${code1[3]}</p></td> 
                                   </tr> 
                                 </table></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"> 
                         <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                           <tr> 
                            <td align="center" valign="top" style="padding:0;Margin:0;width:560px"> 
                             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                               <tr> 
                                <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#F90195;font-size:14px"><strong>ĐỪNG CHIA SẺ MÃ NÀY VỚI BẤT KỲ AI. NHÂN VIÊN SUTYGON-BOT SẼ KHÔNG BAO GIỜ HỎI QUÝ KHÁCH VỀ MẬT KHẨU CŨNG NHƯ MÃ BẢO MẬT.</strong></p></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table></td> 
                       </tr> 
                       <tr> 
                        <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"> 
                         <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]--> 
                         <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"> 
                           <tr> 
                            <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px"> 
                             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                               <tr> 
                                <td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#333333;font-size:14px"><strong>Email:</strong> supervisor@sutygon.com<br><strong>Phone:</strong> 0905 923 149<br></p></td> 
                               </tr> 
                               <tr> 
                                <td align="center" style="padding:0;Margin:0;padding-top:15px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#F90195;border-width:0px 0px 2px 0px;display:inline-block;border-radius:10px;width:auto;border-bottom-width:0px"><a href="https://sutygon.app" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#F90195;border-width:10px 20px 10px 20px;display:inline-block;background:#F90195;border-radius:10px;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center"> Xem Website</a></span></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table> 
                         <!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]--> 
                         <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"> 
                           <tr> 
                            <td align="left" style="padding:0;Margin:0;width:270px"> 
                             <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"> 
                               <tr> 
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://ovloen.stripocdn.email/content/guids/CABINET_68e35a1130abb02e45efdeea96559060/images/96541615148908060.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="150"></td> 
                               </tr> 
                               <tr> 
                                <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'open sans', 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#333333;font-size:14px">Công Ty Của Tương Lai <span style="color:#F90195"><strong>Sutygon-Bot</strong></span><br>Bộ Phận Chăm Sóc Khách Hàng</p></td> 
                               </tr> 
                             </table></td> 
                           </tr> 
                         </table> 
                         <!--[if mso]></td></tr></table><![endif]--></td> 
                       </tr> 
                     </table></td> 
                   </tr> 
                 </table></td> 
               </tr> 
             </table> 
            </div>  
           </body>
          </html>`,
        };
        await sgMail.send(msg);
        return res.status(200).json({
          message: `Email sent to you Check Your Mail Box `,
          status: 200,
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
        return res.status(200).json({
          userExist,
          mesg: "Your email is verified Please add personal info ",
        });
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
        verificationCode: "",
        showOwner: true,
        isPasswordChanged: true,
      };

      const result = await User.findByIdAndUpdate(req.body.id, updatedData, {
        new: true,
      });
      return res.status(200).json({
        msg:
          "Thanks for signing up. We’ll let you know through email when Admin will approve your account.",
      });
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
);
module.exports = router;
