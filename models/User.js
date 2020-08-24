const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    requried: true,
  },
  accountStatus: {
    type: String,
    default: "active",
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },

},
);

module.exports = User = mongoose.model("user", UserSchema);
