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
    file: {
      type: String,
    },
  },

  { timestamps: true }
);
EventSchema.set("autoIndex", true);
module.exports = Events = mongoose.model("events", EventSchema);
