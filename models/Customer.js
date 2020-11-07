const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CutomerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    contactnumber: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
   
    date: {
        type: Date,
        default: Date.now,
    },

},
);

module.exports = Customer = mongoose.model("customer", CutomerSchema);
