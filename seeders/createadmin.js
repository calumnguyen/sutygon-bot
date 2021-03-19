const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
//connect mongoose
(async function seedDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin-calum:QPE9xzsiYfExnWy4@sutygon.aqp0q.mongodb.net/main?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database connected");
    const full_name = "super admin";
    const email = "superadmin@gmail.com";
    const password = "superadmin";
    const salt = await bcrypt.genSalt(10);
    const Hashpassword = await bcrypt.hash(password, salt);
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const user = new User({
      username: email.split("@")[0],
      email: email,
      password: Hashpassword,
      systemRole: "superadmin",
      avatar: avatar,
      accountStatus: "active",
      fullname: full_name,
      sections: ["AdminList"],
    });
    await user.save();
    console.log("Super Admin Created DONE!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
