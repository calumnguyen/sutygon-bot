const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    date: {
      type: Date,
    },
    birthdate: {
      type: Date,
    },
    timeStart: {
      type: String,
    },
    timeEnd: {
      type: String,
    },
    location: {
      type: String,
    },
    note: {
      type: String,
    },
    file:[{
      _id: false,
      img:{type:String},
      date: { type: Date, default: Date.now },
    }],
    // pdfFile:[{ 
    //   _id: false,
    //   file:{type:String},
    //   date: { type: Date, default: Date.now },
    // }],
    user:
      {
        type: String,
      }
  },

  { timestamps: true }
);
EventSchema.set("autoIndex", true);
module.exports = Events = mongoose.model("events", EventSchema);
